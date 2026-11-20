import { defineConfig } from '@playwright/test';

const PORT = 4399;

// Locally set PW_CHANNEL=chrome to reuse the installed Chrome; CI installs Playwright's Chromium.
const channel = process.env.PW_CHANNEL || undefined;

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}/`,
    channel,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npm run preview:playground -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
