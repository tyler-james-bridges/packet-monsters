import * as THREE from 'three';
import type { AppContext, FrameTime, System } from '../core/types';

export interface LightingSystem extends System {
  key: THREE.DirectionalLight;
  rim: THREE.SpotLight;
  /** Drives the reveal flash, 0..1. */
  setSurge(amount: number, color?: THREE.Color): void;
}

/**
 * Three point cinematic rig plus an image based ambient term. The environment
 * agent replaces the ambient probe with a procedurally generated HDR.
 */
export function createLighting(ctx: AppContext): LightingSystem {
  const { scene, quality } = ctx;

  const key = new THREE.DirectionalLight(0xfff2e0, 3.2);
  key.position.set(3.2, 5.4, 2.6);
  key.castShadow = true;
  key.shadow.mapSize.set(quality.shadowMapSize, quality.shadowMapSize);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 20;
  key.shadow.camera.left = -5;
  key.shadow.camera.right = 5;
  key.shadow.camera.top = 5;
  key.shadow.camera.bottom = -5;
  key.shadow.bias = -0.0006;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 4;
  scene.add(key, key.target);

  const fill = new THREE.DirectionalLight(0x4a6cff, 0.7);
  fill.position.set(-4.0, 2.2, -1.5);
  scene.add(fill);

  const rim = new THREE.SpotLight(0x8fd4ff, 12, 18, Math.PI * 0.24, 0.55, 1.6);
  rim.position.set(-1.4, 4.6, -3.2);
  scene.add(rim, rim.target);

  const ambient = new THREE.HemisphereLight(0x2a3350, 0x07080d, 0.55);
  scene.add(ambient);

  const surgeLight = new THREE.PointLight(0xffffff, 0, 12, 2);
  surgeLight.position.set(0, 1.5, 0.6);
  scene.add(surgeLight);

  let surge = 0;

  return {
    name: 'lighting',
    key,
    rim,
    setSurge(amount, color) {
      surge = amount;
      if (color) surgeLight.color.copy(color);
    },
    update(t: FrameTime) {
      surgeLight.intensity = surge * 40;
      // Subtle breathing on the rim keeps the frame alive while idle.
      rim.intensity = 12 + Math.sin(t.elapsed * 0.7) * 1.2;
    },
  };
}
