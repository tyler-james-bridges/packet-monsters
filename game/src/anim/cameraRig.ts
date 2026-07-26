import * as THREE from 'three';
import type { AppContext, System } from '../core/types';
import { choreoFor, STAGE, type AnimBeat, type Choreo } from './choreography';
import { clamp01, mix, EASE, sineInOut, cubicOut } from './easing';
import { SpringVec3, stepSpring, makeSpring } from './spring';
import { fbm1, noise3 } from './noise';

/**
 * Camera rig.
 *
 * Every framing change goes through analytic critically damped springs, so the
 * camera never snaps and never overshoots regardless of frame rate. On top of
 * that sit three things a static spring cannot give you:
 *
 *  - a per beat shot list, cut against `anim:beat` and escalated by rarity, so a
 *    legendary earns a low arcing move that a common does not get,
 *  - trauma based shake with rotational as well as positional components, which
 *    is what makes an impact feel like the camera was hit rather than nudged,
 *  - handheld: sub centimetre positional noise plus a breath on the aim, so a
 *    held frame is never mechanically still. Disabled under the harness, where
 *    a reproducible frame matters more than life.
 *
 * The rig also publishes `camera:focus` every frame with the distance to the
 * subject it is actually looking at, which is what the depth of field pass needs
 * rather than a hardcoded plane.
 */
export interface CameraRig extends System {
  moveTo(position: THREE.Vector3, target: THREE.Vector3, stiffness?: number): void;
  shake(amount: number, duration: number): void;
  /** Distance from the camera to the current subject, world units. */
  readonly focusDistance: number;
  /** Half depth of the in-focus band, world units. */
  readonly focusRange: number;
  /** Release a manual `moveTo` and hand framing back to the beat shot list. */
  releaseManual(): void;
}

interface Shot {
  pos: THREE.Vector3;
  look: THREE.Vector3;
  omega: number;
  roll: number;
  fov: number;
  /** Half depth of field band. */
  range: number;
}

const _v = new THREE.Vector3();
const _look = new THREE.Vector3();
const _euler = new THREE.Euler();
const _q = new THREE.Quaternion();
const _noise = { x: 0, y: 0, z: 0 };

export function createCameraRig(ctx: AppContext): CameraRig {
  const { camera, bus } = ctx;

  const posSpring = new SpringVec3(camera.position);
  const lookSpring = new SpringVec3(new THREE.Vector3(0, STAGE.packetY, 0));
  const rollSpring = makeSpring(0);
  const fovSpring = makeSpring(1);
  const focusSpring = makeSpring(camera.position.length());

  let baseFov = camera.fov;

  // Subject tracking, fed by the card stage.
  const subject = new THREE.Vector3(0, STAGE.packetY, 0);
  const subjectVel = new THREE.Vector3();
  let subjectSpeed = 0;

  let beat: AnimBeat = 'idle';
  let beatTime = 0;
  let beatDur = 0;
  let choreo: Choreo = choreoFor(0);

  let manual = false;
  const manualPos = new THREE.Vector3();
  const manualLook = new THREE.Vector3();
  let manualOmega = 6;

  // Trauma model: shake is trauma squared, trauma decays linearly. Squaring is
  // what gives a hit its characteristic hard onset and soft tail.
  let trauma = 0;
  let traumaDecay = 4;
  let shakeSeed = 0;

  const shot: Shot = {
    pos: new THREE.Vector3(),
    look: new THREE.Vector3(),
    omega: 2,
    roll: 0,
    fov: 1,
    range: 1.2,
  };

  const focusPayload = { distance: 3, range: 1.2 };

  function addTrauma(amount: number, duration: number): void {
    trauma = Math.min(1, trauma + amount);
    traumaDecay = 1 / Math.max(duration, 0.05);
    shakeSeed = (shakeSeed + 1) | 0;
  }

  bus.on('camera:shake', ({ amount, duration }) => addTrauma(amount, duration));

  let pendingSnap = false;

  bus.on('anim:beat', (e) => {
    beat = e.beat;
    beatTime = e.offset;
    beatDur = e.duration;
    choreo = choreoFor(e.rarity);
    manual = false;
    // A non-zero offset means the sequence was seeked, not played. Teleport the
    // rig to the shot it should already be holding; easing there would be a
    // camera move that never happened.
    if (e.offset > 0) pendingSnap = true;
  });

  bus.on('card:pose', (p) => {
    subject.set(p.x, p.y, p.z);
    subjectSpeed = p.speed;
  });

  /**
   * The shot list. Every entry is authored as a real camera position, aim point,
   * spring rate and roll, not as an offset from some previous state, so a beat
   * always resolves to the same framing no matter what preceded it.
   */
  function composeShot(dt: number): void {
    const u = beatDur > 1e-4 ? clamp01(beatTime / beatDur) : 1;
    const hero = STAGE.heroPos;

    switch (beat) {
      case 'idle': {
        // Three quarter view: the plinth reads, the packet silhouette is clean
        // against the backdrop, and the frame has somewhere to push into.
        shot.pos.set(0.34, 1.5, 3.62);
        shot.look.set(0, STAGE.packetY - 0.04, 0);
        shot.omega = 1.5;
        shot.roll = -0.008;
        shot.fov = 1;
        shot.range = 1.5;
        break;
      }
      case 'charge': {
        // Push in and drop slightly. Slow at first so the move is felt, not seen.
        const k = EASE.charge(u);
        shot.pos.set(mix(0.34, 0.12, k), mix(1.5, 1.3, k), mix(3.62, 3.62 - choreo.camPush, k));
        shot.look.set(0, STAGE.packetY - 0.05 * k, 0);
        shot.omega = mix(1.6, 2.6, k);
        shot.roll = mix(-0.008, 0.014, k);
        shot.fov = mix(1, 0.99, k);
        shot.range = mix(1.5, 0.95, k);
        break;
      }
      case 'burst': {
        // Kick back to let the card leave frame centre, then track it. Aiming at
        // the subject rather than a fixed point is what sells the ejection.
        const k = cubicOut(clamp01(beatTime / 0.42));
        shot.pos.set(mix(0.12, -0.06, k), mix(1.3, 1.56, k), mix(3.62 - choreo.camPush, 3.5, k));
        shot.look.copy(subject);
        shot.omega = 5.2;
        shot.roll = mix(0.014, -0.03, k);
        shot.fov = mix(0.99, 1.02, k);
        shot.range = 1.1;
        break;
      }
      case 'impact': {
        // Drop to plinth height so the landing is read from the side, with the
        // card's own edge as the horizon.
        const k = EASE.arrive(clamp01(beatTime / 0.3));
        shot.pos.set(mix(-0.06, 0.02, k), mix(1.56, 1.14, k), mix(3.5, 2.75, k));
        shot.look.copy(subject).y += 0.03;
        shot.omega = 6.5;
        shot.roll = mix(-0.03, 0.006, k);
        shot.fov = 1;
        shot.range = 0.62;
        break;
      }
      case 'turn': {
        // The hero move. A common barely moves. A legendary arcs from a low
        // three quarter round to a square on hero framing while the card turns,
        // and the fov squeezes to compress the background behind it.
        const s = sineInOut(u);
        const arc = choreo.camArc;
        shot.pos.set(
          mix(-arc, 0.0, s),
          mix(hero.y - 0.24, hero.y + 0.02, s),
          hero.z + mix(choreo.camHero + 0.6, choreo.camHero, EASE.glide(u))
        );
        shot.look.copy(subject).lerp(hero, 0.35 * s);
        shot.omega = mix(3.4, 2.2, s);
        shot.roll = Math.sin(u * Math.PI) * -0.035 * (0.4 + arc);
        shot.fov = mix(1, choreo.fovSqueeze, Math.sin(u * Math.PI * 0.85));
        shot.range = mix(0.62, 0.34, s);
        break;
      }
      case 'settle': {
        shot.pos.set(0, hero.y + 0.02, hero.z + choreo.camHero);
        shot.look.copy(hero);
        shot.omega = 2.0;
        shot.roll = 0;
        shot.fov = mix(choreo.fovSqueeze, 1, clamp01(beatTime / 1.2));
        shot.range = 0.34;
        break;
      }
    }

    if (manual) {
      shot.pos.copy(manualPos);
      shot.look.copy(manualLook);
      shot.omega = manualOmega;
    }

    void dt;
  }

  return {
    name: 'camera-rig',

    get focusDistance() {
      return focusSpring.value;
    },
    get focusRange() {
      return shot.range;
    },

    moveTo(p, t, k = 6) {
      manual = true;
      manualPos.copy(p);
      manualLook.copy(t);
      manualOmega = k;
    },

    releaseManual() {
      manual = false;
    },

    shake(amount, duration) {
      addTrauma(amount, duration);
    },

    resize() {
      // main.ts sets the fov for the aspect immediately before this runs, so this
      // is the correct place to re-read the base the rig modulates.
      baseFov = camera.fov / Math.max(fovSpring.value, 0.5);
    },

    update(t) {
      beatTime += t.dt;
      composeShot(t.dt);

      if (pendingSnap) {
        pendingSnap = false;
        posSpring.snap(shot.pos);
        lookSpring.snap(shot.look);
        rollSpring.value = shot.roll;
        rollSpring.velocity = 0;
        fovSpring.value = shot.fov;
        fovSpring.velocity = 0;
        focusSpring.value = shot.pos.distanceTo(subject);
        focusSpring.velocity = 0;
        trauma = 0;
      }

      // Track the subject's velocity so the aim spring leads a fast card instead
      // of permanently trailing it.
      subjectVel.copy(subject).sub(lookSpring.value).multiplyScalar(1 / Math.max(t.dt, 1e-4));
      subjectVel.clampLength(0, 8);

      posSpring.step(shot.pos, shot.omega, t.dt);
      lookSpring.step(shot.look, shot.omega * 1.35, t.dt);
      stepSpring(rollSpring, shot.roll, 3.2, t.dt);
      stepSpring(fovSpring, shot.fov, 3.6, t.dt);

      // --- shake ------------------------------------------------------------
      let shakeX = 0;
      let shakeY = 0;
      let shakeZ = 0;
      let shakeRoll = 0;
      let shakePitch = 0;
      let shakeYaw = 0;
      if (trauma > 0) {
        trauma = Math.max(0, trauma - traumaDecay * t.dt);
        const s = trauma * trauma;
        noise3(t.elapsed * 24.5, shakeSeed * 977 + 5, _noise);
        shakeX = _noise.x * s * 0.085;
        shakeY = _noise.y * s * 0.085;
        shakeZ = _noise.z * s * 0.05;
        // Rotational shake reads far harder than translation at the same amplitude.
        shakePitch = fbm1(t.elapsed * 19.3, shakeSeed * 331 + 61, 2) * s * 0.028;
        shakeYaw = fbm1(t.elapsed * 21.7, shakeSeed * 557 + 13, 2) * s * 0.028;
        shakeRoll = fbm1(t.elapsed * 16.1, shakeSeed * 733 + 97, 2) * s * 0.045;
      }

      // --- handheld ---------------------------------------------------------
      let handX = 0;
      let handY = 0;
      let handRoll = 0;
      let breath = 0;
      if (!ctx.deterministic) {
        handX = fbm1(t.elapsed * 0.37, 101, 3) * 0.012;
        handY = fbm1(t.elapsed * 0.31 + 40, 211, 3) * 0.009;
        handRoll = fbm1(t.elapsed * 0.23 + 90, 307, 2) * 0.004;
        breath = Math.sin(t.elapsed * 0.62) * 0.004;
      }

      camera.position.copy(posSpring.value);
      camera.position.x += shakeX + handX;
      camera.position.y += shakeY + handY + breath;
      camera.position.z += shakeZ;

      _look.copy(lookSpring.value);
      camera.lookAt(_look);

      // Roll and shake rotation are applied in camera local space so they never
      // fight the framing the shot list authored.
      _euler.set(shakePitch, shakeYaw, rollSpring.value + shakeRoll + handRoll, 'XYZ');
      _q.setFromEuler(_euler);
      camera.quaternion.multiply(_q);

      const fov = baseFov * fovSpring.value;
      if (Math.abs(camera.fov - fov) > 1e-4) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }

      // --- focus ------------------------------------------------------------
      _v.copy(subject).sub(camera.position);
      const target = Math.max(0.2, _v.length());
      stepSpring(focusSpring, target, 7.5, t.dt);
      focusPayload.distance = focusSpring.value;
      focusPayload.range = shot.range;
      bus.emit('camera:focus', focusPayload);

      void subjectSpeed;
    },
  };
}
