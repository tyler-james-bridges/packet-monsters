import type { CardRecord } from '../core/types';
import { networkLabel, priceOf, typeNameOf } from '../data/cards';
import { hashSeed } from '../core/rng';
import { drawArtwork } from './cardArt';
import {
  chamferRect,
  drawTracked,
  fitFont,
  font,
  FONT_MONO,
  FONT_SANS,
  linear,
  makeSurface,
  measureTracked,
  radial,
  roundRect,
  truncateMiddle,
  type Ctx2D,
  type Surface,
} from './canvas2d';
import { clamp01, fbm, range, rngFrom, smoothstep, type Rng } from './noise';
import {
  clampRarity,
  isGhost,
  mixHex,
  rgba,
  RARITY_STYLES,
  TYPE_STYLES,
  type RarityStyle,
  type TypeStyle,
} from './palette';

/**
 * The printed face.
 *
 * Composed at 63:88, the real trading card ratio. The default is 1024 x 1434;
 * lower quality tiers compose at the same layout on a smaller sheet so the
 * proportions never move, only the sampling.
 *
 * Two surfaces come out of here: the colour plate, and a single-channel foil
 * plate that says where the holographic layer was laid down. They are merged
 * into one RGBA upload (colour in RGB, foil mask in A) so a card costs exactly
 * one texture.
 */

export const FACE_ASPECT = 63 / 88;

export interface FacePlates {
  color: Surface;
  foil: Surface;
}

interface Layout {
  W: number;
  H: number;
  k: number; // scale factor against the 1024 reference
  pad: number;
  inner: Rect;
  name: Rect;
  art: Rect;
  chips: Rect;
  stats: Rect;
  price: Rect;
  host: Rect;
  footer: Rect;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function r(x: number, y: number, w: number, h: number): Rect {
  return { x, y, w, h };
}

function layout(W: number): Layout {
  const k = W / 1024;
  const H = Math.round((W * 88) / 63);
  const pad = 36 * k;
  const inner = r(pad, pad, W - pad * 2, H - pad * 2);
  const x0 = inner.x + 22 * k;
  const w0 = inner.w - 44 * k;
  return {
    W,
    H,
    k,
    pad,
    inner,
    name: r(x0, inner.y + 10 * k, w0, 94 * k),
    art: r(x0, inner.y + 116 * k, w0, 690 * k),
    chips: r(x0, inner.y + 818 * k, w0, 58 * k),
    stats: r(x0, inner.y + 888 * k, w0, 172 * k),
    price: r(x0, inner.y + 1072 * k, w0, 108 * k),
    host: r(x0, inner.y + 1192 * k, w0, 88 * k),
    footer: r(x0, inner.y + 1292 * k, w0, 60 * k),
  };
}

/** A woven guilloche field, the security print that makes a card feel expensive. */
function guilloche(ctx: Ctx2D, rect: Rect, seed: number, color: string, alpha: number, k: number): void {
  const rng = rngFrom(seed);
  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.9 * k;
  const cx = rect.x + rect.w * 0.5;
  const cy = rect.y + rect.h * 0.5;
  const R = Math.hypot(rect.w, rect.h) * 0.5;
  const bands = 4;
  for (let b = 0; b < bands; b++) {
    const kA = 2 + Math.floor(rng() * 5);
    const kB = 3 + Math.floor(rng() * 9);
    const rA = R * range(rng, 0.45, 0.8);
    const rB = R * range(rng, 0.08, 0.28);
    const phase = rng() * Math.PI * 2;
    const copies = 5;
    for (let c = 0; c < copies; c++) {
      const off = (c / copies) * Math.PI * 2 * 0.02;
      ctx.beginPath();
      const steps = 420;
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2;
        const x = cx + Math.cos(kA * t + phase + off) * rA + Math.cos(kB * t + off) * rB;
        const y = cy + Math.sin(kA * t + phase + off) * rA * 1.3 + Math.sin(kB * t + off) * rB;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

/** Small vector mark per elemental type. Hand-placed, not a font glyph. */
function typeGlyph(ctx: Ctx2D, cx: number, cy: number, s: number, ts: TypeStyle, color: string): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = s * 0.15;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  switch (ts.motif) {
    case 'bolt':
      ctx.beginPath();
      ctx.moveTo(s * 0.18, -s);
      ctx.lineTo(-s * 0.42, s * 0.08);
      ctx.lineTo(s * 0.02, s * 0.08);
      ctx.lineTo(-s * 0.18, s);
      ctx.lineTo(s * 0.5, -s * 0.14);
      ctx.lineTo(s * 0.06, -s * 0.14);
      ctx.closePath();
      ctx.fill();
      break;
    case 'mist':
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(-s, i * s * 0.5);
        ctx.bezierCurveTo(-s * 0.3, i * s * 0.5 - s * 0.42, s * 0.3, i * s * 0.5 + s * 0.42, s, i * s * 0.5);
        ctx.stroke();
      }
      break;
    case 'filament':
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.78, 0.5, 4.4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.34, 2.2, 5.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.14, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'crystal':
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(a) * s;
        const y = Math.sin(a) * s;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(-Math.cos(a) * s * 0.8, -Math.sin(a) * s * 0.8);
        ctx.lineTo(Math.cos(a) * s * 0.8, Math.sin(a) * s * 0.8);
        ctx.stroke();
      }
      break;
    case 'orbit':
      ctx.beginPath();
      ctx.ellipse(0, 0, s, s * 0.36, -0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 0, s, s * 0.36, 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.24, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'grid':
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(-s, i * s * 0.55);
        ctx.lineTo(s, i * s * 0.55);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(i * s * 0.55, -s);
        ctx.lineTo(i * s * 0.55, s);
        ctx.stroke();
      }
      break;
    case 'decay':
      ctx.beginPath();
      ctx.arc(0, -s * 0.15, s * 0.72, Math.PI, 0);
      ctx.lineTo(s * 0.72, s * 0.6);
      ctx.lineTo(s * 0.36, s * 0.3);
      ctx.lineTo(0, s * 0.6);
      ctx.lineTo(-s * 0.36, s * 0.3);
      ctx.lineTo(-s * 0.72, s * 0.6);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-s * 0.3, -s * 0.18, s * 0.13, 0, Math.PI * 2);
      ctx.arc(s * 0.3, -s * 0.18, s * 0.13, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
  ctx.restore();
}

function bevelPanel(
  ctx: Ctx2D,
  rect: Rect,
  rs: RarityStyle,
  k: number,
  opts: { chamfer?: number; fillTop?: string; fillBottom?: string; edge?: string } = {}
): void {
  const c = opts.chamfer ?? 14 * k;
  chamferRect(ctx, rect.x, rect.y, rect.w, rect.h, c, [false, true, true, false]);
  ctx.fillStyle = linear(ctx, rect.x, rect.y, rect.x, rect.y + rect.h, [
    [0, opts.fillTop ?? mixHex(rs.stock, '#ffffff', 0.09)],
    [1, opts.fillBottom ?? rs.stockLo],
  ]);
  ctx.fill();
  ctx.strokeStyle = opts.edge ?? rgba(rs.frameHi, 0.35);
  ctx.lineWidth = 1.6 * k;
  ctx.stroke();
  // Inner top highlight: light rakes across a printed panel from above.
  ctx.save();
  chamferRect(ctx, rect.x, rect.y, rect.w, rect.h, c, [false, true, true, false]);
  ctx.clip();
  ctx.fillStyle = linear(ctx, rect.x, rect.y, rect.x, rect.y + rect.h * 0.4, [
    [0, 'rgba(255,255,255,0.10)'],
    [1, 'rgba(255,255,255,0)'],
  ]);
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.restore();
}

function statRow(
  ctx: Ctx2D,
  rect: Rect,
  label: string,
  value: string,
  frac: number,
  ts: TypeStyle,
  rs: RarityStyle,
  k: number
): void {
  const cy = rect.y + rect.h * 0.5;
  ctx.fillStyle = rgba(rs.ink, 0.72);
  ctx.font = font(21 * k, 700, FONT_MONO);
  drawTracked(ctx, label, rect.x, cy + 7 * k, 2.6 * k);

  const barX = rect.x + 128 * k;
  const barW = rect.w - 128 * k - 128 * k;
  const barH = 13 * k;
  const barY = cy - barH * 0.5;

  roundRect(ctx, barX, barY, barW, barH, barH * 0.5);
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fill();
  ctx.strokeStyle = rgba(rs.frameHi, 0.16);
  ctx.lineWidth = 1 * k;
  ctx.stroke();

  const fw = Math.max(barH, barW * clamp01(frac));
  roundRect(ctx, barX, barY, fw, barH, barH * 0.5);
  ctx.fillStyle = linear(ctx, barX, barY, barX + barW, barY, [
    [0, ts.secondary],
    [0.6, ts.primary],
    [1, ts.accent],
  ]);
  ctx.fill();

  // Segment ticks. A continuous bar reads as a progress bar; a ticked bar reads
  // as a printed scale.
  ctx.save();
  roundRect(ctx, barX, barY, barW, barH, barH * 0.5);
  ctx.clip();
  ctx.globalCompositeOperation = 'destination-out';
  for (let i = 1; i < 20; i++) {
    const x = barX + (i / 20) * barW;
    ctx.fillRect(x - 1.1 * k, barY, 2.2 * k, barH);
  }
  ctx.restore();
  ctx.globalCompositeOperation = 'source-over';

  ctx.fillStyle = rs.ink;
  ctx.font = font(30 * k, 700, FONT_MONO);
  const vw = ctx.measureText(value).width;
  ctx.fillText(value, rect.x + rect.w - vw, cy + 10 * k);
}

function chip(
  ctx: Ctx2D,
  x: number,
  y: number,
  h: number,
  text: string,
  fill: string | CanvasGradient,
  ink: string,
  k: number,
  glyph?: (cx: number, cy: number, s: number) => void
): number {
  ctx.font = font(h * 0.42, 700, FONT_SANS);
  const tw = measureTracked(ctx, text, 2.2 * k);
  const gw = glyph ? h * 0.78 : 0;
  const w = tw + gw + h * 0.86;
  roundRect(ctx, x, y, w, h, h * 0.5);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.lineWidth = 1.2 * k;
  ctx.stroke();
  if (glyph) glyph(x + h * 0.44 + gw * 0.3, y + h * 0.5, h * 0.24);
  ctx.fillStyle = ink;
  ctx.font = font(h * 0.42, 700, FONT_SANS);
  drawTracked(ctx, text, x + h * 0.43 + gw, y + h * 0.5 + h * 0.16, 2.2 * k);
  return w;
}

/** Deterministic per-card noise seed derived from the endpoint hash. */
export function cardSeed(card: CardRecord): number {
  return hashSeed(`${card.urlHash}|${card.id}|${card.host}`);
}

export function composeFace(card: CardRecord, W = 1024): FacePlates {
  const L = layout(W);
  const { k, H } = L;
  const rar = clampRarity(card.rarity);
  const rs = RARITY_STYLES[rar];
  const ts = TYPE_STYLES[typeNameOf(card)];
  const ghost = isGhost(card);
  const seed = cardSeed(card);
  const rng = rngFrom(seed ^ 0x5bf03635);

  const color = makeSurface(W, H, true);
  const foil = makeSurface(W, H, false);
  const c = color.ctx;
  const f = foil.ctx;

  // ======================= colour plate =================================
  c.fillStyle = '#000000';
  c.fillRect(0, 0, W, H);

  // Bleed border: the ink that reaches the cut, tinted by rarity metal.
  c.fillStyle = linear(c, 0, 0, W, H, [
    [0, mixHex(rs.frameLo, '#000000', 0.55)],
    [0.5, mixHex(rs.frameLo, '#000000', 0.72)],
    [1, mixHex(rs.frameLo, '#000000', 0.4)],
  ]);
  c.fillRect(0, 0, W, H);

  // Card stock body.
  roundRect(c, L.pad * 0.36, L.pad * 0.36, W - L.pad * 0.72, H - L.pad * 0.72, 26 * k);
  c.fillStyle = linear(c, 0, L.pad, 0, H - L.pad, [
    [0, mixHex(rs.stock, ts.deep, 0.35)],
    [0.42, rs.stock],
    [1, rs.stockLo],
  ]);
  c.fill();

  // Security print behind everything.
  guilloche(c, r(0, 0, W, H), seed + 17, rs.frameHi, rar >= 3 ? 0.09 : 0.055, k);

  // Metal frame band.
  const fx = L.pad * 0.72;
  const frameRect = r(fx, fx, W - fx * 2, H - fx * 2);
  roundRect(c, frameRect.x, frameRect.y, frameRect.w, frameRect.h, 22 * k);
  c.strokeStyle = linear(c, frameRect.x, frameRect.y, frameRect.x + frameRect.w, frameRect.y + frameRect.h, [
    [0, rs.frameLo],
    [0.22, rs.frameHi],
    [0.4, rs.frame],
    [0.62, rs.frameHi],
    [0.8, rs.frameLo],
    [1, rs.frame],
  ]);
  c.lineWidth = 13 * k;
  c.stroke();
  // Engraved hairline inside the metal.
  roundRect(c, frameRect.x, frameRect.y, frameRect.w, frameRect.h, 22 * k);
  c.strokeStyle = 'rgba(0,0,0,0.5)';
  c.lineWidth = 1.4 * k;
  c.stroke();
  roundRect(c, frameRect.x - 6.5 * k, frameRect.y - 6.5 * k, frameRect.w + 13 * k, frameRect.h + 13 * k, 28 * k);
  c.strokeStyle = rgba(rs.frameHi, 0.5);
  c.lineWidth = 1.2 * k;
  c.stroke();

  // Type wash: the whole card carries a hint of the elemental colour.
  c.save();
  roundRect(c, L.pad * 0.36, L.pad * 0.36, W - L.pad * 0.72, H - L.pad * 0.72, 26 * k);
  c.clip();
  c.globalCompositeOperation = 'lighter';
  c.fillStyle = radial(c, W * 0.5, L.art.y + L.art.h * 0.5, 0, W * 0.9, [
    [0, rgba(ts.primary, 0.1)],
    [1, rgba(ts.primary, 0)],
  ]);
  c.fillRect(0, 0, W, H);
  c.globalCompositeOperation = 'source-over';
  c.restore();

  // ---- name plate --------------------------------------------------------
  bevelPanel(c, L.name, rs, k, {
    fillTop: mixHex(ts.primary, ts.deep, 0.55),
    fillBottom: mixHex(ts.deep, rs.stockLo, 0.72),
    edge: rgba(rs.frameHi, 0.6),
  });

  const nameText = card.name.toUpperCase();
  const hpText = String(card.hp);
  c.font = font(34 * k, 700, FONT_MONO);
  const hpNumW = c.measureText(hpText).width;
  c.font = font(19 * k, 700, FONT_SANS);
  const hpLabW = measureTracked(c, 'HP', 3 * k);
  const hpBlock = hpNumW + hpLabW + 14 * k;

  const nameMax = L.name.w - 40 * k - hpBlock - 24 * k;
  const namePx = fitFont(c, nameText, nameMax, (px) => font(px, 700, FONT_SANS), 52 * k, 22 * k, 1.6 * k);
  c.fillStyle = 'rgba(0,0,0,0.55)';
  drawTracked(c, nameText, L.name.x + 20 * k + 1.5 * k, L.name.y + L.name.h * 0.5 + namePx * 0.36 + 1.5 * k, 1.6 * k);
  c.fillStyle = ghost ? mixHex(rs.ink, ts.primary, 0.4) : '#ffffff';
  c.font = font(namePx, 700, FONT_SANS);
  drawTracked(c, nameText, L.name.x + 20 * k, L.name.y + L.name.h * 0.5 + namePx * 0.36, 1.6 * k);

  const hpRight = L.name.x + L.name.w - 20 * k;
  c.font = font(34 * k, 700, FONT_MONO);
  c.fillStyle = ghost ? '#8fb0a6' : '#ffffff';
  c.fillText(hpText, hpRight - hpNumW, L.name.y + L.name.h * 0.5 + 12 * k);
  c.font = font(19 * k, 700, FONT_SANS);
  c.fillStyle = rgba(rs.ink, 0.75);
  drawTracked(c, 'HP', hpRight - hpNumW - hpLabW - 10 * k, L.name.y + L.name.h * 0.5 + 11 * k, 3 * k);

  // ---- art window --------------------------------------------------------
  drawArtwork(color, L.art, card, ts, rs, seed, ghost);

  // Window frame: a recessed metal surround with a cast shadow inward.
  c.save();
  roundRect(c, L.art.x, L.art.y, L.art.w, L.art.h, 10 * k);
  c.clip();
  c.strokeStyle = 'rgba(0,0,0,0.75)';
  c.lineWidth = 10 * k;
  roundRect(c, L.art.x, L.art.y, L.art.w, L.art.h, 10 * k);
  c.stroke();
  c.restore();
  roundRect(c, L.art.x - 5 * k, L.art.y - 5 * k, L.art.w + 10 * k, L.art.h + 10 * k, 13 * k);
  c.strokeStyle = linear(c, L.art.x, L.art.y, L.art.x + L.art.w, L.art.y + L.art.h, [
    [0, rs.frameHi],
    [0.5, rs.frameLo],
    [1, rs.frame],
  ]);
  c.lineWidth = 6 * k;
  c.stroke();

  // Set number, printed into the lower right of the art window like a plate mark.
  c.font = font(17 * k, 700, FONT_MONO);
  c.fillStyle = 'rgba(255,255,255,0.62)';
  const setMark = `${String(card.id).padStart(3, '0')}/090`;
  const smw = measureTracked(c, setMark, 2 * k);
  c.fillStyle = 'rgba(0,0,0,0.5)';
  roundRect(c, L.art.x + L.art.w - smw - 26 * k, L.art.y + L.art.h - 34 * k, smw + 18 * k, 24 * k, 4 * k);
  c.fill();
  c.fillStyle = 'rgba(255,255,255,0.72)';
  drawTracked(c, setMark, L.art.x + L.art.w - smw - 17 * k, L.art.y + L.art.h - 16 * k, 2 * k);

  // ---- chips -------------------------------------------------------------
  {
    const y = L.chips.y;
    const h = L.chips.h;
    let x = L.chips.x;
    x +=
      chip(
        c,
        x,
        y,
        h,
        ts.label,
        linear(c, x, y, x, y + h, [
          [0, ts.primary],
          [1, mixHex(ts.secondary, '#000000', 0.25)],
        ]),
        ts.onPrimary,
        k,
        (gx, gy, s) => typeGlyph(c, gx, gy, s, ts, ts.onPrimary)
      ) +
      12 * k;
    x +=
      chip(c, x, y, h, networkLabel(card.network), 'rgba(255,255,255,0.06)', rgba(rs.ink, 0.9), k) + 12 * k;
    const statusText = card.alive ? 'LIVE' : 'NO RESPONSE';
    chip(
      c,
      x,
      y,
      h,
      statusText,
      card.alive ? 'rgba(60,220,150,0.16)' : 'rgba(230,80,80,0.16)',
      card.alive ? '#9dffd0' : '#ffb3b3',
      k
    );
  }

  // ---- stat block --------------------------------------------------------
  bevelPanel(c, L.stats, rs, k, { chamfer: 18 * k });
  {
    const rowH = (L.stats.h - 18 * k) / 3;
    const inset = 22 * k;
    const rr = r(L.stats.x + inset, L.stats.y + 9 * k, L.stats.w - inset * 2, rowH);
    statRow(c, rr, 'ATK', String(card.attack), card.attack / 100, ts, rs, k);
    statRow(
      c,
      r(rr.x, rr.y + rowH, rr.w, rowH),
      'SPD',
      String(card.speed),
      card.speed / 100,
      ts,
      rs,
      k
    );
    statRow(
      c,
      r(rr.x, rr.y + rowH * 2, rr.w, rowH),
      'LAT',
      `${card.latencyMs}ms`,
      1 - smoothstep(0, 1600, card.latencyMs),
      ts,
      rs,
      k
    );
  }

  // ---- price panel -------------------------------------------------------
  bevelPanel(c, L.price, rs, k, {
    chamfer: 18 * k,
    fillTop: mixHex(rs.stock, rs.frameLo, 0.4),
    fillBottom: rs.stockLo,
  });
  {
    const px = L.price.x + 24 * k;
    c.font = font(19 * k, 700, FONT_SANS);
    c.fillStyle = rgba(rs.ink, 0.6);
    drawTracked(c, 'ACQUISITION', px, L.price.y + 32 * k, 4 * k);

    const priceText = `$${card.priceUsd}`;
    const ppx = fitFont(c, priceText, L.price.w * 0.56, (p) => font(p, 700, FONT_MONO), 62 * k, 26 * k, 0);
    c.fillStyle = 'rgba(0,0,0,0.6)';
    c.fillText(priceText, px + 2 * k, L.price.y + 88 * k + 2 * k);
    c.font = font(ppx, 700, FONT_MONO);
    c.fillStyle = linear(c, px, L.price.y + 40 * k, px, L.price.y + 92 * k, [
      [0, '#ffffff'],
      [1, rs.frame],
    ]);
    c.fillText(priceText, px, L.price.y + 88 * k);

    c.font = font(18 * k, 700, FONT_MONO);
    c.fillStyle = rgba(rs.ink, 0.55);
    const per = 'PER CALL / x402';
    const pw = measureTracked(c, per, 2.4 * k);
    drawTracked(c, per, L.price.x + L.price.w - pw - 24 * k, L.price.y + 34 * k, 2.4 * k);

    // Backing tier, straight from the record: price times rarity is what the
    // vault weights on, so it belongs on the card.
    const usd = priceOf(card);
    const tier = usd >= 1 ? 'TIER I' : usd >= 0.1 ? 'TIER II' : usd >= 0.01 ? 'TIER III' : 'TIER IV';
    c.font = font(26 * k, 700, FONT_SANS);
    c.fillStyle = rgba(rs.frame, 0.9);
    const tw2 = measureTracked(c, tier, 3 * k);
    drawTracked(c, tier, L.price.x + L.price.w - tw2 - 24 * k, L.price.y + 84 * k, 3 * k);
  }

  // ---- host / status -----------------------------------------------------
  {
    const hy = L.host.y;
    c.font = font(17 * k, 700, FONT_SANS);
    c.fillStyle = rgba(rs.ink, 0.5);
    drawTracked(c, 'ENDPOINT', L.host.x + 2 * k, hy + 20 * k, 4 * k);

    c.font = font(25 * k, 400, FONT_MONO);
    c.fillStyle = rgba(rs.ink, 0.94);
    c.fillText(truncateMiddle(c, card.host, L.host.w - 8 * k), L.host.x + 2 * k, hy + 52 * k);

    c.font = font(17 * k, 400, FONT_MONO);
    c.fillStyle = rgba(card.alive ? ts.primary : '#c98d8d', 0.8);
    const line2 = card.alive
      ? `HTTP 402 PAYMENT REQUIRED · SETTLES ON ${networkLabel(card.network)}`
      : `NO RESPONSE · LAST SEEN ON ${networkLabel(card.network)}`;
    c.fillText(truncateMiddle(c, line2, L.host.w - 8 * k), L.host.x + 2 * k, hy + 80 * k);

    c.strokeStyle = rgba(rs.frameHi, 0.2);
    c.lineWidth = 1 * k;
    c.beginPath();
    c.moveTo(L.host.x, hy + 62 * k);
    c.lineTo(L.host.x + L.host.w, hy + 62 * k);
    c.stroke();
  }

  // ---- footer ------------------------------------------------------------
  {
    const fy = L.footer.y;
    const cyF = fy + 26 * k;
    // Rarity pips.
    let px = L.footer.x + 2 * k;
    for (let i = 0; i < 5; i++) {
      const on = i < rs.pips;
      c.save();
      c.translate(px + 11 * k, cyF);
      c.rotate(Math.PI * 0.25);
      const sz = 9 * k;
      c.beginPath();
      c.rect(-sz, -sz, sz * 2, sz * 2);
      if (on) {
        c.fillStyle = linear(c, -sz, -sz, sz, sz, [
          [0, rs.frameHi],
          [1, rs.frame],
        ]);
        c.fill();
      }
      c.strokeStyle = on ? rgba(rs.frameHi, 0.9) : rgba(rs.ink, 0.28);
      c.lineWidth = 1.6 * k;
      c.stroke();
      c.restore();
      px += 26 * k;
    }
    c.font = font(21 * k, 700, FONT_SANS);
    c.fillStyle = rs.frame;
    drawTracked(c, rs.label, px + 8 * k, cyF + 8 * k, 4.5 * k);

    // Foil seal, bottom right.
    const sx = L.footer.x + L.footer.w - 30 * k;
    const sy = cyF;
    const sr = 27 * k;
    c.beginPath();
    c.arc(sx, sy, sr, 0, Math.PI * 2);
    c.fillStyle = radial(c, sx - sr * 0.3, sy - sr * 0.3, 0, sr * 1.6, [
      [0, rs.frameHi],
      [0.5, rs.frame],
      [1, rs.frameLo],
    ]);
    c.fill();
    c.strokeStyle = rgba(rs.frameHi, 0.8);
    c.lineWidth = 1.6 * k;
    c.stroke();
    for (let i = 0; i < 3; i++) {
      c.beginPath();
      c.arc(sx, sy, sr * (0.78 - i * 0.16), 0, Math.PI * 2);
      c.strokeStyle = 'rgba(0,0,0,0.28)';
      c.lineWidth = 1.2 * k;
      c.stroke();
    }
    c.font = font(13 * k, 700, FONT_SANS);
    c.fillStyle = 'rgba(0,0,0,0.72)';
    const sealText = 'x402';
    const stw = measureTracked(c, sealText, 1.2 * k);
    drawTracked(c, sealText, sx - stw * 0.5, sy + 5 * k, 1.2 * k);

    // Microtext: the endpoint hash, printed at the size real security print uses.
    c.font = font(10.5 * k, 400, FONT_MONO);
    c.fillStyle = rgba(rs.ink, 0.42);
    const micro = `${card.urlHash} · ${card.host} · ${card.urlHash}`;
    c.save();
    c.beginPath();
    c.rect(L.footer.x, fy + 44 * k, L.footer.w - 70 * k, 16 * k);
    c.clip();
    drawTracked(c, micro, L.footer.x + 2 * k, fy + 55 * k, 0.3 * k);
    c.restore();
  }

  // ---- print imperfection ------------------------------------------------
  printPass(c, W, H, k, seed, rar, ghost, rng);

  // ======================= foil plate ===================================
  paintFoilMask(f, L, rs, ts, card, seed, ghost);

  return { color, foil };
}

/**
 * Registration error, ink density variation and dust. Perfectly aligned print
 * is the fastest way to make a physical object read as computer generated.
 */
function printPass(
  c: Ctx2D,
  W: number,
  H: number,
  k: number,
  seed: number,
  rarity: number,
  ghost: boolean,
  rng: Rng
): void {
  // Misregistration: a hair of cyan/magenta offset at the plate edges.
  const off = (0.9 - rarity * 0.13) * k;
  c.save();
  c.globalCompositeOperation = 'lighter';
  c.globalAlpha = 0.05;
  c.fillStyle = '#ff0044';
  c.fillRect(-off, off * 0.6, W, H);
  c.fillStyle = '#00d0ff';
  c.fillRect(off, -off * 0.6, W, H);
  c.restore();

  // Ink density mottle across the sheet.
  const mw = 96;
  const mh = Math.round((mw * H) / W);
  const m = makeSurface(mw, mh, true);
  const img = m.ctx.createImageData(mw, mh);
  for (let y = 0, i = 0; y < mh; y++) {
    for (let x = 0; x < mw; x++) {
      const n = fbm((x / mw) * 5, (y / mh) * 7, seed + 991, 4);
      const v = (n - 0.5) * 2;
      img.data[i++] = v > 0 ? 255 : 0;
      img.data[i++] = v > 0 ? 255 : 0;
      img.data[i++] = v > 0 ? 255 : 0;
      img.data[i++] = Math.abs(v) * 46;
    }
  }
  m.ctx.putImageData(img, 0, 0);
  c.save();
  c.globalCompositeOperation = 'overlay';
  c.globalAlpha = 0.5;
  c.drawImage(m.canvas, 0, 0, W, H);
  c.restore();

  // Dust and fibre specks trapped under the laminate.
  const specks = ghost ? 260 : 90;
  for (let i = 0; i < specks; i++) {
    const x = rng() * W;
    const y = rng() * H;
    const l = range(rng, 1, 7) * k;
    const a = range(rng, 0, Math.PI);
    c.strokeStyle = `rgba(${ghost ? '190,205,190' : '255,255,255'},${range(rng, 0.03, 0.14).toFixed(3)})`;
    c.lineWidth = range(rng, 0.5, 1.4) * k;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    c.stroke();
  }

  if (ghost) {
    // Edge wear: the corners of a dead card are the first thing to go.
    for (let corner = 0; corner < 4; corner++) {
      const cxp = corner % 2 === 0 ? 0 : W;
      const cyp = corner < 2 ? 0 : H;
      c.save();
      c.globalCompositeOperation = 'multiply';
      c.fillStyle = radial(c, cxp, cyp, 0, W * 0.3, [
        [0, 'rgba(120,130,120,0.75)'],
        [1, 'rgba(255,255,255,0)'],
      ]);
      c.fillRect(0, 0, W, H);
      c.restore();
    }
    c.save();
    c.globalCompositeOperation = 'lighter';
    c.fillStyle = linear(c, 0, 0, 0, H, [
      [0, 'rgba(90,220,190,0.05)'],
      [1, 'rgba(20,60,60,0.05)'],
    ]);
    c.fillRect(0, 0, W, H);
    c.restore();
  }

  // Global vignette. Every printed sheet is slightly darker at the trim.
  c.fillStyle = radial(c, W * 0.5, H * 0.44, W * 0.42, W * 1.05, [
    [0, 'rgba(0,0,0,0)'],
    [1, 'rgba(0,0,0,0.24)'],
  ]);
  c.fillRect(0, 0, W, H);
}

/**
 * The foil plate. White where the holographic layer sits, black where it does
 * not. Lower rarities foil only the marks; a legendary is a full-bleed hit with
 * a textured pattern so the interference has structure to run through.
 */
function paintFoilMask(
  f: Ctx2D,
  L: Layout,
  rs: RarityStyle,
  ts: TypeStyle,
  card: CardRecord,
  seed: number,
  ghost: boolean
): void {
  const { W, H, k } = L;
  const rng = rngFrom(seed ^ 0x2f1c8a03);
  f.fillStyle = '#000000';
  f.fillRect(0, 0, W, H);

  const spread = rs.foilSpread;
  const paint = (v: number) => `rgba(255,255,255,${clamp01(v).toFixed(3)})`;

  if (spread >= 4) {
    // Full bleed under everything, modulated so it is not a flat sheet. The
    // field value stays low on purpose: a legendary reads as expensive because
    // the foil has structure, not because the whole sheet is a mirror.
    f.fillStyle = paint(0.3);
    roundRect(f, L.pad * 0.36, L.pad * 0.36, W - L.pad * 0.72, H - L.pad * 0.72, 26 * k);
    f.fill();
    f.save();
    roundRect(f, L.pad * 0.36, L.pad * 0.36, W - L.pad * 0.72, H - L.pad * 0.72, 26 * k);
    f.clip();
    f.globalCompositeOperation = 'lighter';
    // Ray-strike texture: the classic textured legendary hit.
    const cx = W * 0.5;
    const cy = L.art.y + L.art.h * 0.45;
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      const spreadA = 0.022;
      f.beginPath();
      f.moveTo(cx, cy);
      f.arc(cx, cy, H, a - spreadA, a + spreadA);
      f.closePath();
      f.fillStyle = paint(0.1 + 0.22 * Math.abs(Math.sin(i * 2.3)));
      f.fill();
    }
    // Stamped scale pattern over the whole sheet, so the interference has a
    // designed structure to run through instead of a flat field.
    const step = 46 * k;
    for (let row = 0; row * step < H + step; row++) {
      for (let col = -1; col * step < W + step; col++) {
        const px = col * step + (row % 2 ? step * 0.5 : 0);
        const py = row * step * 0.62;
        f.beginPath();
        f.arc(px, py, step * 0.46, Math.PI * 0.1, Math.PI * 0.9);
        f.strokeStyle = paint(0.16);
        f.lineWidth = 2.2 * k;
        f.stroke();
      }
    }
    f.restore();
  }

  if (spread >= 3) {
    // Frame band and name plate.
    f.save();
    roundRect(f, L.pad * 0.72, L.pad * 0.72, W - L.pad * 1.44, H - L.pad * 1.44, 22 * k);
    f.strokeStyle = paint(1);
    f.lineWidth = 26 * k;
    f.stroke();
    f.restore();
    chamferRect(f, L.name.x, L.name.y, L.name.w, L.name.h, 14 * k);
    f.fillStyle = paint(0.66);
    f.fill();
    chamferRect(f, L.price.x, L.price.y, L.price.w, L.price.h, 18 * k);
    f.fillStyle = paint(0.6);
    f.fill();
  }

  if (spread >= 2) {
    // Art window: the holo panel. Soft edged so the foil fades under the art.
    f.save();
    roundRect(f, L.art.x, L.art.y, L.art.w, L.art.h, 10 * k);
    f.clip();
    f.fillStyle = radial(
      f,
      L.art.x + L.art.w * 0.5,
      L.art.y + L.art.h * 0.5,
      0,
      Math.max(L.art.w, L.art.h) * 0.62,
      [
        [0, paint(0.66)],
        [0.6, paint(0.52)],
        [1, paint(0.26)],
      ]
    );
    f.fillRect(L.art.x, L.art.y, L.art.w, L.art.h);
    // Cracked-ice pattern: hard-edged cells the interference can break against.
    f.globalCompositeOperation = 'lighter';
    const cells = 26;
    const sites: [number, number][] = [];
    for (let i = 0; i < cells; i++) sites.push([L.art.x + rng() * L.art.w, L.art.y + rng() * L.art.h]);
    for (const [sx, sy] of sites) {
      f.beginPath();
      const n = 5 + Math.floor(rng() * 4);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rng() * 0.4;
        const rr = (30 + rng() * 90) * k;
        const px = sx + Math.cos(a) * rr;
        const py = sy + Math.sin(a) * rr;
        if (i === 0) f.moveTo(px, py);
        else f.lineTo(px, py);
      }
      f.closePath();
      f.strokeStyle = paint(0.22);
      f.lineWidth = 2.4 * k;
      f.stroke();
    }
    f.restore();
    f.globalCompositeOperation = 'source-over';
  }

  // Marks always foiled from uncommon up: seal, pips, type chip.
  if (spread >= 1) {
    const cyF = L.footer.y + 26 * k;
    f.beginPath();
    f.arc(L.footer.x + L.footer.w - 30 * k, cyF, 30 * k, 0, Math.PI * 2);
    f.fillStyle = paint(1);
    f.fill();
    let px = L.footer.x + 2 * k;
    for (let i = 0; i < rs.pips; i++) {
      f.save();
      f.translate(px + 11 * k, cyF);
      f.rotate(Math.PI * 0.25);
      f.fillStyle = paint(1);
      f.fillRect(-10 * k, -10 * k, 20 * k, 20 * k);
      f.restore();
      px += 26 * k;
    }
    for (let i = rs.pips; i < 5; i++) px += 26 * k;
    // Type chip.
    roundRect(f, L.chips.x, L.chips.y, L.chips.h * 3.4, L.chips.h, L.chips.h * 0.5);
    f.fillStyle = paint(0.8);
    f.fill();
    // Set mark plate.
    roundRect(f, L.art.x + L.art.w - 120 * k, L.art.y + L.art.h - 34 * k, 110 * k, 24 * k, 4 * k);
    f.fillStyle = paint(0.7);
    f.fill();
  } else {
    // Commons still get a tiny hit on the seal. Even the cheapest print does.
    f.beginPath();
    f.arc(L.footer.x + L.footer.w - 30 * k, L.footer.y + 26 * k, 29 * k, 0, Math.PI * 2);
    f.fillStyle = paint(0.55);
    f.fill();
  }

  if (ghost) {
    // A dead card's foil has lifted. What survives sits in the cracks.
    f.save();
    f.globalCompositeOperation = 'destination-out';
    const fw = 128;
    const fh = Math.round((fw * H) / W);
    const m = makeSurface(fw, fh, true);
    const img = m.ctx.createImageData(fw, fh);
    for (let y = 0, i = 0; y < fh; y++) {
      for (let x = 0; x < fw; x++) {
        const n = fbm((x / fw) * 6, (y / fh) * 8, seed + 4241, 5);
        const a = clamp01((n - 0.34) * 3.4);
        img.data[i++] = 0;
        img.data[i++] = 0;
        img.data[i++] = 0;
        img.data[i++] = a * 255;
      }
    }
    m.ctx.putImageData(img, 0, 0);
    f.drawImage(m.canvas, 0, 0, W, H);
    f.restore();
  }

  if (spread >= 4) {
    // Protect the read. A full-bleed hit still knocks back where body copy
    // sits, otherwise the interference competes with the ink and the card stops
    // being a card. Real full-art printing masks the same way.
    f.save();
    f.globalCompositeOperation = 'destination-out';
    f.fillStyle = 'rgba(0,0,0,0.5)';
    chamferRect(f, L.stats.x, L.stats.y, L.stats.w, L.stats.h, 18 * k);
    f.fill();
    f.fillStyle = 'rgba(0,0,0,0.34)';
    chamferRect(f, L.price.x, L.price.y, L.price.w, L.price.h, 18 * k);
    f.fill();
    f.fillStyle = 'rgba(0,0,0,0.55)';
    f.fillRect(L.host.x - 8 * k, L.host.y - 6 * k, L.host.w + 16 * k, L.host.h + 12 * k);
    f.restore();
  }

  // Never foil right up to the trim: a laminated card always has a margin.
  f.save();
  f.globalCompositeOperation = 'destination-in';
  roundRect(f, L.pad * 0.3, L.pad * 0.3, W - L.pad * 0.6, H - L.pad * 0.6, 24 * k);
  f.fillStyle = '#ffffff';
  f.fill();
  f.restore();

  void ts;
  void card;
}
