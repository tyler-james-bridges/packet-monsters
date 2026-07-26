import * as THREE from 'three';
import { RigidBody } from './rigidbody';
import { applyPlateAero, type AeroParams } from './aero';

/**
 * Minimal rigid body world: gravity, optional per body plate aerodynamics, and
 * sequential impulse contacts against a small set of static planes. No broad
 * phase and no body/body pairs, because the pack opening never needs them.
 *
 * Stability is the whole point here. Three things buy it:
 *  - a fixed internal substep (the accumulator never lets a long frame take one
 *    huge step, and under the harness dt is exactly 1/60 so the substeps are
 *    exactly 1/120 and the result is bit reproducible),
 *  - restitution suppressed below a threshold impact speed, so a card cannot
 *    micro-bounce forever,
 *  - explicit sleeping, so a resting card is genuinely still rather than
 *    jittering against the solver.
 */
export interface StaticPlane {
  /** Unit outward normal. Contact happens when a point goes below the plane. */
  normal: THREE.Vector3;
  /** Plane offset: the surface is `dot(p, normal) = offset`. */
  offset: number;
  /** Optional disc limit in the plane's tangent directions, around `center`. */
  radius?: number;
  center?: THREE.Vector3;
  restitution: number;
  friction: number;
  /** Passed to the contact callback so the stage can tell plinth from floor. */
  id: string;
}

export interface Contact {
  planeId: string;
  /** World point of the deepest corner. */
  point: THREE.Vector3;
  /** Normal impulse magnitude accumulated this step. */
  impulse: number;
  /** Approach speed along the normal before the impulse. */
  speed: number;
}

interface Entry {
  body: RigidBody;
  aero: AeroParams | null;
  collide: boolean;
}

const _corner = new THREE.Vector3();
const _r = new THREE.Vector3();
const _vp = new THREE.Vector3();
const _tmp = new THREE.Vector3();
const _tmp2 = new THREE.Vector3();
const _imp = new THREE.Vector3();
const _tan = new THREE.Vector3();
const _deepest = new THREE.Vector3();

const CORNER_SIGNS: ReadonlyArray<readonly [number, number, number]> = [
  [-1, -1, -1],
  [1, -1, -1],
  [-1, 1, -1],
  [1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [-1, 1, 1],
  [1, 1, 1],
];

export class PhysicsWorld {
  readonly gravity = new THREE.Vector3(0, -9.4, 0);
  readonly planes: StaticPlane[] = [];

  /** Fixed substep. 1/120 divides the harness dt exactly. */
  fixedStep = 1 / 120;
  maxSubsteps = 4;
  solverIterations = 4;
  /** Below this approach speed contacts are treated as inelastic. */
  restitutionThreshold = 0.55;
  /** Linear and angular speeds under which a body starts falling asleep. */
  sleepLinear = 0.055;
  sleepAngular = 0.22;
  sleepDelay = 0.28;

  private readonly bodies: Entry[] = [];
  private onContact: ((c: Contact) => void) | null = null;
  private readonly contact: Contact = {
    planeId: '',
    point: new THREE.Vector3(),
    impulse: 0,
    speed: 0,
  };

  add(body: RigidBody, options: { aero?: AeroParams; collide?: boolean } = {}): RigidBody {
    this.bodies.push({
      body,
      aero: options.aero ?? null,
      collide: options.collide ?? true,
    });
    return body;
  }

  remove(body: RigidBody): void {
    const i = this.bodies.findIndex((e) => e.body === body);
    if (i >= 0) this.bodies.splice(i, 1);
  }

  addPlane(plane: StaticPlane): StaticPlane {
    this.planes.push(plane);
    return plane;
  }

  contacts(fn: (c: Contact) => void): void {
    this.onContact = fn;
  }

  step(dt: number): void {
    if (dt <= 0) return;
    const n = Math.max(1, Math.min(this.maxSubsteps, Math.ceil(dt / this.fixedStep - 1e-6)));
    const h = dt / n;
    for (let i = 0; i < n; i++) this.substep(h);
  }

  private substep(h: number): void {
    for (const e of this.bodies) {
      const b = e.body;
      if (!b.active || b.sleeping) continue;
      b.force.addScaledVector(this.gravity, b.mass);
      if (e.aero) applyPlateAero(b, e.aero, h);
      b.integrate(h);
    }
    for (const e of this.bodies) {
      if (!e.collide) continue;
      const b = e.body;
      if (!b.active || b.sleeping) continue;
      this.resolve(b);
      this.updateSleep(b, h);
    }
  }

  private resolve(b: RigidBody): void {
    let reported = 0;
    let reportedSpeed = 0;
    let reportedPlane = '';

    for (let iter = 0; iter < this.solverIterations; iter++) {
      let maxDepth = 0;
      _deepest.set(0, 0, 0);

      for (const plane of this.planes) {
        for (const s of CORNER_SIGNS) {
          _corner
            .set(s[0] * b.halfSize.x, s[1] * b.halfSize.y, s[2] * b.halfSize.z)
            .applyQuaternion(b.quaternion)
            .add(b.position);

          const depth = plane.offset - _corner.dot(plane.normal);
          if (depth <= 0) continue;
          if (plane.radius !== undefined) {
            const cx = plane.center ? plane.center.x : 0;
            const cz = plane.center ? plane.center.z : 0;
            const dx = _corner.x - cx;
            const dz = _corner.z - cz;
            if (dx * dx + dz * dz > plane.radius * plane.radius) continue;
          }

          if (depth > maxDepth) {
            maxDepth = depth;
            _deepest.copy(plane.normal);
          }

          _r.copy(_corner).sub(b.position);
          _vp.copy(b.angularVelocity).cross(_r).add(b.velocity);
          const vn = _vp.dot(plane.normal);
          if (vn >= 0) continue;

          // Effective mass along the contact normal.
          _tmp.copy(_r).cross(plane.normal);
          b.applyInvInertia(_tmp, _tmp2);
          const effN = b.invMass + _tmp2.cross(_r).dot(plane.normal);
          if (effN <= 1e-9) continue;

          const closing = -vn;
          const e =
            closing < this.restitutionThreshold ? 0 : plane.restitution * b.restitution;
          const j = (-(1 + e) * vn) / effN;
          _imp.copy(plane.normal).multiplyScalar(j);
          b.velocity.addScaledVector(_imp, b.invMass);
          _tmp.copy(_r).cross(_imp);
          b.applyInvInertia(_tmp, _tmp2);
          b.angularVelocity.add(_tmp2);

          if (iter === 0 && j > reported) {
            reported = j;
            reportedSpeed = closing;
            reportedPlane = plane.id;
            this.contact.point.copy(_corner);
          }

          // Coulomb friction along the tangential slip after the normal impulse.
          _vp.copy(b.angularVelocity).cross(_r).add(b.velocity);
          _tan.copy(_vp).addScaledVector(plane.normal, -_vp.dot(plane.normal));
          const slip = _tan.length();
          if (slip > 1e-5) {
            _tan.multiplyScalar(1 / slip);
            _tmp.copy(_r).cross(_tan);
            b.applyInvInertia(_tmp, _tmp2);
            const effT = b.invMass + _tmp2.cross(_r).dot(_tan);
            if (effT > 1e-9) {
              const mu = plane.friction * b.friction;
              const jt = Math.max(-slip / effT, -mu * j);
              _imp.copy(_tan).multiplyScalar(jt);
              b.velocity.addScaledVector(_imp, b.invMass);
              _tmp.copy(_r).cross(_imp);
              b.applyInvInertia(_tmp, _tmp2);
              b.angularVelocity.add(_tmp2);
            }
          }
        }
      }

      // Positional correction. Leaving a sliver of allowed penetration stops the
      // solver from pumping the body out and back in every frame.
      const slop = 0.0004;
      if (maxDepth > slop) {
        b.position.addScaledVector(_deepest, (maxDepth - slop) * 0.72);
      } else if (maxDepth === 0) {
        break;
      }
    }

    if (reported > 0 && this.onContact) {
      this.contact.planeId = reportedPlane;
      this.contact.impulse = reported;
      this.contact.speed = reportedSpeed;
      this.onContact(this.contact);
    }
  }

  private updateSleep(b: RigidBody, h: number): void {
    const still =
      b.velocity.lengthSq() < this.sleepLinear * this.sleepLinear &&
      b.angularVelocity.lengthSq() < this.sleepAngular * this.sleepAngular;
    if (still) {
      b.restTimer += h;
      if (b.restTimer > this.sleepDelay) {
        b.sleeping = true;
        b.velocity.set(0, 0, 0);
        b.angularVelocity.set(0, 0, 0);
      }
    } else {
      b.restTimer = 0;
    }
  }
}
