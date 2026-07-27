/**
 * Canvas plumbing shared by every texture composer.
 *
 * Only system font stacks are used. Nothing is fetched. The metric-compatible
 * families available in headless Chromium are listed first so a capture on the
 * shot harness lays out identically to a capture on a workstation.
 */

export type Ctx2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
export type AnyCanvas = HTMLCanvasElement | OffscreenCanvas;

/** Helvetica/Arial metrics. Liberation Sans is the headless-Chromium stand-in. */
export const FONT_SANS = '"Liberation Sans","DejaVu Sans","Helvetica Neue",Arial,sans-serif';
/** Courier metrics. Used for every number, hash and hostname on the card. */
export const FONT_MONO = '"DejaVu Sans Mono","Liberation Mono","Courier 10 Pitch",monospace';
/** Times metrics. Used only for the legendary flavour line. */
export const FONT_SERIF = '"Liberation Serif","DejaVu Serif",Georgia,serif';

export interface Surface {
  readonly canvas: AnyCanvas;
  readonly ctx: Ctx2D;
  readonly w: number;
  readonly h: number;
}

export function makeSurface(w: number, h: number, alpha = true): Surface {
  let canvas: AnyCanvas;
  if (typeof OffscreenCanvas !== 'undefined') {
    canvas = new OffscreenCanvas(w, h);
  } else {
    const el = document.createElement('canvas');
    el.width = w;
    el.height = h;
    canvas = el;
  }
  const ctx = canvas.getContext('2d', { alpha, willReadFrequently: false }) as Ctx2D | null;
  if (!ctx) throw new Error('materials: 2d context unavailable');
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  return { canvas, ctx, w, h };
}

/** Read the surface back as straight (non-premultiplied) RGBA bytes. */
export function readPixels(s: Surface): Uint8ClampedArray {
  return s.ctx.getImageData(0, 0, s.w, s.h).data;
}

export function font(px: number, weight: number | string, family: string, italic = false): string {
  return `${italic ? 'italic ' : ''}${weight} ${px.toFixed(1)}px ${family}`;
}

/**
 * Whether the engine exposes native letter spacing. Written as a plain boolean
 * rather than an `in` check at each call site: both members of Ctx2D declare
 * letterSpacing in lib.dom, so an inline `in` narrows the fallback branch to
 * never and the per-glyph path stops compiling. The runtime check is still real,
 * because the property is absent on older engines regardless of what lib says.
 */
export function hasNativeTracking(ctx: Ctx2D): boolean {
  return 'letterSpacing' in (ctx as object);
}

/** Letter spacing, when the engine exposes it. Chromium does; the guard is for safety. */
export function setTracking(ctx: Ctx2D, px: number): void {
  const c = ctx as unknown as { letterSpacing?: string };
  if (hasNativeTracking(ctx)) c.letterSpacing = `${px.toFixed(2)}px`;
}

export function clearTracking(ctx: Ctx2D): void {
  setTracking(ctx, 0);
}

/**
 * Draw text with explicit tracking, falling back to per-glyph placement when
 * the engine has no letterSpacing. The fallback keeps kerning pairs intact for
 * runs of two characters, which is enough for the all-caps labels that use it.
 */
export function drawTracked(ctx: Ctx2D, text: string, x: number, y: number, tracking: number): number {
  if (hasNativeTracking(ctx)) {
    setTracking(ctx, tracking);
    ctx.fillText(text, x, y);
    const w = ctx.measureText(text).width;
    clearTracking(ctx);
    return w;
  }
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + tracking;
  }
  return cx - x;
}

export function measureTracked(ctx: Ctx2D, text: string, tracking: number): number {
  if (hasNativeTracking(ctx)) {
    setTracking(ctx, tracking);
    const w = ctx.measureText(text).width;
    clearTracking(ctx);
    return w;
  }
  let w = 0;
  for (const ch of text) w += ctx.measureText(ch).width + tracking;
  return Math.max(0, w - tracking);
}

/**
 * Binary-search the largest size at which `text` fits `maxWidth`. Type on a
 * trading card is optically fitted, never squashed, so this changes the size
 * rather than the transform: a horizontally scaled face reads as a mistake.
 */
export function fitFont(
  ctx: Ctx2D,
  text: string,
  maxWidth: number,
  mkFont: (px: number) => string,
  maxPx: number,
  minPx: number,
  tracking = 0
): number {
  let lo = minPx;
  let hi = maxPx;
  for (let i = 0; i < 18; i++) {
    const mid = (lo + hi) * 0.5;
    ctx.font = mkFont(mid);
    if (measureTracked(ctx, text, tracking) <= maxWidth) lo = mid;
    else hi = mid;
  }
  ctx.font = mkFont(lo);
  return lo;
}

/** Truncate with a middle ellipsis, which keeps both ends of a hostname legible. */
export function truncateMiddle(ctx: Ctx2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let lo = 1;
  let hi = text.length;
  let best = text.slice(0, 1);
  while (lo <= hi) {
    const n = (lo + hi) >> 1;
    const head = Math.ceil(n * 0.55);
    const tail = n - head;
    const s = `${text.slice(0, head)}…${tail > 0 ? text.slice(text.length - tail) : ''}`;
    if (ctx.measureText(s).width <= maxWidth) {
      best = s;
      lo = n + 1;
    } else {
      hi = n - 1;
    }
  }
  return best;
}

export function roundRect(ctx: Ctx2D, x: number, y: number, w: number, h: number, r: number): void {
  const rr = Math.min(r, w * 0.5, h * 0.5);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.arcTo(x + w, y, x + w, y + rr, rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr);
  ctx.lineTo(x + rr, y + h);
  ctx.arcTo(x, y + h, x, y + h - rr, rr);
  ctx.lineTo(x, y + rr);
  ctx.arcTo(x, y, x + rr, y, rr);
  ctx.closePath();
}

/** A rectangle with the two lower corners chamfered, used for the stat panels. */
export function chamferRect(
  ctx: Ctx2D,
  x: number,
  y: number,
  w: number,
  h: number,
  c: number,
  corners: [boolean, boolean, boolean, boolean] = [false, true, true, false]
): void {
  const [tl, tr, br, bl] = corners;
  ctx.beginPath();
  ctx.moveTo(x + (tl ? c : 0), y);
  ctx.lineTo(x + w - (tr ? c : 0), y);
  if (tr) ctx.lineTo(x + w, y + c);
  ctx.lineTo(x + w, y + h - (br ? c : 0));
  if (br) ctx.lineTo(x + w - c, y + h);
  ctx.lineTo(x + (bl ? c : 0), y + h);
  if (bl) ctx.lineTo(x, y + h - c);
  ctx.lineTo(x, y + (tl ? c : 0));
  ctx.closePath();
}

/** Linear gradient helper taking stops as [offset, cssColor]. */
export function linear(
  ctx: Ctx2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  stops: [number, string][]
): CanvasGradient {
  const g = ctx.createLinearGradient(
    finite(x0, 0, 'linear x0'),
    finite(y0, 0, 'linear y0'),
    finite(x1, 1, 'linear x1'),
    finite(y1, 0, 'linear y1')
  );
  for (const [o, c] of stops) g.addColorStop(Math.min(1, Math.max(0, o)), c);
  return g;
}

/**
 * Canvas throws a hard TypeError on a non-finite gradient coordinate, which
 * would take down the whole scene because one card produced a NaN somewhere
 * upstream. A face texture is decoration; it is never worth an app crash. Sub a
 * safe value, warn so the real cause stays findable, and carry on.
 */
function finite(value: number, fallback: number, label: string): number {
  if (Number.isFinite(value)) return value;
  console.warn(`materials: non-finite ${label} (${value}), substituting ${fallback}`);
  return fallback;
}

export function radial(
  ctx: Ctx2D,
  x: number,
  y: number,
  r0: number,
  r1: number,
  stops: [number, string][]
): CanvasGradient {
  const sx = finite(x, 0, 'radial x');
  const sy = finite(y, 0, 'radial y');
  // Radii must additionally be non-negative, and r1 must exceed r0 or the
  // gradient degenerates.
  const s0 = Math.max(0, finite(r0, 0, 'radial r0'));
  const s1 = Math.max(s0 + 1e-3, finite(r1, s0 + 1, 'radial r1'));
  const g = ctx.createRadialGradient(sx, sy, s0, sx, sy, s1);
  for (const [o, c] of stops) g.addColorStop(Math.min(1, Math.max(0, o)), c);
  return g;
}
