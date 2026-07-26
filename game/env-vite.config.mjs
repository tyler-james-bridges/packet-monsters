// Temporary build config for the environment agent's review captures. Builds to
// its own outDir so parallel agents building into dist/ cannot clobber a run.
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  base: './',
  plugins: [glsl({ compress: false })],
  build: { target: 'es2022', outDir: '.envdist', sourcemap: false, chunkSizeWarningLimit: 2048 },
  preview: { port: 4881, host: '127.0.0.1', strictPort: true },
});
