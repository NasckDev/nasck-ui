import { applicationConfig, componentWrapperDecorator, moduleMetadata } from '@storybook/angular';
import type { Preview } from '@storybook/angular';
import { presets } from '@nasckdev/nasck-ui-tokens';
import { AppThemeProviderComponent } from '../src/ui/theme';
import { provideNasckUi } from '../src/ui/providers';

const preview: Preview = {
  decorators: [
    applicationConfig({ providers: [provideNasckUi()] }),
    moduleMetadata({ imports: [AppThemeProviderComponent] }),
    componentWrapperDecorator(
      (story) =>
        `<app-theme-provider [preset]="nasckPreset" [mode]="nasckMode" [density]="nasckDensity">
           <div style="padding: 24px; min-height: 100vh; box-sizing: border-box;">${story}</div>
         </app-theme-provider>`,
      ({ globals }) => ({
        nasckPreset: String(globals['preset'] ?? 'nasck'),
        nasckMode: globals['mode'] === 'dark' ? 'dark' : 'light',
        nasckDensity: globals['density'] === 'compact' ? 'compact' : 'default',
      }),
    ),
  ],
  initialGlobals: { preset: 'nasck', mode: 'light', density: 'default' },
  globalTypes: {
    preset: {
      description: 'Preset de paleta',
      toolbar: {
        title: 'Preset de tema',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: presets.map((preset) => ({ value: preset.id, title: preset.label })),
      },
    },
    mode: {
      description: 'Modo de cor',
      toolbar: {
        title: 'Modo',
        icon: 'circlehollow',
        dynamicTitle: true,
        items: [
          { value: 'light', title: 'Claro' },
          { value: 'dark', title: 'Escuro' },
        ],
      },
    },
    density: {
      description: 'Densidade',
      toolbar: {
        title: 'Densidade',
        icon: 'component',
        dynamicTitle: true,
        items: [
          { value: 'default', title: 'Padrão' },
          { value: 'compact', title: 'Compacta' },
        ],
      },
    },
  },
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    a11y: { test: 'error' },
    options: { storySort: { order: ['Visão geral', 'Componentes', 'Modelos', 'Tema'] } },
  },
  tags: ['autodocs'],
};

export default preview;
