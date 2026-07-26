#!/usr/bin/env node
/**
 * Fast UI-only capture. Skips the harness settle loop (which costs a minute per
 * shot under swiftshader) by loading the app live and driving the DOM directly.
 * Used only for design iteration; final verification still goes through
 * tools/shoot.mjs.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = '/home/user/packet-monsters/game';
const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d;
};
const OUT = path.resolve(ROOT, arg('out', 'shots/ui-fast'));
const PORT = Number(arg('port', 4291));
mkdirSync(OUT, { recursive: true });

const server = spawn('npx', ['vite', '--port', String(PORT), '--host', '127.0.0.1'], {
  cwd: ROOT,
  stdio: ['ignore', 'pipe', 'pipe'],
});
process.on('exit', () => server.kill('SIGTERM'));

const base = `http://127.0.0.1:${PORT}/`;
for (let i = 0; i < 120; i++) {
  try {
    const r = await fetch(base);
    if (r.ok) break;
  } catch {}
  await new Promise((r) => setTimeout(r, 250));
}

const PINNED = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({
  executablePath: existsSync(PINNED) ? PINNED : undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb', '--hide-scrollbars'],
});

const errors = [];
const sizes = [
  { id: 'desktop', w: 1600, h: 1000 },
  { id: 'mobile', w: 430, h: 932 },
];

for (const size of sizes) {
  const page = await browser.newPage({
    viewport: { width: size.w, height: size.h },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
  });
  page.on('pageerror', (e) => errors.push(`${size.id}: ${e}`));
  page.on('console', (m) => m.type() === 'error' && errors.push(`${size.id}: ${m.text()}`));
  await page.goto(`${base}?seed=vault-alpha`, { waitUntil: 'load' });
  await page.waitForSelector('.pull', { timeout: 30000 });
  await page.waitForTimeout(2500);

  await page.screenshot({ path: path.join(OUT, `${size.id}-idle.png`), animations: 'disabled' });
  console.log('idle', size.id);

  // Reveal, driven through the real bus so the readout gets a real position.
  await page.evaluate(() => {
    const m = window.__machine;
    const legendary = m.positions.find((p) => p.card.rarity === 4) ?? m.positions[0];
    window.__ctx?.bus.emit('reveal:start', { position: legendary, index: 0, total: 1 });
    window.__ctx?.bus.emit('reveal:settled', { position: legendary, index: 0 });
  });
  await page.waitForTimeout(1400);
  await page.screenshot({ path: path.join(OUT, `${size.id}-reveal.png`), animations: 'disabled' });
  console.log('reveal', size.id);

  await page.click('[data-view="odds"]');
  await page.waitForTimeout(1400);
  await page.screenshot({ path: path.join(OUT, `${size.id}-odds.png`), animations: 'disabled' });
  console.log('odds', size.id);

  await page.click('[data-view="collection"]');
  await page.waitForTimeout(1400);
  await page.screenshot({ path: path.join(OUT, `${size.id}-collection.png`), animations: 'disabled' });
  console.log('collection', size.id);

  await page.close();
}

await browser.close();
server.kill('SIGTERM');
if (errors.length) {
  console.error('page errors:');
  for (const e of errors.slice(0, 20)) console.error('  ' + e);
}
console.log('done');
process.exit(0);
