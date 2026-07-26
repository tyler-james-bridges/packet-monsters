import * as THREE from 'three';
import type { QualitySettings } from './types';

/**
 * Creates the WebGL2 renderer with a linear working space, no tone mapping and
 * physically correct shadow configuration. Everything downstream assumes HDR
 * values in linear-sRGB until the single tone map in src/post/grade.ts.
 */
export function createRenderer(canvas: HTMLCanvasElement, q: QualitySettings): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false, // resolved by the post pipeline (TAA, or FXAA on low)
    alpha: false,
    stencil: false,
    depth: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: true, // required for deterministic screenshot capture
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, q.pixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // The pipeline owns tone mapping and the transfer function encode; the
  // renderer writes linear HDR into a half float target. Tone mapping here
  // would double apply, and so would an output colour space conversion, which
  // is why every post pass is a RawShaderMaterial: three injects neither into
  // those, so the grade pass is provably the only place gamma is applied.
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.toneMappingExposure = 1;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = q.softShadows ? THREE.VSMShadowMap : THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = true;

  // The pipeline clears its own targets and the scene owns its background, so
  // the default clear only matters for the first frame before anything draws.
  renderer.setClearColor(0x000000, 1);

  // main.ts resets this once per frame, before systems update, so a read after
  // pipeline.render() is the true whole frame cost.
  renderer.info.autoReset = false;

  return renderer;
}

export function maxAnisotropy(renderer: THREE.WebGLRenderer, q: QualitySettings): number {
  return Math.min(renderer.capabilities.getMaxAnisotropy(), q.anisotropy);
}

/**
 * Picks the storage type for the HDR chain.
 *
 * Rendering to RGBA16F needs EXT_color_buffer_float, and bilinear filtering of
 * those targets (which the bloom upsample and the DOF gather both rely on)
 * needs OES_texture_float_linear on some drivers. If either is missing the
 * chain still runs, at eight bits, which loses the highlight headroom bloom
 * feeds on but does not fail to draw. Silently producing a black screen on a
 * device that cannot do float targets would be worse.
 */
export function hdrTextureType(renderer: THREE.WebGLRenderer): THREE.TextureDataType {
  const ext = renderer.extensions;
  const colorBufferFloat = ext.has('EXT_color_buffer_float');
  const halfFloatLinear = ext.has('OES_texture_float_linear') || renderer.capabilities.isWebGL2;
  return colorBufferFloat && halfFloatLinear ? THREE.HalfFloatType : THREE.UnsignedByteType;
}

/** True when the driver can render to and filter half float targets. */
export function supportsHdrTargets(renderer: THREE.WebGLRenderer): boolean {
  return hdrTextureType(renderer) === THREE.HalfFloatType;
}
