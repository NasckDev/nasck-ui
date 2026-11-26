import '@fontsource-variable/geist/wght.css';
import '@fontsource-variable/geist-mono/wght.css';
import type { Decorator, Preview } from '@storybook/react-vite';
import { presets, type ThemeMode } from '@nasckdev/nasck-ui-tokens';
import type { ReactElement, ReactNode } from 'react';
import { AppThemeProvider, useThemeTokens } from '../src/ui/AppThemeProvider.tsx';
import { nasckTheme, prefersDark } from './nasck-theme';

/** Na pagina de docs a story fica dentro do bloco, sem ocupar a altura da tela. */
function Frame({ children, inDocs }: { children: ReactNode; inDocs: boolean }): ReactElement {
  const token = useThemeTokens();
  return (
    <div
      style={{
        background: String(token['colorBgLayout']),
        color: String(token['colorText']),
        fontFamily: String(token['fontFamily']),
        padding: Number(token['paddingLG']),
        minHeight: inDocs ? undefined : '100vh',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
}

const withNasckTheme: Decorator = (Story, context) => {
  const preset = String(context.globals['preset'] ?? 'nasck');
  const mode = (context.globals['mode'] === 'dark' ? 'dark' : 'light') satisfies ThemeMode;
  const density = context.globals['density'] === 'compact' ? 'compact' : 'default';
  if (typeof document !== 'undefined') document.documentElement.dataset['theme'] = mode;
  return (
    <AppThemeProvider preset={preset} mode={mode} density={density}>
      <Frame inDocs={context.viewMode === 'docs'}>
        <Story />
      </Frame>
    </AppThemeProvider>
  );
};

const preview: Preview = {
  decorators: [withNasckTheme],
  initialGlobals: { preset: 'nasck', mode: prefersDark() ? 'dark' : 'light', density: 'default' },
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
    controls: { expanded: true, matchers: { date: /Date$/ } },
    a11y: { test: 'error' },
    docs: { theme: nasckTheme() },
    options: { storySort: { order: ['Visão geral', 'Componentes', 'Modelos', 'Tema'] } },
  },
  tags: ['autodocs'],
};

export default preview;
