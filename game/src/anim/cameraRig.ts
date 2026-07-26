import * as THREE from 'three';
import type { AppContext, System } from '../core/types';

/**
 * Critically damped camera rig. All motion goes through springs so nothing ever
 * snaps, and shake is additive in rig space so it never fights the framing.
 */
export interface CameraRig extends System {
  moveTo(position: THREE.Vector3, target: THREE.Vector3, stiffness?: number): void;
  shake(amount: number, duration: number): void;
}

export function createCameraRig(ctx: AppContext): CameraRig {
  const { camera, bus } = ctx;

  const pos = camera.position.clone();
  const posVel = new THREE.Vector3();
  const look = new THREE.Vector3(0, 1.35, 0);
  const lookVel = new THREE.Vector3();

  const desiredPos = pos.clone();
  const desiredLook = look.clone();
  let stiffness = 6;

  let shakeAmount = 0;
  let shakeDecay = 0;
  const shakeOffset = new THREE.Vector3();

  bus.on('camera:shake', ({ amount, duration }) => {
    shakeAmount = Math.max(shakeAmount, amount);
    shakeDecay = 1 / Math.max(duration, 0.05);
  });

  // Critically damped spring: no overshoot, frame rate independent.
  function spring(cur: THREE.Vector3, vel: THREE.Vector3, target: THREE.Vector3, k: number, dt: number): void {
    const omega = k;
    const exp = Math.exp(-omega * dt);
    const dx = cur.clone().sub(target);
    const temp = vel.clone().addScaledVector(dx, omega).multiplyScalar(dt);
    vel.sub(temp.clone().multiplyScalar(omega)).multiplyScalar(exp);
    cur.copy(target).add(dx.add(temp).multiplyScalar(exp));
  }

  return {
    name: 'camera-rig',
    moveTo(p, t, k = 6) {
      desiredPos.copy(p);
      desiredLook.copy(t);
      stiffness = k;
    },
    shake(amount, duration) {
      shakeAmount = Math.max(shakeAmount, amount);
      shakeDecay = 1 / Math.max(duration, 0.05);
    },
    update(t) {
      spring(pos, posVel, desiredPos, stiffness, t.dt);
      spring(look, lookVel, desiredLook, stiffness * 1.2, t.dt);

      if (shakeAmount > 0.0001) {
        shakeAmount = Math.max(0, shakeAmount - shakeDecay * t.dt);
        const s = shakeAmount * shakeAmount;
        shakeOffset.set(
          Math.sin(t.elapsed * 71.3) * s,
          Math.sin(t.elapsed * 63.7) * s,
          Math.sin(t.elapsed * 55.1) * s * 0.5
        );
      } else {
        shakeOffset.multiplyScalar(0.9);
      }

      // Slow idle drift keeps a static frame from reading as a still image.
      const drift = ctx.deterministic ? 0 : Math.sin(t.elapsed * 0.23) * 0.03;

      camera.position.copy(pos).add(shakeOffset);
      camera.position.x += drift;
      camera.lookAt(look);
    },
  };
}
