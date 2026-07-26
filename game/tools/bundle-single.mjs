#!/usr/bin/env node
/**
 * Inline the built app into one self-contained HTML file.
 *
 * The publish target forbids requests to any external host, so the CSS and the
 * JS bundle are embedded as text rather than linked. Card data is already
 * compiled into the bundle, so the result has no runtime fetch at all and runs
 * from a file:// URL as happily as from a server.
 *
 *   npx vite build && node tools/bundle-single.mjs --out dist/vault.html
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const ASSETS = path.join(DIST, 'assets');

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const OUT = path.resolve(ROOT, arg('out', 'dist/vault.html'));

const files = readdirSync(ASSETS);
const jsName = files.find((f) => f.endsWith('.js'));
const cssName = files.find((f) => f.endsWith('.css'));
if (!jsName) throw new Error('no js bundle in dist/assets; run vite build first');

const js = readFileSync(path.join(ASSETS, jsName), 'utf8');
const css = cssName ? readFileSync(path.join(ASSETS, cssName), 'utf8') : '';

// A closing script tag inside a string literal in the bundle would terminate the
// inline script element early. Escaping the sequence is the standard fix and is
// invisible to the parser that reads the string back.
const safeJs = js.replace(/<\/script/gi, '<\\/script');

// The charset declaration must be the very first bytes of the document. The
// publish wrapper supplies its own head, so this lands in the body, but the
// encoding prescan reads the first 1024 bytes regardless of element position
// and honours it. Without this the interpuncts in the HUD render as mojibake
// whenever the file is opened over file:// or served without a charset header.
const html = `<meta charset="utf-8">
<title>Packet Monsters / Sealed Vault</title>

<style>
${css}

/* Wrapper-only styles. The app owns everything inside #app; these exist purely
   to hold the frame before the first render and to say something useful when
   the device cannot give us WebGL2 at all. */
.boot {
  position: fixed;
  inset: 0;
  display: grid;
  place-content: center;
  gap: 14px;
  justify-items: center;
  background: #05060a;
  color: #7c88a8;
  font: 11px/1.5 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  letter-spacing: 0.22em;
  z-index: 50;
  transition: opacity 600ms ease;
}
.boot[hidden] {
  display: none;
}
.boot.is-done {
  opacity: 0;
  pointer-events: none;
}
.boot-mark {
  width: 34px;
  height: 34px;
  border: 1px solid #2a3350;
  border-radius: 8px;
  display: grid;
  place-content: center;
  font-size: 10px;
  color: #8fb6ff;
}
.boot-bar {
  width: 172px;
  height: 1px;
  background: #1a2032;
  overflow: hidden;
}
.boot-bar i {
  display: block;
  height: 100%;
  width: 40%;
  background: #8fb6ff;
  animation: sweep 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@keyframes sweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}
@media (prefers-reduced-motion: reduce) {
  .boot-bar i { animation: none; width: 100%; opacity: 0.5; }
  .boot { transition: none; }
}
.boot-note {
  max-width: 34ch;
  text-align: center;
  letter-spacing: 0.06em;
  line-height: 1.7;
  color: #5d6780;
}
</style>

<div id="app">
  <canvas id="stage"></canvas>
  <div id="ui"></div>
</div>

<div class="boot" id="boot">
  <div class="boot-mark">PM</div>
  <div>SEALED VAULT</div>
  <div class="boot-bar"><i></i></div>
</div>

<script type="module">
const boot = document.getElementById('boot');

// Fail loudly and legibly rather than leaving a black rectangle on screen.
const probe = document.createElement('canvas').getContext('webgl2');
if (!probe) {
  boot.innerHTML =
    '<div class="boot-mark">PM</div><div>SEALED VAULT</div>' +
    '<p class="boot-note">This vault needs WebGL2, which this browser is not ' +
    'providing. Try a current Chrome, Firefox or Safari with hardware ' +
    'acceleration enabled.</p>';
} else {
  window.addEventListener('error', (e) => {
    boot.innerHTML =
      '<div class="boot-mark">PM</div><div>SEALED VAULT</div>' +
      '<p class="boot-note">The vault failed to start: ' +
      String(e.message).slice(0, 160) +
      '</p>';
  });

  ${safeJs}

  // The app renders its first frame synchronously on module evaluation, so by
  // the time the next frame lands there is something real behind the overlay.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      boot.classList.add('is-done');
      setTimeout(() => { boot.hidden = true; }, 650);
    });
  });
}
</script>
`;

writeFileSync(OUT, html);
const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
console.log(`wrote ${path.relative(ROOT, OUT)} (${kb} KB, fully self contained)`);
