import * as THREE from 'three';

/**
 * Compact rigid body for a box.
 *
 * Semi-implicit (symplectic) Euler on the linear state and an exact exponential
 * map on the orientation, which is what keeps a fast tumbling card from drifting
 * off the unit quaternion or gaining energy the way a first order `q += 0.5*w*q`
 * step does. Damping is applied as `exp(-k*dt)` rather than `1 - k*dt` so the
 * decay rate is identical at any frame rate.
 *
 * Inertia is stored as the inverse of the body space diagonal. The world space
 * inverse inertia is never materialised as a matrix; `applyInvInertia` rotates
 * into body space, scales, and rotates back, which is both cheaper and exact.
 */
export interface RigidBodyDesc {
  /** Kilograms. A real trading card is about 1.8 g. */
  mass: number;
  /** Full extents in local space. Local +Z is the face normal for a card. */
  size: THREE.Vector3;
  /** Per second exponential decay of linear velocity, on top of aerodynamics. */
  linearDamping?: number;
  angularDamping?: number;
  restitution?: number;
  friction?: number;
}

const _q = new THREE.Quaternion();
const _v = new THREE.Vector3();
const _r = new THREE.Vector3();
const _spin = new THREE.Quaternion();

export class RigidBody {
  readonly position = new THREE.Vector3();
  readonly quaternion = new THREE.Quaternion();
  /** Linear velocity, world space, m/s. */
  readonly velocity = new THREE.Vector3();
  /** Angular velocity, world space, rad/s. */
  readonly angularVelocity = new THREE.Vector3();
  readonly force = new THREE.Vector3();
  readonly torque = new THREE.Vector3();

  readonly size: THREE.Vector3;
  readonly halfSize: THREE.Vector3;
  readonly invInertiaLocal = new THREE.Vector3();

  mass: number;
  invMass: number;
  linearDamping: number;
  angularDamping: number;
  restitution: number;
  friction: number;

  /** Set false to freeze the body without destroying its state. */
  active = true;
  sleeping = false;
  restTimer = 0;

  constructor(desc: RigidBodyDesc) {
    this.mass = Math.max(desc.mass, 1e-6);
    this.invMass = 1 / this.mass;
    this.size = desc.size.clone();
    this.halfSize = desc.size.clone().multiplyScalar(0.5);
    this.linearDamping = desc.linearDamping ?? 0;
    this.angularDamping = desc.angularDamping ?? 0;
    this.restitution = desc.restitution ?? 0.2;
    this.friction = desc.friction ?? 0.5;
    this.setBoxInertia();
  }

  /** Solid box inertia: I_xx = m/12 * (y^2 + z^2), and so on. */
  setBoxInertia(): void {
    const { x, y, z } = this.size;
    const k = this.mass / 12;
    const ix = k * (y * y + z * z);
    const iy = k * (x * x + z * z);
    const iz = k * (x * x + y * y);
    this.invInertiaLocal.set(1 / ix, 1 / iy, 1 / iz);
  }

  /** out = I_world^-1 * v, for a world space vector v. */
  applyInvInertia(v: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
    _q.copy(this.quaternion).conjugate();
    out.copy(v).applyQuaternion(_q);
    out.multiply(this.invInertiaLocal);
    out.applyQuaternion(this.quaternion);
    return out;
  }

  wake(): void {
    this.sleeping = false;
    this.restTimer = 0;
  }

  addForce(f: THREE.Vector3): void {
    this.force.add(f);
  }

  addTorque(t: THREE.Vector3): void {
    this.torque.add(t);
  }

  /** Force at a world space point; produces the matching torque about the centre of mass. */
  addForceAtPoint(f: THREE.Vector3, worldPoint: THREE.Vector3): void {
    this.force.add(f);
    _r.copy(worldPoint).sub(this.position);
    this.torque.add(_v.copy(_r).cross(f));
  }

  addImpulseAtPoint(impulse: THREE.Vector3, worldPoint: THREE.Vector3): void {
    this.velocity.addScaledVector(impulse, this.invMass);
    _r.copy(worldPoint).sub(this.position);
    _v.copy(_r).cross(impulse);
    this.applyInvInertia(_v, _v);
    this.angularVelocity.add(_v);
    this.wake();
  }

  /** Velocity of the material point currently at `worldPoint`. */
  pointVelocity(worldPoint: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
    _r.copy(worldPoint).sub(this.position);
    out.copy(this.angularVelocity).cross(_r).add(this.velocity);
    return out;
  }

  /** World space local axis: 0 = X, 1 = Y, 2 = Z (the card's face normal). */
  axis(index: 0 | 1 | 2, out: THREE.Vector3): THREE.Vector3 {
    out.set(index === 0 ? 1 : 0, index === 1 ? 1 : 0, index === 2 ? 1 : 0);
    return out.applyQuaternion(this.quaternion);
  }

  integrate(dt: number): void {
    if (!this.active || this.sleeping) {
      this.force.set(0, 0, 0);
      this.torque.set(0, 0, 0);
      return;
    }

    this.velocity.addScaledVector(this.force, this.invMass * dt);
    this.applyInvInertia(this.torque, _v);
    this.angularVelocity.addScaledVector(_v, dt);

    if (this.linearDamping > 0) this.velocity.multiplyScalar(Math.exp(-this.linearDamping * dt));
    if (this.angularDamping > 0) {
      this.angularVelocity.multiplyScalar(Math.exp(-this.angularDamping * dt));
    }

    this.position.addScaledVector(this.velocity, dt);

    // Exponential map: exact for a constant angular velocity over the step, and
    // it stays on the unit sphere instead of needing renormalisation to rescue it.
    const w = this.angularVelocity.length();
    if (w > 1e-8) {
      const angle = w * dt;
      _v.copy(this.angularVelocity).multiplyScalar(1 / w);
      _spin.setFromAxisAngle(_v, angle);
      // Angular velocity is in world space, so the increment premultiplies.
      this.quaternion.premultiply(_spin).normalize();
    }

    this.force.set(0, 0, 0);
    this.torque.set(0, 0, 0);
  }

  /** Write the current pose onto a scene object. */
  writeTo(object: THREE.Object3D): void {
    object.position.copy(this.position);
    object.quaternion.copy(this.quaternion);
  }

  readFrom(position: THREE.Vector3, quaternion: THREE.Quaternion): void {
    this.position.copy(position);
    this.quaternion.copy(quaternion).normalize();
    this.velocity.set(0, 0, 0);
    this.angularVelocity.set(0, 0, 0);
    this.wake();
  }
}
