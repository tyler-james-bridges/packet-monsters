import * as THREE from 'three';

/**
 * The chamber's dimensions and light directions, shared by the geometry, the
 * light rig, the IBL probe and the volumetrics so they cannot drift apart.
 *
 * Everything is metric and sized against a standing human: the wall is 4.6 m to
 * the cornice, the dais is one step high, and the altar reads as waist height
 * from the camera at eye level. Scale is what stops the frame looking like an
 * object floating in a void.
 */
export const CHAMBER = {
  /** Inner face of the wall panels. */
  wallRadius: 6.4,
  /** Panel run, from the top of the skirting to the underside of the cornice. */
  wallHeight: 4.3,
  skirtHeight: 0.3,
  corniceY: 4.6,
  ceilingY: 4.8,
  floorRadius: 7.4,
  panels: 24,
  pilasters: 8,

  daisRadius: 2.3,
  daisHeight: 0.2,

  /** Widest radius of the altar, used by the volumetric shadow test. */
  plinthRadius: 1.1,
  /**
   * The altar's top face. This is a contract, not a taste call: the card
   * physics in src/anim/choreography.ts resolves its contact plane against
   * STAGE.plinthTop = 0.62 with STAGE.plinthRadius = 0.85, so the machined cap
   * below lands exactly there. Move it and the card tumbles through the altar.
   */
  plinthTopY: 0.62,
  plinthCapRadius: 0.885,

  /** Where the hero card settles. */
  cardY: 1.35,

  /** Radius of the ceiling aperture the key light falls through. */
  apertureRadius: 1.35,

  /** Flush with the back panel's inner face so the rim buries into the wall. */
  portalZ: -6.4,
  portalY: 1.95,
  portalOuterRadius: 2.0,
  /** Radius of the glowing ring that haloes the hero card. */
  portalRingRadius: 1.41,
} as const;

/** Direction from the chamber toward the key light. */
export const KEY_DIR = new THREE.Vector3(2.6, 4.6, 2.0).normalize();
/** Direction toward the cool fill wash. */
export const FILL_DIR = new THREE.Vector3(-4.4, 1.9, 1.1).normalize();
/** Direction toward the cool back rim. */
export const RIM_DIR = new THREE.Vector3(-1.5, 2.4, -3.6).normalize();

export const KEY_COLOR = new THREE.Color(1.0, 0.895, 0.775);
export const FILL_COLOR = new THREE.Color(0.34, 0.52, 0.95);
export const RIM_COLOR = new THREE.Color(0.58, 0.79, 1.0);
/** The chamber's resting accent: warm amber, the onchain infrastructure tell. */
export const ACCENT_COLOR = new THREE.Color(1.0, 0.6, 0.26);

/** The beam axis passes through the card so the shaft cores on the hero. */
export const BEAM_AXIS = new THREE.Vector3(0, CHAMBER.cardY, 0);
