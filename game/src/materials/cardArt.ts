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

/**
 * Creature outline as a closed polar contour, mirror-symmetric about the
 * vertical.
 *
 * The radius is not free-form noise: it interpolates a fixed anatomical
 * skeleton, head at the top, a neck pinch, shoulders, a waist, then a wide
 * planted base. Only the amounts vary per card. Pure harmonic noise gives blobs
 * with no read; a skeleton with jittered proportions gives something the eye
 * parses as a body every time.
 */
type Archetype = 'titan' | 'floater' | 'serpent' | 'swarm';

interface Creature {
  pts: { t: number; r: number }[];
  archetype: Archetype;
  /** True when the shape has a base that stands on the ground plane. */
  grounded: boolean;
  /** Half-extent multipliers, so a serpent is narrow and a titan is broad. */
  rx: number;
  ry: number;
}

function creatureContour(rng: Rng, samples: number): Creature {
  const j = (v: number, amt: number) => v * (1 + (rng() * 2 - 1) * amt);
  const archetype = pick<Archetype>(rng, ['titan', 'titan', 'floater', 'serpent', 'swarm']);
  const bulk = range(rng, 0.7, 1.3);

  let skeleton: [number, number][];
  let grounded = true;
  let rx = 1;
  let ry = 1;
  const spikes: { t: number; a: number; s: number }[] = [];

  if (archetype === 'titan') {
    const topHeavy = range(rng, -0.35, 0.5);
    const neck = range(rng, 0.22, 0.6);
    skeleton = [
      [0.0, j(0.4 + topHeavy * 0.4, 0.3)],
      [0.2, j(0.46 + topHeavy * 0.5, 0.28)],
      [0.4, j(neck * bulk, 0.3)],
      [0.66, j((0.86 + topHeavy * 0.5) * bulk, 0.28)],
      [0.95, j((0.7 + topHeavy * 0.3) * bulk, 0.34)],
      [1.3, j((0.6 - topHeavy * 0.15) * bulk, 0.36)],
      [1.75, j((0.84 - topHeavy * 0.3) * bulk, 0.3)],
      [2.25, j((1.0 - topHeavy * 0.35) * bulk, 0.22)],
      [2.75, j((0.86 - topHeavy * 0.2) * bulk, 0.24)],
      [Math.PI, j(0.7 * bulk, 0.2)],
    ];
    rx = range(rng, 0.9, 1.15);
    ry = range(rng, 0.9, 1.2);
    for (let i = 0, n = irange(rng, 0, 3); i < n; i++) {
      spikes.push({ t: range(rng, 0.08, 0.42), a: range(rng, 0.3, 1.0), s: range(rng, 0.03, 0.09) });
    }
    for (let i = 0, n = irange(rng, 0, 2); i < n; i++) {
      spikes.push({ t: range(rng, 0.55, 1.2), a: range(rng, 0.25, 0.85), s: range(rng, 0.05, 0.18) });
    }
  } else if (archetype === 'floater') {
    // A hovering mass: widest at the equator, tapering to a point below.
    grounded = false;
    const eq = range(rng, 1.15, 1.75);
    skeleton = [
      [0.0, j(0.34, 0.4)],
      [0.35, j(0.62 * bulk, 0.3)],
      [eq * 0.6, j(0.86 * bulk, 0.25)],
      [eq, j(1.05 * bulk, 0.18)],
      [eq + 0.45, j(0.72 * bulk, 0.3)],
      [2.55, j(0.34 * bulk, 0.4)],
      [Math.PI, j(0.12, 0.5)],
    ];
    rx = range(rng, 1.0, 1.35);
    ry = range(rng, 0.78, 1.05);
    for (let i = 0, n = irange(rng, 3, 8); i < n; i++) {
      spikes.push({ t: range(rng, 0.2, 2.6), a: range(rng, 0.2, 0.7), s: range(rng, 0.03, 0.1) });
    }
  } else if (archetype === 'serpent') {
    // Tall and narrow, with two or three bulges along its length.
    skeleton = [
      [0.0, j(0.3, 0.35)],
      [0.22, j(0.44 * bulk, 0.3)],
      [0.55, j(0.26 * bulk, 0.4)],
      [0.95, j(0.5 * bulk, 0.3)],
      [1.45, j(0.3 * bulk, 0.4)],
      [1.95, j(0.56 * bulk, 0.3)],
      [2.5, j(0.42 * bulk, 0.35)],
      [Math.PI, j(0.5 * bulk, 0.3)],
    ];
    rx = range(rng, 0.5, 0.75);
    ry = range(rng, 1.15, 1.5);
    for (let i = 0, n = irange(rng, 2, 5); i < n; i++) {
      spikes.push({ t: range(rng, 0.05, 1.4), a: range(rng, 0.25, 0.8), s: range(rng, 0.03, 0.08) });
    }
  } else {
    // Jagged, unstable, many limbs. The shape a swarm resolves into.
    grounded = rng() < 0.4;
    skeleton = [
      [0.0, j(0.5 * bulk, 0.4)],
      [0.5, j(0.7 * bulk, 0.4)],
      [1.0, j(0.55 * bulk, 0.4)],
      [1.6, j(0.8 * bulk, 0.35)],
      [2.2, j(0.6 * bulk, 0.4)],
      [2.7, j(0.75 * bulk, 0.35)],
      [Math.PI, j(0.55 * bulk, 0.35)],
    ];
    rx = range(rng, 0.85, 1.25);
    ry = range(rng, 0.85, 1.25);
    for (let i = 0, n = irange(rng, 6, 12); i < n; i++) {
      spikes.push({ t: range(rng, 0, Math.PI), a: range(rng, 0.2, 0.75), s: range(rng, 0.02, 0.07) });
    }
  }

  const ripple = archetype === 'swarm' ? range(rng, 0.04, 0.12) : range(rng, 0.01, 0.07);
  const rippleK = irange(rng, 4, archetype === 'swarm' ? 22 : 14);

  function radiusAt(t: number): number {
    let i = 0;
    while (i < skeleton.length - 2 && skeleton[i + 1][0] < t) i++;
    const [t0, r0] = skeleton[i];
    const [t1, r1] = skeleton[i + 1];
    let r = mix(r0, r1, smoothstep(t0, t1, t));
    for (const s of spikes) {
      const d = (t - s.t) / s.s;
      r += s.a * Math.exp(-0.5 * d * d);
    }
    r += ripple * Math.cos(rippleK * t);
    return Math.max(0.1, r);
  }

  const pts: { t: number; r: number }[] = [];
  for (let i = 0; i <= samples; i++) pts.push({ t: (i / samples) * Math.PI, r: radiusAt((i / samples) * Math.PI) });
  for (let i = samples - 1; i > 0; i--) pts.push({ t: -pts[i].t, r: pts[i].r });
  return { pts, archetype, grounded, rx, ry };
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
  ctx.globalAlpha = 1;
  ctx.drawImage(field.canvas, x, y, w, h);
  ctx.globalCompositeOperation = 'source-over';

  // ---- 3. Key glow behind the subject ------------------------------------
  // The subject is backlit. This glow is the brightest thing in the window and
  // it is what gives the silhouette something to read against.
  const cx = x + w * mix(0.44, 0.56, rng());
  const cy = y + h * horizon;
  const glowR = w * range(rng, 0.5, 0.7);
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = radial(ctx, cx, cy, 0, glowR, [
    [0, '#ffffff'],
    [0.1, rgba(ts.accent, 0.95)],
    [0.3, rgba(ts.primary, 0.72)],
    [0.62, rgba(ts.secondary, 0.26)],
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
  // Not every endpoint lives on a surface. A quarter of them are drawn in open
  // space, which keeps the set from reading as one repeated matte painting.
  const terrainLayers = rng() < 0.74 ? 3 : 0;
  for (let layer = 0; layer < terrainLayers; layer++) {
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
    // Aerial perspective: the far ridge sits closest to the sky value, the near
    // one goes almost black. That gradient is the whole illusion of depth.
    const shade = mixHex(ts.deep, '#000000', 0.05 + layer * 0.3);
    ctx.fillStyle = linear(ctx, x, base - amp, x, y + h, [
      [0, mixHex(shade, ts.primary, 0.42 - layer * 0.14)],
      [1, shade],
    ]);
    ctx.fill();
    // Rim of light along the ridge line.
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = rgba(ts.primary, 0.3 - layer * 0.08);
    ctx.lineWidth = w * 0.0022;
    ctx.stroke();
    ctx.restore();
  }

  // ---- 6. The subject ----------------------------------------------------
  const creature = creatureContour(rng, 120);
  const pts = creature.pts;
  // Framing: some cards are a portrait crop, some sit small in a landscape.
  const framing = range(rng, 0.72, 1.3);
  const bodyR = w * range(rng, 0.22, 0.28) * framing * creature.rx;
  const bodyH = w * range(rng, 0.3, 0.4) * framing * creature.ry;
  const byc = creature.grounded
    ? y + h * (horizon + 0.02) - bodyH * 0.46
    : y + h * range(rng, 0.36, 0.54);

  if (creature.grounded) {
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
  } else {
    // A hovering entity gets a containment ring instead of a shadow.
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.ellipse(cx, byc + bodyH * (0.9 + i * 0.16), bodyR * (1.5 - i * 0.3), bodyR * 0.3, 0, 0, Math.PI * 2);
      ctx.strokeStyle = rgba(ts.accent, 0.3 - i * 0.12);
      ctx.lineWidth = w * 0.004;
      ctx.stroke();
    }
    ctx.restore();
  }

  // Body: near-black against the glow, with a chromatic rim.
  contourPath(ctx, pts, cx, byc, bodyR, bodyH);
  ctx.fillStyle = linear(ctx, cx - bodyR, byc - bodyH, cx + bodyR, byc + bodyH, [
    [0, mixHex(ts.deep, ts.secondary, 0.3)],
    [0.35, mixHex(ts.deep, '#000000', 0.5)],
    [0.75, mixHex(ts.deep, '#000000', 0.82)],
    [1, mixHex(ts.deep, '#000000', 0.62)],
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

  // Rim light: a broad bloom outside the silhouette and a hot hairline on it.
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 3; i >= 1; i--) {
    contourPath(ctx, pts, cx, byc, bodyR, bodyH);
    ctx.strokeStyle = rgba(ts.primary, 0.16 / i);
    ctx.lineWidth = w * 0.014 * i;
    ctx.stroke();
  }
  ctx.restore();
  ctx.save();
  contourPath(ctx, pts, cx, byc, bodyR, bodyH);
  ctx.strokeStyle = rgba(ts.accent, 0.95);
  ctx.lineWidth = w * 0.0055;
  ctx.stroke();
  ctx.restore();
  // Key side hairline, offset up and left so the form reads as lit from above.
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w * 0.55, h);
  ctx.clip();
  ctx.translate(-w * 0.006, -w * 0.006);
  contourPath(ctx, pts, cx, byc, bodyR, bodyH);
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = rgba('#ffffff', 0.55);
  ctx.lineWidth = w * 0.004;
  ctx.stroke();
  ctx.restore();

  // Eyes, placed inside the head region of the skeleton rather than anywhere on
  // the mass. This is what makes the silhouette read as facing the viewer.
  const eyePairs = irange(rng, 1, 3);
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < eyePairs; i++) {
    const et = range(rng, 0.14, 0.42) + i * 0.1;
    const headR = pts.find((p) => p.t >= et)?.r ?? 0.5;
    const frac = range(rng, 0.42, 0.68);
    const ex = Math.sin(et) * headR * frac * bodyR + bodyR * 0.06;
    const ey = byc - Math.cos(et) * headR * frac * bodyH;
    const er = w * range(rng, 0.011, 0.019);
    for (const sgn of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(cx + sgn * ex, ey, er * 4.5, er * 4.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = radial(ctx, cx + sgn * ex, ey, 0, er * 4.5, [
        [0, '#ffffff'],
        [0.16, rgba(ts.accent, 0.9)],
        [0.42, rgba(ts.primary, 0.35)],
        [1, rgba(ts.primary, 0)],
      ]);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + sgn * ex, ey, er * 1.15, er * 0.75, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
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
    // Bleach: dead endpoints lose their ink, but not all of it. A fully grey
    // card reads as a mistake; a partly bleached one reads as time passing.
    ctx.globalCompositeOperation = 'saturation';
    ctx.fillStyle = '#808080';
    ctx.globalAlpha = 0.34;
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

    // A cold spectral wash that keeps it beautiful rather than merely dirty,
    // plus a residual aura around where the subject still stands.
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = linear(ctx, x, y, x, y + h, [
      [0, 'rgba(120,255,220,0.16)'],
      [0.55, 'rgba(70,190,180,0.07)'],
      [1, 'rgba(30,90,100,0.16)'],
    ]);
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = radial(ctx, cx, byc, 0, bodyR * 2.4, [
      [0, 'rgba(150,255,230,0.22)'],
      [0.45, 'rgba(90,220,200,0.09)'],
      [1, 'rgba(60,180,170,0)'],
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
  ctx.fillStyle = radial(ctx, x + w * 0.5, y + h * 0.5, Math.min(w, h) * 0.42, Math.max(w, h) * 0.78, [
    [0, 'rgba(0,0,0,0)'],
    [1, `rgba(0,0,0,${(0.24 + rs.foil * 0.1).toFixed(3)})`],
  ]);
  ctx.fillRect(x, y, w, h);

  ctx.restore();
  void pick;
}
