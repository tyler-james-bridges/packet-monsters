#!/usr/bin/env node
/**
 * Deterministic screenshot harness.
 *
 * Builds the app, serves it, drives the in page shot registry and captures a
 * PNG per named state. Every run with the same seed produces the same frame,
 * which is what lets the review loop compare two revisions honestly.
 *
 *   node tools/shoot.mjs --out shots/run-01 --shots idle,hero,reveal-legendary
 *   node tools/shoot.mjs --out shots/x --width 1920 --height 1080 --skip-build
 */
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync } from 'node:fs';
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
const has = (name) => process.argv.includes(`--${name}`);

const OUT = path.resolve(ROOT, arg('out', 'shots/latest'));
const WIDTH = Number(arg('width', 1600));
const HEIGHT = Number(arg('height', 1000));
const SEED = arg('seed', 'vault-alpha');
const SHOTS = arg('shots', '').split(',').filter(Boolean);
const PORT = Number(arg('port', 4173));
const DPR = Number(arg('dpr', 2));

if (!has('skip-build')) {
  const r = spawnSync('npx', ['vite', 'build', '--logLevel', 'warn'], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  if (r.status !== 0) {
    console.error('build failed');
    process.exit(1);
  }
}

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--host', '127.0.0.1'], {
  cwd: ROOT,
  stdio: ['ignore', 'pipe', 'pipe'],
});
const shutdown = () => {
  try {
    server.kill('SIGTERM');
  } catch {
    /* already gone */
  }
};
process.on('exit', shutdown);
process.on('SIGINT', () => {
  shutdown();
  process.exit(130);
});

async function waitForServer(url, timeoutMs = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`server did not start at ${url}`);
}

const base = `http://127.0.0.1:${PORT}/`;
await waitForServer(base);

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// The environment ships a pinned Chromium that will not always match the
// playwright package version, so point at it explicitly rather than letting
// playwright resolve a download it is not allowed to fetch.
const PINNED_CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({
  executablePath: existsSync(PINNED_CHROME) ? PINNED_CHROME : undefined,
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--disable-frame-rate-limit',
    '--force-color-profile=srgb',
    '--hide-scrollbars',
  ],
});
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: DPR,
  colorScheme: 'dark',
});

const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});

async function discoverShots() {
  await page.goto(`${base}?seed=${encodeURIComponent(SEED)}`, { waitUntil: 'load' });
  await page.waitForFunction(() => Boolean(window.__harness), null, { timeout: 30000 });
  return page.evaluate(() => window.__harness.shots);
}

const available = await discoverShots();
const targets = SHOTS.length ? SHOTS.filter((s) => available.includes(s)) : available;
const missing = SHOTS.filter((s) => !available.includes(s));
if (missing.length) console.warn(`unregistered shots skipped: ${missing.join(', ')}`);

const captured = [];
for (const shot of targets) {
  await page.goto(`${base}?seed=${encodeURIComponent(SEED)}&shot=${encodeURIComponent(shot)}`, {
    waitUntil: 'load',
  });
  await page.waitForFunction(() => window.__harness && window.__harness.ready === true, null, {
    timeout: 60000,
  });
  const file = path.join(OUT, `${shot}.png`);
  await page.screenshot({ path: file, timeout: 120000, animations: 'disabled', caret: 'hide' });
  captured.push(file);
  console.log(`captured ${shot} -> ${path.relative(ROOT, file)}`);
}

await browser.close();
shutdown();

if (errors.length) {
  console.error(`\npage errors (${errors.length}):`);
  for (const e of errors.slice(0, 20)) console.error(`  ${e}`);
  process.exit(2);
}
console.log(`\n${captured.length} shots in ${path.relative(ROOT, OUT)}`);
