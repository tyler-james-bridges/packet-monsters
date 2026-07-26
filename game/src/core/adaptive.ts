import type { Pipeline } from '../post/pipeline';
import { QUALITY_ORDER, qualityFor } from './quality';
import type { AppContext, FrameTime, System } from './types';

/**
 * Watches a rolling median of frame time and steps the quality tier down when
 * the frame budget is blown, or back up once there is sustained headroom.
 * Median rather than mean so a single GC spike never demotes the whole scene.
 */
export function createAdaptiveQuality(ctx: AppContext, pipeline: Pipeline): System {
  const WINDOW = 90;
  const samples: number[] = [];
  let cooldown = 3;
  let index = QUALITY_ORDER.indexOf(ctx.quality.tier);

  function applyTier(next: number): void {
    index = next;
    Object.assign(ctx.quality, qualityFor(QUALITY_ORDER[index]));
    ctx.renderer.setPixelRatio(Math.min(window.devicePixelRatio, ctx.quality.pixelRatio));
    pipeline.applyQuality();
    ctx.bus.emit('quality:changed', { settings: ctx.quality });
    cooldown = 5;
    samples.length = 0;
  }

  return {
    name: 'adaptive-quality',
    update(t: FrameTime) {
      if (ctx.deterministic) return; // never mutate quality under the shot harness
      samples.push(t.dt);
      if (samples.length < WINDOW) return;
      if (cooldown > 0) {
        cooldown--;
        samples.length = 0;
        return;
      }
      const sorted = samples.slice().sort((a, b) => a - b);
      const median = sorted[sorted.length >> 1];
      samples.length = 0;

      if (median > 1 / 45 && index > 0) applyTier(index - 1);
      else if (median < 1 / 110 && index < QUALITY_ORDER.length - 1) applyTier(index + 1);
    },
  };
}
