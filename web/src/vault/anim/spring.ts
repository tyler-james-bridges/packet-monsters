import * as THREE from 'three';

/**
 * Analytic springs.
 *
 * These are closed form solutions of the damped harmonic oscillator, evaluated
 * once per frame at an arbitrary dt. That matters for two reasons: the motion is
 * exactly frame rate independent (a 30 fps step and two 60 fps steps land on the
 * same value), and a critically damped spring genuinely never overshoots, which
 * a naive `vel += (target - x) * k * dt` integrator cannot promise at any dt.
 *
 * Parameterisation is by angular frequency `omega` (rad/s). Higher is snappier.
 * `omegaFromHalfLife` converts from the more intuitive "seconds to close half
 * the gap" if that is how you think about it.
 */

const LN2 = Math.LN2;

export interface SpringState {
  value: number;
  velocity: number;
}

export function makeSpring(value = 0, velocity = 0): SpringState {
  return { value, velocity };
}

export function omegaFromHalfLife(halfLife: number): number {
  return (2 * LN2) / Math.max(halfLife, 1e-5);
}

export function halfLifeFromOmega(omega: number): number {
  return (2 * LN2) / Math.max(omega, 1e-5);
}

/**
 * Critically damped step. Exact solution of x'' + 2*omega*x' + omega^2*x = 0,
 * so no overshoot at any dt, ever.
 *
 * `targetVelocity` lets the spring chase a moving goal without lagging behind
 * it forever, which is what keeps camera tracking from trailing a fast card.
 */
export function stepSpring(
  s: SpringState,
  target: number,
  omega: number,
  dt: number,
  targetVelocity = 0
): number {
  if (dt <= 0) return s.value;
  const y = Math.max(omega, 1e-5);
  // Offset goal so the steady state tracks a constant target velocity exactly.
  const c = target + (2 * targetVelocity) / y;
  const j0 = s.value - c;
  const j1 = s.velocity + j0 * y;
  const e = Math.exp(-y * dt);
  s.value = e * (j0 + j1 * dt) + c;
  s.velocity = e * (s.velocity - j1 * y * dt);
  return s.value;
}

/**
 * General damping ratio. `zeta` < 1 overshoots and rings, 1 is critical, > 1 is
 * sluggish. Only reach for this when the overshoot is the point; the default
 * everywhere else is `stepSpring`.
 */
export function stepSpringDamped(
  s: SpringState,
  target: number,
  omega: number,
  zeta: number,
  dt: number
): number {
  if (dt <= 0) return s.value;
  const w = Math.max(omega, 1e-5);
  if (Math.abs(zeta - 1) < 1e-3) return stepSpring(s, target, w, dt);

  const x0 = s.value - target;
  const v0 = s.velocity;

  if (zeta < 1) {
    const wd = w * Math.sqrt(1 - zeta * zeta);
    const e = Math.exp(-zeta * w * dt);
    const A = x0;
    const B = (v0 + zeta * w * x0) / wd;
    const c = Math.cos(wd * dt);
    const sn = Math.sin(wd * dt);
    const x = A * c + B * sn;
    s.value = target + e * x;
    s.velocity = e * (-zeta * w * x + wd * (-A * sn + B * c));
  } else {
    const r = w * Math.sqrt(zeta * zeta - 1);
    const r1 = -zeta * w + r;
    const r2 = -zeta * w - r;
    const c2 = (v0 - r1 * x0) / (r2 - r1);
    const c1 = x0 - c2;
    const e1 = Math.exp(r1 * dt);
    const e2 = Math.exp(r2 * dt);
    s.value = target + c1 * e1 + c2 * e2;
    s.velocity = c1 * r1 * e1 + c2 * r2 * e2;
  }
  return s.value;
}

/** Wrapped angular spring. Always takes the short way round. */
export function stepSpringAngle(
  s: SpringState,
  target: number,
  omega: number,
  dt: number
): number {
  const TAU = Math.PI * 2;
  let delta = s.value - target;
  delta -= TAU * Math.floor((delta + Math.PI) / TAU); // wrap into (-PI, PI]
  s.value = target + delta; // rebase onto the nearest branch, then spring normally
  return stepSpring(s, target, omega, dt);
}

/** Three independent critically damped springs. The system is separable, so this is exact. */
export class SpringVec3 {
  readonly value = new THREE.Vector3();
  readonly velocity = new THREE.Vector3();
  private readonly sx: SpringState = { value: 0, velocity: 0 };
  private readonly sy: SpringState = { value: 0, velocity: 0 };
  private readonly sz: SpringState = { value: 0, velocity: 0 };

  constructor(initial?: THREE.Vector3) {
    if (initial) this.snap(initial);
  }

  snap(v: THREE.Vector3): this {
    this.value.copy(v);
    this.velocity.set(0, 0, 0);
    return this;
  }

  step(target: THREE.Vector3, omega: number, dt: number, targetVelocity?: THREE.Vector3): THREE.Vector3 {
    this.sx.value = this.value.x;
    this.sy.value = this.value.y;
    this.sz.value = this.value.z;
    this.sx.velocity = this.velocity.x;
    this.sy.velocity = this.velocity.y;
    this.sz.velocity = this.velocity.z;
    stepSpring(this.sx, target.x, omega, dt, targetVelocity ? targetVelocity.x : 0);
    stepSpring(this.sy, target.y, omega, dt, targetVelocity ? targetVelocity.y : 0);
    stepSpring(this.sz, target.z, omega, dt, targetVelocity ? targetVelocity.z : 0);
    this.value.set(this.sx.value, this.sy.value, this.sz.value);
    this.velocity.set(this.sx.velocity, this.sy.velocity, this.sz.velocity);
    return this.value;
  }
}

// --- rotational springs -----------------------------------------------------

const _diff = new THREE.Quaternion();
const _inv = new THREE.Quaternion();
const _j0 = new THREE.Vector3();
const _j1 = new THREE.Vector3();
const _tmpV = new THREE.Vector3();
const _rot = new THREE.Quaternion();

/** 2*log(q): the rotation as a scaled axis vector, taking the short arc. */
export function quatToScaledAngleAxis(q: THREE.Quaternion, out: THREE.Vector3): THREE.Vector3 {
  let { x, y, z, w } = q;
  if (w < 0) {
    x = -x;
    y = -y;
    z = -z;
    w = -w;
  }
  const s = Math.sqrt(x * x + y * y + z * z);
  if (s < 1e-8) return out.set(x * 2, y * 2, z * 2);
  const angle = 2 * Math.atan2(s, w);
  return out.set((x / s) * angle, (y / s) * angle, (z / s) * angle);
}

/** exp(v/2): inverse of `quatToScaledAngleAxis`. */
export function quatFromScaledAngleAxis(v: THREE.Vector3, out: THREE.Quaternion): THREE.Quaternion {
  const angle = v.length();
  if (angle < 1e-8) return out.set(v.x * 0.5, v.y * 0.5, v.z * 0.5, 1).normalize();
  const half = angle * 0.5;
  const s = Math.sin(half) / angle;
  return out.set(v.x * s, v.y * s, v.z * s, Math.cos(half));
}

/**
 * Critically damped spring on the rotation manifold. Works on the log map of the
 * error quaternion, so it behaves correctly through large rotations instead of
 * degenerating the way a componentwise quaternion lerp does.
 *
 * `angularVelocity` is in rad/s in the same frame as `q`.
 */
export function stepSpringQuat(
  q: THREE.Quaternion,
  angularVelocity: THREE.Vector3,
  goal: THREE.Quaternion,
  omega: number,
  dt: number
): void {
  if (dt <= 0) return;
  const y = Math.max(omega, 1e-5);
  _inv.copy(goal).invert();
  _diff.copy(q).multiply(_inv);
  quatToScaledAngleAxis(_diff, _j0);
  _j1.copy(angularVelocity).addScaledVector(_j0, y);
  const e = Math.exp(-y * dt);
  _tmpV.copy(_j0).addScaledVector(_j1, dt).multiplyScalar(e);
  quatFromScaledAngleAxis(_tmpV, _rot);
  q.copy(_rot).multiply(goal).normalize();
  angularVelocity.addScaledVector(_j1, -y * dt).multiplyScalar(e);
}

/** Convenience wrapper that owns its own angular velocity. */
export class SpringQuat {
  readonly value = new THREE.Quaternion();
  readonly angularVelocity = new THREE.Vector3();

  snap(q: THREE.Quaternion): this {
    this.value.copy(q);
    this.angularVelocity.set(0, 0, 0);
    return this;
  }

  step(goal: THREE.Quaternion, omega: number, dt: number): THREE.Quaternion {
    stepSpringQuat(this.value, this.angularVelocity, goal, omega, dt);
    return this.value;
  }
}
