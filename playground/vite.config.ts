import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// `base: './'` keeps every asset URL relative, so the build works under any subpath
// (GitHub Pages, Vercel, or a folder inside another site).
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: './',
  plugins: [react()],
  build: {
    outDir: fileURLToPath(new URL('../playground-dist', import.meta.url)),
    emptyOutDir: true,
  },
});
