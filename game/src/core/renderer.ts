import * as THREE from 'three';
import type { QualitySettings } from './types';

/**
 * Creates the WebGL2 renderer with a linear working space, ACES-class tone
 * mapping and physically correct shadow configuration. Everything downstream
 * assumes HDR values in linear-sRGB until the final tone map in the pipeline.
 */
export function createRenderer(canvas: HTMLCanvasElement, q: QualitySettings): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false, // resolved by the post pipeline (TAA + SMAA)
    alpha: false,
    stencil: false,
    depth: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: true, // required for deterministic screenshot capture
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, q.pixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // The pipeline owns tone mapping; the renderer writes linear HDR to the
  // float target. Tone mapping here would double-apply.
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = q.softShadows ? THREE.VSMShadowMap : THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = true;
  renderer.info.autoReset = false;

  return renderer;
}

export function maxAnisotropy(renderer: THREE.WebGLRenderer, q: QualitySettings): number {
  return Math.min(renderer.capabilities.getMaxAnisotropy(), q.anisotropy);
}
