import type { CardRecord } from '../core/types';
import { linear, makeSurface, radial, roundRect, type Ctx2D, type Surface } from './canvas2d';
import { clamp01, fbm, gaussian, irange, mix, pick, range, ridged, rngFrom, smoothstep, warpedFbm, type Rng } from './noise';
import { mixHex, rgba, type RarityStyle, type TypeStyle } from './palette';

/**
 * The art window.
 *
 * Everything here is generated from the card's urlHash, so a given endpoint
 * always paints the same creature. The composition is deliberately built the
 * way a concept painter builds one: a lit backdrop, atmospheric depth layers, a
 * backlit silhouette that owns the frame, then a type-specific effects pass and
 * a print pass on top. A flat gradient with a logo on it is what this is not.
 */

export interface ArtRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Low-resolution field rendered through ImageData, then upsampled smoothly. */
function fieldSurface(
  fw: number,
  fh: number,
  fn: (u: number, v: number) => [number, number, number, number]
): Surface {
  const s = makeSurface(fw, fh, true);
  const img = s.ctx.createImageData(fw, fh);
  const d = img.data;
  let i = 0;
  for (let y = 0; y < fh; y++) {
    const v = (y + 0.5) / fh;
    for (let x = 0; x < fw; x++) {
      const u = (x + 0.5) / fw;
      const [r, g, b, a] = fn(u, v);
      d[i++] = r * 255;
      d[i++] = g * 255;
      d[i++] = b * 255;
      d[i++] = a * 255;
    }
  }
  s.ctx.putImageData(img, 0, 0);
  return s;
}

function hexRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** Creature outline as a closed polar contour, mirror-symmetric about the vertical. */
function creatureContour(rng: Rng, samples: number): { t: number; r: number }[] {
  const harmonics: { k: number; a: number }[] = [];
  const kCount = irange(rng, 3, 5);
  for (let i = 0; i < kCount; i++) {
    harmonics.push({ k: irange(rng, 1, 6), a: range(rng, 0.05, 0.22) / (1 + i * 0.4) });
  }
  const lobes: { t: number; a: number; s: number }[] = [];
  const lobeCount = irange(rng, 2, 4);
  for (let i = 0; i < lobeCount; i++) {
    lobes.push({
      t: range(rng, 0.15, Math.PI * 0.95),
      a: range(rng, 0.25, 0.85),
      s: range(rng, 0.1, 0.34),
    });
  }
  // Vertical stretch: tall predatory shapes versus squat heavy ones.
  const stretch = range(rng, 0.78, 1.28);

  const half: { t: number; r: number }[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * Math.PI; // 0 = straight up, PI = straight down
    let r = 1;
    for (const h of harmonics) r += h.a * Math.cos(h.k * t);
    for (const l of lobes) {
      const d = (t - l.t) / l.s;
      r += l.a * Math.exp(-0.5 * d * d);
    }
    // Ground the shape: the bottom of the silhouette flattens as if it stands.
    r *= mix(1, 0.72, smoothstep(0.6, 1.0, t / Math.PI));
    half.push({ t, r: Math.max(0.18, r) });
  }

  const full: { t: number; r: number }[] = [];
  for (const p of half) full.push({ t: p.t, r: p.r * (1 / stretch) });
  for (let i = half.length - 2; i > 0; i--) full.push({ t: -half[i].t, r: half[i].r * (1 / stretch) });
  return full.map((p) => ({ t: p.t, r: p.r }));
}

function contourPath(ctx: Ctx2D, pts: { t: number; r: number }[], cx: number, cy: number, rx: number, ry: number): void {
  ctx.beginPath();
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    // theta measured from +Y, positive toward +X.
    const x = cx + Math.sin(p.t) * p.r * rx;
    const y = cy - Math.cos(p.t) * p.r * ry;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function bolt(
  ctx: Ctx2D,
  rng: Rng,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  spread: number,
  depth: number,
  color: string,
  width: number
): void {
  const pts: [number, number][] = [
    [x0, y0],
    [x1, y1],
  ];
  for (let d = 0; d < depth; d++) {
    const next: [number, number][] = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, ay] = pts[i];
      const [bx, by] = pts[i + 1];
      const mx = (ax + bx) * 0.5;
      const my = (ay + by) * 0.5;
      const dx = bx - ax;
      const dy = by - ay;
      const len = Math.hypot(dx, dy) || 1;
      const off = gaussian(rng) * spread * (1 / (d + 1));
      next.push([mx + (-dy / len) * off, my + (dx / len) * off]);
      next.push([bx, by]);
    }
    pts.length = 0;
    pts.push(...next);
  }
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Branches, thinner and shorter, taken from the middle third of the trunk.
  if (depth > 2) {
    const branches = irange(rng, 1, 3);
    for (let b = 0; b < branches; b++) {
      const i = irange(rng, Math.floor(pts.length * 0.25), Math.floor(pts.length * 0.75));
      const [bx, by] = pts[i];
      bolt(
        ctx,
        rng,
        bx,
        by,
        bx + gaussian(rng) * spread * 2.4,
        by + Math.abs(gaussian(rng)) * spread * 2.0,
        spread * 0.45,
        depth - 2,
        color,
        width * 0.5
      );
    }
  }
}

function frostBranch(
  ctx: Ctx2D,
  rng: Rng,
  x: number,
  y: number,
  angle: number,
  len: number,
  depth: number,
  color: string,
  width: number
): void {
  if (depth <= 0 || len < 3) return;
  const x2 = x + Math.cos(angle) * len;
  const y2 = y + Math.sin(angle) * len;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  const n = irange(rng, 2, 3);
  for (let i = 0; i < n; i++) {
    const t = range(rng, 0.35, 0.95);
    const px = mix(x, x2, t);
    const py = mix(y, y2, t);
    const side = rng() < 0.5 ? 1 : -1;
    frostBranch(
      ctx,
      rng,
      px,
      py,
      angle + side * range(rng, 0.5, 1.0),
      len * range(rng, 0.3, 0.55),
      depth - 1,
      color,
      width * 0.62
    );
  }
}

/**
 * Paint the art window. `s` is the full card surface; the artwork is clipped to
 * `rect`. Returns nothing: everything is composited in place.
 */
export function drawArtwork(
  s: Surface,
  rect: ArtRect,
  card: CardRecord,
  ts: TypeStyle,
  rs: RarityStyle,
  seed: number,
  ghost: boolean
): void {
  const { ctx } = s;
  const { x, y, w, h } = rect;
  const rng = rngFrom(seed);
  const nseed = seed >>> 3;

  ctx.save();
  roundRect(ctx, x, y, w, h, w * 0.012);
  ctx.clip();

  const [pr, pg, pb] = hexRgb(ts.primary);
  const [sr, sg, sb] = hexRgb(ts.secondary);
  const [dr, dg, db] = hexRgb(ts.deep);

  // ---- 1. Backdrop -------------------------------------------------------
  ctx.fillStyle = linear(ctx, x, y, x, y + h, [
    [0, mixHex(ts.deep, '#000000', 0.35)],
    [0.55, ts.deep],
    [1, mixHex(ts.deep, ts.secondary, 0.18)],
  ]);
  ctx.fillRect(x, y, w, h);

  // ---- 2. Atmosphere: domain-warped field, upsampled ---------------------
  const horizon = range(rng, 0.56, 0.72);
  const fw = 132;
  const fh = Math.round((fw * h) / w);
  const field = fieldSurface(fw, fh, (u, v) => {
    const n = warpedFbm(u * 3.1 + 4.7, v * 3.4 + 1.9, nseed, 1.9);
    const band = Math.exp(-Math.pow((v - horizon) * 3.6, 2));
    const cloud = clamp01((n - 0.34) * 2.2);
    const up = clamp01(1 - v / (horizon + 0.25));
    const a = clamp01(cloud * (0.32 + band * 0.75) * (0.35 + up * 0.85));
    const t = clamp01(n * 1.3);
    return [mix(dr, mix(sr, pr, t), 0.9), mix(dg, mix(sg, pg, t), 0.9), mix(db, mix(sb, pb, t), 0.9), a];
  });
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = 0.85;
  ctx.drawImage(field.canvas, x, y, w, h);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';

  // ---- 3. Key glow behind the subject ------------------------------------
  const cx = x + w * mix(0.42, 0.58, rng());
  const cy = y + h * horizon;
  const glowR = w * range(rng, 0.42, 0.6);
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = radial(ctx, cx, cy, 0, glowR, [
    [0, rgba(ts.accent, 0.85)],
    [0.22, rgba(ts.primary, 0.5)],
    [0.6, rgba(ts.secondary, 0.14)],
    [1, rgba(ts.secondary, 0)],
  ]);
  ctx.fillRect(x, y, w, h);
  ctx.globalCompositeOperation = 'source-over';

  // ---- 4. Structure: a diffraction rosette keyed to the card's numbers ----
  const rays = 12 + (card.attack % 24);
  const rings = 2 + (card.hp % 4);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = 0.5;
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2 + seed * 0.0001;
    const len = glowR * (0.9 + 0.55 * Math.sin(i * 2.7 + seed * 0.001));
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
    ctx.strokeStyle = linear(
      ctx,
      0,
      0,
      Math.cos(a) * len,
      Math.sin(a) * len,
      [
        [0, rgba(ts.accent, 0.5)],
        [1, rgba(ts.primary, 0)],
      ]
    );
    ctx.lineWidth = w * 0.0035;
    ctx.stroke();
  }
  for (let i = 0; i < rings; i++) {
    const rr = glowR * (0.36 + i * 0.24);
    ctx.beginPath();
    ctx.arc(0, 0, rr, 0, Math.PI * 2);
    ctx.strokeStyle = rgba(ts.accent, 0.2 - i * 0.035);
    ctx.lineWidth = w * (0.0022 + (i % 2) * 0.0018);
    ctx.stroke();
    // Tick marks so the ring reads as an instrument, not a circle.
    const ticks = 24 + i * 12;
    for (let k = 0; k < ticks; k++) {
      const a = (k / ticks) * Math.PI * 2;
      const t0 = rr - w * 0.008;
      const t1 = rr + w * (k % 4 === 0 ? 0.014 : 0.006);
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * t0, Math.sin(a) * t0);
      ctx.lineTo(Math.cos(a) * t1, Math.sin(a) * t1);
      ctx.strokeStyle = rgba(ts.accent, 0.22);
      ctx.lineWidth = w * 0.0016;
      ctx.stroke();
    }
  }
  ctx.restore();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';

  // ---- 5. Depth layers: far terrain reading as scale ---------------------
  for (let layer = 0; layer < 3; layer++) {
    const base = y + h * (horizon + 0.02 + layer * 0.075);
    const amp = h * (0.16 - layer * 0.04);
    const freq = 1.4 + layer * 1.7;
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    const steps = 64;
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const n = ridged(u * freq + layer * 13.3, layer * 5.5, nseed + layer * 401, 4);
      ctx.lineTo(x + u * w, base - n * amp);
    }
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    const shade = mixHex(ts.deep, '#000000', 0.15 + layer * 0.22);
    ctx.fillStyle = linear(ctx, x, base - amp, x, y + h, [
      [0, mixHex(shade, ts.secondary, 0.22 - layer * 0.06)],
      [1, shade],
    ]);
    ctx.fill();
  }

  // ---- 6. The subject ----------------------------------------------------
  const pts = creatureContour(rng, 96);
  const bodyR = w * range(rng, 0.2, 0.27);
  const bodyH = bodyR * range(rng, 1.15, 1.6);
  const byc = y + h * (horizon + 0.02) - bodyH * 0.62;

  // Cast shadow onto the terrain, keeps the subject planted.
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = radial(ctx, cx, y + h * (horizon + 0.04), 0, bodyR * 1.5, [
    [0, 'rgba(0,0,0,0.85)'],
    [1, 'rgba(0,0,0,0)'],
  ]);
  ctx.beginPath();
  ctx.ellipse(cx, y + h * (horizon + 0.04), bodyR * 1.5, bodyR * 0.34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Body: near-black against the glow, with a chromatic rim.
  contourPath(ctx, pts, cx, byc, bodyR, bodyH);
  ctx.fillStyle = linear(ctx, cx, byc - bodyH, cx, byc + bodyH, [
    [0, mixHex(ts.deep, '#000000', 0.55)],
    [0.62, mixHex(ts.deep, '#000000', 0.78)],
    [1, mixHex(ts.deep, ts.primary, 0.28)],
  ]);
  ctx.fill();

  // Internal energy: the body is not solid, it holds the type's light.
  ctx.save();
  contourPath(ctx, pts, cx, byc, bodyR, bodyH);
  ctx.clip();
  ctx.globalCompositeOperation = 'lighter';
  const veinCount = irange(rng, 5, 9);
  for (let i = 0; i < veinCount; i++) {
    const a = range(rng, -Math.PI, Math.PI);
    const rr = bodyR * range(rng, 0.2, 0.95);
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * rr * 0.5, byc + Math.sin(a) * rr * 0.5, bodyR * range(rng, 0.06, 0.2), 0, Math.PI * 2);
    ctx.fillStyle = radial(
      ctx,
      cx + Math.cos(a) * rr * 0.5,
      byc + Math.sin(a) * rr * 0.5,
      0,
      bodyR * 0.2,
      [
        [0, rgba(ts.primary, 0.55)],
        [1, rgba(ts.primary, 0)],
      ]
    );
    ctx.fill();
  }
  // Plate seams.
  const seams = irange(rng, 3, 6);
  for (let i = 0; i < seams; i++) {
    const yy = byc - bodyH + ((i + 1) / (seams + 1)) * bodyH * 2;
    ctx.beginPath();
    ctx.moveTo(cx - bodyR * 1.4, yy + range(rng, -6, 6));
    ctx.quadraticCurveTo(cx, yy + range(rng, -18, 18), cx + bodyR * 1.4, yy + range(rng, -6, 6));
    ctx.strokeStyle = rgba(ts.secondary, 0.28);
    ctx.lineWidth = w * 0.003;
    ctx.stroke();
  }
  ctx.restore();

  // Rim light: two passes, warm from the key and cool from behind.
  ctx.save();
  contourPath(ctx, pts, cx, byc, bodyR, bodyH);
  ctx.strokeStyle = rgba(ts.accent, 0.9);
  ctx.lineWidth = w * 0.006;
  ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.translate(0, -w * 0.006);
  contourPath(ctx, pts, cx, byc, bodyR, bodyH);
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = rgba(ts.primary, 0.55);
  ctx.lineWidth = w * 0.011;
  ctx.stroke();
  ctx.restore();

  // Eyes.
  const eyePairs = irange(rng, 1, 3);
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < eyePairs; i++) {
    const ex = bodyR * range(rng, 0.16, 0.5);
    const ey = byc - bodyH * range(rng, 0.1, 0.62);
    const er = w * range(rng, 0.007, 0.014);
    for (const sgn of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(cx + sgn * ex, ey, er * 1.5, er, 0, 0, Math.PI * 2);
      ctx.fillStyle = radial(ctx, cx + sgn * ex, ey, 0, er * 3.4, [
        [0, '#ffffff'],
        [0.28, rgba(ts.accent, 0.95)],
        [1, rgba(ts.primary, 0)],
      ]);
      ctx.fill();
    }
  }
  ctx.globalCompositeOperation = 'source-over';

  // ---- 7. Type motif -----------------------------------------------------
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  switch (ts.motif) {
    case 'bolt': {
      const n = irange(rng, 2, 4);
      for (let i = 0; i < n; i++) {
        const sx = x + range(rng, 0.1, 0.9) * w;
        bolt(ctx, rng, sx, y - 10, cx + gaussian(rng) * bodyR, byc - bodyH * 0.3, w * 0.06, 6, rgba(ts.accent, 0.9), w * 0.004);
      }
      break;
    }
    case 'mist': {
      const n = irange(rng, 6, 10);
      for (let i = 0; i < n; i++) {
        const yy = y + range(rng, 0.2, 0.95) * h;
        ctx.beginPath();
        ctx.moveTo(x - 20, yy);
        ctx.bezierCurveTo(
          x + w * 0.3,
          yy + gaussian(rng) * h * 0.1,
          x + w * 0.7,
          yy + gaussian(rng) * h * 0.1,
          x + w + 20,
          yy + gaussian(rng) * h * 0.06
        );
        ctx.strokeStyle = rgba(ts.primary, range(rng, 0.05, 0.16));
        ctx.lineWidth = range(rng, w * 0.01, w * 0.05);
        ctx.stroke();
      }
      break;
    }
    case 'filament': {
      const n = irange(rng, 8, 14);
      for (let i = 0; i < n; i++) {
        const a0 = range(rng, 0, Math.PI * 2);
        const a1 = a0 + range(rng, 0.6, 2.4);
        const rr = glowR * range(rng, 0.35, 1.0);
        ctx.beginPath();
        ctx.arc(cx, cy, rr, a0, a1);
        ctx.strokeStyle = rgba(i % 2 ? ts.secondary : ts.primary, range(rng, 0.14, 0.5));
        ctx.lineWidth = w * range(rng, 0.0016, 0.005);
        ctx.stroke();
      }
      break;
    }
    case 'crystal': {
      const n = irange(rng, 4, 7);
      for (let i = 0; i < n; i++) {
        const sx = x + range(rng, 0, 1) * w;
        const sy = y + range(rng, 0, 1) * h;
        frostBranch(ctx, rng, sx, sy, range(rng, 0, Math.PI * 2), w * range(rng, 0.08, 0.2), 4, rgba(ts.secondary, 0.45), w * 0.0035);
      }
      break;
    }
    case 'orbit': {
      const n = irange(rng, 3, 5);
      for (let i = 0; i < n; i++) {
        const rr = glowR * (0.45 + i * 0.22);
        const tilt = range(rng, -0.9, 0.9);
        ctx.beginPath();
        ctx.ellipse(cx, cy, rr, rr * range(rng, 0.14, 0.42), tilt, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(ts.secondary, 0.34);
        ctx.lineWidth = w * 0.0028;
        ctx.stroke();
        const pa = range(rng, 0, Math.PI * 2);
        const px = cx + Math.cos(pa) * rr * Math.cos(tilt);
        const py = cy + Math.sin(pa) * rr * 0.3;
        ctx.beginPath();
        ctx.arc(px, py, w * 0.012, 0, Math.PI * 2);
        ctx.fillStyle = radial(ctx, px, py, 0, w * 0.012, [
          [0, '#ffffff'],
          [1, rgba(ts.accent, 0)],
        ]);
        ctx.fill();
      }
      break;
    }
    case 'grid': {
      const rows = 14;
      for (let i = 0; i <= rows; i++) {
        const t = i / rows;
        const yy = y + h * (horizon + 0.02) + Math.pow(t, 2.1) * h * 0.4;
        ctx.beginPath();
        ctx.moveTo(x, yy);
        ctx.lineTo(x + w, yy);
        ctx.strokeStyle = rgba(ts.primary, 0.22 * (1 - t));
        ctx.lineWidth = w * 0.0018;
        ctx.stroke();
      }
      for (let i = -10; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * w * 0.03, y + h * (horizon + 0.02));
        ctx.lineTo(cx + i * w * 0.32, y + h);
        ctx.strokeStyle = rgba(ts.primary, 0.14);
        ctx.lineWidth = w * 0.0016;
        ctx.stroke();
      }
      break;
    }
    case 'decay': {
      const n = irange(rng, 5, 9);
      for (let i = 0; i < n; i++) {
        const yy = y + range(rng, 0, 1) * h;
        const hh = range(rng, 2, h * 0.03);
        ctx.fillStyle = rgba(ts.accent, range(rng, 0.05, 0.2));
        ctx.fillRect(x, yy, w, hh);
      }
      break;
    }
  }
  ctx.restore();

  // ---- 8. Airborne particulate ------------------------------------------
  ctx.globalCompositeOperation = 'lighter';
  const motes = 70 + (card.speed % 60);
  for (let i = 0; i < motes; i++) {
    const px = x + rng() * w;
    const py = y + rng() * h;
    const depth = rng();
    const r = w * mix(0.0012, 0.006, depth * depth);
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = rgba(rng() < 0.3 ? ts.accent : ts.primary, mix(0.1, 0.75, depth));
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';

  // ---- 9. Ghost decay ----------------------------------------------------
  if (ghost) {
    // Bleach: dead endpoints lose their ink.
    ctx.globalCompositeOperation = 'saturation';
    ctx.fillStyle = '#808080';
    ctx.globalAlpha = 0.55;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    // Emulsion tears: bands where the print has lifted off the stock.
    const tears = irange(rng, 4, 8);
    for (let i = 0; i < tears; i++) {
      const yy = y + rng() * h;
      const hh = range(rng, h * 0.004, h * 0.03);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0,0,0,${range(rng, 0.25, 0.7).toFixed(3)})`;
      ctx.beginPath();
      let px = x;
      ctx.moveTo(x, yy);
      while (px < x + w) {
        px += range(rng, 6, 40);
        ctx.lineTo(px, yy + gaussian(rng) * hh * 0.6);
      }
      ctx.lineTo(x + w, yy + hh);
      px = x + w;
      while (px > x) {
        px -= range(rng, 6, 40);
        ctx.lineTo(px, yy + hh + gaussian(rng) * hh * 0.6);
      }
      ctx.closePath();
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    // Foxing: the brown-green bloom old card stock gets.
    const spots = irange(rng, 10, 20);
    for (let i = 0; i < spots; i++) {
      const px = x + rng() * w;
      const py = y + rng() * h;
      const r = w * range(rng, 0.02, 0.11);
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = radial(ctx, px, py, 0, r, [
        [0, 'rgba(150,160,120,0.65)'],
        [0.6, 'rgba(110,130,110,0.28)'],
        [1, 'rgba(120,140,120,0)'],
      ]);
      ctx.fillRect(px - r, py - r, r * 2, r * 2);
      ctx.globalCompositeOperation = 'source-over';
    }

    // A cold spectral wash that keeps it beautiful rather than merely dirty.
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = linear(ctx, x, y, x, y + h, [
      [0, 'rgba(120,255,220,0.10)'],
      [0.6, 'rgba(60,160,150,0.03)'],
      [1, 'rgba(20,60,70,0.10)'],
    ]);
    ctx.fillRect(x, y, w, h);
    ctx.globalCompositeOperation = 'source-over';
  }

  // ---- 10. Print pass ----------------------------------------------------
  // Halftone-scale grain. Real offset printing is never clean.
  const gw = Math.round(w * 0.5);
  const gh = Math.round(h * 0.5);
  const grain = fieldSurface(gw, gh, (u, v) => {
    const n = fbm(u * gw * 0.9, v * gh * 0.9, nseed + 7717, 2);
    return [n, n, n, 0.055];
  });
  ctx.globalCompositeOperation = 'overlay';
  ctx.drawImage(grain.canvas, x, y, w, h);
  ctx.globalCompositeOperation = 'source-over';

  // Window vignette: the art sits in a recess, so it darkens at the frame.
  ctx.fillStyle = radial(ctx, x + w * 0.5, y + h * 0.5, Math.min(w, h) * 0.28, Math.max(w, h) * 0.72, [
    [0, 'rgba(0,0,0,0)'],
    [1, `rgba(0,0,0,${(0.42 + rs.foil * 0.14).toFixed(3)})`],
  ]);
  ctx.fillRect(x, y, w, h);

  ctx.restore();
  void pick;
}
