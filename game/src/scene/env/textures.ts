import * as THREE from 'three';
import { cellular2, fbm2, valueNoise2 } from './noise';

/**
 * Procedural PBR map authoring for the vault architecture.
 *
 * Every surface gets albedo + tangent space normal + a packed ORM map
 * (R = ambient occlusion, G = roughness, B = metalness), which is the glTF
 * convention and lets one sampler feed three material slots.
 *
 * Colour space is not cosmetic here: albedo is authored in sRGB bytes and must
 * be tagged SRGBColorSpace so the shader linearises it, while the ORM and
 * normal maps carry raw numbers and must be tagged NoColorSpace or they get
 * silently gamma-decoded and the whole surface goes soft and dark.
 */

export interface PbrTextureSet {
  map: THREE.DataTexture;
  normalMap: THREE.DataTexture;
  /** R = AO, G = roughness, B = metalness. */
  ormMap: THREE.DataTexture;
  dispose(): void;
}

function srgbByte(linear: number): number {
  const c = linear <= 0 ? 0 : linear >= 1 ? 1 : linear;
  const s = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.round(s * 255);
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function smoothstep(a: number, b: number, x: number): number {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

function dataTexture(
  data: Uint8Array,
  size: number,
  colorSpace: THREE.ColorSpace,
  anisotropy: number
): THREE.DataTexture {
  const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.UnsignedByteType);
  t.colorSpace = colorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  // DataTexture defaults to nearest with no mips; leaving that in place is the
  // classic reason procedural surfaces shimmer at grazing angles.
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = anisotropy;
  t.needsUpdate = true;
  return t;
}

/** Wrapped fetch into a square scalar field. */
function at(field: Float32Array, size: number, x: number, y: number): number {
  const xi = ((x % size) + size) % size;
  const yi = ((y % size) + size) % size;
  return field[yi * size + xi];
}

/** Separable wrapped box blur, used to derive a cavity term from the height. */
function boxBlur(field: Float32Array, size: number, radius: number): Float32Array {
  const tmp = new Float32Array(size * size);
  const out = new Float32Array(size * size);
  const inv = 1 / (radius * 2 + 1);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let s = 0;
      for (let d = -radius; d <= radius; d++) s += at(field, size, x + d, y);
      tmp[y * size + x] = s * inv;
    }
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let s = 0;
      for (let d = -radius; d <= radius; d++) s += at(tmp, size, x, y + d);
      out[y * size + x] = s * inv;
    }
  }
  return out;
}

function normalMapFromHeight(
  height: Float32Array,
  size: number,
  strength: number,
  anisotropy: number
): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const hl = at(height, size, x - 1, y);
      const hr = at(height, size, x + 1, y);
      const hd = at(height, size, x, y - 1);
      const hu = at(height, size, x, y + 1);
      let nx = (hl - hr) * strength;
      let ny = (hd - hu) * strength;
      let nz = 1;
      const len = Math.hypot(nx, ny, nz);
      nx /= len;
      ny /= len;
      nz /= len;
      const o = (y * size + x) * 4;
      data[o] = Math.round((nx * 0.5 + 0.5) * 255);
      data[o + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      data[o + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      data[o + 3] = 255;
    }
  }
  return dataTexture(data, size, THREE.NoColorSpace, anisotropy);
}

export interface ConcreteOptions {
  size?: number;
  seed?: number;
  /** Linear base albedo. Cold architectural concrete sits low and blue. */
  base?: [number, number, number];
  /** Peak-to-peak albedo variation in linear units. */
  variation?: number;
  roughnessRange?: [number, number];
  normalStrength?: number;
  anisotropy: number;
}

/**
 * Cast concrete: broad formwork undulation, exposed aggregate, air pockets and
 * a slow stain field so no two square metres read the same.
 */
export function createConcreteTextures(opts: ConcreteOptions): PbrTextureSet {
  const size = opts.size ?? 512;
  const seed = opts.seed ?? 1301;
  const base = opts.base ?? [0.052, 0.056, 0.066];
  const variation = opts.variation ?? 0.026;
  const rr = opts.roughnessRange ?? [0.52, 0.94];
  const inv = 1 / size;

  const height = new Float32Array(size * size);
  const aggregate = new Float32Array(size * size);
  const stain = new Float32Array(size * size);
  const pores = new Float32Array(size * size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x + 0.5) * inv;
      const v = (y + 0.5) * inv;
      const i = y * size + x;

      // Formwork scale swell plus the fine tooth of a floated surface.
      const swell = fbm2(u, v, 3, 4, seed) - 0.5;
      const tooth = fbm2(u, v, 24, 5, seed + 31) - 0.5;
      // Aggregate stones just under the skin.
      const agg = 1 - smoothstep(0.0, 0.42, cellular2(u, v, 22, seed + 77));
      // Entrained air voids: small, sharp, sparse.
      const cell = cellular2(u, v, 46, seed + 133);
      const pore = 1 - smoothstep(0.0, 0.16, cell);
      const dust = valueNoise2(u, v, 128, seed + 211) - 0.5;

      aggregate[i] = agg;
      pores[i] = pore;
      stain[i] = fbm2(u, v, 2, 3, seed + 401);
      // Weighted toward the low frequencies. Cranking the fine terms is what
      // turns a concrete map into television static once it is minified.
      height[i] = swell * 0.62 + tooth * 0.19 + agg * 0.10 - pore * 0.34 + dust * 0.022;
    }
  }

  const blurred = boxBlur(height, size, 6);
  const albedo = new Uint8Array(size * size * 4);
  const orm = new Uint8Array(size * size * 4);

  for (let i = 0; i < size * size; i++) {
    const cavity = height[i] - blurred[i];
    const ao = clamp01(0.42 + smoothstep(-0.30, 0.06, cavity) * 0.58);

    // Stains lift and cool the albedo; aggregate lifts it slightly and greys it.
    const s = (stain[i] - 0.5) * 2;
    const lift = s * variation + aggregate[i] * variation * 0.45 - pores[i] * variation * 0.9;
    const r = base[0] + lift + s * 0.004;
    const g = base[1] + lift + s * 0.001;
    const b = base[2] + lift - s * 0.003;

    const o = i * 4;
    albedo[o] = srgbByte(Math.max(0.004, r));
    albedo[o + 1] = srgbByte(Math.max(0.004, g));
    albedo[o + 2] = srgbByte(Math.max(0.004, b));
    albedo[o + 3] = 255;

    // Polished aggregate is smoother than the paste; voids are rougher still.
    let rough = rr[0] + (rr[1] - rr[0]) * (0.55 + (stain[i] - 0.5) * 0.72);
    rough -= aggregate[i] * 0.15;
    rough += pores[i] * 0.09;

    orm[o] = Math.round(ao * 255);
    orm[o + 1] = Math.round(clamp01(rough) * 255);
    orm[o + 2] = 0;
    orm[o + 3] = 255;
  }

  const map = dataTexture(albedo, size, THREE.SRGBColorSpace, opts.anisotropy);
  const ormMap = dataTexture(orm, size, THREE.NoColorSpace, opts.anisotropy);
  const normalMap = normalMapFromHeight(height, size, opts.normalStrength ?? 22, opts.anisotropy);

  return {
    map,
    normalMap,
    ormMap,
    dispose() {
      map.dispose();
      ormMap.dispose();
      normalMap.dispose();
    },
  };
}

export interface MetalOptions {
  size?: number;
  seed?: number;
  /** Linear base reflectance. Dark anodised aluminium lives around 0.16-0.24. */
  base?: [number, number, number];
  roughnessRange?: [number, number];
  /** 'linear' brushes along U, 'radial' brushes concentrically for turned caps. */
  mode?: 'linear' | 'radial';
  normalStrength?: number;
  /** Amount of chipped-to-bright-metal wear along the grain. */
  wear?: number;
  anisotropy: number;
}

/**
 * Anodised metal with a real brushed grain. The grain is written into both the
 * height (so it bends the normal) and the roughness (so the specular lobe
 * stretches), which together with MeshPhysicalMaterial.anisotropy gives the
 * stretched highlight that reads as machined metal rather than plastic.
 */
export function createMetalTextures(opts: MetalOptions): PbrTextureSet {
  const size = opts.size ?? 512;
  const seed = opts.seed ?? 907;
  const base = opts.base ?? [0.185, 0.196, 0.216];
  const rr = opts.roughnessRange ?? [0.16, 0.44];
  const mode = opts.mode ?? 'linear';
  const wearAmount = opts.wear ?? 0.14;
  const inv = 1 / size;

  const height = new Float32Array(size * size);
  const grain = new Float32Array(size * size);
  const blotch = new Float32Array(size * size);
  const wear = new Float32Array(size * size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x + 0.5) * inv;
      const v = (y + 0.5) * inv;
      const i = y * size + x;

      let gu: number;
      let gv: number;
      if (mode === 'radial') {
        // Concentric turning marks: frequency along radius, continuity in angle.
        const dx = u - 0.5;
        const dy = v - 0.5;
        const rad = Math.hypot(dx, dy);
        const ang = (Math.atan2(dy, dx) + Math.PI) / (Math.PI * 2);
        gu = ang;
        gv = rad;
      } else {
        gu = u;
        gv = v;
      }

      // Anisotropic: near-constant along the brush direction, dense across it.
      const fine = fbm2(gu * 0.06, gv * 1.0, 96, 3, seed) - 0.5;
      const mid = fbm2(gu * 0.25, gv * 1.0, 26, 3, seed + 17) - 0.5;
      const broad = fbm2(u, v, 4, 3, seed + 51);
      const w = clamp01((fbm2(u, v, 9, 4, seed + 313) - 0.55) * 4);

      grain[i] = fine * 0.7 + mid * 0.3;
      blotch[i] = broad;
      wear[i] = w;
      height[i] = grain[i] * 0.9 + (broad - 0.5) * 0.22;
    }
  }

  const blurred = boxBlur(height, size, 4);
  const albedo = new Uint8Array(size * size * 4);
  const orm = new Uint8Array(size * size * 4);

  for (let i = 0; i < size * size; i++) {
    const cavity = height[i] - blurred[i];
    const ao = clamp01(0.68 + smoothstep(-0.25, 0.1, cavity) * 0.32);
    const w = wear[i] * wearAmount;

    // Wear rubs the anodising back toward raw aluminium: brighter and warmer.
    const r = base[0] * (1 + (blotch[i] - 0.5) * 0.22) + w * 0.5;
    const g = base[1] * (1 + (blotch[i] - 0.5) * 0.22) + w * 0.5;
    const b = base[2] * (1 + (blotch[i] - 0.5) * 0.22) + w * 0.46;

    const o = i * 4;
    albedo[o] = srgbByte(r);
    albedo[o + 1] = srgbByte(g);
    albedo[o + 2] = srgbByte(b);
    albedo[o + 3] = 255;

    const rough = clamp01(
      rr[0] + (rr[1] - rr[0]) * clamp01(0.5 + grain[i] * 1.4 + (blotch[i] - 0.5) * 0.7) - w * 0.55
    );

    orm[o] = Math.round(ao * 255);
    orm[o + 1] = Math.round(rough * 255);
    orm[o + 2] = Math.round(clamp01(1 - wear[i] * 0.12) * 255);
    orm[o + 3] = 255;
  }

  const map = dataTexture(albedo, size, THREE.SRGBColorSpace, opts.anisotropy);
  const ormMap = dataTexture(orm, size, THREE.NoColorSpace, opts.anisotropy);
  const normalMap = normalMapFromHeight(height, size, opts.normalStrength ?? 9, opts.anisotropy);

  return {
    map,
    normalMap,
    ormMap,
    dispose() {
      map.dispose();
      ormMap.dispose();
      normalMap.dispose();
    },
  };
}

/**
 * A soft ramp used to fade emissive strips at their ends so they do not stop
 * dead against the concrete. Authored in sRGB because it multiplies an albedo.
 */
export function createStripRamp(anisotropy: number): THREE.DataTexture {
  const w = 8;
  const h = 128;
  const data = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    const v = (y + 0.5) / h;
    const fade = smoothstep(0, 0.14, v) * smoothstep(0, 0.14, 1 - v);
    const flutter = 0.94 + 0.06 * valueNoise2(0.5, v, 12, 4021);
    const value = srgbByte(fade * flutter);
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4;
      data[o] = value;
      data[o + 1] = value;
      data[o + 2] = value;
      data[o + 3] = 255;
    }
  }
  const t = new THREE.DataTexture(data, w, h, THREE.RGBAFormat, THREE.UnsignedByteType);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = anisotropy;
  t.needsUpdate = true;
  return t;
}

/** Single channel blue noise tile for raymarch dithering. */
export function createBlueNoiseTexture(data: Uint8Array, size: number): THREE.DataTexture {
  const t = new THREE.DataTexture(data, size, size, THREE.RedFormat, THREE.UnsignedByteType);
  t.colorSpace = THREE.NoColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.minFilter = THREE.NearestFilter;
  t.magFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.needsUpdate = true;
  return t;
}
