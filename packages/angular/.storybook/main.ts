import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import type { StorybookConfig } from '@storybook/angular';

const require = createRequire(import.meta.url);
const fontDir = (name: string): string =>
  join(dirname(require.resolve(`${name}/package.json`)), 'files');

const config: StorybookConfig = {
  framework: '@storybook/angular',
  stories: ['../src/**/*.stories.ts'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  staticDirs: [
    { from: fontDir('@fontsource-variable/geist'), to: '/fonts/geist' },
    { from: fontDir('@fontsource-variable/geist-mono'), to: '/fonts/geist-mono' },
  ],
  core: { disableTelemetry: true },
};

export default config;
