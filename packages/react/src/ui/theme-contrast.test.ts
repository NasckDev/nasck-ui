import { buildTheme, checkTheme, presets, type ResolvedTokens } from '@nasckdev/nasck-ui-tokens';
import { describe, expect, it } from 'vitest';
import { resolveTokens } from './AppThemeProvider.tsx';

describe('contraste AA dos tokens resolvidos pelo antd', () => {
  for (const preset of presets) {
    for (const mode of ['light', 'dark'] as const) {
      it(`${preset.id}/${mode}: todos os pares passam`, () => {
        const resolved = resolveTokens(buildTheme(preset, { mode }));
        const checks = checkTheme(resolved as ResolvedTokens);
        // Garante que os pares sobre o tom claro (tags) foram mesmo avaliados.
        expect(checks.some((row) => row.id === 'success-tint')).toBe(true);
        const failures = checks
          .filter((row) => !row.pass)
          .map((row) => `${row.id} ${row.ratio.toFixed(2)}`);
        expect(failures).toEqual([]);
      });
    }
  }
});
