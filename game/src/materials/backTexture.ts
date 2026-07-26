import {
  drawTracked,
  font,
  FONT_MONO,
  FONT_SANS,
  linear,
  makeSurface,
  measureTracked,
  radial,
  roundRect,
  type Ctx2D,
  type Surface,
} from './canvas2d';
import { fbm, range, rngFrom } from './noise';

/**
 * The card back.
 *
 * One design for the whole set, exactly as a real trading card line does it: a
 * shared back is what makes a stack of cards read as a product rather than a
 * pile of prints. It is generated once and shared by every card in the vault,
 * so it costs one texture no matter how many cards are live.
 *
 * RGB is the printed back. Alpha carries the foil plate, same convention as the
 * face, so the frame and the seal catch the light and the field does not.
 */

const BACK_SEED = 0x5ea1ed;

/**
 * Text set on a circular baseline. `dir` is +1 for the upper arc, where angle
 * increases left to right, and -1 for the lower arc, where it must decrease so
 * the glyphs stay upright and still read left to right.
 */
function arcText(
  ctx: Ctx2D,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  centreAngle: number,
  spread: number,
  dir: 1 | -1
): void {
  const chars = [...text];
  const n = chars.length;
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const a = centreAngle + dir * (t - 0.5) * spread;
    ctx.save();
    ctx.translate(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
    ctx.rotate(a + (dir * Math.PI) / 2);
    const w = ctx.measureText(chars[i]).width;
    ctx.fillText(chars[i], -w * 0.5, 0);
    ctx.restore();
  }
}

function polygon(ctx: Ctx2D, cx: number, cy: number, r: number, sides: number, rot = 0): void {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2 + rot;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

export function composeBack(W = 768): { color: Surface; foil: Surface } {
  const H = Math.round((W * 88) / 63);
  const k = W / 1024;
  const color = makeSurface(W, H, true);
  const foil = makeSurface(W, H, false);
  const c = color.ctx;
  const f = foil.ctx;
  const rng = rngFrom(BACK_SEED);

  const INK = '#0a0d18';
  const INK2 = '#141c33';
  const METAL = '#c8a45c';
  const METAL_HI = '#ffeeba';
  const METAL_LO = '#6b4a12';
  const ACCENT = '#6fd7ff';

  const cx = W * 0.5;
  const cy = H * 0.5;
  const pad = 36 * k;

  // Field.
  c.fillStyle = '#04050a';
  c.fillRect(0, 0, W, H);
  roundRect(c, pad * 0.36, pad * 0.36, W - pad * 0.72, H - pad * 0.72, 26 * k);
  c.fillStyle = linear(c, 0, 0, 0, H, [
    [0, INK2],
    [0.5, INK],
    [1, '#05070e'],
  ]);
  c.fill();

  c.save();
  roundRect(c, pad * 0.36, pad * 0.36, W - pad * 0.72, H - pad * 0.72, 26 * k);
  c.clip();

  // Hex lattice ground, the base layer of the security print.
  const hexR = 26 * k;
  for (let row = -1; row * hexR * 1.5 < H + hexR; row++) {
    for (let col = -1; col * hexR * 1.74 < W + hexR; col++) {
      const px = col * hexR * 1.74 + (row % 2 ? hexR * 0.87 : 0);
      const py = row * hexR * 1.5;
      polygon(c, px, py, hexR * 0.94, 6, Math.PI / 6);
      c.strokeStyle = 'rgba(110,160,235,0.075)';
      c.lineWidth = 1 * k;
      c.stroke();
    }
  }

  // Radial burst behind the emblem.
  c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 96; i++) {
    const a = (i / 96) * Math.PI * 2;
    const wA = 0.012;
    c.beginPath();
    c.moveTo(cx, cy);
    c.arc(cx, cy, H, a - wA, a + wA);
    c.closePath();
    c.fillStyle = `rgba(58,108,205,${(0.05 + 0.045 * Math.sin(i * 3.1)).toFixed(3)})`;
    c.fill();
  }
  c.globalCompositeOperation = 'source-over';

  // Guilloche rosettes. Banknote line work: the density is the point, a few
  // faint curves read as an unfinished background.
  for (let b = 0; b < 6; b++) {
    const kA = 2 + b;
    const kB = 7 + b * 3;
    const rA = Math.min(W, H) * (0.2 + b * 0.085);
    const rB = Math.min(W, H) * (0.04 + b * 0.008);
    c.strokeStyle = `rgba(130,180,255,${(0.3 - b * 0.03).toFixed(3)})`;
    c.lineWidth = 1.1 * k;
    for (let cpy = 0; cpy < 4; cpy++) {
      const off = cpy * 0.022;
      c.beginPath();
      for (let i = 0; i <= 420; i++) {
        const t = (i / 420) * Math.PI * 2;
        const x = cx + Math.cos(kA * t + off) * rA + Math.cos(kB * t) * rB;
        const y = cy + Math.sin(kA * t + off) * rA * 1.34 + Math.sin(kB * t) * rB;
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();
    }
  }

  // Cross hatch, at the pitch a real engraved plate uses.
  c.lineWidth = 1 * k;
  for (let yy = -H; yy < H * 2; yy += 9 * k) {
    c.strokeStyle = 'rgba(150,200,255,0.085)';
    c.beginPath();
    c.moveTo(0, yy);
    c.lineTo(W, yy + W * 0.42);
    c.stroke();
    c.strokeStyle = 'rgba(90,140,220,0.06)';
    c.beginPath();
    c.moveTo(0, yy);
    c.lineTo(W, yy - W * 0.42);
    c.stroke();
  }

  c.restore();

  // Emblem.
  const R = Math.min(W, H) * 0.235;
  c.save();
  c.translate(cx, cy);

  // Outer ring.
  c.beginPath();
  c.arc(0, 0, R, 0, Math.PI * 2);
  c.fillStyle = radial(c, -R * 0.3, -R * 0.3, 0, R * 1.9, [
    [0, '#101728'],
    [1, '#04060c'],
  ]);
  c.fill();
  c.strokeStyle = linear(c, -R, -R, R, R, [
    [0, METAL_LO],
    [0.3, METAL_HI],
    [0.55, METAL],
    [0.8, METAL_HI],
    [1, METAL_LO],
  ]);
  c.lineWidth = 9 * k;
  c.stroke();
  c.beginPath();
  c.arc(0, 0, R * 0.9, 0, Math.PI * 2);
  c.strokeStyle = 'rgba(200,164,92,0.45)';
  c.lineWidth = 2 * k;
  c.stroke();

  // Tick ring.
  for (let i = 0; i < 90; i++) {
    const a = (i / 90) * Math.PI * 2;
    const long = i % 9 === 0;
    c.beginPath();
    c.moveTo(Math.cos(a) * R * 0.82, Math.sin(a) * R * 0.82);
    c.lineTo(Math.cos(a) * R * (long ? 0.7 : 0.77), Math.sin(a) * R * (long ? 0.7 : 0.77));
    c.strokeStyle = long ? 'rgba(255,238,186,0.7)' : 'rgba(200,164,92,0.4)';
    c.lineWidth = (long ? 2.2 : 1.2) * k;
    c.stroke();
  }

  // Inner hexagon lock.
  polygon(c, 0, 0, R * 0.62, 6, Math.PI / 6);
  c.fillStyle = linear(c, 0, -R * 0.6, 0, R * 0.6, [
    [0, '#1b2540'],
    [1, '#080b14'],
  ]);
  c.fill();
  c.strokeStyle = METAL;
  c.lineWidth = 3.4 * k;
  c.stroke();

  polygon(c, 0, 0, R * 0.46, 6, 0);
  c.strokeStyle = 'rgba(111,215,255,0.5)';
  c.lineWidth = 2 * k;
  c.stroke();

  // Packet glyph: three datagrams in flight, each with a header notch, the
  // middle one running ahead of the other two.
  for (let i = -1; i <= 1; i++) {
    const w = R * (0.52 - Math.abs(i) * 0.06);
    const hh = R * 0.13;
    const ox = i === 0 ? R * 0.1 : -Math.abs(i) * R * 0.03;
    const x0 = -w * 0.5 + ox;
    const y0 = i * hh * 1.75 - hh * 0.5;
    roundRect(c, x0, y0, w, hh, hh * 0.26);
    c.fillStyle = i === 0 ? ACCENT : 'rgba(200,164,92,0.88)';
    c.fill();
    // Header field.
    c.fillStyle = 'rgba(8,12,22,0.55)';
    c.fillRect(x0 + w * 0.08, y0 + hh * 0.28, w * 0.16, hh * 0.44);
    // Motion trail.
    c.beginPath();
    c.moveTo(x0 - R * 0.09, y0 + hh * 0.5);
    c.lineTo(x0 - R * 0.02, y0 + hh * 0.5);
    c.strokeStyle = i === 0 ? 'rgba(111,215,255,0.55)' : 'rgba(200,164,92,0.4)';
    c.lineWidth = hh * 0.22;
    c.lineCap = 'round';
    c.stroke();
  }

  // Arc lettering.
  c.fillStyle = METAL_HI;
  c.font = font(23 * k, 700, FONT_SANS);
  arcText(c, 'PACKET MONSTERS', 0, 0, R * 0.76, -Math.PI / 2, 1.86, 1);
  c.font = font(17 * k, 700, FONT_SANS);
  c.fillStyle = 'rgba(200,164,92,0.9)';
  arcText(c, 'SEALED VAULT', 0, 0, R * 0.75, Math.PI / 2, 1.22, -1);

  c.restore();

  // Frame band.
  const fx = pad * 0.72;
  roundRect(c, fx, fx, W - fx * 2, H - fx * 2, 22 * k);
  c.strokeStyle = linear(c, fx, fx, W - fx, H - fx, [
    [0, METAL_LO],
    [0.22, METAL_HI],
    [0.45, METAL],
    [0.7, METAL_HI],
    [1, METAL_LO],
  ]);
  c.lineWidth = 12 * k;
  c.stroke();
  roundRect(c, fx, fx, W - fx * 2, H - fx * 2, 22 * k);
  c.strokeStyle = 'rgba(0,0,0,0.55)';
  c.lineWidth = 1.4 * k;
  c.stroke();
  roundRect(c, fx + 16 * k, fx + 16 * k, W - fx * 2 - 32 * k, H - fx * 2 - 32 * k, 14 * k);
  c.strokeStyle = 'rgba(200,164,92,0.35)';
  c.lineWidth = 1.6 * k;
  c.stroke();

  // Corner marks.
  for (let i = 0; i < 4; i++) {
    const ax = i % 2 === 0 ? fx + 34 * k : W - fx - 34 * k;
    const ay = i < 2 ? fx + 34 * k : H - fx - 34 * k;
    c.save();
    c.translate(ax, ay);
    c.rotate((i === 0 ? 0 : i === 1 ? Math.PI / 2 : i === 2 ? -Math.PI / 2 : Math.PI) as number);
    c.strokeStyle = 'rgba(255,238,186,0.5)';
    c.lineWidth = 2.4 * k;
    c.beginPath();
    c.moveTo(0, 22 * k);
    c.lineTo(0, 0);
    c.lineTo(22 * k, 0);
    c.stroke();
    c.restore();
  }

  // Top and bottom legends.
  c.textAlign = 'left';
  c.font = font(15 * k, 700, FONT_MONO);
  c.fillStyle = 'rgba(200,220,255,0.4)';
  const top = 'x402 INDEXED ENDPOINT';
  const tw = measureTracked(c, top, 4 * k);
  drawTracked(c, top, cx - tw * 0.5, fx + 62 * k, 4 * k);
  const bot = 'HARMONIC WEIGHTED SEALED DRAW';
  const bw = measureTracked(c, bot, 3.4 * k);
  drawTracked(c, bot, cx - bw * 0.5, H - fx - 48 * k, 3.4 * k);

  // Print imperfection.
  const mw = 96;
  const mh = Math.round((mw * H) / W);
  const m = makeSurface(mw, mh, true);
  const img = m.ctx.createImageData(mw, mh);
  for (let y = 0, i = 0; y < mh; y++) {
    for (let x = 0; x < mw; x++) {
      const n = fbm((x / mw) * 5, (y / mh) * 7, BACK_SEED + 31, 4);
      const v = (n - 0.5) * 2;
      img.data[i++] = v > 0 ? 255 : 0;
      img.data[i++] = v > 0 ? 255 : 0;
      img.data[i++] = v > 0 ? 255 : 0;
      img.data[i++] = Math.abs(v) * 50;
    }
  }
  m.ctx.putImageData(img, 0, 0);
  c.save();
  c.globalCompositeOperation = 'overlay';
  c.globalAlpha = 0.55;
  c.drawImage(m.canvas, 0, 0, W, H);
  c.restore();

  for (let i = 0; i < 120; i++) {
    const x = rng() * W;
    const y = rng() * H;
    const l = range(rng, 1, 6) * k;
    const a = range(rng, 0, Math.PI);
    c.strokeStyle = `rgba(255,255,255,${range(rng, 0.02, 0.1).toFixed(3)})`;
    c.lineWidth = 0.9 * k;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    c.stroke();
  }

  c.fillStyle = radial(c, cx, cy, W * 0.28, W * 0.95, [
    [0, 'rgba(0,0,0,0)'],
    [1, 'rgba(0,0,0,0.5)'],
  ]);
  c.fillRect(0, 0, W, H);

  // ---- foil plate --------------------------------------------------------
  f.fillStyle = '#000000';
  f.fillRect(0, 0, W, H);
  // Frame.
  roundRect(f, fx, fx, W - fx * 2, H - fx * 2, 22 * k);
  f.strokeStyle = 'rgba(255,255,255,0.95)';
  f.lineWidth = 13 * k;
  f.stroke();
  roundRect(f, fx + 16 * k, fx + 16 * k, W - fx * 2 - 32 * k, H - fx * 2 - 32 * k, 14 * k);
  f.strokeStyle = 'rgba(255,255,255,0.45)';
  f.lineWidth = 3 * k;
  f.stroke();
  // Emblem.
  f.beginPath();
  f.arc(cx, cy, R * 1.02, 0, Math.PI * 2);
  f.fillStyle = radial(f, cx, cy, R * 0.3, R * 1.05, [
    [0, 'rgba(255,255,255,0.75)'],
    [0.62, 'rgba(255,255,255,0.95)'],
    [1, 'rgba(255,255,255,0.25)'],
  ]);
  f.fill();
  // A soft field hit so the whole back has a faint sheen.
  f.save();
  f.globalCompositeOperation = 'lighter';
  roundRect(f, pad * 0.36, pad * 0.36, W - pad * 0.72, H - pad * 0.72, 26 * k);
  f.fillStyle = radial(f, cx, cy, 0, Math.max(W, H) * 0.7, [
    [0, 'rgba(255,255,255,0.22)'],
    [1, 'rgba(255,255,255,0.04)'],
  ]);
  f.fill();
  f.restore();
  f.save();
  f.globalCompositeOperation = 'destination-in';
  roundRect(f, pad * 0.3, pad * 0.3, W - pad * 0.6, H - pad * 0.6, 24 * k);
  f.fillStyle = '#ffffff';
  f.fill();
  f.restore();

  return { color, foil };
}
