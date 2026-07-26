import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
const PORT = Number(process.argv[2] ?? 4310);
const server = spawn('npx', ['vite', 'preview', '--config', 'rp-vite.config.mjs', '--port', String(PORT), '--host', '127.0.0.1'],
  { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] });
process.on('exit', () => server.kill('SIGTERM'));
const base = `http://127.0.0.1:${PORT}/`;
for (let i = 0; i < 200; i++) { try { const r = await fetch(base); if (r.ok) break; } catch {} await new Promise(r => setTimeout(r, 250)); }
const PINNED = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: existsSync(PINNED) ? PINNED : undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-frame-rate-limit', '--force-color-profile=srgb'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.log('PAGEERROR:', String(e).slice(0, 2000)));
await page.goto(`${base}?seed=vault-alpha`, { waitUntil: 'domcontentloaded', timeout: 300000 });
await page.waitForFunction(() => Boolean(window.__pipeline), null, { timeout: 300000 });
const r = await page.evaluate(() => new Promise((resolve) => {
  const marks = [];
  let n = 0;
  const tick = () => {
    marks.push(performance.now());
    if (++n < 22) requestAnimationFrame(tick);
    else {
      const d = [];
      for (let i = 1; i < marks.length; i++) d.push(marks[i] - marks[i - 1]);
      d.sort((a, b) => a - b);
      resolve({ medianMs: d[d.length >> 1], minMs: d[0], maxMs: d[d.length - 1], stats: window.__pipeline.stats() });
    }
  };
  requestAnimationFrame(tick);
}));
console.log(JSON.stringify(r, null, 2));
await browser.close(); server.kill('SIGTERM'); process.exit(0);
