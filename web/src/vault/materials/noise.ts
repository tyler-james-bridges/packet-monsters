import { splitmix32 } from '../core/rng';

/**
 * CPU-side procedural noise used by the texture composers. Seeded, no
 * Math.random, identical output for identical inputs on every machine.
 */

export type Rng = () => number;

export function rngFrom(seed: number): Rng {
  return splitmix32(seed >>> 0);
}

/** Uniform in [lo, hi). */
export function range(rng: Rng, lo: number, hi: number): number {
  return lo + rng() * (hi - lo);
}

/** Integer in [lo, hi]. */
export function irange(rng: Rng, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

export function pick<T>(rng: Rng, list: readonly T[]): T {
  return list[Math.min(list.length - 1, Math.floor(rng() * list.length))];
}

/** Approximately normal, via the sum of three uniforms. Cheap and adequate. */
export function gaussian(rng: Rng): number {
  return (rng() + rng() + rng() - 1.5) * 1.4142;
}

function hash2(x: number, y: number, seed: number): number {
  let h = seed ^ Math.imul(x | 0, 0x27d4eb2d) ^ Math.imul(y | 0, 0x165667b1);
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
  h = Math.imul(h ^ (h >>> 12), 0x297a2d39);
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
}

function smooth(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/** Value noise on the unit lattice, output in 0..1. */
export function valueNoise(x: number, y: number, seed: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const a = hash2(xi, yi, seed);
  const b = hash2(xi + 1, yi, seed);
  const c = hash2(xi, yi + 1, seed);
  const d = hash2(xi + 1, yi + 1, seed);
  return (a + (b - a) * xf) * (1 - yf) + (c + (d - c) * xf) * yf;
}

/** Fractal Brownian motion, output roughly 0..1. */
export function fbm(x: number, y: number, seed: number, octaves = 5, lacunarity = 2.03, gain = 0.5): number {
  let amp = 1;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise(x * freq, y * freq, seed + i * 1013);
    norm += amp;
    amp *= gain;
    freq *= lacunarity;
  }
  return sum / norm;
}

/** Ridged multifractal: sharp creases, good for crystal and lightning fields. */
export function ridged(x: number, y: number, seed: number, octaves = 4): number {
  let amp = 1;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    const n = 1 - Math.abs(valueNoise(x * freq, y * freq, seed + i * 7919) * 2 - 1);
    sum += amp * n * n;
    norm += amp;
    amp *= 0.55;
    freq *= 2.11;
  }
  return sum / norm;
}

/** Domain-warped fbm. Produces the curdled, fluid look a flat fbm never gets. */
export function warpedFbm(x: number, y: number, seed: number, warp = 1.6): number {
  const qx = fbm(x, y, seed + 11, 4);
  const qy = fbm(x + 5.2, y + 1.3, seed + 29, 4);
  return fbm(x + warp * qx, y + warp * qy, seed + 53, 5);
}

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function smoothstep(a: number, b: number, t: number): number {
  const x = clamp01((t - a) / (b - a || 1e-6));
  return x * x * (3 - 2 * x);
}

export function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
