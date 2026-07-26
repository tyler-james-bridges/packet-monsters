/**
 * Deterministic procedural noise. Everything the vault paints onto its surfaces
 * is generated from these primitives, so the build ships with zero external
 * assets and every run produces byte identical maps.
 *
 * All 2D generators are tileable: the lattice indices wrap on `period`, which
 * is what lets a 512px map repeat across a 6.5 m wall with no seam.
 */

/** 32-bit integer hash to [0,1). Math.imul keeps it exact across engines. */
export function hash2i(ix: number, iy: number, seed: number): number {
  let h = Math.imul(ix | 0, 0x27d4eb2d) ^ Math.imul(iy | 0, 0x9e3779b1) ^ Math.imul(seed | 0, 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
  h = Math.imul(h ^ (h >>> 12), 0x297a2d39);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

function quintic(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function wrap(i: number, n: number): number {
  return ((i % n) + n) % n;
}

/**
 * Tileable 2D value noise. `x`,`y` are in the unit tile; `period` is the number
 * of lattice cells across it and must be an integer for the wrap to be seamless.
 */
export function valueNoise2(x: number, y: number, period: number, seed: number): number {
  const fx = x * period;
  const fy = y * period;
  const ix = Math.floor(fx);
  const iy = Math.floor(fy);
  const ux = quintic(fx - ix);
  const uy = quintic(fy - iy);
  const x0 = wrap(ix, period);
  const y0 = wrap(iy, period);
  const x1 = wrap(ix + 1, period);
  const y1 = wrap(iy + 1, period);
  const v00 = hash2i(x0, y0, seed);
  const v10 = hash2i(x1, y0, seed);
  const v01 = hash2i(x0, y1, seed);
  const v11 = hash2i(x1, y1, seed);
  const a = v00 + (v10 - v00) * ux;
  const b = v01 + (v11 - v01) * ux;
  return a + (b - a) * uy;
}

/** Tileable fractal Brownian motion in [0,1]. */
export function fbm2(
  x: number,
  y: number,
  period: number,
  octaves: number,
  seed: number,
  gain = 0.5
): number {
  let sum = 0;
  let amp = 1;
  let norm = 0;
  let p = period;
  for (let o = 0; o < octaves; o++) {
    sum += amp * valueNoise2(x, y, p, seed + o * 7919);
    norm += amp;
    amp *= gain;
    p *= 2;
  }
  return sum / norm;
}

/**
 * Tileable cellular (Worley) noise. Returns the distance to the nearest feature
 * point normalised by the cell size, which is what gives concrete its aggregate
 * and its air pockets.
 */
export function cellular2(x: number, y: number, period: number, seed: number): number {
  const fx = x * period;
  const fy = y * period;
  const cx = Math.floor(fx);
  const cy = Math.floor(fy);
  let best = 8;
  for (let oy = -1; oy <= 1; oy++) {
    for (let ox = -1; ox <= 1; ox++) {
      const gx = cx + ox;
      const gy = cy + oy;
      const wx = wrap(gx, period);
      const wy = wrap(gy, period);
      const px = gx + hash2i(wx, wy, seed);
      const py = gy + hash2i(wx, wy, seed + 4111);
      const dx = px - fx;
      const dy = py - fy;
      const d = dx * dx + dy * dy;
      if (d < best) best = d;
    }
  }
  return Math.min(1, Math.sqrt(best));
}

/**
 * Void-and-cluster blue noise. Raymarch dithering with white noise leaves a
 * visible grain that resolves into banding once the frame is blurred by bloom;
 * a proper blue noise tile keeps the error in the high frequencies where the
 * eye and the tone curve both ignore it.
 *
 * Returns a `size*size` byte array of ranks scaled to 0..255.
 */
export function generateBlueNoise(size: number, rng: () => number): Uint8Array {
  const n = size * size;
  const pattern = new Uint8Array(n);
  const energy = new Float32Array(n);
  const rank = new Int32Array(n).fill(-1);

  const R = 5;
  const sigma = 1.9;
  const kw = R * 2 + 1;
  const kernel = new Float32Array(kw * kw);
  for (let dy = -R, k = 0; dy <= R; dy++) {
    for (let dx = -R; dx <= R; dx++, k++) {
      kernel[k] = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
    }
  }

  function splat(idx: number, sign: number): void {
    const px = idx % size;
    const py = (idx / size) | 0;
    let k = 0;
    for (let dy = -R; dy <= R; dy++) {
      const row = (((py + dy) % size) + size) % size;
      const base = row * size;
      for (let dx = -R; dx <= R; dx++, k++) {
        const col = (((px + dx) % size) + size) % size;
        energy[base + col] += sign * kernel[k];
      }
    }
  }

  function tightestCluster(): number {
    let bi = -1;
    let bv = -Infinity;
    for (let i = 0; i < n; i++) {
      if (pattern[i] === 1 && energy[i] > bv) {
        bv = energy[i];
        bi = i;
      }
    }
    return bi;
  }

  function largestVoid(): number {
    let bi = -1;
    let bv = Infinity;
    for (let i = 0; i < n; i++) {
      if (pattern[i] === 0 && energy[i] < bv) {
        bv = energy[i];
        bi = i;
      }
    }
    return bi;
  }

  // Seed roughly a tenth of the tile, then relax it into a stable prototype.
  const initial = Math.max(1, Math.round(n * 0.1));
  let placed = 0;
  while (placed < initial) {
    const i = Math.min(n - 1, Math.floor(rng() * n));
    if (pattern[i] === 0) {
      pattern[i] = 1;
      splat(i, 1);
      placed++;
    }
  }
  for (let iter = 0; iter < n; iter++) {
    const c = tightestCluster();
    pattern[c] = 0;
    splat(c, -1);
    const v = largestVoid();
    if (v === c) {
      pattern[c] = 1;
      splat(c, 1);
      break;
    }
    pattern[v] = 1;
    splat(v, 1);
  }

  // Phase 1: strip the prototype, ranking from initial-1 down to 0.
  const proto = pattern.slice();
  for (let r = placed - 1; r >= 0; r--) {
    const c = tightestCluster();
    pattern[c] = 0;
    splat(c, -1);
    rank[c] = r;
  }

  // Phase 2 and 3: refill from the prototype, ranking upward through the rest.
  pattern.set(proto);
  energy.fill(0);
  for (let i = 0; i < n; i++) if (pattern[i] === 1) splat(i, 1);
  for (let r = placed; r < n; r++) {
    const v = largestVoid();
    pattern[v] = 1;
    splat(v, 1);
    rank[v] = r;
  }

  const out = new Uint8Array(n);
  for (let i = 0; i < n; i++) out[i] = Math.min(255, Math.round((rank[i] / (n - 1)) * 255));
  return out;
}
