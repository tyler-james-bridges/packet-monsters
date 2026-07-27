import * as THREE from 'three';

/**
 * The physical card body.
 *
 * A trading card is 63 x 88 x 0.3 mm with a 3 mm corner radius and a slightly
 * rolled cut edge. That roll is the detail that sells the object: it is what
 * catches a highlight all the way around the outline and it is what lets the
 * printed face wrap a hair over the edge the way a real laminated card does.
 *
 * The mesh is a swept profile, not a box. Three groups come out of it:
 *
 *   0  front face, including the front edge roll   (planar UV, origin top-left)
 *   1  back face, including the back edge roll     (planar UV, mirrored in u)
 *   2  the trimmed edge band                       (u = arc length, v = depth)
 *
 * UVs put v = 0 at the top of the card because every texture this package
 * uploads is a DataTexture with flipY disabled. Do not change one without the
 * other.
 */

export const CARD = {
  /** 63:88, the real trading card ratio. */
  aspect: 63 / 88,
  /** Card thickness as a fraction of height. 0.3 mm over 88 mm. */
  thicknessRatio: 0.0042,
  /** Corner radius as a fraction of height. 3 mm over 88 mm. */
  cornerRatio: 3 / 88,
  /** Edge roll radius as a fraction of thickness. */
  rollRatio: 0.36,
  /** Default world height used by the stage. */
  defaultHeight: 0.62,
} as const;

export interface CardGeometryOptions {
  height?: number;
  /** Outline segments per corner. 12 is smooth at hero framing. */
  cornerSegments?: number;
  /** Cross-section segments across the edge roll. */
  rollSegments?: number;
}

interface Profile {
  inset: number;
  z: number;
  no: number;
  nz: number;
}

function outline(hw: number, hh: number, r: number, cornerSegments: number): { x: number; y: number; nx: number; ny: number }[] {
  const pts: { x: number; y: number; nx: number; ny: number }[] = [];
  // Four corner arcs, walked counter-clockwise starting from the +x/+y corner.
  const corners: [number, number, number][] = [
    [hw - r, hh - r, 0],
    [-(hw - r), hh - r, Math.PI * 0.5],
    [-(hw - r), -(hh - r), Math.PI],
    [hw - r, -(hh - r), Math.PI * 1.5],
  ];
  for (const [cx, cy, a0] of corners) {
    for (let i = 0; i <= cornerSegments; i++) {
      const a = a0 + (i / cornerSegments) * Math.PI * 0.5;
      const nx = Math.cos(a);
      const ny = Math.sin(a);
      pts.push({ x: cx + nx * r, y: cy + ny * r, nx, ny });
    }
  }
  return pts;
}

export function createCardGeometry(opts: CardGeometryOptions = {}): THREE.BufferGeometry {
  const H = opts.height ?? CARD.defaultHeight;
  const W = H * CARD.aspect;
  const T = H * CARD.thicknessRatio;
  const R = H * CARD.cornerRatio;
  const cornerSegments = opts.cornerSegments ?? 12;
  const rollSegments = opts.rollSegments ?? 3;

  const hw = W * 0.5;
  const hh = H * 0.5;
  const ht = T * 0.5;
  const E = Math.min(T * CARD.rollRatio, ht * 0.9);

  const ring = outline(hw, hh, R, cornerSegments);
  const N = ring.length;

  // Cumulative arc length around the outline, for the edge band's u.
  const arc = new Float32Array(N + 1);
  for (let i = 0; i < N; i++) {
    const a = ring[i];
    const b = ring[(i + 1) % N];
    arc[i + 1] = arc[i] + Math.hypot(b.x - a.x, b.y - a.y);
  }
  const perimeter = arc[N] || 1;

  // Cross-section profile: front roll, straight trimmed band, back roll.
  const profile: Profile[] = [];
  for (let k = 0; k <= rollSegments; k++) {
    const a = (k / rollSegments) * Math.PI * 0.5;
    profile.push({ inset: E * (1 - Math.sin(a)), z: ht - E + E * Math.cos(a), no: Math.sin(a), nz: Math.cos(a) });
  }
  for (let k = rollSegments; k >= 0; k--) {
    const a = (k / rollSegments) * Math.PI * 0.5;
    profile.push({ inset: E * (1 - Math.sin(a)), z: -(ht - E + E * Math.cos(a)), no: Math.sin(a), nz: -Math.cos(a) });
  }

  const pos: number[] = [];
  const nor: number[] = [];
  const uvs: number[] = [];
  const idx: number[] = [];
  const groups: { start: number; count: number; mat: number }[] = [];

  type UvMode = 'front' | 'back' | 'edge';

  const planarUv = (x: number, y: number, mirror: boolean): [number, number] => [
    mirror ? 0.5 - x / W : 0.5 + x / W,
    0.5 - y / H,
  ];

  function emitRing(p: Profile, mode: UvMode, edgeV: number): number {
    const base = pos.length / 3;
    for (let i = 0; i <= N; i++) {
      const o = ring[i % N];
      const x = o.x - o.nx * p.inset;
      const y = o.y - o.ny * p.inset;
      pos.push(x, y, p.z);
      nor.push(o.nx * p.no, o.ny * p.no, p.nz);
      if (mode === 'edge') {
        uvs.push((arc[i] / perimeter) * 8, edgeV);
      } else {
        const [u, v] = planarUv(x, y, mode === 'back');
        uvs.push(u, v);
      }
    }
    return base;
  }

  function strip(a: Profile, b: Profile, mode: UvMode, mat: number, vA = 0, vB = 1): void {
    const ra = emitRing(a, mode, vA);
    const rb = emitRing(b, mode, vB);
    const start = idx.length;
    for (let i = 0; i < N; i++) {
      const a0 = ra + i;
      const a1 = ra + i + 1;
      const b0 = rb + i;
      const b1 = rb + i + 1;
      idx.push(a0, b0, b1, a0, b1, a1);
    }
    groups.push({ start, count: idx.length - start, mat });
  }

  function cap(p: Profile, sign: number, mode: UvMode, mat: number): void {
    const centerIdx = pos.length / 3;
    pos.push(0, 0, p.z);
    nor.push(0, 0, sign);
    uvs.push(mode === 'back' ? 0.5 : 0.5, 0.5);
    const base = pos.length / 3;
    for (let i = 0; i <= N; i++) {
      const o = ring[i % N];
      const x = o.x - o.nx * p.inset;
      const y = o.y - o.ny * p.inset;
      pos.push(x, y, p.z);
      nor.push(0, 0, sign);
      const [u, v] = planarUv(x, y, mode === 'back');
      uvs.push(u, v);
    }
    const start = idx.length;
    for (let i = 0; i < N; i++) {
      if (sign > 0) idx.push(centerIdx, base + i, base + i + 1);
      else idx.push(centerIdx, base + i + 1, base + i);
    }
    groups.push({ start, count: idx.length - start, mat });
  }

  const last = profile.length - 1;
  cap(profile[0], 1, 'front', 0);
  for (let i = 0; i < rollSegments; i++) strip(profile[i], profile[i + 1], 'front', 0);
  strip(profile[rollSegments], profile[rollSegments + 1], 'edge', 2, 0, 1);
  for (let i = rollSegments + 1; i < last; i++) strip(profile[i + 1], profile[i], 'back', 1);
  cap(profile[last], -1, 'back', 1);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(idx);

  // Merge adjacent groups that share a material so the mesh stays at three
  // draw calls rather than one per strip.
  groups.sort((a, b) => a.start - b.start);
  const merged: { start: number; count: number; mat: number }[] = [];
  for (const g of groups) {
    const prev = merged[merged.length - 1];
    if (prev && prev.mat === g.mat && prev.start + prev.count === g.start) prev.count += g.count;
    else merged.push({ ...g });
  }
  for (const g of merged) geo.addGroup(g.start, g.count, g.mat);

  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  geo.name = 'packet-card';
  return geo;
}
