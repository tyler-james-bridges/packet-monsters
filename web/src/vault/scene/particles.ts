import * as THREE from 'three';
import type { AppContext, System } from '../core/types';

/**
 * GPU particle field: ambient vault motes plus the reveal burst. Baseline is a
 * simple additive point cloud; the VFX agent replaces the simulation with a
 * curl noise compute step and rarity tinted emission.
 */
export function createParticles(ctx: AppContext): System {
  const count = Math.min(ctx.quality.maxParticles, 4000);
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 1.5 + ctx.rng() * 8;
    const a = ctx.rng() * Math.PI * 2;
    positions[i * 3] = Math.cos(a) * r;
    positions[i * 3 + 1] = ctx.rng() * 5;
    positions[i * 3 + 2] = Math.sin(a) * r;
    seeds[i] = ctx.rng();
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

  const mat = new THREE.PointsMaterial({
    size: 0.012,
    color: 0x8fb6ff,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  ctx.scene.add(points);

  return {
    name: 'particles',
    update(t) {
      const p = geo.attributes.position as THREE.BufferAttribute;
      const arr = p.array as Float32Array;
      for (let i = 0; i < count; i++) {
        arr[i * 3 + 1] += (0.08 + seeds[i] * 0.12) * t.dt;
        if (arr[i * 3 + 1] > 5.2) arr[i * 3 + 1] = 0;
      }
      p.needsUpdate = true;
    },
    dispose() {
      ctx.scene.remove(points);
      geo.dispose();
      mat.dispose();
    },
  };
}
