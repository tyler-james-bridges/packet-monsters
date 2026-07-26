#!/usr/bin/env node
/**
 * Boot diagnostic. Loads the built app against a running preview server and
 * reports harness state plus every page error and console error.
 *
 * A shot capture that times out tells you nothing about why. This does.
 *
 *   npx vite preview --port 4304 --host 127.0.0.1 &
 *   node tools/diag.mjs --port 4304
 */
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const PORT = Number(arg('port', 4173));
const WAIT = Number(arg('wait', 8000));
const PINNED = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: existsSync(PINNED) ? PINNED : undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const logs = [];
page.on('pageerror', (e) => logs.push(`PAGEERROR: ${e.message}\n${(e.stack || '').split('\n').slice(0, 4).join('\n')}`));
page.on('console', (m) => {
  if (m.type() === 'error') logs.push(`CONSOLE: ${m.text()}`);
});

await page.goto(`http://127.0.0.1:${PORT}/?seed=diag`, { waitUntil: 'load', timeout: 120000 });
await page.waitForTimeout(WAIT);

const state = await page.evaluate(() => ({
  harness: typeof window.__harness,
  shots: window.__harness ? window.__harness.shots : null,
}));
console.log('state:', JSON.stringify(state));
console.log(logs.length ? logs.slice(0, 12).join('\n---\n') : 'no errors');

await browser.close();
process.exit(logs.length ? 1 : 0);
