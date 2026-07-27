import * as THREE from 'three';
// The stylesheet is imported by the route, not here. Global CSS belongs to an
// app directory module; pulling it in from a lazily imported engine module ties
// style loading to a dynamic chunk, which is the wrong lifetime for it.
import { createBus } from './core/bus';
import { createRenderer } from './core/renderer';
import { detectQuality } from './core/quality';
import { hashSeed, splitmix32 } from './core/rng';
import type { AppContext, FrameTime, System } from './core/types';
import { createPipeline } from './post/pipeline';
import { createVault } from './scene/vault';
import { createLighting } from './scene/lighting';
import { createCardStage } from './scene/cardStage';
import { createParticles } from './scene/particles';
import { createCameraRig } from './anim/cameraRig';
import { createGachaMachine } from './gacha/machine';
import { createHud } from './ui/hud';
import { createAudio } from './audio/engine';
import { createAdaptiveQuality } from './core/adaptive';
import { createDebugHarness, harnessState } from './core/harness';

export interface VaultHandle {
  /** Tear down every GPU resource, listener and loop. Safe to call twice. */
  dispose(): void;
  /** The live app context, for debugging. */
  readonly ctx: AppContext;
}

export interface MountOptions {
  /** Deterministic seed. Anything falsy takes a random one. */
  seed?: string | null;
  /**
   * Force deterministic mode: fixed timestep, no idle drift, silent audio.
   * Defaults to true whenever a seed is supplied.
   */
  deterministic?: boolean;
}

/**
 * Mount the vault into a container the caller owns.
 *
 * This is the only entry point. It creates nothing at module scope and touches
 * no global except the harness hooks, so a host framework can mount, unmount and
 * remount it without leaking a renderer or stacking animation loops. Sizing
 * follows the container rather than the viewport, which is what lets the vault
 * sit under an application header instead of owning the whole screen.
 */
export function mountVault(container: HTMLElement, options: MountOptions = {}): VaultHandle {
  const canvas = document.createElement('canvas');
  canvas.id = 'stage';
  const uiRoot = document.createElement('div');
  uiRoot.id = 'ui';

  container.classList.add('vault-root');
  container.append(canvas, uiRoot);

  const seedText = options.seed ?? null;
  const deterministic = options.deterministic ?? seedText !== null;
  const seed = seedText !== null ? hashSeed(seedText) : (Math.random() * 0xffffffff) >>> 0;

  const quality = detectQuality();
  const renderer = createRenderer(canvas, quality);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 200);
  camera.position.set(0, 1.35, 4.2);

  const ctx: AppContext = {
    renderer,
    scene,
    camera,
    canvas,
    quality,
    bus: createBus(),
    rng: splitmix32(seed),
    size: { width: 1, height: 1 },
    deterministic,
  };

  const systems: System[] = [];
  const add = <T extends System>(s: T): T => {
    systems.push(s);
    return s;
  };

  add(createLighting(ctx));
  add(createVault(ctx));
  add(createCardStage(ctx));
  add(createParticles(ctx));
  add(createCameraRig(ctx));
  add(createAudio(ctx));
  const machine = add(createGachaMachine(ctx));
  // The HUD reads live protocol numbers from the machine; publish it before the
  // HUD constructs so its first paint already has real price and odds.
  (window as unknown as Record<string, unknown>).__machine = machine;
  add(createHud(ctx, uiRoot));
  const pipeline = createPipeline(ctx);
  add(createAdaptiveQuality(ctx, pipeline));

  function resize(): void {
    const rect = container.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    if (w === ctx.size.width && h === ctx.size.height) return;
    ctx.size.width = w;
    ctx.size.height = h;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, ctx.quality.pixelRatio));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Keep the vertical framing stable on wide displays and widen on portrait so
    // the altar never crops.
    camera.fov = h > w ? 52 : 38;
    camera.updateProjectionMatrix();
    pipeline.resize(w, h);
    for (const s of systems) s.resize?.(w, h);
  }

  // Observing the container rather than the window catches layout changes that
  // never fire a window resize, such as a sidebar opening beside the canvas.
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  const clock = new THREE.Clock();
  const time: FrameTime = { dt: 0, elapsed: 0, frame: 0 };

  let running = false;
  let disposed = false;

  function frame(): void {
    // Frozen by the shot harness: stop scheduling entirely so the compositor
    // goes idle and the capture tool sees a genuinely stable surface. Without
    // this the screenshot call waits forever on a never settling loop.
    if (disposed || harnessState.frozen) {
      running = false;
      return;
    }
    requestAnimationFrame(frame);
    const raw = clock.getDelta();
    time.dt = ctx.deterministic ? 1 / 60 : Math.min(raw, 1 / 20);
    time.elapsed += time.dt;
    time.frame++;

    renderer.info.reset();
    for (const s of systems) s.update(time);
    pipeline.render(time);
  }

  harnessState.resume = () => {
    if (running || disposed) return;
    running = true;
    clock.getDelta(); // discard the paused interval
    requestAnimationFrame(frame);
  };

  ctx.bus.emit('scene:ready', {});
  createDebugHarness(ctx, pipeline, time);
  running = true;
  frame();

  return {
    ctx,
    dispose() {
      if (disposed) return;
      disposed = true;
      running = false;
      observer.disconnect();
      for (const s of systems) s.dispose?.();
      pipeline.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      uiRoot.remove();
      container.classList.remove('vault-root');
      delete (window as unknown as Record<string, unknown>).__machine;
    },
  };
}
