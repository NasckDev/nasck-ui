// Pagina de entrada da demo portatil: HTML estatico mais os especimes reais (wrappers React).
// `npm run dev:portable` em http://localhost:5195; o `build:portable` gera portable-dist/.
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { applyStats, portableStats } from '../scripts/portable-stats.ts';

const ROOT = dirname(fileURLToPath(import.meta.url));

function nasckStats(): Plugin {
  return {
    name: 'nasck-stats',
    transformIndexHtml: (html) => applyStats(html, portableStats()),
  };
}

export default defineConfig({
  root: ROOT,
  base: './',
  plugins: [react(), nasckStats()],
  server: { port: 5195, strictPort: true },
  preview: { port: 5195, strictPort: true },
  build: {
    outDir: '../portable-dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: false,
  },
});
