/**
 * UI motion runtime.
 *
 * The HUD does not lean on CSS transitions for anything that matters. A
 * transition cannot be interrupted cleanly, cannot be staggered without magic
 * `transition-delay` numbers, and cannot be frozen for a deterministic capture.
 * Everything here runs off one shared requestAnimationFrame ticker that stops
 * itself the moment nothing is animating, so an idle HUD costs zero frames and
 * the screenshot harness sees a genuinely settled surface.
 *
 * Three rules the rest of src/ui follows:
 *   1. Nothing is linear. Entrances decelerate, exits accelerate.
 *   2. Every tween is cancellable and every element owns at most one tween per
 *      channel, so a fast re-trigger retargets instead of fighting itself.
 *   3. `prefers-reduced-motion` and the deterministic harness both collapse
 *      durations to zero. The final visual state is identical either way, which
 *      is what makes reduced motion a real accommodation rather than a downgrade.
 */

export type Easing = (t: number) => number;

const BACK_C1 = 1.70158;
const BACK_C3 = BACK_C1 + 1;

/**
 * Curve library. Names describe where the energy is: `out` decelerates into
 * rest, `inOut` is symmetric, `outBack` overshoots by a hair.
 */
export const Ease = {
  outQuad: (t: number): number => 1 - (1 - t) * (1 - t),
  outCubic: (t: number): number => 1 - Math.pow(1 - t, 3),
  outQuart: (t: number): number => 1 - Math.pow(1 - t, 4),
  outQuint: (t: number): number => 1 - Math.pow(1 - t, 5),
  outExpo: (t: number): number => (t >= 1 ? 1 : 1 - Math.pow(2, -11 * t)),
  outCirc: (t: number): number => Math.sqrt(1 - Math.pow(t - 1, 2)),
  outBack: (t: number): number =>
    1 + BACK_C3 * Math.pow(t - 1, 3) + BACK_C1 * Math.pow(t - 1, 2),
  inQuad: (t: number): number => t * t,
  inCubic: (t: number): number => t * t * t,
  inOutCubic: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  inOutQuint: (t: number): number =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2,
  inOutExpo: (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
  },
  /** Critically damped settle. Reads as weight without the cartoon bounce. */
  settle: (t: number): number => {
    if (t >= 1) return 1;
    const d = 1 - Math.pow(2, -9 * t);
    return d + Math.sin(t * Math.PI * 2.0) * Math.pow(1 - t, 3) * 0.16;
  },
} as const;

/** Durations, in ms. One table so timing stays consistent across components. */
export const Dur = {
  micro: 120,
  fast: 190,
  base: 280,
  slow: 420,
  entrance: 560,
  reveal: 760,
} as const;

export interface Handle {
  cancel(): void;
  /** Jump to the end, run onUpdate(1) and onComplete. */
  finish(): void;
  readonly done: boolean;
}

export interface TweenOptions {
  duration?: number;
  delay?: number;
  easing?: Easing;
  from?: number;
  to?: number;
  onUpdate(value: number, progress: number): void;
  onComplete?(): void;
}

interface Job {
  startAt: number;
  duration: number;
  easing: Easing;
  from: number;
  to: number;
  onUpdate(value: number, progress: number): void;
  onComplete?(): void;
  cancelled: boolean;
  finished: boolean;
}

const jobs = new Set<Job>();
let rafId = 0;

let reducedMotion = false;
let instant = false;

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  reducedMotion = mq.matches;
  const onChange = (e: MediaQueryListEvent): void => {
    reducedMotion = e.matches;
  };
  if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onChange);
}

/**
 * Forced by the screenshot harness. A captured frame must never depend on how
 * long the software rasteriser took to get there, so under `deterministic` all
 * motion resolves to its end state in the same tick it is requested.
 */
export function setInstant(value: boolean): void {
  instant = value;
}

export function isReducedMotion(): boolean {
  return reducedMotion || instant;
}

/** Scale a nominal duration by the current motion policy. */
export function scaled(ms: number): number {
  return isReducedMotion() ? 0 : ms;
}

function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

function pump(): void {
  rafId = 0;
  const t = now();
  for (const job of Array.from(jobs)) {
    if (job.cancelled) {
      jobs.delete(job);
      continue;
    }
    const elapsed = t - job.startAt;
    if (elapsed < 0) continue;
    const p = job.duration <= 0 ? 1 : Math.min(1, elapsed / job.duration);
    const eased = job.easing(p);
    job.onUpdate(job.from + (job.to - job.from) * eased, p);
    if (p >= 1) {
      job.finished = true;
      jobs.delete(job);
      job.onComplete?.();
    }
  }
  if (jobs.size > 0 && rafId === 0) rafId = requestAnimationFrame(pump);
}

function schedule(): void {
  if (rafId === 0 && jobs.size > 0) rafId = requestAnimationFrame(pump);
}

/** Core tween. Returns a handle you can cancel or fast-forward. */
export function animate(options: TweenOptions): Handle {
  const from = options.from ?? 0;
  const to = options.to ?? 1;
  const easing = options.easing ?? Ease.outQuint;
  const duration = isReducedMotion() ? 0 : Math.max(0, options.duration ?? Dur.base);
  const delay = isReducedMotion() ? 0 : Math.max(0, options.delay ?? 0);

  if (duration === 0 && delay === 0) {
    options.onUpdate(to, 1);
    options.onComplete?.();
    return { cancel: () => {}, finish: () => {}, done: true };
  }

  const job: Job = {
    startAt: now() + delay,
    duration,
    easing,
    from,
    to,
    onUpdate: options.onUpdate,
    onComplete: options.onComplete,
    cancelled: false,
    finished: false,
  };
  // Paint the start state immediately so a delayed entrance does not flash at
  // its resting position for one frame before the delay expires.
  options.onUpdate(from, 0);
  jobs.add(job);
  schedule();

  return {
    cancel(): void {
      job.cancelled = true;
      jobs.delete(job);
    },
    finish(): void {
      if (job.cancelled || job.finished) return;
      job.cancelled = true;
      jobs.delete(job);
      job.onUpdate(job.to, 1);
      job.onComplete?.();
    },
    get done(): boolean {
      return job.finished || job.cancelled;
    },
  };
}

/**
 * One tween per element per channel. Retriggering `slide` on an element that is
 * mid-slide retargets from wherever it is instead of stacking two writers on
 * the same style property.
 */
const channels = new WeakMap<Element, Map<string, Handle>>();

export function claim(el: Element, channel: string, handle: Handle): Handle {
  let map = channels.get(el);
  if (!map) {
    map = new Map();
    channels.set(el, map);
  }
  map.get(channel)?.cancel();
  map.set(channel, handle);
  return handle;
}

export function release(el: Element, channel?: string): void {
  const map = channels.get(el);
  if (!map) return;
  if (channel) {
    map.get(channel)?.cancel();
    map.delete(channel);
    return;
  }
  for (const h of map.values()) h.cancel();
  map.clear();
}

export interface EnterOptions {
  /** Vertical offset in px the element travels from. */
  y?: number;
  x?: number;
  /** Start scale; 1 disables the scale channel. */
  scale?: number;
  /** Start blur in px. Used sparingly; blur is expensive. */
  blur?: number;
  duration?: number;
  delay?: number;
  easing?: Easing;
  onComplete?(): void;
}

/**
 * Canonical entrance: opacity plus a short travel, decelerating hard. The
 * opacity ramp is deliberately front-loaded relative to the travel (the element
 * is fully opaque at 60% of the distance) so it reads as arriving rather than
 * fading.
 */
export function enter(el: HTMLElement, options: EnterOptions = {}): Handle {
  const y = options.y ?? 12;
  const x = options.x ?? 0;
  const scale = options.scale ?? 1;
  const blur = options.blur ?? 0;
  const handle = animate({
    duration: options.duration ?? Dur.entrance,
    delay: options.delay ?? 0,
    easing: options.easing ?? Ease.outExpo,
    onUpdate: (v) => {
      const inv = 1 - v;
      const tx = x * inv;
      const ty = y * inv;
      const s = scale + (1 - scale) * v;
      el.style.opacity = String(Math.min(1, v / 0.6));
      el.style.transform =
        s === 1 ? `translate3d(${tx.toFixed(3)}px, ${ty.toFixed(3)}px, 0)`
          : `translate3d(${tx.toFixed(3)}px, ${ty.toFixed(3)}px, 0) scale(${s.toFixed(4)})`;
      if (blur > 0) el.style.filter = inv < 0.01 ? '' : `blur(${(blur * inv).toFixed(2)}px)`;
    },
    onComplete: () => {
      el.style.transform = '';
      el.style.opacity = '';
      if (blur > 0) el.style.filter = '';
      options.onComplete?.();
    },
  });
  return claim(el, 'enter', handle);
}

/** Exit is faster than entrance and accelerates. Leaving should feel decisive. */
export function exit(el: HTMLElement, options: EnterOptions = {}): Handle {
  const y = options.y ?? -8;
  const scale = options.scale ?? 1;
  const handle = animate({
    duration: options.duration ?? Dur.fast,
    delay: options.delay ?? 0,
    easing: options.easing ?? Ease.inCubic,
    onUpdate: (v) => {
      const s = 1 + (scale - 1) * v;
      el.style.opacity = String(1 - v);
      el.style.transform = `translate3d(0, ${(y * v).toFixed(3)}px, 0) scale(${s.toFixed(4)})`;
    },
    onComplete: () => options.onComplete?.(),
  });
  return claim(el, 'enter', handle);
}

/**
 * Staggered entrance. The gap shrinks as the list grows so a 40 item list does
 * not take four seconds to arrive; total stagger is capped.
 */
export function stagger(
  els: readonly HTMLElement[],
  options: EnterOptions & { gap?: number; maxTotal?: number } = {}
): void {
  const gap = options.gap ?? 42;
  const maxTotal = options.maxTotal ?? 420;
  const effective = els.length > 1 ? Math.min(gap, maxTotal / (els.length - 1)) : 0;
  els.forEach((node, i) => {
    enter(node, { ...options, delay: (options.delay ?? 0) + effective * i });
  });
}

/**
 * Counts a numeric readout up to its new value. Used for the acquisition price
 * so a protocol update reads as a change rather than a silent swap.
 */
export function countTo(
  el: HTMLElement,
  from: number,
  to: number,
  format: (n: number) => string,
  duration = Dur.reveal
): Handle {
  const handle = animate({
    from,
    to,
    duration,
    easing: Ease.outExpo,
    onUpdate: (v) => {
      el.textContent = format(v);
    },
    onComplete: () => {
      el.textContent = format(to);
    },
  });
  return claim(el, 'count', handle);
}

/**
 * Tweens a CSS custom property on an element between 0 and 1. Lets CSS own the
 * visual mapping (colour, width, glow) while JS owns the timing curve.
 */
export function tweenVar(
  el: HTMLElement,
  name: string,
  from: number,
  to: number,
  options: { duration?: number; delay?: number; easing?: Easing; precision?: number } = {}
): Handle {
  const precision = options.precision ?? 4;
  const handle = animate({
    from,
    to,
    duration: options.duration ?? Dur.base,
    delay: options.delay ?? 0,
    easing: options.easing ?? Ease.outQuint,
    onUpdate: (v) => el.style.setProperty(name, v.toFixed(precision)),
  });
  return claim(el, `var:${name}`, handle);
}

/** Reads the current numeric value of a custom property, for interruption. */
export function readVar(el: HTMLElement, name: string, fallback = 0): number {
  const raw = el.style.getPropertyValue(name).trim();
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

/** Cancels every in-flight tween. Used on dispose. */
export function stopAll(): void {
  for (const job of jobs) job.cancelled = true;
  jobs.clear();
  if (rafId !== 0) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
}
