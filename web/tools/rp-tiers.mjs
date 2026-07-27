import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
const PORT = Number(process.argv[2] ?? 4330);
const server = spawn('npx', ['vite', 'preview', '--config', 'rp-vite.config.mjs', '--port', String(PORT), '--host', '127.0.0.1'],
  { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] });
process.on('exit', () => server.kill('SIGTERM'));
const base = `http://127.0.0.1:${PORT}/`;
for (let i = 0; i < 200; i++) { try { const r = await fetch(base); if (r.ok) break; } catch {} await new Promise(r => setTimeout(r, 250)); }
const PINNED = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: existsSync(PINNED) ? PINNED : undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb'] });
for (const q of (process.argv[3] ?? 'low,medium,high,ultra').split(',')) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.log(`  PAGEERROR[${q}]:`, String(e).slice(0, 800)));
  await page.goto(`${base}?seed=vault-alpha&quality=${q}`, { waitUntil: 'domcontentloaded', timeout: 300000 });
  await page.waitForFunction(() => Boolean(window.__pipeline), null, { timeout: 300000 });
  await new Promise(r => setTimeout(r, 4000));
  const s = await page.evaluate(() => new Promise((res) => {
    let ticks = 0; const t0 = performance.now();
    const tick = () => { ticks++; if (performance.now() - t0 < 4000) requestAnimationFrame(tick);
      else res({ fps: +(ticks / 4).toFixed(2), stats: window.__pipeline.stats() }); };
    requestAnimationFrame(tick);
  }));
  console.log(q, JSON.stringify(s));
  await page.close();
}
await browser.close(); server.kill('SIGTERM'); process.exit(0);
