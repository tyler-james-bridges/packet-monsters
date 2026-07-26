#!/usr/bin/env node
// Private capture harness for the render pipeline review loop. Same in page
// contract as tools/shoot.mjs, but builds through rp-vite.config.mjs into
// dist-rp so parallel builds by other agents cannot race the output.
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d;
};
const has = (n) => process.argv.includes(`--${n}`);

const OUT = path.resolve(ROOT, arg('out', 'shots/rp-latest'));
const WIDTH = Number(arg('width', 1600));
const HEIGHT = Number(arg('height', 1000));
const SEED = arg('seed', 'vault-alpha');
const SHOTS = arg('shots', '').split(',').filter(Boolean);
const PORT = Number(arg('port', 4300));
const DPR = Number(arg('dpr', 1));

if (!has('skip-build')) {
  const r = spawnSync('npx', ['vite', 'build', '--config', 'rp-vite.config.mjs', '--logLevel', 'warn'], {
    cwd: ROOT, stdio: 'inherit', env: { ...process.env },
  });
  if (r.status !== 0) { console.error('build failed'); process.exit(1); }
}

const server = spawn('npx', ['vite', 'preview', '--config', 'rp-vite.config.mjs', '--port', String(PORT), '--host', '127.0.0.1'], {
  cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env },
});
const shutdown = () => { try { server.kill('SIGTERM'); } catch {} };
process.on('exit', shutdown);
process.on('SIGINT', () => { shutdown(); process.exit(130); });

const base = `http://127.0.0.1:${PORT}/`;
let up = false;
for (let i = 0; i < 200; i++) {
  try { const r = await fetch(base); if (r.ok) { up = true; break; } } catch {}
  await new Promise((r) => setTimeout(r, 250));
}
if (!up) { console.error('server never came up'); process.exit(1); }

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const PINNED = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({
  executablePath: existsSync(PINNED) ? PINNED : undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
         '--disable-frame-rate-limit', '--force-color-profile=srgb', '--hide-scrollbars'],
});
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: DPR, colorScheme: 'dark' });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto(`${base}?seed=${encodeURIComponent(SEED)}`, { waitUntil: 'domcontentloaded', timeout: 300000 });
await page.waitForFunction(() => Boolean(window.__harness), null, { timeout: 60000 });
const available = await page.evaluate(() => window.__harness.shots);
const targets = SHOTS.length ? SHOTS.filter((s) => available.includes(s)) : available;

for (const shot of targets) {
  const t0 = Date.now();
  await page.goto(`${base}?seed=${encodeURIComponent(SEED)}&shot=${encodeURIComponent(shot)}`, { waitUntil: 'domcontentloaded', timeout: 300000 });
  await page.waitForFunction(() => window.__harness && window.__harness.ready === true, null, { timeout: 300000 });
  const stats = await page.evaluate(() => ({
    pipeline: window.__pipeline?.stats?.() ?? null,
    draws: window.__ctx?.renderer?.info?.render?.calls ?? null,
    tris: window.__ctx?.renderer?.info?.render?.triangles ?? null,
    textures: window.__ctx?.renderer?.info?.memory?.textures ?? null,
    programs: window.__ctx?.renderer?.info?.programs?.length ?? null,
  }));
  const file = path.join(OUT, `${shot}.png`);
  await page.screenshot({ path: file, timeout: 180000, animations: 'disabled', caret: 'hide' });
  console.log(`captured ${shot} in ${((Date.now() - t0) / 1000).toFixed(1)}s -> ${path.relative(ROOT, file)}`);
  console.log(`  stats ${JSON.stringify(stats)}`);
}

await browser.close();
shutdown();
if (errors.length) {
  console.error(`\npage errors (${errors.length}):`);
  for (const e of errors.slice(0, 20)) console.error(`  ${e}`);
}
console.log(`\ndone`);
process.exit(0);
