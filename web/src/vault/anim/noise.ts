/**
 * Deterministic value noise.
 *
 * Everything that would normally reach for `Math.random()` (camera handheld,
 * shake, packet tremor, per-pull ejection variation) comes from here instead.
 * The only inputs are a coordinate and an integer seed, so a captured frame is
 * byte-identical between runs, and the harness gets the same motion the player
 * gets rather than a special cased still.
 */

/** Integer avalanche hash. Returns a well distributed value in [-1, 1). */
export function hash11(n: number): number {
  let x = Math.imul(n | 0, 0x27d4eb2d) ^ 0x9e3779b9;
  x ^= x >>> 15;
  x = Math.imul(x, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 2147483648 - 1;
}

/** Deterministic 32 bit seed from an integer, for per-pull variation. */
export function seedFrom(...parts: number[]): number {
  let h = 0x811c9dc5;
  for (const p of parts) {
    h ^= Math.imul(p | 0, 0x01000193);
    h = Math.imul(h ^ (h >>> 13), 0x5bd1e995);
  }
  return h >>> 0;
}

/** Smooth 1D value noise in [-1, 1], quintic interpolated so its derivative is continuous. */
export function noise1(x: number, seed = 0): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * f * (f * (f * 6 - 15) + 10);
  const s = Math.imul(seed | 0, 0x9e3779b1);
  const a = hash11(i + s);
  const b = hash11(i + 1 + s);
  return a + (b - a) * u;
}

/** Fractal sum of value noise. 3 octaves is plenty for motion. */
export function fbm1(x: number, seed = 0, octaves = 3): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += noise1(x * freq, seed + i * 1013) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.037; // irrational-ish so octaves never phase align
  }
  return norm > 0 ? sum / norm : 0;
}

/**
 * Three decorrelated noise channels sampled at one coordinate. Used for shake
 * and handheld, where three independent scalars is exactly what you want.
 */
export function noise3(x: number, seed: number, out: { x: number; y: number; z: number }): void {
  out.x = fbm1(x, seed + 17, 2);
  out.y = fbm1(x * 1.13 + 31.7, seed + 191, 2);
  out.z = fbm1(x * 0.87 + 71.3, seed + 733, 2);
}
