import * as THREE from 'three';

/**
 * Procedural 3D grade LUT.
 *
 * No asset is loaded. The cube is evaluated in code so the look is readable,
 * tweakable and reproducible, and so the build works with zero network access.
 *
 * Domain and range are both display referred sRGB, which is where a real show
 * LUT lives: the tone map has already mapped scene linear HDR to the display,
 * and the LUT is the creative print emulation on top of it. Internally each
 * entry is decoded to linear, graded with an ASC CDL plus a log space contrast
 * pivot, split toned and re-encoded, so the maths stays physical even though
 * the table is indexed in display space.
 */

export interface GradeLook {
  /** ASC CDL slope, per channel. */
  slope: [number, number, number];
  /** ASC CDL offset, per channel, in linear. */
  offset: [number, number, number];
  /** ASC CDL power, per channel. */
  power: [number, number, number];
  /** Contrast around the 0.18 scene linear pivot. */
  contrast: number;
  /** Overall saturation. */
  saturation: number;
  /** Extra desaturation applied as luminance rises, 0..1. */
  highlightDesat: number;
  /** Multiplicative tint applied to shadows. */
  shadowTint: [number, number, number];
  /** Multiplicative tint applied to highlights. */
  highlightTint: [number, number, number];
  /** Print black lift in display units. Film never reaches absolute zero. */
  blackLift: number;
  /** Channel crosstalk, softens pure primaries the way a print stock does. */
  crosstalk: number;
}

/**
 * The vault look: cold steel shadows with a warm gold bias in the highlights,
 * mild contrast, and highlight desaturation so the reveal flash goes to white
 * rather than to a screaming primary.
 */
export const VAULT_LOOK: GradeLook = {
  slope: [1.015, 1.0, 0.985],
  offset: [-0.006, -0.004, 0.006],
  power: [1.0, 1.005, 1.035],
  contrast: 1.12,
  saturation: 1.08,
  highlightDesat: 0.28,
  shadowTint: [0.87, 0.95, 1.14],
  highlightTint: [1.07, 1.005, 0.9],
  blackLift: 0.006,
  crosstalk: 0.045,
};

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
  if (c <= 0) return 0;
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

const LUMA = [0.2126, 0.7152, 0.0722] as const;
const LOG_PIVOT = Math.log2(0.18);

/**
 * Builds the cube. Size 33 is the ACES/Resolve convention: large enough that
 * trilinear interpolation between entries is invisible, small enough that the
 * upload is 143 KB.
 */
export function buildGradeLut(look: GradeLook = VAULT_LOOK, size = 33): THREE.Data3DTexture {
  const n = size;
  const data = new Uint8Array(n * n * n * 4);
  const inv = 1 / (n - 1);
  const rgb = [0, 0, 0];

  let p = 0;
  for (let bi = 0; bi < n; bi++) {
    for (let gi = 0; gi < n; gi++) {
      for (let ri = 0; ri < n; ri++) {
        rgb[0] = srgbToLinear(ri * inv);
        rgb[1] = srgbToLinear(gi * inv);
        rgb[2] = srgbToLinear(bi * inv);

        // ASC CDL: slope, offset, power.
        for (let c = 0; c < 3; c++) {
          const v = Math.max(0, rgb[c] * look.slope[c] + look.offset[c]);
          rgb[c] = Math.pow(v, look.power[c]);
        }

        // Contrast about the scene linear mid grey pivot, in log2 so the pivot
        // holds and the shoulder and toe move symmetrically in stops.
        for (let c = 0; c < 3; c++) {
          const l = Math.log2(Math.max(rgb[c], 1e-5));
          rgb[c] = Math.pow(2, LOG_PIVOT + (l - LOG_PIVOT) * look.contrast);
        }

        let lum = rgb[0] * LUMA[0] + rgb[1] * LUMA[1] + rgb[2] * LUMA[2];

        // Split tone: the mix ramp runs on perceptual luminance so the crossover
        // sits in the midtones rather than up in the highlights.
        const t = Math.min(1, Math.max(0, Math.pow(Math.min(1, lum), 1 / 2.2)));
        const ease = t * t * (3 - 2 * t);
        for (let c = 0; c < 3; c++) {
          rgb[c] *= look.shadowTint[c] * (1 - ease) + look.highlightTint[c] * ease;
        }

        // Saturation, with extra pull toward neutral as luminance rises.
        lum = rgb[0] * LUMA[0] + rgb[1] * LUMA[1] + rgb[2] * LUMA[2];
        const desat = look.highlightDesat * ease;
        const sat = look.saturation * (1 - desat) + desat * 0.55;
        for (let c = 0; c < 3; c++) rgb[c] = lum + (rgb[c] - lum) * sat;

        // Crosstalk: bleed a little of each channel into the others. This is
        // what stops a saturated primary from reading as a pure LED.
        if (look.crosstalk > 0) {
          const k = look.crosstalk;
          const r = rgb[0];
          const g = rgb[1];
          const b = rgb[2];
          rgb[0] = r * (1 - k) + (g + b) * k * 0.5;
          rgb[1] = g * (1 - k) + (r + b) * k * 0.5;
          rgb[2] = b * (1 - k) + (r + g) * k * 0.5;
        }

        for (let c = 0; c < 3; c++) {
          const out = linearToSrgb(Math.max(0, rgb[c])) * (1 - look.blackLift) + look.blackLift;
          data[p + c] = Math.round(Math.min(1, Math.max(0, out)) * 255);
        }
        data[p + 3] = 255;
        p += 4;
      }
    }
  }

  const tex = new THREE.Data3DTexture(data, n, n, n);
  tex.format = THREE.RGBAFormat;
  tex.type = THREE.UnsignedByteType;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.wrapR = THREE.ClampToEdgeWrapping;
  tex.colorSpace = THREE.NoColorSpace;
  tex.unpackAlignment = 1;
  tex.needsUpdate = true;
  return tex;
}

/** Scale and offset that map a 0..1 colour onto texel centres of an N cube. */
export function lutScaleOffset(size: number): { scale: number; offset: number } {
  return { scale: (size - 1) / size, offset: 1 / (2 * size) };
}
