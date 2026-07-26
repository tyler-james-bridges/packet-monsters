import * as THREE from 'three';
import type { AppContext, System, VaultPosition } from '../core/types';
import { registerShot } from '../core/harness';

/**
 * Owns the physical card objects: the sealed packet, the burst, and the revealed
 * hero card on the plinth. Baseline places a single card; the card material and
 * animation agents own the surface and the choreography.
 */
export function createCardStage(ctx: AppContext): System {
  const group = new THREE.Group();
  group.position.set(0, 1.35, 0);
  ctx.scene.add(group);

  // 63 x 88 mm, the real trading card ratio, scaled to 0.62 m tall.
  const h = 0.62;
  const w = h * (63 / 88);
  const card = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, 0.004),
    new THREE.MeshPhysicalMaterial({
      color: 0x1b2340,
      roughness: 0.22,
      metalness: 0.85,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    })
  );
  card.castShadow = true;
  card.receiveShadow = true;
  group.add(card);

  let hero: VaultPosition | null = null;
  ctx.bus.on('reveal:settled', (p) => {
    hero = p.position;
  });

  registerShot('hero', {
    apply: () => {
      group.rotation.set(0, 0, 0);
    },
    settleFrames: 60,
  });

  return {
    name: 'card-stage',
    update(t) {
      group.rotation.y = Math.sin(t.elapsed * 0.45) * 0.35;
      group.position.y = 1.35 + Math.sin(t.elapsed * 0.9) * 0.015;
      void hero;
    },
    dispose() {
      ctx.scene.remove(group);
    },
  };
}
