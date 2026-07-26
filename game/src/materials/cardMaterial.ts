import * as THREE from 'three';
import type { AppContext, CardRecord, FrameTime, QualityTier } from '../core/types';
import { typeNameOf } from '../data/cards';
import { readPixels, type Surface } from './canvas2d';
import { composeBack } from './backTexture';
import { cardSeed, composeFace } from './faceTexture';
import { makeFoilUniforms, patchFoil, spectralSamplesFor, type FoilUniforms } from './foilShader';
import { edgeCore, fibreNormal, foilDetail, handlingMap, type RawImage } from './surfaceTextures';
import {
  clampRarity,
  hexToRgb,
  isGhost,
  RARITY_STYLES,
  TYPE_STYLES,
  type RarityStyle,
  type TypeStyle,
} from './palette';

/**
 * Card material factory.
 *
 * Ownership model:
 *
 *  - Every card gets its own three MeshPhysicalMaterial instances (front, back,
 *    edge) so its foil uniforms animate independently. Material objects are
 *    cheap; the expensive things are textures and shader programs, and both are
 *    shared.
 *  - Exactly one shader program serves every card surface in the vault. All
 *    rarity and type differences are uniforms, and every material carries the
 *    same feature set and the same customProgramCacheKey, so three compiles the
 *    physical shader once.
 *  - Exactly one texture is unique per card: the printed face. Fibre, handling,
 *    foil grating, card back and edge core are shared singletons.
 *  - Face textures are reference counted. A card released by every holder goes
 *    into a cold pool; the pool is trimmed to a byte budget derived from the
 *    quality tier, so a 90 card vault never holds 90 face textures.
 */

export interface CardMaterialOptions {
  /**
   * Composition width of the printed face in pixels. Height follows the 63:88
   * ratio. Defaults to the quality tier: 1024 on ultra and high, 768 on medium,
   * 512 on low.
   */
  faceResolution?: number;
  /** Spectral integration samples for the thin film. Defaults to the tier. */
  spectralSamples?: number;
  /** Byte budget for released face textures. Defaults to the tier. */
  faceBudgetBytes?: number;
}

export interface CardMaterial {
  readonly card: CardRecord;
  /**
   * Materials indexed to match `createCardGeometry` groups:
   * [0] front face, [1] back face, [2] cut edge. Pass straight to THREE.Mesh.
   */
  readonly materials: THREE.Material[];
  readonly front: THREE.MeshPhysicalMaterial;
  readonly back: THREE.MeshPhysicalMaterial;
  readonly edge: THREE.MeshPhysicalMaterial;
  /** Accent colour for lights, particles and UI keyed to this card. */
  readonly accent: THREE.Color;
  /** Drive the travelling interference term. Call once per frame. */
  update(t: FrameTime): void;
  /** 0..1 reveal charge. Lifts foil gain and widens the fringes. */
  setReveal(v: number): void;
  /** 0..1 additive punch at the impact frame. */
  setSurge(v: number): void;
  /** 0..1 laminate gloss. 1 is factory fresh. */
  setGloss(v: number): void;
  /** Drop one reference. The face texture is freed once nothing holds it. */
  release(): void;
}

export interface CardMaterialStats {
  /** Cards currently referenced at least once. */
  live: number;
  /** Cards built but released, still holding their texture. */
  cold: number;
  faceTextures: number;
  faceBytes: number;
  sharedBytes: number;
  totalBytes: number;
  /** Distinct shader programs this package asks three to compile. */
  programs: number;
}

interface Shared {
  fibre: THREE.DataTexture;
  handling: THREE.DataTexture;
  foil: THREE.DataTexture;
  back: THREE.DataTexture;
  edgeLight: THREE.DataTexture;
  edgeDark: THREE.DataTexture;
  bytes: number;
  anisotropy: number;
  spectralSamples: number;
  faceResolution: number;
  faceBudgetBytes: number;
}

interface Entry {
  card: CardRecord;
  refs: number;
  serial: number;
  faceTex: THREE.DataTexture;
  faceBytes: number;
  front: THREE.MeshPhysicalMaterial;
  back: THREE.MeshPhysicalMaterial;
  edge: THREE.MeshPhysicalMaterial;
  uniforms: FoilUniforms[];
  handle: CardMaterial;
}

let shared: Shared | null = null;
const entries = new Map<number, Entry>();
let serialCounter = 0;

// ---------------------------------------------------------------------------
// texture upload
// ---------------------------------------------------------------------------

function texBytes(w: number, h: number, mips: boolean): number {
  return Math.round(w * h * 4 * (mips ? 4 / 3 : 1));
}

function makeTexture(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  opts: { srgb: boolean; anisotropy: number; repeat?: [number, number]; wrap?: THREE.Wrapping }
): THREE.DataTexture {
  const tex = new THREE.DataTexture(
    new Uint8Array(data.buffer, data.byteOffset, data.byteLength),
    width,
    height,
    THREE.RGBAFormat,
    THREE.UnsignedByteType
  );
  tex.colorSpace = opts.srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  // Every texture in this package is authored top-down and uploaded without a
  // flip, which is why createCardGeometry emits v = 0 at the top of the card.
  tex.flipY = false;
  tex.premultiplyAlpha = false;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  const wrap = opts.wrap ?? THREE.ClampToEdgeWrapping;
  tex.wrapS = wrap;
  tex.wrapT = wrap;
  tex.anisotropy = opts.anisotropy;
  if (opts.repeat) tex.repeat.set(opts.repeat[0], opts.repeat[1]);
  tex.needsUpdate = true;
  return tex;
}

function fromRaw(
  img: RawImage,
  opts: { srgb: boolean; anisotropy: number; repeat?: [number, number]; wrap?: THREE.Wrapping }
): THREE.DataTexture {
  return makeTexture(img.data, img.width, img.height, opts);
}

/** Colour plate in RGB, foil plate in A. One upload, two channels of meaning. */
function mergePlates(color: Surface, foil: Surface): Uint8ClampedArray {
  const c = readPixels(color);
  const f = readPixels(foil);
  for (let i = 0, n = c.length; i < n; i += 4) c[i + 3] = f[i];
  return c;
}

// ---------------------------------------------------------------------------
// shared resources
// ---------------------------------------------------------------------------

function resolutionFor(tier: QualityTier): number {
  switch (tier) {
    case 'ultra':
    case 'high':
      return 1024;
    case 'medium':
      return 768;
    default:
      return 512;
  }
}

function budgetFor(tier: QualityTier): number {
  switch (tier) {
    case 'ultra':
      return 40 * 1024 * 1024;
    case 'high':
      return 32 * 1024 * 1024;
    case 'medium':
      return 16 * 1024 * 1024;
    default:
      return 6 * 1024 * 1024;
  }
}

function ensureShared(ctx: AppContext, opts: CardMaterialOptions): Shared {
  if (shared) return shared;
  const aniso = Math.min(ctx.renderer.capabilities.getMaxAnisotropy(), ctx.quality.anisotropy);

  const fibreImg = fibreNormal(512, 1.7);
  const handlingImg = handlingMap(768);
  const foilImg = foilDetail(512);
  const edgeLightImg = edgeCore(64, 256, false);
  const edgeDarkImg = edgeCore(64, 256, true);
  const backPlates = composeBack(768);

  const fibre = fromRaw(fibreImg, {
    srgb: false,
    anisotropy: aniso,
    repeat: [5, 7],
    wrap: THREE.RepeatWrapping,
  });
  const handling = fromRaw(handlingImg, { srgb: false, anisotropy: aniso });
  const foil = fromRaw(foilImg, {
    srgb: false,
    anisotropy: aniso,
    repeat: [1, 1],
    wrap: THREE.RepeatWrapping,
  });
  const edgeLight = fromRaw(edgeLightImg, {
    srgb: true,
    anisotropy: aniso,
    wrap: THREE.RepeatWrapping,
  });
  const edgeDark = fromRaw(edgeDarkImg, { srgb: true, anisotropy: aniso, wrap: THREE.RepeatWrapping });
  const back = makeTexture(mergePlates(backPlates.color, backPlates.foil), backPlates.color.w, backPlates.color.h, {
    srgb: true,
    anisotropy: aniso,
  });

  const bytes =
    texBytes(512, 512, true) +
    texBytes(768, Math.round((768 * 88) / 63), true) +
    texBytes(512, 512, true) +
    texBytes(64, 256, true) * 2 +
    texBytes(backPlates.color.w, backPlates.color.h, true);

  shared = {
    fibre,
    handling,
    foil,
    back,
    edgeLight,
    edgeDark,
    bytes,
    anisotropy: aniso,
    spectralSamples: opts.spectralSamples ?? spectralSamplesFor(ctx.quality.tier),
    faceResolution: opts.faceResolution ?? resolutionFor(ctx.quality.tier),
    faceBudgetBytes: opts.faceBudgetBytes ?? budgetFor(ctx.quality.tier),
  };
  return shared;
}

// ---------------------------------------------------------------------------
// material construction
// ---------------------------------------------------------------------------

function applySharedMaps(m: THREE.MeshPhysicalMaterial, s: Shared, fibreRepeat: [number, number]): void {
  const fibre = s.fibre.clone();
  fibre.repeat.set(fibreRepeat[0], fibreRepeat[1]);
  fibre.needsUpdate = false;
  m.normalMap = fibre;
  m.roughnessMap = s.handling;
  m.metalnessMap = s.handling;
  m.aoMap = s.handling;
  m.clearcoatRoughnessMap = s.handling;
}

/** Foil drive per rarity, in the packing the shader expects. */
function foilVectors(
  rs: RarityStyle,
  ts: TypeStyle,
  ghost: boolean,
  seed: number,
  surface: 'front' | 'back' | 'edge'
): {
  seedV: THREE.Vector4;
  params: THREE.Vector4;
  film: THREE.Vector4;
  streak: THREE.Vector4;
  metal: THREE.Vector4;
  tint: THREE.Color;
} {
  // Stable per-card grating orientation and scale.
  const a = ts.streakAngle + ((seed & 0xff) / 255 - 0.5) * 0.5;
  const scale = surface === 'edge' ? 3.4 : 1.0 + ((seed >>> 8) & 0xff) / 255 * 0.8;
  const phase = (((seed >>> 16) & 0xffff) / 65535) * Math.PI * 2;

  const surfaceGain = surface === 'front' ? 1 : surface === 'back' ? 0.72 : rs.pips >= 5 ? 1.15 : 0.45;
  const gain = rs.foil * surfaceGain * (ghost ? 0.55 : 1) + (rs.foil > 0 ? 0 : 0.05);

  // Film geometry. A stamped holographic layer is a few hundred nanometres of
  // lacquer over an aluminium or dielectric stack; the type bias moves where in
  // the visible band the first order fringe lands.
  const base = 330 + ts.filmBias * 0.45 + (ghost ? -45 : 0);
  const rangeNm = 46 + rs.foilSpread * 16;
  const filmIor = 1.38 + rs.foilSpread * 0.03;
  const substrateIor = ghost ? 1.62 : 2.05 + rs.foilSpread * 0.06;

  const tint = new THREE.Color(1, 1, 1);
  if (ghost) tint.setRGB(0.62, 1.0, 0.86);

  return {
    seedV: new THREE.Vector4(Math.cos(a), Math.sin(a), scale, phase),
    params: new THREE.Vector4(gain, rs.emboss * (ghost ? 1.4 : 1), rs.foilSpread >= 2 ? 0.55 + rs.foil * 0.6 : 0.12, 0.35 + rs.foil * 0.9),
    film: new THREE.Vector4(base, rangeNm, filmIor, substrateIor),
    streak: new THREE.Vector4(60 + rs.anisotropy * 260, 0.55 + rs.anisotropy * 1.5, 0.1 + (1 - rs.foil) * 0.18, 3.4),
    metal: new THREE.Vector4(ghost ? 0.55 : 0.92, rs.foil * (surface === 'front' ? 0.9 : 0.7), 0.6, 0),
    tint,
  };
}

function buildMaterial(
  kind: 'front' | 'back' | 'edge',
  map: THREE.Texture,
  s: Shared,
  rs: RarityStyle,
  ts: TypeStyle,
  ghost: boolean,
  seed: number
): { mat: THREE.MeshPhysicalMaterial; uniforms: FoilUniforms } {
  const m = new THREE.MeshPhysicalMaterial();
  m.name = `card-${kind}`;
  m.map = map;
  applySharedMaps(m, s, kind === 'edge' ? [24, 1] : [5, 7]);
  m.normalScale.set(kind === 'edge' ? 1.4 : 0.55, kind === 'edge' ? 1.4 : 0.55);

  m.roughness = kind === 'edge' ? 0.78 : rs.roughness;
  m.metalness = 0.0;
  m.clearcoat = kind === 'edge' ? rs.clearcoat * 0.25 : rs.clearcoat;
  m.clearcoatRoughness = rs.clearcoatRoughness + (kind === 'edge' ? 0.35 : 0);
  m.ior = 1.52; // laminate film
  m.reflectivity = 0.55;

  // Uncoated stock has fibre sheen. It is what keeps a common card from
  // looking like painted plastic.
  m.sheen = ghost ? 0.7 : 0.15 + (1 - rs.clearcoat) * 0.5;
  m.sheenRoughness = 0.85;
  m.sheenColor = new THREE.Color(...(ghost ? [0.55, 0.78, 0.7] : [0.95, 0.93, 0.88]));

  m.iridescence = rs.iridescence * (ghost ? 0.6 : 1);
  m.iridescenceIOR = 1.38 + rs.foilSpread * 0.03;
  m.iridescenceThicknessRange = [180, 720];

  m.anisotropy = rs.anisotropy;
  m.anisotropyRotation = ts.streakAngle;

  m.envMapIntensity = 1.0;
  m.side = THREE.FrontSide;
  m.transparent = false;
  m.depthWrite = true;

  if (ghost) {
    m.color.setRGB(0.82, 0.92, 0.88);
  }

  const uniforms = makeFoilUniforms();
  const v = foilVectors(rs, ts, ghost, seed, kind);
  uniforms.uFoilTex.value = s.foil;
  uniforms.uFoilSeed.value = v.seedV;
  uniforms.uFoilParams.value = v.params;
  uniforms.uFilm.value = v.film;
  uniforms.uStreak.value = v.streak;
  uniforms.uFoilMetal.value = v.metal;
  uniforms.uFoilTint.value = v.tint;
  uniforms.uFoilDyn.value.set(0, 0, 0, ghost ? 1 : 0);

  // One tag for every card surface: identical injected source means three
  // compiles the physical shader exactly once for the whole vault.
  patchFoil(m, uniforms, { spectralSamples: s.spectralSamples, tag: 'card' });

  return { mat: m, uniforms };
}

// ---------------------------------------------------------------------------
// cache
// ---------------------------------------------------------------------------

function coldBytes(): number {
  let n = 0;
  for (const e of entries.values()) if (e.refs === 0) n += e.faceBytes;
  return n;
}

function trim(budget: number): void {
  let over = coldBytes() - budget;
  if (over <= 0) return;
  const cold = [...entries.values()].filter((e) => e.refs === 0).sort((a, b) => a.serial - b.serial);
  for (const e of cold) {
    if (over <= 0) break;
    over -= e.faceBytes;
    destroyEntry(e);
    entries.delete(e.card.id);
  }
}

function destroyEntry(e: Entry): void {
  e.faceTex.dispose();
  for (const m of [e.front, e.back, e.edge]) {
    // The fibre map is a per-material clone so the repeat can differ; the
    // others are shared singletons and are freed by disposeCardMaterials.
    m.normalMap?.dispose();
    m.dispose();
  }
}

/**
 * Build or reuse the materials for a card. Every call takes a reference; call
 * `release()` on the handle when the mesh is torn down.
 */
export function createCardMaterial(
  card: CardRecord,
  ctx: AppContext,
  opts: CardMaterialOptions = {}
): CardMaterial {
  const s = ensureShared(ctx, opts);
  const existing = entries.get(card.id);
  if (existing) {
    existing.refs++;
    existing.serial = ++serialCounter;
    return existing.handle;
  }

  const rar = clampRarity(card.rarity);
  const rs = RARITY_STYLES[rar];
  const ts = TYPE_STYLES[typeNameOf(card)];
  const ghost = isGhost(card);
  const seed = cardSeed(card);

  const res = opts.faceResolution ?? s.faceResolution;
  const plates = composeFace(card, res);
  const faceTex = makeTexture(mergePlates(plates.color, plates.foil), plates.color.w, plates.color.h, {
    srgb: true,
    anisotropy: s.anisotropy,
  });
  faceTex.name = `face-${card.id}`;

  const edgeMap = rar >= 3 ? s.edgeDark : s.edgeLight;
  const front = buildMaterial('front', faceTex, s, rs, ts, ghost, seed);
  const back = buildMaterial('back', s.back, s, rs, ts, ghost, seed);
  const edge = buildMaterial('edge', edgeMap, s, rs, ts, ghost, seed);
  const [er, eg, eb] = hexToRgb(rs.edge);
  edge.mat.color.setRGB(er, eg, eb).convertSRGBToLinear();

  const uniforms = [front.uniforms, back.uniforms, edge.uniforms];
  const accent = new THREE.Color(...hexToRgb(ghost ? ts.accent : rs.frame)).convertSRGBToLinear();

  const entry: Entry = {
    card,
    refs: 1,
    serial: ++serialCounter,
    faceTex,
    faceBytes: texBytes(plates.color.w, plates.color.h, true),
    front: front.mat,
    back: back.mat,
    edge: edge.mat,
    uniforms,
    handle: null as unknown as CardMaterial,
  };

  let reveal = 0;
  let surge = 0;

  entry.handle = {
    card,
    materials: [front.mat, back.mat, edge.mat],
    front: front.mat,
    back: back.mat,
    edge: edge.mat,
    accent,
    update(t: FrameTime) {
      for (const u of uniforms) {
        u.uFoilDyn.value.x = t.elapsed;
        u.uFoilDyn.value.y = reveal;
        u.uFoilDyn.value.z = surge;
      }
    },
    setReveal(v: number) {
      reveal = Math.max(0, Math.min(1, v));
    },
    setSurge(v: number) {
      surge = Math.max(0, Math.min(1, v));
    },
    setGloss(v: number) {
      const g = Math.max(0, Math.min(1, v));
      front.mat.clearcoat = rs.clearcoat * g;
      back.mat.clearcoat = rs.clearcoat * g;
      edge.mat.clearcoat = rs.clearcoat * 0.25 * g;
    },
    release() {
      entry.refs = Math.max(0, entry.refs - 1);
      if (entry.refs === 0) trim(s.faceBudgetBytes);
    },
  };

  entries.set(card.id, entry);
  trim(s.faceBudgetBytes);
  return entry.handle;
}

/**
 * Build the face textures for a set of cards ahead of time. Face composition is
 * a few milliseconds of canvas work per card; call this while the packet is
 * still sealed so the reveal frame never hitches.
 */
export function prewarmCardMaterials(cards: CardRecord[], ctx: AppContext, opts: CardMaterialOptions = {}): void {
  for (const card of cards) createCardMaterial(card, ctx, opts).release();
}

export function cardMaterialStats(): CardMaterialStats {
  let live = 0;
  let cold = 0;
  let faceBytes = 0;
  for (const e of entries.values()) {
    if (e.refs > 0) live++;
    else cold++;
    faceBytes += e.faceBytes;
  }
  const sharedBytes = shared?.bytes ?? 0;
  return {
    live,
    cold,
    faceTextures: entries.size,
    faceBytes,
    sharedBytes,
    totalBytes: faceBytes + sharedBytes,
    // One physical program for every card surface, plus the depth prepass and
    // shadow variants three derives from it.
    programs: entries.size > 0 ? 1 : 0,
  };
}

/** Free everything this package holds. Safe to call more than once. */
export function disposeCardMaterials(): void {
  for (const e of entries.values()) destroyEntry(e);
  entries.clear();
  if (shared) {
    shared.fibre.dispose();
    shared.handling.dispose();
    shared.foil.dispose();
    shared.back.dispose();
    shared.edgeLight.dispose();
    shared.edgeDark.dispose();
    shared = null;
  }
  serialCounter = 0;
}
