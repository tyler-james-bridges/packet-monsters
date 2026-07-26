import * as THREE from 'three';
import type { Key } from './timeline';
import { EASE, cubicBezier, linear, quadOut, sineInOut, cubicOut, expoOut } from './easing';

/**
 * The rarity escalation table.
 *
 * One place where the tempo of the whole pack opening is authored. A common is
 * brisk and modest: short charge, low ejection, quick turn, done. A legendary is
 * a held performance: a long wind up with a dead beat before the burst, a high
 * arcing tumble, a heavy landing, and a turn that snaps most of the way round
 * then *stops* and creeps the last few degrees while the foil rakes the light.
 *
 * Both the card stage and the camera rig read this, so the picture and the
 * subject are always cut to the same clock. The card stage broadcasts each beat
 * and its duration on the bus; the camera rig never guesses.
 */
export type AnimBeat = 'idle' | 'charge' | 'burst' | 'impact' | 'turn' | 'settle';

export interface Choreo {
  /** Seconds of visible wind up. */
  chargeDur: number;
  /** Dead beat at full compression, right before the tear. Anticipation lives here. */
  holdDur: number;
  /** Ejection speed along the packet's up axis, m/s. */
  ejectSpeed: number;
  /** Ejection speed toward the camera. */
  ejectForward: number;
  /** Magnitude of the ejection tumble, rad/s. */
  ejectSpin: number;
  /** Longest the card is allowed to stay airborne before the beat advances. */
  maxFlight: number;
  /** Beat held on the landing before the card is lifted. */
  impactHold: number;
  /** Duration of the hero turn. */
  turnDur: number;
  /** Extra full revolutions folded into the turn so the foil sweeps the key light. */
  spinTurns: number;
  /** Height of the lift arc between the plinth and the hero pose. */
  liftArc: number;
  /** Camera shake trauma at the burst and at the landing. */
  burstShake: number;
  impactShake: number;
  shakeDur: number;
  /** How far the camera pushes in during the charge, metres. */
  camPush: number;
  /** Lateral swing of the camera through the turn, metres. */
  camArc: number;
  /** Final camera distance from the hero card. Lower is a bigger card. */
  camHero: number;
  /** Focal breathing: fov multiplier at the peak of the turn. */
  fovSqueeze: number;
  /** Seal emission gain. */
  glow: number;
  color: THREE.Color;
  /** Rotation progress of the hero turn, normalized. */
  turnKeys: readonly Key[];
  /** Height progress of the lift, normalized. Overshoots so it settles down into pose. */
  liftKeys: readonly Key[];
  /** Decay of the extra spin folded into the turn. */
  spinKeys: readonly Key[];
}

const RARITY_COLORS = [0x9fb6d8, 0x63e6a8, 0x54a6ff, 0xbe7bff, 0xffb648];

/** Quick turn: one move, modest deceleration, no theatre. */
const QUICK_TURN: readonly Key[] = [
  { t: 0, v: 0, ease: EASE.arrive },
  { t: 1, v: 1 },
];

/** Mid tier: commits, eases, small settle overshoot at the end. */
const MID_TURN: readonly Key[] = [
  { t: 0, v: 0, ease: cubicBezier(0.1, 0.82, 0.28, 0.98) },
  { t: 0.62, v: 0.9, ease: sineInOut },
  { t: 1, v: 1 },
];

/**
 * Hero turn. Snaps to 84 percent in the first third, holds almost still through
 * the middle third with the face raked to the key light, then creeps home. The
 * hold is the shot.
 */
const HERO_TURN: readonly Key[] = [
  { t: 0, v: 0, ease: cubicBezier(0.08, 0.9, 0.2, 1.0) },
  { t: 0.34, v: 0.84, ease: linear },
  { t: 0.52, v: 0.865, ease: sineInOut },
  { t: 0.82, v: 1.02, ease: quadOut },
  { t: 1, v: 1 },
];

const QUICK_LIFT: readonly Key[] = [
  { t: 0, v: 0, ease: cubicOut },
  { t: 1, v: 1 },
];

const HERO_LIFT: readonly Key[] = [
  { t: 0, v: 0, ease: expoOut },
  { t: 0.45, v: 1.08, ease: sineInOut },
  { t: 0.78, v: 0.985, ease: sineInOut },
  { t: 1, v: 1 },
];

const SPIN_DECAY: readonly Key[] = [
  { t: 0, v: 1, ease: cubicBezier(0.2, 0.0, 0.1, 1.0) },
  { t: 0.72, v: 0.02, ease: quadOut },
  { t: 1, v: 0 },
];

export const CHOREO: readonly Choreo[] = [
  // COMMON
  {
    chargeDur: 0.72,
    holdDur: 0.1,
    ejectSpeed: 3.0,
    ejectForward: 0.3,
    ejectSpin: 7.5,
    maxFlight: 1.5,
    impactHold: 0.2,
    turnDur: 0.46,
    spinTurns: 0,
    liftArc: 0.1,
    burstShake: 0.1,
    impactShake: 0.14,
    shakeDur: 0.3,
    camPush: 0.35,
    camArc: 0.05,
    camHero: 1.72,
    fovSqueeze: 1,
    glow: 0.9,
    color: new THREE.Color(RARITY_COLORS[0]),
    turnKeys: QUICK_TURN,
    liftKeys: QUICK_LIFT,
    spinKeys: SPIN_DECAY,
  },
  // UNCOMMON
  {
    chargeDur: 0.86,
    holdDur: 0.14,
    ejectSpeed: 3.3,
    ejectForward: 0.34,
    ejectSpin: 8.6,
    maxFlight: 1.6,
    impactHold: 0.24,
    turnDur: 0.58,
    spinTurns: 0,
    liftArc: 0.13,
    burstShake: 0.14,
    impactShake: 0.2,
    shakeDur: 0.34,
    camPush: 0.45,
    camArc: 0.1,
    camHero: 1.68,
    fovSqueeze: 1,
    glow: 1.15,
    color: new THREE.Color(RARITY_COLORS[1]),
    turnKeys: MID_TURN,
    liftKeys: QUICK_LIFT,
    spinKeys: SPIN_DECAY,
  },
  // RARE
  {
    chargeDur: 1.05,
    holdDur: 0.2,
    ejectSpeed: 3.7,
    ejectForward: 0.36,
    ejectSpin: 10.2,
    maxFlight: 1.7,
    impactHold: 0.28,
    turnDur: 0.82,
    spinTurns: 0.5,
    liftArc: 0.17,
    burstShake: 0.2,
    impactShake: 0.3,
    shakeDur: 0.4,
    camPush: 0.58,
    camArc: 0.2,
    camHero: 1.62,
    fovSqueeze: 0.985,
    glow: 1.5,
    color: new THREE.Color(RARITY_COLORS[2]),
    turnKeys: MID_TURN,
    liftKeys: HERO_LIFT,
    spinKeys: SPIN_DECAY,
  },
  // EPIC
  {
    chargeDur: 1.25,
    holdDur: 0.3,
    ejectSpeed: 4.0,
    ejectForward: 0.38,
    ejectSpin: 11.8,
    maxFlight: 1.8,
    impactHold: 0.32,
    turnDur: 1.15,
    spinTurns: 1,
    liftArc: 0.2,
    burstShake: 0.26,
    impactShake: 0.4,
    shakeDur: 0.46,
    camPush: 0.7,
    camArc: 0.42,
    camHero: 1.56,
    fovSqueeze: 0.96,
    glow: 1.9,
    color: new THREE.Color(RARITY_COLORS[3]),
    turnKeys: HERO_TURN,
    liftKeys: HERO_LIFT,
    spinKeys: SPIN_DECAY,
  },
  // LEGENDARY
  {
    chargeDur: 1.5,
    holdDur: 0.46,
    ejectSpeed: 4.35,
    ejectForward: 0.4,
    ejectSpin: 13.5,
    maxFlight: 2.0,
    impactHold: 0.4,
    turnDur: 1.62,
    spinTurns: 1.5,
    liftArc: 0.26,
    burstShake: 0.36,
    impactShake: 0.58,
    shakeDur: 0.55,
    camPush: 0.86,
    camArc: 0.72,
    camHero: 1.5,
    fovSqueeze: 0.925,
    glow: 2.6,
    color: new THREE.Color(RARITY_COLORS[4]),
    turnKeys: HERO_TURN,
    liftKeys: HERO_LIFT,
    spinKeys: SPIN_DECAY,
  },
];

export function choreoFor(rarity: number): Choreo {
  return CHOREO[Math.max(0, Math.min(CHOREO.length - 1, Math.round(rarity)))];
}

/** Shared stage geometry, so the camera and the card agree on where things are. */
export const STAGE = {
  /** Top surface of the plinth. */
  plinthTop: 0.62,
  plinthRadius: 0.85,
  /** Resting centre of the sealed packet. */
  packetY: 1.14,
  /** Hero pose of the revealed card. */
  heroPos: new THREE.Vector3(0, 1.34, 0.5),
} as const;
