import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  base: './',
  plugins: [glsl({ compress: false })],
  server: { port: 5178, host: '127.0.0.1' },
  preview: { port: 4173, host: '127.0.0.1' },
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 2048,
  },
});
