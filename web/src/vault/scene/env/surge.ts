import * as THREE from 'three';
import { ACCENT_COLOR } from './layout';

/**
 * Shared reveal-surge state for the environment.
 *
 * The lighting rig and the chamber are two systems and systems never import one
 * another, but they are both facets of one physical room: when a legendary
 * lands, the key light punches AND the wall strips, the cove, the plinth seam
 * and the light shaft all have to move together. This module is the small piece
 * of shared environment state they both read, not a back channel for events.
 *
 * `target` is written by LightingSystem.setSurge. `value` is a critically damped
 * follow of it, stepped once per frame by the lighting rig (which updates first)
 * so every consumer sees the same number within a frame.
 */
export interface EnvSurge {
  /** Raw request, 0..1. */
  target: number;
  /** Smoothed response, 0..1. */
  value: number;
  /** Rate of change, used for the sharp leading edge on the strips. */
  velocity: number;
  /** Accent colour requested by the reveal. */
  color: THREE.Color;
  /** Neutral chamber accent, blended toward `color` as the surge rises. */
  readonly restColor: THREE.Color;
}

const state: EnvSurge = {
  target: 0,
  value: 0,
  velocity: 0,
  color: ACCENT_COLOR.clone(),
  restColor: ACCENT_COLOR.clone(),
};

export function envSurge(): EnvSurge {
  return state;
}

export function requestEnvSurge(amount: number, color?: THREE.Color): void {
  state.target = Math.max(0, Math.min(1, amount));
  if (color) state.color.copy(color);
}

/**
 * Critically damped spring. A surge should slam on and bleed off, so the rise
 * uses a much stiffer constant than the fall.
 */
export function stepEnvSurge(dt: number): number {
  const rising = state.target > state.value;
  const omega = rising ? 26 : 6.5;
  const step = Math.min(dt, 1 / 30);
  const delta = state.target - state.value;
  state.velocity += (delta * omega - state.velocity * 2 * Math.sqrt(omega)) * step;
  state.value += state.velocity * step;
  if (state.value < 0) {
    state.value = 0;
    state.velocity = 0;
  }
  if (state.value > 1.4) {
    state.value = 1.4;
    state.velocity = 0;
  }
  return state.value;
}

/** Accent colour for chamber emissives at the current surge level. */
export function surgeAccent(out: THREE.Color): THREE.Color {
  return out.copy(state.restColor).lerp(state.color, Math.min(1, state.value * 1.35));
}
