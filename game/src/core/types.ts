import type * as THREE from 'three';

/** Rarity tiers, aligned with data/cards.json rarity ints. */
export const RARITY = {
  COMMON: 0,
  UNCOMMON: 1,
  RARE: 2,
  EPIC: 3,
  LEGENDARY: 4,
} as const;
export type Rarity = (typeof RARITY)[keyof typeof RARITY];

export const RARITY_NAMES = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'] as const;

/** Elemental type ids, aligned with SPEC.md. */
export const TYPE_NAMES = [
  'SURGE',
  'PHANTOM',
  'PLASMA',
  'FROST',
  'EXOTIC',
  'SANDBOX',
  'GHOST',
] as const;
export type TypeName = (typeof TYPE_NAMES)[number];

/** A raw card record as produced by scripts/derive-cards.mjs. */
export interface CardRecord {
  id: number;
  name: string;
  host: string;
  urlHash: string;
  hp: number;
  attack: number;
  speed: number;
  typeId: number;
  rarity: number;
  priceUsd: string;
  latencyMs: number;
  alive: boolean;
  network: string;
}

/**
 * A vault position: a card paired with committed ETH backing, in the manner of
 * the Fake World Assets protocol. Backing sets the draw weight and funds the
 * depositor's standing bid.
 */
export interface VaultPosition {
  card: CardRecord;
  /** Committed ETH backing, in wei-scaled float ETH. */
  backing: number;
  /** Normalized selection weight, derived from backing. Sums to 1 across the vault. */
  weight: number;
  /** Depositor's irrevocable standing bid to reacquire, in ETH. */
  standingBid: number;
}

/** Quality tier chosen by the adaptive quality manager. */
export type QualityTier = 'ultra' | 'high' | 'medium' | 'low';

export interface QualitySettings {
  tier: QualityTier;
  /** Device pixel ratio cap. */
  pixelRatio: number;
  /** Shadow map resolution per light. */
  shadowMapSize: number;
  /** Enable percentage-closer soft shadows. */
  softShadows: boolean;
  /** Number of temporal AA jitter samples; 1 disables TAA. */
  taaSamples: number;
  /** Bloom mip chain length. */
  bloomMips: number;
  /** Enable depth of field. */
  dof: boolean;
  /** Enable screen space reflections on the vault floor. */
  ssr: boolean;
  /** Enable volumetric light shafts. */
  volumetrics: boolean;
  /** Max simultaneous GPU particles. */
  maxParticles: number;
  /** Anisotropic filtering level. */
  anisotropy: number;
}

/** Per-frame timing handed to every updatable system. */
export interface FrameTime {
  /** Seconds since the previous frame, clamped to avoid spiral-of-death. */
  dt: number;
  /** Seconds since app start. */
  elapsed: number;
  /** Monotonically increasing frame index. */
  frame: number;
}

/** Any system that ticks each frame. */
export interface System {
  readonly name: string;
  update(t: FrameTime): void;
  dispose?(): void;
  /** Called on canvas resize. */
  resize?(width: number, height: number): void;
}

/** Shared services every subsystem receives. */
export interface AppContext {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  canvas: HTMLCanvasElement;
  quality: QualitySettings;
  bus: EventBus;
  /** Deterministic RNG seeded from the URL, for reproducible screenshots. */
  rng: () => number;
  /** Viewport size in CSS pixels. */
  size: { width: number; height: number };
  /** True when running under the screenshot harness. */
  deterministic: boolean;
}

/** Application-wide events. Systems communicate through this, never by import cycles. */
export interface AppEvents {
  'pull:requested': { count: number };
  'pull:committed': { seed: number; positions: VaultPosition[] };
  'reveal:start': { position: VaultPosition; index: number; total: number };
  'reveal:impact': { position: VaultPosition; index: number };
  'reveal:settled': { position: VaultPosition; index: number };
  'pull:complete': { positions: VaultPosition[] };
  'camera:shake': { amount: number; duration: number };
  /**
   * Beat changes in the pack opening choreography, broadcast by the card stage.
   * The camera rig, VFX and audio cut against this rather than re-deriving the
   * sequence timing, so the picture and the subject never drift apart.
   * `duration` is the authored length of the beat in seconds (0 if open ended).
   */
  'anim:beat': {
    beat: 'idle' | 'charge' | 'burst' | 'impact' | 'turn' | 'settle';
    rarity: number;
    duration: number;
  };
  /**
   * Live pose of whatever object is currently the subject (sealed packet, then
   * the tumbling card, then the hero card). Emitted every frame with a reused
   * payload object, so handlers must read it, not retain it.
   */
  'card:pose': { x: number; y: number; z: number; speed: number };
  /**
   * Focus distance from the camera to the current subject, in world units, so
   * depth of field tracks where the card actually is. Emitted by the camera rig.
   */
  'camera:focus': { distance: number; range: number };
  'quality:changed': { settings: QualitySettings };
  'ui:navigate': { view: 'vault' | 'collection' | 'odds' };
  'audio:cue': { id: string; intensity?: number };
  'scene:ready': Record<string, never>;
}

export type EventBus = {
  on<K extends keyof AppEvents>(k: K, fn: (p: AppEvents[K]) => void): () => void;
  off<K extends keyof AppEvents>(k: K, fn: (p: AppEvents[K]) => void): void;
  emit<K extends keyof AppEvents>(k: K, p: AppEvents[K]): void;
};
