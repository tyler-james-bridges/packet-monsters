import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Geometry helpers for the chamber.
 *
 * Every architectural element is chamfered. A raw unbevelled box has a zero
 * width silhouette edge that catches no light at all, and an entire frame of
 * them is the fastest way to look like an untextured prototype.
 */

/**
 * Revolve a profile. THREE.LatheGeometry derives each normal as (dy, -dx) along
 * the profile, so for an interior surface (a wall seen from inside the room)
 * the profile must be traversed downward, and for an exterior surface upward.
 * Every profile in this file is ordered deliberately for that reason.
 */
export function revolve(profile: [number, number][], segments: number): THREE.BufferGeometry {
  const points = profile.map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(points, segments);
}

export function chamferedBox(
  width: number,
  height: number,
  depth: number,
  radius: number,
  segments = 3
): THREE.BufferGeometry {
  return new RoundedBoxGeometry(width, height, depth, segments, radius);
}

export function merge(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const merged = mergeGeometries(geometries, false);
  for (const g of geometries) g.dispose();
  if (!merged) throw new Error('geometry merge failed');
  return merged;
}

export interface InstancePlacement {
  matrix: THREE.Matrix4;
  /** Per instance UV shift so a shared texture does not visibly repeat. */
  uvOffset: THREE.Vector2;
}

/**
 * Builds an InstancedMesh and attaches the per instance UV offset attribute
 * consumed by `enableInstanceUvOffset`.
 */
export function buildInstanced(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  placements: InstancePlacement[]
): THREE.InstancedMesh {
  const mesh = new THREE.InstancedMesh(geometry, material, placements.length);
  const offsets = new Float32Array(placements.length * 2);
  for (let i = 0; i < placements.length; i++) {
    mesh.setMatrixAt(i, placements[i].matrix);
    offsets[i * 2] = placements[i].uvOffset.x;
    offsets[i * 2 + 1] = placements[i].uvOffset.y;
  }
  mesh.instanceMatrix.needsUpdate = true;
  geometry.setAttribute('aUvOffset', new THREE.InstancedBufferAttribute(offsets, 2));
  return mesh;
}

/** Places `count` copies evenly around the Y axis, each facing the axis. */
export function ringPlacements(
  count: number,
  radius: number,
  y: number,
  rng: () => number,
  angleOffset = 0
): InstancePlacement[] {
  const out: InstancePlacement[] = [];
  for (let i = 0; i < count; i++) {
    const a = angleOffset + (i / count) * Math.PI * 2;
    const m = new THREE.Matrix4();
    m.makeRotationY(a);
    m.setPosition(Math.sin(a) * radius, y, Math.cos(a) * radius);
    out.push({
      matrix: m,
      uvOffset: new THREE.Vector2(rng() * 4, rng() * 4),
    });
  }
  return out;
}

/** A flat annulus in the XZ plane, facing up. */
export function floorRing(
  inner: number,
  outer: number,
  segments = 128
): THREE.BufferGeometry {
  const g = new THREE.RingGeometry(inner, outer, segments, 1);
  g.rotateX(-Math.PI / 2);
  return g;
}

/** A flat disc in the XZ plane, facing up. */
export function floorDisc(radius: number, segments = 128): THREE.BufferGeometry {
  const g = new THREE.CircleGeometry(radius, segments);
  g.rotateX(-Math.PI / 2);
  return g;
}

/** A flat disc in the XZ plane, facing down. */
export function ceilingDisc(radius: number, segments = 96): THREE.BufferGeometry {
  const g = new THREE.CircleGeometry(radius, segments);
  g.rotateX(Math.PI / 2);
  return g;
}

/**
 * A profile revolved about the Z axis, for wall mounted circular assemblies.
 * The profile's y becomes depth toward +Z, so front facing surfaces are the
 * ones traversed with decreasing radius.
 */
export function revolveZ(profile: [number, number][], segments: number): THREE.BufferGeometry {
  const g = revolve(profile, segments);
  g.rotateX(Math.PI / 2);
  return g;
}
