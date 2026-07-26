import * as THREE from 'three';
import type { RigidBody } from './rigidbody';

/**
 * Thin plate aerodynamics.
 *
 * A falling card does not behave like a falling brick, and the difference is
 * entirely aerodynamic. Three terms produce the whole recognisable flutter:
 *
 *  1. Normal pressure. A flat plate makes almost all of its force perpendicular
 *     to its own surface, proportional to the square of the *normal* component
 *     of velocity. Edge on it barely resists; broadside it stops hard.
 *
 *  2. Centre of pressure shift. That force does not act at the centroid. It acts
 *     forward of it, toward the leading edge, and the offset grows as the card
 *     approaches edge on. The centre of pressure sitting ahead of the centre of
 *     mass makes the card statically unstable in pitch, which is exactly why a
 *     dropped card never falls straight: it stalls, tips, slices, accelerates,
 *     stalls the other way. This one term is the flutter.
 *
 *  3. Rotational drag, quadratic in angular rate. Without it the instability
 *     from (2) has nothing to bound it and the card spins up forever.
 *
 * A `liftCoupling` term (a Magnus-like omega x v force) adds the sideways drift
 * that keeps a tumbling card from falling in a flat plane.
 *
 * The card's face normal is local +Z. Local X is width, local Y is height.
 */
export interface AeroParams {
  /** Effective air density. Scales the whole thing; tune this first. */
  density: number;
  /** Normal pressure coefficient. Around 1.2 for a flat plate broadside. */
  normalDrag: number;
  /** In plane skin drag coefficient. Much smaller than normalDrag. */
  edgeDrag: number;
  /** Centre of pressure offset as a fraction of the half chord, edge on. */
  copShift: number;
  /** Quadratic rotational damping. */
  rotationalDrag: number;
  /** Magnus-like spin/velocity coupling. */
  liftCoupling: number;
}

export const CARD_AERO: AeroParams = {
  density: 1.9,
  normalDrag: 1.28,
  edgeDrag: 0.06,
  copShift: 0.42,
  rotationalDrag: 0.016,
  liftCoupling: 0.035,
};

const _n = new THREE.Vector3();
const _vt = new THREE.Vector3();
const _f = new THREE.Vector3();
const _cop = new THREE.Vector3();
const _t = new THREE.Vector3();
const _lift = new THREE.Vector3();

/**
 * Accumulate aerodynamic force and torque onto a thin plate body for this step.
 * Call before `integrate`.
 */
export function applyPlateAero(body: RigidBody, p: AeroParams): void {
  if (!body.active || body.sleeping) return;

  const w = body.size.x;
  const h = body.size.y;
  const area = w * h;
  const halfChord = 0.5 * Math.sqrt(w * h); // geometric mean: the card is not square

  body.axis(2, _n); // face normal, world space

  const speed = body.velocity.length();
  if (speed > 1e-4) {
    const vn = body.velocity.dot(_n);
    const q = 0.5 * p.density * area;

    // 1. Normal pressure, opposing the normal component of the flow.
    const fn = -q * p.normalDrag * Math.abs(vn) * vn;
    _f.copy(_n).multiplyScalar(fn);

    // In plane flow direction. The leading edge is the edge heading into it.
    _vt.copy(body.velocity).addScaledVector(_n, -vn);
    const vtLen = _vt.length();

    // 2. Centre of pressure. Broadside (sinAlpha = 1) it sits at the centroid;
    // edge on it runs out toward the leading edge and destabilises the pitch.
    if (vtLen > 1e-5) {
      const sinAlpha = Math.min(1, Math.abs(vn) / speed);
      const offset = halfChord * p.copShift * (1 - sinAlpha);
      _cop.copy(_vt).multiplyScalar(offset / vtLen);
      body.torque.add(_t.copy(_cop).cross(_f));

      // In plane skin drag over the thin edge cross section.
      const edgeArea = area * 0.08 + w * body.size.z;
      const ft = -0.5 * p.density * p.edgeDrag * edgeArea * vtLen;
      _f.addScaledVector(_vt, ft);
    }

    body.force.add(_f);

    // 4. Magnus-like coupling. Spin across the flow pushes the card sideways.
    if (p.liftCoupling > 0) {
      _lift.copy(body.angularVelocity).cross(body.velocity);
      body.force.addScaledVector(_lift, p.liftCoupling * p.density * area);
    }
  }

  // 3. Quadratic rotational damping, scaled by the plan area and the lever arm.
  const wl = body.angularVelocity.length();
  if (wl > 1e-5) {
    const k = p.rotationalDrag * p.density * area * halfChord * halfChord * wl;
    body.torque.addScaledVector(body.angularVelocity, -k);
  }
}
