import { ConfigProvider, theme, type ThemeConfig } from 'antd';
import {
  buildTheme,
  type Density,
  type NasckTheme,
  type ThemeMode,
} from '@nasckdev/nasck-ui-tokens';
import { useMemo, type ReactElement, type ReactNode } from 'react';

export interface AppThemeProviderProps {
  /** Id de um preset de `presets` (padrao: nasck). */
  preset?: string;
  mode?: ThemeMode;
  density?: Density;
  children?: ReactNode;
}

/**
 * Ultimo algoritmo da cadeia: o algoritmo escuro do antd recalcula cores (ate as semanticas) e
 * derruba o contraste calculado pelo pacote de tokens. Aqui os tokens do tema voltam a valer.
 */
function enforceTokens(nasck: NasckTheme): (seed: object, map?: object) => Record<string, unknown> {
  return (_seed, map) => ({ ...map, ...nasck.token });
}

/** Converte o tema neutro dos tokens em `ThemeConfig` do antd. */
export function toAntdTheme(nasck: NasckTheme): ThemeConfig {
  const base = nasck.algorithm.map((name) =>
    name === 'dark' ? theme.darkAlgorithm : theme.compactAlgorithm,
  );
  const chain = base.length > 0 ? base : [theme.defaultAlgorithm];
  return {
    algorithm: [...chain, enforceTokens(nasck) as unknown as typeof theme.darkAlgorithm],
    token: { ...nasck.token },
    components: nasck.components as ThemeConfig['components'],
  };
}

export function AppThemeProvider({
  preset = 'nasck',
  mode = 'light',
  density = 'default',
  children,
}: AppThemeProviderProps): ReactElement {
  const config = useMemo(
    () => toAntdTheme(buildTheme(preset, { mode, density })),
    [preset, mode, density],
  );
  return <ConfigProvider theme={config}>{children}</ConfigProvider>;
}

function flatten(token: object): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(token)) {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      out[key] = value;
    }
  }
  return out;
}

/** Tokens resolvidos pelo antd para o tema atual (leitura para telas e graficos). */
export function useThemeTokens(): Record<string, string | number | boolean> {
  const { token } = theme.useToken();
  return flatten(token);
}

/** Resolve os tokens finais (com o algoritmo do antd) de um tema dos tokens, fora de um provider. */
export function resolveTokens(nasck: NasckTheme): Record<string, string | number | boolean> {
  const config = toAntdTheme(nasck);
  return flatten(theme.getDesignToken({ algorithm: config.algorithm, token: config.token }));
}

export interface AppThemeScopeProps {
  theme: NasckTheme;
  children?: ReactNode;
}

/** Aplica um tema ja montado a uma subarvore (pre-visualizacoes, construtor de tema). */
export function AppThemeScope({ theme: nasck, children }: AppThemeScopeProps): ReactElement {
  return <ConfigProvider theme={toAntdTheme(nasck)}>{children}</ConfigProvider>;
}
