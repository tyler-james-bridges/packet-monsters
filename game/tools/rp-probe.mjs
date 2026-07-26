import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const ROOT = '/home/user/packet-monsters/game';
const PORT = Number(process.argv[2] ?? 4212);
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--host', '127.0.0.1'], {
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
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb'],
});
const page = await browser.newPage({ viewport: { width: 800, height: 500 }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.log('PAGEERROR:', String(e).slice(0, 5000)));
page.on('console', (m) => console.log(`CONSOLE[${m.type()}]:`, m.text().slice(0, 5000)));
await page.goto(`${base}?seed=vault-alpha`, { waitUntil: 'load' });
await new Promise((r) => setTimeout(r, 15000));
const info = await page.evaluate(() => ({
  harness: Boolean(window.__harness),
  pipeline: Boolean(window.__pipeline),
  stats: window.__pipeline?.stats?.() ?? null,
}));
console.log('INFO:', JSON.stringify(info));
await browser.close();
server.kill('SIGTERM');
process.exit(0);
