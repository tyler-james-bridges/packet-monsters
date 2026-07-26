import * as THREE from 'three';
import type { AppContext, FrameTime, QualitySettings } from '../core/types';
import { PassRunner, disposeTarget, makeTarget } from './common';
import { TaaPass } from './taa';
import type { TaaOptions } from './taa';
import { BloomChain } from './bloom';
import type { BloomOptions } from './bloom';
import { DofPass } from './dof';
import type { DofOptions } from './dof';
import { MeterPass } from './meter';
import { GradePass, DEFAULT_GRADE } from './grade';
import { FxaaPass } from './fxaa';
import { hdrTextureType } from '../core/renderer';

export interface Pipeline {
  render(t: FrameTime): void;
  resize(width: number, height: number): void;
  /** Focus distance in world units for the bokeh pass. */
  setFocus(distance: number, range?: number): void;
  /** 0..1 extra bloom/exposure punch used on high rarity reveals. */
  setSurge(amount: number): void;
  applyQuality(): void;
  dispose(): void;
  /** Additive: fire a decaying surge impulse rather than a sustained level. */
  surgePulse?(amount: number): void;
  /** Additive: return to metered autofocus. */
  clearFocus?(): void;
  /** Additive: drop the temporal history, for hard camera cuts. */
  resetHistory?(): void;
  /** Additive: pass counts and target memory, for the frame budget report. */
  stats?(): PipelineStats;
}

export interface PipelineStats {
  /** Fullscreen passes issued by the pipeline, including the scene render. */
  passes: number;
  /** Whole frame draw calls, scene plus post. */
  drawCalls: number;
  triangles: number;
  textures: number;
  programs: number;
  /** Approximate render target bytes resident on the GPU. */
  targetBytes: number;
  bufferWidth: number;
  bufferHeight: number;
  taa: boolean;
  dof: boolean;
  bloomMips: number;
}

interface PostConfig {
  taa: TaaOptions;
  bloom: BloomOptions;
  dof: DofOptions;
  dofEnabled: boolean;
  /** Maximum defocus radius as a fraction of buffer height. */
  dofRadiusFraction: number;
  grain: number;
  bloomStrength: number;
}

/**
 * Derives every post setting from a quality tier. Called on construction and on
 * every adaptive quality change, so a tier step at runtime reconfigures and
 * reallocates the whole chain instead of leaving stale targets bound.
 */
function configFor(q: QualitySettings): PostConfig {
  const high = q.tier === 'ultra' || q.tier === 'high';
  return {
    taa: {
      samples: q.taaSamples,
      // Longer history on the tiers that can afford more jitter samples.
      feedback: q.taaSamples >= 16 ? 0.955 : q.taaSamples >= 8 ? 0.94 : 0.9,
      clampScale: q.taaSamples >= 8 ? 1.15 : 1.35,
      sharpen: high ? 0.22 : 0.12,
      dilateDepth: q.tier !== 'low',
    },
    bloom: {
      mips: q.bloomMips,
      // Scene linear. Mid grey is 0.18, so this opens roughly two and a half
      // stops above middle grey: practical sources and speculars, not walls.
      threshold: 1.05,
      knee: 0.7,
      radius: high ? 1.0 : 0.8,
      clamp: 40,
    },
    dof: {
      sensorHeight: 24,
      fStop: 2.2,
      bokehScale: 1.45,
      maxRadius: 20,
      taps: q.tier === 'ultra' ? 32 : 22,
      aperture: 0.7,
    },
    dofEnabled: q.dof,
    dofRadiusFraction: 0.021,
    grain: high ? 0.022 : 0.016,
    bloomStrength: 0.055,
  };
}

/**
 * Surge envelope.
 *
 * A brightness slider is instantaneous and symmetric, which is exactly what a
 * camera is not. This runs a fast attack and a slow release, and keeps a second
 * lagging follower. The difference between the two drives a deliberate
 * undershoot: the frame blows out on impact and then settles a little under
 * nominal before recovering, which is the automatic exposure of a real body
 * chasing a flash. Everything is dt driven so it reproduces exactly under the
 * shot harness.
 */
class SurgeEnvelope {
  private sustain = 0;
  private impulse = 0;
  fast = 0;
  slow = 0;

  setSustain(amount: number): void {
    this.sustain = Math.min(1, Math.max(0, amount));
  }

  pulse(amount: number): void {
    this.impulse = Math.max(this.impulse, Math.min(1, Math.max(0, amount)));
  }

  update(dt: number): void {
    const d = Math.min(dt, 0.1);
    this.impulse *= Math.exp(-d * 2.4);
    if (this.impulse < 1e-4) this.impulse = 0;
    const target = Math.max(this.sustain, this.impulse);
    const k = target > this.fast ? 1 - Math.exp(-d * 34) : 1 - Math.exp(-d * 4.5);
    this.fast += (target - this.fast) * k;
    this.slow += (this.fast - this.slow) * (1 - Math.exp(-d * 1.35));
  }

  reset(): void {
    this.sustain = 0;
    this.impulse = 0;
    this.fast = 0;
    this.slow = 0;
  }
}

export function createPipeline(ctx: AppContext): Pipeline {
  const { renderer, scene, camera, quality, bus } = ctx;

  let config = configFor(quality);

  const runner = new PassRunner();
  const taa = new TaaPass(config.taa);
  const bloom = new BloomChain(config.bloom);
  const dof = new DofPass(config.dof);
  const meter = new MeterPass({ attack: 2.6, release: 0.9, focusRate: 3.4 });
  const grade = new GradePass({ ...DEFAULT_GRADE, grain: config.grain });
  const fxaa = new FxaaPass();
  const surge = new SurgeEnvelope();

  const HDR = hdrTextureType(renderer);

  let sceneTarget = makeTarget(1, 1, {
    type: HDR,
    depthBuffer: true,
    depthTexture: true,
  });
  let ldrTarget: THREE.WebGLRenderTarget | null = null;
  let bufferWidth = 0;
  let bufferHeight = 0;
  let passCount = 0;
  let focusRange = 0.75;

  const bufferSize = new THREE.Vector2();

  function pushExposurePolicy(): void {
    const g = grade.base;
    meter.setExposure({
      base: g.exposure,
      comp: g.exposureComp,
      auto: g.autoExposure,
      min: g.minExposure,
      max: g.maxExposure,
    });
  }

  function allocate(width: number, height: number): void {
    const w = Math.max(1, Math.round(width));
    const h = Math.max(1, Math.round(height));
    if (w === bufferWidth && h === bufferHeight) return;
    bufferWidth = w;
    bufferHeight = h;

    disposeTarget(sceneTarget);
    sceneTarget = makeTarget(w, h, {
      type: HDR,
      depthBuffer: true,
      depthTexture: true,
    });

    taa.setSize(w, h);
    bloom.setSize(w, h);
    meter.setSize(w, h);
    if (config.dofEnabled) dof.setSize(w, h);

    disposeTarget(ldrTarget);
    ldrTarget = null;
    if (!taa.enabled) {
      ldrTarget = makeTarget(w, h, { type: THREE.UnsignedByteType });
      fxaa.setSize(w, h);
    }

    grade.setAspect(w / h);
    dof.configure({ ...config.dof, maxRadius: Math.max(4, h * config.dofRadiusFraction) });
  }

  function reconfigure(): void {
    config = configFor(quality);
    taa.configure(config.taa);
    bloom.configure(config.bloom);
    grade.configure({ grain: config.grain, bloomStrength: config.bloomStrength });
    dof.configure({
      ...config.dof,
      maxRadius: Math.max(4, bufferHeight * config.dofRadiusFraction),
    });

    // TAA on or off decides whether the FXAA fallback target exists at all.
    if (taa.enabled) {
      disposeTarget(ldrTarget);
      ldrTarget = null;
    } else if (!ldrTarget && bufferWidth > 1) {
      ldrTarget = makeTarget(bufferWidth, bufferHeight, { type: THREE.UnsignedByteType });
      fxaa.setSize(bufferWidth, bufferHeight);
    }

    if (config.dofEnabled) {
      if (bufferWidth > 0) dof.setSize(bufferWidth, bufferHeight);
    } else {
      dof.release();
    }

    pushExposurePolicy();
    meter.resetState();
    taa.resetHistory();
  }

  // The pipeline is a system like any other: it listens on the bus rather than
  // being wired by hand from main.ts. Rarity drives the size of the camera
  // reaction, which is the whole point of the surge.
  const REVEAL_SURGE = [0.16, 0.24, 0.42, 0.66, 1.0];
  const offImpact = bus.on('reveal:impact', ({ position }) => {
    surge.pulse(REVEAL_SURGE[Math.min(4, Math.max(0, position.card.rarity))]);
  });
  const offStart = bus.on('reveal:start', ({ position }) => {
    surge.pulse(REVEAL_SURGE[Math.min(4, Math.max(0, position.card.rarity))] * 0.35);
  });

  function syncBufferSize(): void {
    renderer.getDrawingBufferSize(bufferSize);
    allocate(bufferSize.x, bufferSize.y);
  }

  pushExposurePolicy();
  syncBufferSize();

  const api: Pipeline = {
    render(t: FrameTime) {
      // The adaptive manager can change the pixel ratio between frames without
      // a window resize, so the drawing buffer is the source of truth.
      renderer.getDrawingBufferSize(bufferSize);
      if (bufferSize.x !== bufferWidth || bufferSize.y !== bufferHeight) {
        allocate(bufferSize.x, bufferSize.y);
      }

      surge.update(t.dt);
      const fast = surge.fast;
      const slow = surge.slow;

      passCount = 0;

      meter.setCamera(camera.near, camera.far);
      dof.setCamera(camera);
      dof.setFocusRange(focusRange);
      // The iris opens as the flash lands: depth of field goes shallower for a
      // beat, which sells the reaction far better than exposure alone.
      dof.setFStop(config.dof.fStop / (1 + fast * 0.55));

      taa.checkCameraCut(camera, t.dt);
      const restoreJitter = taa.applyJitter(camera);
      renderer.setRenderTarget(sceneTarget);
      renderer.render(scene, camera);
      restoreJitter();
      passCount++;

      const depth = sceneTarget.depthTexture as THREE.Texture;
      let color: THREE.Texture = sceneTarget.texture;

      if (taa.enabled) {
        color = taa.render(renderer, runner, color, depth);
        passCount++;
      } else {
        taa.step();
      }

      meter.render(renderer, runner, color, depth, t.dt);
      passCount += 2;

      if (config.dofEnabled) {
        color = dof.render(renderer, runner, color, depth, meter.texture);
        passCount += 3;
      }

      const base = grade.base;
      // Blow out on attack, stop down on the lagging follower. The net is a
      // spike followed by a shallow dip under nominal, then recovery.
      const exposureScale = 1 + fast * 0.72 - slow * 0.3;
      // More of the frame is allowed to glare while the flash is on.
      bloom.setThreshold(config.bloom.threshold * (1 - fast * 0.55), config.bloom.knee);
      bloom.setExposure(meter.texture, exposureScale);
      bloom.render(renderer, runner, color);
      passCount += Math.max(1, config.bloom.mips * 2 - 1);

      grade.pass.set('uExposureScale', exposureScale);
      grade.pass.set('uBloomStrength', base.bloomStrength * (1 + fast * 3.4));
      grade.pass.set('uCA', base.chromaticAberration * (1 + fast * 3.2));
      grade.pass.set('uVignette', base.vignette * (1 + fast * 0.35));
      grade.pass.set('uSurge', fast);

      grade.pass.set('tColor', color);
      grade.pass.set('tBloom', bloom.texture);
      grade.pass.set('tMeter', meter.texture);
      grade.pass.set('uGrainSeed', (t.frame % 1024) + 1);

      if (taa.enabled || !ldrTarget) {
        runner.render(renderer, grade.pass, null);
        passCount++;
      } else {
        runner.render(renderer, grade.pass, ldrTarget);
        fxaa.pass.set('tDiffuse', ldrTarget.texture);
        runner.render(renderer, fxaa.pass, null);
        passCount += 2;
      }

      renderer.setRenderTarget(null);
    },

    resize(width: number, height: number) {
      void width;
      void height;
      syncBufferSize();
    },

    setFocus(distance: number, range?: number) {
      meter.setManualFocus(distance);
      if (range !== undefined) focusRange = Math.max(0, range);
    },

    clearFocus() {
      meter.setManualFocus(-1);
    },

    setSurge(amount: number) {
      surge.setSustain(amount);
    },

    surgePulse(amount: number) {
      surge.pulse(amount);
    },

    resetHistory() {
      taa.resetHistory();
      meter.resetState();
    },

    applyQuality() {
      reconfigure();
      syncBufferSize();
    },

    stats(): PipelineStats {
      // Half float is 8 bytes per texel, byte targets 4, plus the depth
      // attachment on the scene target.
      const full = bufferWidth * bufferHeight;
      let bytes = full * 8 + full * 4; // scene colour + depth
      if (taa.enabled) bytes += full * 8 * 2; // history ping pong
      let mip = full / 4;
      for (let i = 0; i < config.bloom.mips; i++) {
        bytes += mip * 8 * 2; // down and up chains
        mip /= 4;
      }
      if (config.dofEnabled) bytes += (full / 4) * 8 * 3 + full * 8;
      if (ldrTarget) bytes += full * 4;
      return {
        passes: passCount,
        drawCalls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        textures: renderer.info.memory.textures,
        programs: renderer.info.programs?.length ?? 0,
        targetBytes: Math.round(bytes),
        bufferWidth,
        bufferHeight,
        taa: taa.enabled,
        dof: config.dofEnabled,
        bloomMips: config.bloom.mips,
      };
    },

    dispose() {
      offImpact();
      offStart();
      disposeTarget(sceneTarget);
      disposeTarget(ldrTarget);
      ldrTarget = null;
      taa.dispose();
      bloom.dispose();
      dof.dispose();
      meter.dispose();
      grade.dispose();
      fxaa.dispose();
      runner.dispose();
      surge.reset();
    },
  };

  // Exposed for the shot review loop: pass counts, draw calls and the resolved
  // exposure are otherwise invisible in a captured PNG.
  (window as unknown as Record<string, unknown>).__pipeline = api;

  return api;
}
