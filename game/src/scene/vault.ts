import * as THREE from 'three';
import type { AppContext, System } from '../core/types';

/**
 * The vault chamber: floor, altar plinth and backdrop. Baseline geometry only;
 * the environment agent owns material authorship, volumetrics and set dressing.
 */
export function createVault(ctx: AppContext): System {
  const group = new THREE.Group();
  group.name = 'vault';

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(14, 96),
    new THREE.MeshStandardMaterial({ color: 0x0a0c14, roughness: 0.35, metalness: 0.6 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);

  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 1.05, 0.62, 64, 1, false),
    new THREE.MeshStandardMaterial({ color: 0x14182a, roughness: 0.28, metalness: 0.9 })
  );
  plinth.position.y = 0.31;
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  group.add(plinth);

  ctx.scene.add(group);
  ctx.scene.fog = new THREE.FogExp2(0x05060a, 0.055);
  ctx.scene.background = new THREE.Color(0x05060a);

  return {
    name: 'vault',
    update() {},
    dispose() {
      ctx.scene.remove(group);
    },
  };
}
