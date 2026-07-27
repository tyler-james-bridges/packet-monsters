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
  /** Air density, kg/m^3. 1.2 is real air; raising it exaggerates the flutter. */
  density: number;
  /** Normal pressure coefficient. Around 1.28 for a flat plate broadside. */
  normalDrag: number;
  /** In plane skin drag coefficient. Much smaller than normalDrag. */
  edgeDrag: number;
  /** Centre of pressure offset as a fraction of the half chord, edge on. */
  copShift: number;
  /** Angular damping coefficient, quadratic in rate. Applied analytically. */
  rotationalDrag: number;
  /** Magnus-like spin/velocity coupling. */
  liftCoupling: number;
}

export const CARD_AERO: AeroParams = {
  density: 0.6,
  normalDrag: 1.28,
  edgeDrag: 0.08,
  copShift: 0.46,
  rotationalDrag: 0.34,
  liftCoupling: 0.02,
};

const _n = new THREE.Vector3();
const _vt = new THREE.Vector3();
const _cop = new THREE.Vector3();
const _t = new THREE.Vector3();
const _fn = new THREE.Vector3();
const _lift = new THREE.Vector3();

/**
 * Accumulate aerodynamic force and torque onto a thin plate body for this step.
 * Call before `integrate`. `h` is the substep about to be taken.
 *
 * Quadratic drag on a body with this much area and this little mass is stiff:
 * an explicit `F = -c|v|v` step can easily overshoot and reverse the velocity,
 * and then it diverges. So both drag terms are solved analytically instead. The
 * scalar equation `dv/dt = -c|v|v` has the exact solution `v/(1 + c|v0|t)`, and
 * the force reported back to the solver is the one that produces exactly that
 * velocity change over the step. The result is unconditionally stable at any dt
 * and still gives the torque the centre of pressure needs.
 */
export function applyPlateAero(body: RigidBody, p: AeroParams, h: number): void {
  if (!body.active || body.sleeping || h <= 0) return;

  const w = body.size.x;
  const ht = body.size.y;
  const area = w * ht;
  const halfChord = 0.5 * Math.sqrt(w * ht); // geometric mean: the card is not square
  const m = body.mass;

  body.axis(2, _n); // face normal, world space

  const speed = body.velocity.length();
  if (speed > 1e-4) {
    const vn = body.velocity.dot(_n);

    // 1. Normal pressure, opposing the normal component of the flow.
    const cn = (0.5 * p.density * p.normalDrag * area) / m;
    const vnNext = vn / (1 + cn * Math.abs(vn) * h);
    const fn = (m * (vnNext - vn)) / h;
    _fn.copy(_n).multiplyScalar(fn);
    body.force.add(_fn);

    // In plane flow direction. The leading edge is the edge heading into it.
    _vt.copy(body.velocity).addScaledVector(_n, -vn);
    const vtLen = _vt.length();

    if (vtLen > 1e-5) {
      // 2. Centre of pressure. Broadside (sinAlpha = 1) it sits at the centroid;
      // edge on it runs out toward the leading edge, ahead of the centre of mass,
      // which is what makes the card statically unstable in pitch. This is the
      // flutter.
      const sinAlpha = Math.min(1, Math.abs(vn) / speed);
      const offset = halfChord * p.copShift * (1 - sinAlpha);
      _cop.copy(_vt).multiplyScalar(offset / vtLen);
      body.torque.add(_t.copy(_cop).cross(_fn));

      // In plane skin drag over the thin edge cross section, same analytic form.
      const edgeArea = area * 0.1 + w * body.size.z;
      const ct = (0.5 * p.density * p.edgeDrag * edgeArea) / m;
      const vtNext = vtLen / (1 + ct * vtLen * h);
      body.force.addScaledVector(_vt, (m * (vtNext - vtLen)) / h / vtLen);
    }

    // 3. Magnus-like coupling. Spin across the flow pushes the card sideways and
    // stops a tumble from staying in one plane.
    if (p.liftCoupling > 0) {
      _lift.copy(body.angularVelocity).cross(body.velocity);
      body.force.addScaledVector(_lift, p.liftCoupling * p.density * area);
    }
  }

  // 4. Rotational damping, quadratic in rate, again solved analytically so a fast
  // ejection spin can never be turned inside out by one large step.
  const wl = body.angularVelocity.length();
  if (wl > 1e-5) {
    body.angularVelocity.multiplyScalar(1 / (1 + p.rotationalDrag * wl * h));
  }
}
