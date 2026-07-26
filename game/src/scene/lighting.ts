import * as THREE from 'three';
import type { AppContext, FrameTime, System } from '../core/types';
import { createEnvProbe, type EnvProbe } from './env/ibl';
import {
  ACCENT_COLOR,
  CHAMBER,
  FILL_COLOR,
  FILL_DIR,
  KEY_COLOR,
  KEY_DIR,
  RIM_COLOR,
  RIM_DIR,
} from './env/layout';
import { envSurge, requestEnvSurge, stepEnvSurge } from './env/surge';

export interface LightingSystem extends System {
  key: THREE.DirectionalLight;
  rim: THREE.SpotLight;
  /** Drives the reveal flash, 0..1. */
  setSurge(amount: number, color?: THREE.Color): void;
}

/**
 * The chamber's light rig.
 *
 * A procedurally generated HDR probe carries the indirect term, and on top of
 * it sits a physical five source rig: a hard warm key falling through the
 * ceiling aperture, a cool wall bounce fill, a cold back rim that separates the
 * altar from the portal, warm practicals standing in for the cove and the
 * portal ring, and a floor bounce.
 *
 * Intensities are physical. Directional lights are irradiance, point and spot
 * lights are candela with inverse square decay, so the numbers below are the
 * numbers a gaffer would recognise rather than values tuned against whatever
 * tone curve happens to be in the post chain today.
 */
export function createLighting(ctx: AppContext): LightingSystem {
  const { scene, quality, renderer } = ctx;

  // ------------------------------------------------------------ image based
  const probe: EnvProbe = createEnvProbe(renderer, {
    keyDir: KEY_DIR.clone(),
    fillDir: FILL_DIR.clone(),
    keyColor: KEY_COLOR.clone(),
    fillColor: FILL_COLOR.clone(),
    coveColor: ACCENT_COLOR.clone(),
    size: quality.tier === 'low' ? 128 : 256,
  });
  scene.environment = probe.texture;
  scene.environmentIntensity = 1.0;

  // -------------------------------------------------------------------- key
  const KEY_BASE = 5.4;
  const key = new THREE.DirectionalLight(KEY_COLOR.getHex(), KEY_BASE);
  key.color.copy(KEY_COLOR);
  key.position.copy(KEY_DIR).multiplyScalar(9.5);
  key.target.position.set(0, 0.75, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(quality.shadowMapSize, quality.shadowMapSize);
  key.shadow.camera.near = 3.0;
  key.shadow.camera.far = 15.5;
  key.shadow.camera.left = -3.6;
  key.shadow.camera.right = 3.6;
  key.shadow.camera.top = 3.6;
  key.shadow.camera.bottom = -3.6;
  // VSM stores depth moments, so a slope bias is the wrong tool and only causes
  // peter-panning. Depth precision is handled by the tight near/far above and a
  // small normal offset that pushes the lookup off the shading point.
  key.shadow.bias = quality.softShadows ? 0 : -0.00035;
  key.shadow.normalBias = 0.018;
  key.shadow.radius = quality.softShadows ? 3.5 : 1;
  // VSM blurs the whole map twice per frame, so the sample count is a real
  // frame cost rather than a free quality dial. Eight is where the penumbra
  // stops showing steps at this map size.
  key.shadow.blurSamples = quality.softShadows ? 8 : 4;
  scene.add(key, key.target);

  // ------------------------------------------------------------------- fill
  const FILL_BASE = 0.72;
  const fill = new THREE.DirectionalLight(FILL_COLOR.getHex(), FILL_BASE);
  fill.color.copy(FILL_COLOR);
  fill.position.copy(FILL_DIR).multiplyScalar(9);
  fill.target.position.set(0, 1.1, 0);
  scene.add(fill, fill.target);

  // Floor bounce. Concrete kicks a surprising amount back up under an altar and
  // without it every underside in the frame reads as a hole.
  const bounce = new THREE.DirectionalLight(0x3d4d6b, 0.34);
  bounce.position.set(0.4, -2.0, 2.6);
  bounce.target.position.set(0, 1.4, 0);
  scene.add(bounce, bounce.target);

  // -------------------------------------------------------------------- rim
  const RIM_BASE = 58;
  const rim = new THREE.SpotLight(RIM_COLOR.getHex(), RIM_BASE, 18, Math.PI * 0.2, 0.62, 2);
  rim.color.copy(RIM_COLOR);
  rim.position.copy(RIM_DIR).multiplyScalar(5.1);
  rim.target.position.set(0, CHAMBER.cardY - 0.1, 0);
  scene.add(rim, rim.target);

  // ------------------------------------------------------------- practicals
  // Standing in for the emissive geometry, which is self lit but casts nothing.
  const cove = new THREE.PointLight(ACCENT_COLOR.getHex(), 34, 15, 2);
  cove.color.copy(ACCENT_COLOR);
  cove.position.set(0, 4.32, -3.1);
  scene.add(cove);

  const portalGlow = new THREE.PointLight(ACCENT_COLOR.getHex(), 16, 8, 2);
  portalGlow.color.copy(ACCENT_COLOR);
  portalGlow.position.set(0, CHAMBER.portalY, CHAMBER.portalZ + 0.9);
  scene.add(portalGlow);

  const altarGlow = new THREE.PointLight(ACCENT_COLOR.getHex(), 5.5, 4.2, 2);
  altarGlow.color.copy(ACCENT_COLOR);
  altarGlow.position.set(0, 0.5, 0);
  scene.add(altarGlow);

  // A hemisphere term only insures against gaps in the probe; the IBL does the
  // real indirect work, so this stays low enough not to flatten anything.
  const ambient = new THREE.HemisphereLight(0x1e2942, 0x05070b, 0.22);
  scene.add(ambient);

  // ------------------------------------------------------------------ surge
  const surgeLight = new THREE.PointLight(0xffffff, 0, 14, 2);
  surgeLight.position.set(0, CHAMBER.cardY + 0.15, 0.45);
  scene.add(surgeLight);

  const keyRest = KEY_COLOR.clone();
  const rimRest = RIM_COLOR.clone();
  const tmp = new THREE.Color();

  return {
    name: 'lighting',
    key,
    rim,

    setSurge(amount: number, color?: THREE.Color) {
      // Publish to the shared environment state so the chamber's strips, cove,
      // altar seam and light shaft all move on the same beat as the rig.
      requestEnvSurge(amount, color);
      if (color) surgeLight.color.copy(color);
    },

    update(t: FrameTime) {
      const s = stepEnvSurge(t.dt);
      const state = envSurge();

      // Idle: a slow breath on the practicals keeps the frame alive without
      // reading as a flicker.
      const breath = Math.sin(t.elapsed * 0.62) * 0.06;
      const shimmer = Math.sin(t.elapsed * 1.7 + 1.3) * 0.03;

      key.intensity = KEY_BASE * (1 + s * 1.25);
      tmp.copy(keyRest).lerp(state.color, Math.min(0.55, s * 0.7));
      key.color.copy(tmp);

      rim.intensity = RIM_BASE * (1 + breath * 0.5 + s * 1.9);
      tmp.copy(rimRest).lerp(state.color, Math.min(0.6, s * 0.8));
      rim.color.copy(tmp);

      cove.intensity = 34 * (1 + breath + s * 2.2);
      portalGlow.intensity = 16 * (1 + shimmer + s * 3.4);
      altarGlow.intensity = 5.5 * (1 + shimmer * 2 + s * 6.0);

      fill.intensity = FILL_BASE * (1 + s * 0.4);
      surgeLight.intensity = s * 90;
    },

    dispose() {
      scene.remove(key, key.target, fill, fill.target, bounce, bounce.target);
      scene.remove(rim, rim.target, cove, portalGlow, altarGlow, ambient, surgeLight);
      scene.environment = null;
      probe.dispose();
    },
  };
}
