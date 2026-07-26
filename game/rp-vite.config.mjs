import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import path from 'node:path';

const STUB = path.resolve(process.cwd(), 'tools/rp-hud-stub.js');
const USE_STUB = process.env.RP_STUB_HUD === '1';

/** Swaps the in-flight HUD module for an inert stub when RP_STUB_HUD=1. */
function stubHud() {
  return {
    name: 'rp-stub-hud',
    enforce: 'pre',
    resolveId(source) {
      if (!USE_STUB) return null;
      if (source === './ui/hud' || source.endsWith('/src/ui/hud.ts')) return STUB;
      return null;
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [stubHud(), glsl({ compress: false })],
  // A private output directory so concurrent builds from other agents cannot
  // empty dist/ out from under a capture run.
  build: { outDir: 'dist-rp', target: 'es2022', sourcemap: false, chunkSizeWarningLimit: 2048 },
  preview: { host: '127.0.0.1' },
});
