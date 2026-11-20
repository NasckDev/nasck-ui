import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Nasck UI',
    colorPrimary: '#FF5B14',
    colorSecondary: '#C2410C',
    appBg: '#FFFFFF',
    appContentBg: '#FFFFFF',
    appBorderColor: '#E5E5E5',
    appBorderRadius: 4,
    textColor: '#0A0A0A',
    barTextColor: '#404040',
    barSelectedColor: '#C2410C',
    barBg: '#FFFFFF',
    fontBase: '"DM Sans Variable", "DM Sans", system-ui, sans-serif',
    fontCode: '"Space Mono", ui-monospace, monospace',
  }),
});
