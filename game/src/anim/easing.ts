/**
 * Easing curves and scalar helpers.
 *
 * Every curve is a pure `(t: number) => number` mapping 0..1 to 0..1 (except the
 * back and elastic families, which deliberately leave the unit range). Nothing
 * in this file touches time, randomness or state, so the whole animation layer
 * stays reproducible under the deterministic harness.
 */

export type Ease = (t: number) => number;

export const clamp = (x: number, a: number, b: number): number => (x < a ? a : x > b ? b : x);
export const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
export const mix = (a: number, b: number, t: number): number => a + (b - a) * t;
export const inverseLerp = (a: number, b: number, v: number): number =>
  Math.abs(b - a) < 1e-9 ? 0 : (v - a) / (b - a);
export const remap = (v: number, a: number, b: number, c: number, d: number): number =>
  mix(c, d, clamp01(inverseLerp(a, b, v)));

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01(inverseLerp(edge0, edge1, x));
  return t * t * (3 - 2 * t);
}

export function smootherstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01(inverseLerp(edge0, edge1, x));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/** Frame rate independent exponential approach. `halfLife` is in seconds. */
export function damp(current: number, target: number, halfLife: number, dt: number): number {
  return mix(target, current, Math.pow(2, -dt / Math.max(halfLife, 1e-5)));
}

// --- polynomial ------------------------------------------------------------

export const linear: Ease = (t) => t;

const pIn = (p: number): Ease => (t) => Math.pow(clamp01(t), p);
const pOut = (p: number): Ease => (t) => 1 - Math.pow(1 - clamp01(t), p);
const pInOut =
  (p: number): Ease =>
  (t) => {
    const x = clamp01(t);
    return x < 0.5 ? Math.pow(2 * x, p) / 2 : 1 - Math.pow(2 - 2 * x, p) / 2;
  };

export const quadIn = pIn(2);
export const quadOut = pOut(2);
export const quadInOut = pInOut(2);
export const cubicIn = pIn(3);
export const cubicOut = pOut(3);
export const cubicInOut = pInOut(3);
export const quartIn = pIn(4);
export const quartOut = pOut(4);
export const quartInOut = pInOut(4);
export const quintIn = pIn(5);
export const quintOut = pOut(5);
export const quintInOut = pInOut(5);

/** Arbitrary exponent, for when 2..5 is not the shape you want. */
export const powerOut = pOut;
export const powerIn = pIn;

// --- trigonometric / exponential ------------------------------------------

export const sineIn: Ease = (t) => 1 - Math.cos((clamp01(t) * Math.PI) / 2);
export const sineOut: Ease = (t) => Math.sin((clamp01(t) * Math.PI) / 2);
export const sineInOut: Ease = (t) => -(Math.cos(Math.PI * clamp01(t)) - 1) / 2;

export const expoIn: Ease = (t) => (t <= 0 ? 0 : Math.pow(2, 10 * clamp01(t) - 10));
export const expoOut: Ease = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp01(t)));
export const expoInOut: Ease = (t) => {
  const x = clamp01(t);
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  return x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
};

export const circIn: Ease = (t) => 1 - Math.sqrt(1 - clamp01(t) * clamp01(t));
export const circOut: Ease = (t) => Math.sqrt(1 - Math.pow(clamp01(t) - 1, 2));
export const circInOut: Ease = (t) => {
  const x = clamp01(t);
  return x < 0.5
    ? (1 - Math.sqrt(1 - 4 * x * x)) / 2
    : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
};

// --- overshoot families ----------------------------------------------------

/** Overshoot on the way out. `s` is the overshoot amount (1.70158 is the classic 10 percent). */
export const backOut =
  (s = 1.70158): Ease =>
  (t) => {
    const x = clamp01(t) - 1;
    return 1 + (s + 1) * x * x * x + s * x * x;
  };

/** Undershoot before launching. This is anticipation in a single curve. */
export const backIn =
  (s = 1.70158): Ease =>
  (t) => {
    const x = clamp01(t);
    return (s + 1) * x * x * x - s * x * x;
  };

export const backInOut =
  (s = 1.70158): Ease =>
  (t) => {
    const x = clamp01(t);
    const c = s * 1.525;
    return x < 0.5
      ? (Math.pow(2 * x, 2) * ((c + 1) * 2 * x - c)) / 2
      : (Math.pow(2 * x - 2, 2) * ((c + 1) * (2 * x - 2) + c) + 2) / 2;
  };

/** Decaying oscillation. `periods` counts the visible wobbles. */
export const elasticOut =
  (amplitude = 1, periods = 3): Ease =>
  (t) => {
    const x = clamp01(t);
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return 1 + amplitude * Math.pow(2, -10 * x) * Math.sin((x * periods - 0.25) * 2 * Math.PI);
  };

export const bounceOut: Ease = (t) => {
  const n = 7.5625;
  const d = 2.75;
  let x = clamp01(t);
  if (x < 1 / d) return n * x * x;
  if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75;
  if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375;
  return n * (x -= 2.625 / d) * x + 0.984375;
};

// --- cubic bezier ----------------------------------------------------------

const bezA = (a1: number, a2: number) => 1 - 3 * a2 + 3 * a1;
const bezB = (a1: number, a2: number) => 3 * a2 - 6 * a1;
const bezC = (a1: number) => 3 * a1;
const bezCalc = (t: number, a1: number, a2: number) =>
  ((bezA(a1, a2) * t + bezB(a1, a2)) * t + bezC(a1)) * t;
const bezSlope = (t: number, a1: number, a2: number) =>
  3 * bezA(a1, a2) * t * t + 2 * bezB(a1, a2) * t + bezC(a1);

/**
 * A real CSS-style cubic bezier, solved with Newton-Raphson and a bisection
 * fallback. This is how you author a curve with an intentional shape instead of
 * reaching for another magic exponent.
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): Ease {
  if (x1 === y1 && x2 === y2) return linear;
  return (t: number) => {
    const x = clamp01(t);
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    // Newton first; it converges in two or three steps for well behaved curves.
    let guess = x;
    for (let i = 0; i < 6; i++) {
      const slope = bezSlope(guess, x1, x2);
      if (Math.abs(slope) < 1e-6) break;
      guess -= (bezCalc(guess, x1, x2) - x) / slope;
    }
    if (!(guess >= 0 && guess <= 1)) {
      // Bisect when Newton wandered off a near-vertical segment.
      let lo = 0;
      let hi = 1;
      guess = x;
      for (let i = 0; i < 24; i++) {
        const cur = bezCalc(guess, x1, x2);
        if (Math.abs(cur - x) < 1e-6) break;
        if (cur > x) hi = guess;
        else lo = guess;
        guess = (lo + hi) / 2;
      }
    }
    return bezCalc(guess, y1, y2);
  };
}

// --- authored presets ------------------------------------------------------

/**
 * The curves the pack-opening choreography is actually cut on. Named for the
 * animation beat they serve, not for their maths, so the sequence reads as
 * intent rather than as numbers.
 */
export const EASE = {
  /** Slow build with a late acceleration. Used for the seal charging. */
  charge: cubicBezier(0.55, 0.02, 0.86, 0.28),
  /** Violent out. Almost all the distance in the first fifth. */
  snap: cubicBezier(0.05, 0.86, 0.16, 1.0),
  /** Fast out that keeps creeping. Reads as momentum bleeding off. */
  drift: cubicBezier(0.12, 0.72, 0.22, 1.0),
  /** Soft symmetric move for camera pushes. */
  glide: cubicBezier(0.42, 0.0, 0.24, 1.0),
  /** Weighted arrival: fast, then a long deceleration with a touch of settle. */
  arrive: cubicBezier(0.16, 0.9, 0.28, 1.0),
  /** Hero turn: commits hard, then holds and creeps the last few degrees. */
  heroTurn: cubicBezier(0.14, 0.88, 0.1, 1.0),
  /** Small overshoot for the final card settle. */
  settle: backOut(1.28),
  /** Anticipation dip before a launch. */
  anticipate: backIn(2.1),
  linear,
} as const;
