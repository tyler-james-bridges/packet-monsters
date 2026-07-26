import * as THREE from 'three';
import type { AppContext, FrameTime } from '../core/types';

export interface Pipeline {
  render(t: FrameTime): void;
  resize(width: number, height: number): void;
  /** Focus distance in world units for the bokeh pass. */
  setFocus(distance: number, range?: number): void;
  /** 0..1 extra bloom/exposure punch used on high rarity reveals. */
  setSurge(amount: number): void;
  applyQuality(): void;
  dispose(): void;
}

/**
 * Baseline pipeline: renders the scene into an HDR float target and tone maps
 * to the screen. The post-processing agent replaces the interior with the full
 * TAA -> bloom -> DOF -> grade -> SMAA chain; this signature is the contract.
 */
export function createPipeline(ctx: AppContext): Pipeline {
  const { renderer, scene, camera } = ctx;

  let target = makeTarget(1, 1);
  let surge = 0;

  const quad = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      uniforms: {
        tDiffuse: { value: target.texture },
        uExposure: { value: 1.0 },
        uSurge: { value: 0 },
      },
      vertexShader: /* glsl */ `
        in vec3 position;
        in vec2 uv;
        out vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        in vec2 vUv;
        out vec4 fragColor;
        uniform sampler2D tDiffuse;
        uniform float uExposure;
        uniform float uSurge;

        // ACES filmic approximation (Narkowicz), operating in linear space.
        vec3 aces(vec3 x) {
          const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
          return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
        }

        void main() {
          vec3 hdr = texture(tDiffuse, vUv).rgb * uExposure * (1.0 + uSurge * 0.6);
          vec3 mapped = aces(hdr);
          fragColor = vec4(pow(mapped, vec3(1.0 / 2.2)), 1.0);
        }
      `,
      depthTest: false,
      depthWrite: false,
    })
  );
  const quadScene = new THREE.Scene().add(quad);
  const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  function makeTarget(w: number, h: number): THREE.WebGLRenderTarget {
    const t = new THREE.WebGLRenderTarget(w, h, {
      type: THREE.HalfFloatType,
      colorSpace: THREE.LinearSRGBColorSpace,
      samples: 0,
      depthBuffer: true,
      stencilBuffer: false,
    });
    t.texture.minFilter = THREE.LinearFilter;
    t.texture.magFilter = THREE.LinearFilter;
    return t;
  }

  return {
    render() {
      renderer.setRenderTarget(target);
      renderer.clear();
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      (quad.material as THREE.RawShaderMaterial).uniforms.uSurge.value = surge;
      renderer.render(quadScene, quadCam);
    },
    resize(w, h) {
      const dpr = renderer.getPixelRatio();
      target.dispose();
      target = makeTarget(Math.ceil(w * dpr), Math.ceil(h * dpr));
      (quad.material as THREE.RawShaderMaterial).uniforms.tDiffuse.value = target.texture;
    },
    setFocus() {
      /* replaced by the DOF implementation */
    },
    setSurge(a) {
      surge = a;
    },
    applyQuality() {
      /* replaced when passes become quality dependent */
    },
    dispose() {
      target.dispose();
      quad.geometry.dispose();
      (quad.material as THREE.Material).dispose();
    },
  };
}
