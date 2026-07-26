import type { Pipeline } from '../post/pipeline';
import type { AppContext, FrameTime } from './types';

/**
 * Screenshot harness. Drives the app into a named, reproducible state and then
 * flags readiness so the capture tool can shoot the exact same frame every run.
 *
 * Any system can register a shot handler; the tool in tools/shoot.mjs walks the
 * registry so new states become capturable without touching the tool.
 */
export interface ShotHandler {
  /** Set up the state. Resolve when the state is applied (not yet settled). */
  apply(): void | Promise<void>;
  /** Frames of simulated settling before capture. */
  settleFrames?: number;
}

declare global {
  interface Window {
    __harness?: {
      shots: string[];
      goto(name: string): Promise<void>;
      ready: boolean;
    };
  }
}

const handlers = new Map<string, ShotHandler>();

/**
 * When true the main loop stops stepping. A live requestAnimationFrame loop
 * keeps the compositor perpetually busy, which makes the capture tool wait
 * forever for a stable frame, so a shot ends by freezing the exact frame that
 * was reviewed. preserveDrawingBuffer keeps the last render readable.
 */
export const harnessState = {
  frozen: false,
  /** Set by main.ts so the harness can restart the loop after a freeze. */
  resume: () => {},
};

/** Systems call this at construction time to expose a capturable state. */
export function registerShot(name: string, handler: ShotHandler): void {
  handlers.set(name, handler);
}

export function createDebugHarness(ctx: AppContext, pipeline: Pipeline, time: FrameTime): void {
  void pipeline;

  registerShot('idle', { apply: () => {}, settleFrames: 90 });

  const waitFrames = (n: number) =>
    new Promise<void>((resolve) => {
      const start = time.frame;
      const tick = () => {
        if (time.frame - start >= n) resolve();
        else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });

  const api = {
    shots: [] as string[],
    ready: false,
    async goto(name: string): Promise<void> {
      api.ready = false;
      const h = handlers.get(name);
      if (!h) throw new Error(`unknown shot: ${name}`);
      harnessState.frozen = false;
      harnessState.resume();
      await h.apply();
      await waitFrames(h.settleFrames ?? 60);
      harnessState.frozen = true;
      api.ready = true;
    },
  };
  Object.defineProperty(api, 'shots', { get: () => Array.from(handlers.keys()) });
  window.__harness = api;

  const requested = new URLSearchParams(location.search).get('shot');
  if (requested) {
    // Give one frame for every system to finish first-frame construction.
    requestAnimationFrame(() => void api.goto(requested));
  }
}
