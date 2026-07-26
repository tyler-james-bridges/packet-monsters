import { clamp01, fbm, ridged, rngFrom, smoothstep, valueNoise } from './noise';

/**
 * Shared surface detail. None of this is per card: every card in the vault is
 * cut from the same sheet, so the stock fibre, the varnish mottle, the handling
 * marks and the holographic grating are generated once and shared.
 *
 * All of it is emitted as straight RGBA byte arrays and uploaded as
 * DataTextures, which keeps the upload path free of canvas premultiplication
 * and lets alpha carry a real channel instead of a coverage value.
 */

export interface RawImage {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

function raw(w: number, h: number): RawImage {
  return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h };
}

/**
 * Cardstock fibre, as a tangent-space normal map. Paper fibre is strongly
 * anisotropic: the pulp aligns with the machine direction, so the height field
 * is stretched along u. Tiled several times across the card.
 */
export function fibreNormal(size = 512, strength = 1.6): RawImage {
  const img = raw(size, size);
  const height = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      // Machine direction fibre: long in u, short in v.
      const f =
        fbm(u * 26, v * 150, 3301, 3) * 0.55 +
        fbm(u * 90, v * 90, 7717, 4) * 0.3 +
        valueNoise(u * size * 0.9, v * size * 0.9, 9091) * 0.15;
      height[y * size + x] = f;
    }
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const l = height[y * size + ((x - 1 + size) % size)];
      const r = height[y * size + ((x + 1) % size)];
      const d = height[((y - 1 + size) % size) * size + x];
      const t = height[((y + 1) % size) * size + x];
      let nx = (l - r) * strength;
      let ny = (d - t) * strength;
      const nz = 1;
      const inv = 1 / Math.hypot(nx, ny, nz);
      nx *= inv;
      ny *= inv;
      const i = (y * size + x) * 4;
      img.data[i] = (nx * 0.5 + 0.5) * 255;
      img.data[i + 1] = (ny * 0.5 + 0.5) * 255;
      img.data[i + 2] = nz * inv * 255;
      img.data[i + 3] = 255;
    }
  }
  return img;
}

/**
 * Handling map, mapped 1:1 over the card rather than tiled so the marks sit
 * where a thumb would put them.
 *
 *   R  ambient occlusion (creases and the frame recess)
 *   G  roughness multiplier: varnish mottle, fingerprints, wipe streaks
 *   B  metalness multiplier
 *   A  clearcoat roughness multiplier
 */
export function handlingMap(size = 768): RawImage {
  const h = Math.round((size * 88) / 63);
  const img = raw(size, h);
  const rng = rngFrom(0x0fac1e);

  // A few oily contacts where a card is actually held: the two long edges near
  // the middle, and the lower right corner where a thumb lands on pickup.
  const prints: { x: number; y: number; r: number; rot: number; s: number }[] = [
    { x: 0.06, y: 0.52, r: 0.16, rot: 0.3, s: 0.9 },
    { x: 0.95, y: 0.47, r: 0.15, rot: -0.4, s: 0.8 },
    { x: 0.78, y: 0.9, r: 0.19, rot: 0.9, s: 1.0 },
    { x: 0.28, y: 0.14, r: 0.13, rot: -1.1, s: 0.55 },
  ];

  for (let y = 0; y < h; y++) {
    const v = y / h;
    for (let x = 0; x < size; x++) {
      const u = x / size;

      // Varnish mottle: the coating never lies perfectly flat.
      const mottle = fbm(u * 7, v * 9, 1201, 4);
      let rough = 0.82 + (mottle - 0.5) * 0.34;

      // Wipe streaks from the coating roller, faint and directional.
      const streak = ridged(u * 3.2, v * 44, 2609, 3);
      rough += (streak - 0.5) * 0.12;

      // Fingerprints: warped concentric ridges, matte against the gloss.
      let printMask = 0;
      for (const p of prints) {
        const dx = (u - p.x) * Math.cos(p.rot) - (v - p.y) * Math.sin(p.rot);
        const dy = ((u - p.x) * Math.sin(p.rot) + (v - p.y) * Math.cos(p.rot)) * 0.72;
        const d = Math.hypot(dx, dy * 1.25);
        if (d > p.r) continue;
        const falloff = smoothstep(p.r, p.r * 0.25, d);
        const warp = fbm(u * 9, v * 9, 4409, 3) * 2.4;
        const ridgeV = Math.sin(d * 260 + warp * 6);
        printMask = Math.max(printMask, falloff * p.s * clamp01(ridgeV * 0.5 + 0.5));
      }
      rough += printMask * 0.3;

      // Frame recess occlusion: the art window sits slightly proud.
      const inset = Math.min(u, 1 - u, v * 0.72, (1 - v) * 0.72);
      const ao = 0.78 + 0.22 * smoothstep(0.0, 0.045, inset);

      // Speckle, at the scale of a coating defect.
      const speck = rng() < 0.0006 ? 0.35 : 0;
      rough += speck;

      const i = (y * size + x) * 4;
      img.data[i] = ao * 255;
      img.data[i + 1] = clamp01(rough) * 255;
      img.data[i + 2] = 255;
      img.data[i + 3] = clamp01(0.72 + printMask * 0.55 + (mottle - 0.5) * 0.3) * 255;
    }
  }
  return img;
}

/**
 * The holographic layer's physical structure, tiled across the card.
 *
 *   R  diffraction grating phase: fine parallel rulings with drift
 *   G  film thickness field: what the interference actually integrates over
 *   B  scratch and cell-boundary mask
 *   A  micro-facet sparkle
 */
export function foilDetail(size = 512): RawImage {
  const img = raw(size, size);
  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;

      // Ruled grating. Real embossed holograms are a physical relief with a
      // pitch of order a micron; the drift keeps it from reading as a screen
      // door when magnified across the card.
      const drift = fbm(u * 4, v * 4, 5501, 3) - 0.5;
      const grating = Math.sin((u * 148 + drift * 5.5 + v * 9) * Math.PI * 2) * 0.5 + 0.5;

      // Thickness field: broad cells with sharp boundaries, the way a stamped
      // foil actually varies.
      const cellA = fbm(u * 5.5, v * 5.5, 7013, 4);
      const cellB = ridged(u * 3.1, v * 3.1, 8117, 3);
      const thickness = clamp01(cellA * 0.65 + cellB * 0.45);

      // Scratches: shallow, long, mostly along one axis.
      const sc = ridged(u * 2.0 + v * 0.3, v * 130, 9203, 2);
      const scratch = clamp01((sc - 0.66) * 4.2);

      // Sparkle: individual facet flashes.
      const sp = valueNoise(u * size * 1.4, v * size * 1.4, 6151);
      const sparkle = clamp01((sp - 0.78) * 5.5);

      const i = (y * size + x) * 4;
      img.data[i] = grating * 255;
      img.data[i + 1] = thickness * 255;
      img.data[i + 2] = scratch * 255;
      img.data[i + 3] = sparkle * 255;
    }
  }
  return img;
}

/**
 * The cut edge. A card is a laminate: printed face, clay coat, a grey or black
 * core, clay coat, printed back. That stack is exactly what you see on the
 * trimmed edge, and it is the single most convincing detail on a card mesh.
 *
 * v runs 0 (front face) to 1 (back face).
 */
export function edgeCore(width = 64, height = 256, coreDark = false): RawImage {
  const img = raw(width, height);
  for (let y = 0; y < height; y++) {
    const v = y / (height - 1);
    for (let x = 0; x < width; x++) {
      const u = x / width;
      // Fibre showing at the trim, and the slight burr a die cut leaves.
      const fibre = fbm(u * 40, v * 6, 3607, 3);
      const burr = fbm(u * 130, v * 2, 4801, 2);

      let r: number;
      let g: number;
      let b: number;
      if (v < 0.09) {
        // Face ink layer.
        const t = v / 0.09;
        r = 0.1 + t * 0.35;
        g = 0.11 + t * 0.36;
        b = 0.14 + t * 0.36;
      } else if (v > 0.91) {
        // Back ink layer.
        const t = (1 - v) / 0.09;
        r = 0.08 + t * 0.32;
        g = 0.1 + t * 0.34;
        b = 0.16 + t * 0.36;
      } else {
        // Core.
        const t = (v - 0.09) / 0.82;
        const shade = 0.86 - Math.abs(t - 0.5) * 0.18;
        if (coreDark) {
          r = 0.08 * shade + 0.02;
          g = 0.075 * shade + 0.02;
          b = 0.09 * shade + 0.03;
        } else {
          r = 0.9 * shade;
          g = 0.88 * shade;
          b = 0.82 * shade;
        }
      }
      const n = (fibre - 0.5) * 0.14 + (burr - 0.5) * 0.08;
      const i = (y * width + x) * 4;
      img.data[i] = clamp01(r + n) * 255;
      img.data[i + 1] = clamp01(g + n) * 255;
      img.data[i + 2] = clamp01(b + n) * 255;
      // Alpha is the foil plate: only the two ink layers and, on a gilt edge,
      // the whole stack catch light.
      img.data[i + 3] = clamp01(v < 0.09 || v > 0.91 ? 0.85 : coreDark ? 0.25 : 0.05) * 255;
    }
  }
  return img;
}
