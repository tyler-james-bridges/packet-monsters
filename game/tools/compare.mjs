#!/usr/bin/env node
/**
 * Blind comparison sheet builder.
 *
 * Takes two directories of PNGs and emits an unlabelled A/B contact sheet plus
 * a separate key file. The reviewer is shown only the sheet, so the judgement
 * is genuinely blind: which panel is A and which is B is randomised per pair
 * and recorded only in the key, which the reviewer must not open.
 *
 *   node tools/compare.mjs --ours shots/latest --ref shots/reference --out shots/blind
 *
 * Pairs are matched by filename when both sides share names, otherwise every
 * image from each side is emitted as its own single-panel card so a reviewer
 * can still rank them without knowing the source.
 */
import { readdirSync, existsSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')
    ? process.argv[i + 1]
    : fallback;
}

const OURS = path.resolve(ROOT, arg('ours', 'shots/latest'));
const REF = path.resolve(ROOT, arg('ref', 'shots/reference'));
const OUT = path.resolve(ROOT, arg('out', 'shots/blind'));
const SEED = Number(arg('seed', '20260726'));

for (const dir of [OURS, REF]) {
  if (!existsSync(dir)) {
    console.error(`missing directory: ${dir}`);
    process.exit(1);
  }
}

// Deterministic shuffle so a review can be reproduced exactly.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x9e3779b9) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 16), 0x21f0aaad);
    t = Math.imul(t ^ (t >>> 15), 0x735a2d97);
    return ((t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}
const rand = rng(SEED);

const pngs = (dir) => readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.png')).sort();
const oursFiles = pngs(OURS);
const refFiles = pngs(REF);

const dataUri = (file) => `data:image/png;base64,${readFileSync(file).toString('base64')}`;

const shared = oursFiles.filter((f) => refFiles.includes(f));
const pairs = [];

if (shared.length) {
  for (const name of shared) {
    const flip = rand() < 0.5;
    pairs.push({
      name,
      A: flip ? path.join(REF, name) : path.join(OURS, name),
      B: flip ? path.join(OURS, name) : path.join(REF, name),
      aIs: flip ? 'reference' : 'ours',
      bIs: flip ? 'ours' : 'reference',
    });
  }
} else {
  // No shared filenames: pair positionally so each sheet still shows one image
  // from each source side by side.
  const n = Math.max(oursFiles.length, refFiles.length);
  for (let i = 0; i < n; i++) {
    const o = oursFiles[i % oursFiles.length];
    const r = refFiles[i % refFiles.length];
    const flip = rand() < 0.5;
    pairs.push({
      name: `pair-${String(i + 1).padStart(2, '0')}`,
      A: flip ? path.join(REF, r) : path.join(OURS, o),
      B: flip ? path.join(OURS, o) : path.join(REF, r),
      aIs: flip ? 'reference' : 'ours',
      bIs: flip ? 'ours' : 'reference',
    });
  }
}

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
    ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
    : undefined,
});
const page = await browser.newPage({ viewport: { width: 1720, height: 1000 }, deviceScaleFactor: 1 });

for (const pair of pairs) {
  const html = `<!doctype html><meta charset="utf-8"><style>
    html,body{margin:0;background:#0b0b0d;color:#d8dbe4;
      font:12px/1.4 ui-sans-serif,system-ui,sans-serif;letter-spacing:.14em}
    .wrap{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px}
    figure{margin:0}
    .tag{padding:6px 2px 8px;color:#8b93a7}
    img{width:100%;height:auto;display:block;border:1px solid #23262f;border-radius:4px}
  </style><div class="wrap">
    <figure><div class="tag">PANEL A</div><img src="${dataUri(pair.A)}"></figure>
    <figure><div class="tag">PANEL B</div><img src="${dataUri(pair.B)}"></figure>
  </div>`;
  await page.setContent(html, { waitUntil: 'load' });
  const file = path.join(OUT, `${path.basename(pair.name, '.png')}.png`);
  await page.screenshot({ path: file, fullPage: true, timeout: 60000 });
  console.log(`sheet -> ${path.relative(ROOT, file)}`);
}

await browser.close();

writeFileSync(
  path.join(OUT, 'KEY.do-not-open.json'),
  JSON.stringify({ seed: SEED, ours: OURS, ref: REF, pairs }, null, 2)
);
console.log(`\n${pairs.length} blind sheets in ${path.relative(ROOT, OUT)}`);
console.log('key written to KEY.do-not-open.json; the reviewer must not read it');
