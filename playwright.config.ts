import { defineConfig } from '@playwright/test';

const PORT = 4173;
const channel = process.env['PW_CHANNEL'];

export default defineConfig({
  testDir: 'e2e',
  timeout: 1_800_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    ...(channel ? { channel } : {}),
  },
  webServer: {
    command: `node scripts/serve.mjs ${PORT}`,
    url: `http://localhost:${PORT}/projetos/nasck-ui/`,
    reuseExistingServer: !process.env['CI'],
    timeout: 60_000,
  },
});
