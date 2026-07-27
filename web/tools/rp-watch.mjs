import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
const PORT = Number(process.argv[2] ?? 4360);
const FLAGS = process.argv[3] === 'nolimit' ? ['--disable-frame-rate-limit'] : [];
const server = spawn('npx', ['vite','preview','--config','rp-vite.config.mjs','--port',String(PORT),'--host','127.0.0.1'],
  { cwd: process.cwd(), stdio: ['ignore','pipe','pipe'] });
process.on('exit', () => server.kill('SIGTERM'));
const base = `http://127.0.0.1:${PORT}/`;
for (let i=0;i<200;i++){ try{const r=await fetch(base); if(r.ok)break;}catch{} await new Promise(r=>setTimeout(r,250)); }
const PINNED='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: existsSync(PINNED)?PINNED:undefined,
  args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader',...FLAGS,'--force-color-profile=srgb'] });
const page = await browser.newPage({ viewport:{width:1600,height:1000}, deviceScaleFactor:1 });
page.on('pageerror', e=>console.log('ERR', String(e).slice(0,600)));
const t0=Date.now();
await page.goto(`${base}?seed=vault-alpha&shot=idle`, { waitUntil:'domcontentloaded', timeout:300000 });
await page.waitForFunction(()=>Boolean(window.__pipeline), null, { timeout:300000 });
console.log('pipeline at', ((Date.now()-t0)/1000).toFixed(1),'s');
for (let i=0;i<40;i++){
  await new Promise(r=>setTimeout(r,3000));
  const s = await page.evaluate(()=>({ ready: window.__harness?.ready, frames: window.__pipeline?.stats?.().frames }));
  console.log(`${((Date.now()-t0)/1000).toFixed(0)}s ready=${s.ready} frames=${s.frames}`);
  if (s.ready) break;
}
await browser.close(); server.kill('SIGTERM'); process.exit(0);
