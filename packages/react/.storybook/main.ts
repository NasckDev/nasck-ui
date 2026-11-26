import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const require = createRequire(import.meta.url);
const fontDir = (name: string): string =>
  join(dirname(require.resolve(`${name}/package.json`)), 'files');

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  staticDirs: [
    { from: fontDir('@fontsource-variable/geist'), to: '/fonts/geist' },
    { from: fontDir('@fontsource-variable/geist-mono'), to: '/fonts/geist-mono' },
  ],
  core: { disableTelemetry: true },
  viteFinal: (viteConfig) => ({ ...viteConfig, base: './' }),
};

export default config;
