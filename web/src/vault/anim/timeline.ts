import type { Ease } from './easing';
import { clamp01, linear } from './easing';

/**
 * A tiny keyframe sequencer.
 *
 * Tracks are authored in normalized time (0..1) and sampled against a timeline
 * whose duration is set per beat, so the same authored shape can be replayed at
 * a common's tempo or a legendary's. The `ease` on a key describes the
 * interpolation *out of* that key, which is how every DCC tool spells it and
 * which is what makes hold beats expressible: two keys with the same value and
 * a linear ease between them is a hold, and holds are half the craft.
 */
export interface Key {
  /** Normalized time, 0..1. Keys must be authored in ascending order. */
  t: number;
  v: number;
  /** Interpolation from this key to the next. Defaults to linear. */
  ease?: Ease;
}

export class Track {
  constructor(private readonly keys: readonly Key[]) {
    if (keys.length === 0) throw new Error('track needs at least one key');
  }

  at(u: number): number {
    const k = this.keys;
    const first = k[0];
    if (u <= first.t || k.length === 1) return first.v;
    const last = k[k.length - 1];
    if (u >= last.t) return last.v;
    let i = 0;
    while (i < k.length - 2 && k[i + 1].t <= u) i++;
    const a = k[i];
    const b = k[i + 1];
    const span = b.t - a.t;
    const t = span > 1e-9 ? (u - a.t) / span : 1;
    return a.v + (b.v - a.v) * (a.ease ?? linear)(t);
  }
}

interface Cue {
  at: number;
  fn: () => void;
  fired: boolean;
}

/**
 * A named bundle of tracks plus one-shot cues, advanced by dt. Deterministic:
 * the same dt sequence always produces the same values and fires the same cues
 * in the same order.
 */
export class Timeline {
  time = 0;

  private readonly tracks = new Map<string, Track>();
  private readonly cues: Cue[] = [];

  constructor(public duration: number) {}

  track(name: string, keys: readonly Key[]): this {
    this.tracks.set(name, new Track(keys));
    return this;
  }

  /** Fire once when normalized time passes `u`. */
  cue(u: number, fn: () => void): this {
    this.cues.push({ at: u, fn, fired: false });
    this.cues.sort((a, b) => a.at - b.at);
    return this;
  }

  advance(dt: number): void {
    this.time += dt;
    const u = this.u;
    for (const c of this.cues) {
      if (!c.fired && u >= c.at) {
        c.fired = true;
        c.fn();
      }
    }
  }

  /** Normalized playhead, clamped to 0..1. */
  get u(): number {
    return this.duration > 1e-9 ? clamp01(this.time / this.duration) : 1;
  }

  get done(): boolean {
    return this.time >= this.duration;
  }

  value(name: string, fallback = 0): number {
    const t = this.tracks.get(name);
    return t ? t.at(this.u) : fallback;
  }

  /** Sample a track at an arbitrary normalized time, ignoring the playhead. */
  sample(name: string, u: number, fallback = 0): number {
    const t = this.tracks.get(name);
    return t ? t.at(clamp01(u)) : fallback;
  }

  reset(duration = this.duration): this {
    this.duration = duration;
    this.time = 0;
    for (const c of this.cues) c.fired = false;
    return this;
  }
}
