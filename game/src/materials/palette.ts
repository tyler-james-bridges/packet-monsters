import type { CardRecord } from '../core/types';
import { RARITY_NAMES, TYPE_NAMES } from '../core/types';

/**
 * Art direction tables for the physical card.
 *
 * Everything the surface looks like is derived from these two tables plus the
 * card record itself. Nothing here is random: the same card always produces the
 * same colours, the same foil mask and the same artwork.
 */

/** sRGB hex triplet, authored the way a print designer would pick it. */
export type Hex = string;

export interface TypeStyle {
  /** Display name printed on the type chip. */
  readonly label: string;
  /** Dominant ink of the type. Frames, chips, art key light. */
  readonly primary: Hex;
  /** Secondary ink, used for gradients and the art rim light. */
  readonly secondary: Hex;
  /** Deep shadow value for the art backdrop. */
  readonly deep: Hex;
  /** High-chroma accent used sparingly: eyes, sparks, the foil stamp. */
  readonly accent: Hex;
  /** Ink used for text sitting on the type colour. */
  readonly onPrimary: Hex;
  /**
   * Thin-film thickness bias in nanometres. Shifts where the interference
   * fringes sit in the spectrum so a FROST foil reads cold and a SURGE foil
   * reads warm without being a tinted rainbow.
   */
  readonly filmBias: number;
  /** Anisotropic streak direction in the card plane, radians. */
  readonly streakAngle: number;
  /** Which procedural overlay the artwork uses. */
  readonly motif:
    | 'bolt'
    | 'mist'
    | 'filament'
    | 'crystal'
    | 'orbit'
    | 'grid'
    | 'decay';
}

export interface RarityStyle {
  readonly label: string;
  /** Frame metal. */
  readonly frame: Hex;
  readonly frameLo: Hex;
  readonly frameHi: Hex;
  /** Card stock base value seen in the panels. */
  readonly stock: Hex;
  readonly stockLo: Hex;
  /** Ink used for body text. */
  readonly ink: Hex;
  /** Colour printed onto the cut edge core. */
  readonly edge: Hex;
  /** Number of rarity pips printed bottom-left. */
  readonly pips: number;
  /** Foil strength driver, 0..1. */
  readonly foil: number;
  /** How far the foil spreads: 0 = seal only, 4 = full bleed. */
  readonly foilSpread: 0 | 1 | 2 | 3 | 4;
  /** Laminate gloss. */
  readonly clearcoat: number;
  readonly clearcoatRoughness: number;
  /** Base sheet roughness before the shared variation map. */
  readonly roughness: number;
  /** Built-in iridescence weight for the laminate itself. */
  readonly iridescence: number;
  /** Anisotropic streak weight. */
  readonly anisotropy: number;
  /** Embossing depth on the foil regions, in normal-map strength. */
  readonly emboss: number;
}

export const TYPE_STYLES: Record<string, TypeStyle> = {
  SURGE: {
    label: 'SURGE',
    primary: '#ffb42e',
    secondary: '#ff6a18',
    deep: '#2a1403',
    accent: '#fff3c4',
    onPrimary: '#231202',
    filmBias: 40,
    streakAngle: 0.18,
    motif: 'bolt',
  },
  PHANTOM: {
    label: 'PHANTOM',
    primary: '#a976ff',
    secondary: '#e05ad0',
    deep: '#170c2c',
    accent: '#ffd9ff',
    onPrimary: '#150a26',
    filmBias: -30,
    streakAngle: -0.34,
    motif: 'mist',
  },
  PLASMA: {
    label: 'PLASMA',
    primary: '#ff4f7a',
    secondary: '#36e0ff',
    deep: '#22071a',
    accent: '#ffe4ec',
    onPrimary: '#2a0512',
    filmBias: 70,
    streakAngle: 0.62,
    motif: 'filament',
  },
  FROST: {
    label: 'FROST',
    primary: '#8ad6ff',
    secondary: '#cfeaff',
    deep: '#061a2c',
    accent: '#ffffff',
    onPrimary: '#052033',
    filmBias: -90,
    streakAngle: 1.24,
    motif: 'crystal',
  },
  EXOTIC: {
    label: 'EXOTIC',
    primary: '#3fe0a8',
    secondary: '#c8ff5e',
    deep: '#03211c',
    accent: '#eaffe2',
    onPrimary: '#032018',
    filmBias: 10,
    streakAngle: -0.9,
    motif: 'orbit',
  },
  SANDBOX: {
    label: 'SANDBOX',
    primary: '#c9b48a',
    secondary: '#8e9a7c',
    deep: '#1c1a12',
    accent: '#fff2d0',
    onPrimary: '#1a170e',
    filmBias: 0,
    streakAngle: 0.0,
    motif: 'grid',
  },
  GHOST: {
    label: 'GHOST',
    primary: '#7f9a92',
    secondary: '#4a6b63',
    deep: '#080d0c',
    accent: '#b9ffe8',
    onPrimary: '#060a09',
    filmBias: -140,
    streakAngle: 0.45,
    motif: 'decay',
  },
};

export const RARITY_STYLES: RarityStyle[] = [
  // 0 COMMON: uncoated stock, matte varnish, flat single-hit ink.
  {
    label: 'COMMON',
    frame: '#5a6274',
    frameLo: '#333a49',
    frameHi: '#8b94a8',
    stock: '#1a1f2b',
    stockLo: '#0e121a',
    ink: '#d7dde9',
    edge: '#cdcec6',
    pips: 1,
    foil: 0.0,
    foilSpread: 0,
    clearcoat: 0.3,
    clearcoatRoughness: 0.34,
    roughness: 0.62,
    // Not zero. A matte varnish really does carry a whisper of film, and
    // keeping both terms non-zero on every rarity means three compiles the card
    // shader exactly once for the whole vault instead of once per feature set.
    iridescence: 0.035,
    anisotropy: 0.04,
    emboss: 0.0,
  },
  // 1 UNCOMMON: satin varnish, bronze foil on the marks only.
  {
    label: 'UNCOMMON',
    frame: '#b08048',
    frameLo: '#5d4021',
    frameHi: '#e9c184',
    stock: '#1b1c22',
    stockLo: '#0d0e13',
    ink: '#e6e2d8',
    edge: '#e2ddcd',
    pips: 2,
    foil: 0.4,
    foilSpread: 1,
    clearcoat: 0.62,
    clearcoatRoughness: 0.19,
    roughness: 0.5,
    iridescence: 0.12,
    anisotropy: 0.18,
    emboss: 0.25,
  },
  // 2 RARE: full gloss laminate, holo panel behind the art window.
  {
    label: 'RARE',
    frame: '#b9c4d4',
    frameLo: '#5a6472',
    frameHi: '#f2f6ff',
    stock: '#141822',
    stockLo: '#080a10',
    ink: '#eef3fb',
    edge: '#f0f2f5',
    pips: 3,
    foil: 0.72,
    foilSpread: 2,
    clearcoat: 0.9,
    clearcoatRoughness: 0.085,
    roughness: 0.36,
    iridescence: 0.3,
    anisotropy: 0.42,
    emboss: 0.45,
  },
  // 3 EPIC: cold-foil frame plus holo panel, deep black core.
  {
    label: 'EPIC',
    frame: '#c69bff',
    frameLo: '#4b2a86',
    frameHi: '#f4e6ff',
    stock: '#0f0b1a',
    stockLo: '#06040c',
    ink: '#f4eeff',
    edge: '#14101f',
    pips: 4,
    foil: 0.88,
    foilSpread: 3,
    clearcoat: 1.0,
    clearcoatRoughness: 0.055,
    roughness: 0.28,
    iridescence: 0.5,
    anisotropy: 0.62,
    emboss: 0.7,
  },
  // 4 LEGENDARY: full-bleed textured holo, gilt frame, foiled edge.
  {
    label: 'LEGENDARY',
    frame: '#ffd678',
    frameLo: '#8a5c14',
    frameHi: '#fff6d2',
    stock: '#0b0906',
    stockLo: '#040302',
    ink: '#fff8e6',
    edge: '#c8a256',
    pips: 5,
    foil: 1.0,
    foilSpread: 4,
    clearcoat: 1.0,
    clearcoatRoughness: 0.035,
    roughness: 0.2,
    iridescence: 0.72,
    anisotropy: 0.8,
    emboss: 1.0,
  },
];

export function rarityStyle(card: CardRecord): RarityStyle {
  return RARITY_STYLES[clampRarity(card.rarity)];
}

export function typeStyle(card: CardRecord): TypeStyle {
  const name = TYPE_NAMES[card.typeId] ?? 'EXOTIC';
  return TYPE_STYLES[name];
}

export function clampRarity(r: number): number {
  return Math.max(0, Math.min(RARITY_STYLES.length - 1, r | 0));
}

export function rarityLabel(r: number): string {
  return RARITY_NAMES[clampRarity(r)];
}

/** A ghost is a dead endpoint. It is not just the GHOST type: any dead card decays. */
export function isGhost(card: CardRecord): boolean {
  return !card.alive || (TYPE_NAMES[card.typeId] ?? '') === 'GHOST';
}

/** Parse '#rrggbb' into 0..1 linear-ish sRGB components (no transfer applied). */
export function hexToRgb(hex: Hex): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function rgba(hex: Hex, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${alpha.toFixed(4)})`;
}

/** Mix two hex colours in sRGB space. Print work is authored in sRGB, not linear. */
export function mixHex(a: Hex, b: Hex, t: number): Hex {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const to = (x: number) =>
    Math.max(0, Math.min(255, Math.round(x * 255)))
      .toString(16)
      .padStart(2, '0');
  return `#${to(ar + (br - ar) * t)}${to(ag + (bg - ag) * t)}${to(ab + (bb - ab) * t)}`;
}
