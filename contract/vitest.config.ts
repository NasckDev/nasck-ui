import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['contract/**/*.test.ts'],
    root: new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'),
  },
});
