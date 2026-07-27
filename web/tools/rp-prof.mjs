import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
const PORT = Number(process.argv[2] ?? 4350);
const TIERS = (process.argv[3] ?? 'high').split(',');
const server = spawn('npx', ['vite', 'preview', '--config', 'rp-vite.config.mjs', '--port', String(PORT), '--host', '127.0.0.1'],
  { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] });
process.on('exit', () => server.kill('SIGTERM'));
const base = `http://127.0.0.1:${PORT}/`;
for (let i = 0; i < 200; i++) { try { const r = await fetch(base); if (r.ok) break; } catch {} await new Promise(r => setTimeout(r, 250)); }
const PINNED = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: existsSync(PINNED) ? PINNED : undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb'] });
for (const q of TIERS) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.log(`  ERR[${q}]`, String(e).slice(0, 500)));
  await page.goto(`${base}?seed=vault-alpha&quality=${q}`, { waitUntil: 'domcontentloaded', timeout: 300000 });
  await page.waitForFunction(() => Boolean(window.__pipeline), null, { timeout: 300000 });
  const r = await page.evaluate(() => ({ profile: window.__pipeline.profile(6), stats: window.__pipeline.stats() }));
  console.log(q, JSON.stringify(r));
  await page.close();
}
await browser.close(); server.kill('SIGTERM'); process.exit(0);
