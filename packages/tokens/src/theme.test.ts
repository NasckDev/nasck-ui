import { describe, expect, it } from 'vitest';
import { checkTheme, contrastRatio, ensureContrast, parseHex, toCssVariables } from './index.ts';
import { buildTheme } from './theme.ts';
import { presets } from './presets.ts';

describe('contrast', () => {
  it('computes known ratios', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0);
    expect(contrastRatio('#777777', '#FFFFFF')).toBeGreaterThan(4.4);
  });

  it('rejects malformed colors', () => {
    expect(() => parseHex('orange')).toThrow(/Cor invalida/);
  });

  it('adjusts a color until it reaches the target ratio on both light and dark', () => {
    const onLight = ensureContrast('#FF5B14', '#FFFFFF', 4.5);
    const onDark = ensureContrast('#0E3B2E', '#141414', 3);
    expect(contrastRatio(onLight, '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(onDark, '#141414')).toBeGreaterThanOrEqual(3);
  });
});

describe('buildTheme', () => {
  for (const preset of presets) {
    for (const mode of ['light', 'dark'] as const) {
      it(`${preset.id}/${mode}: every contrast pair passes AA`, () => {
        const { token } = buildTheme(preset, { mode });
        const failures = checkTheme(token as Record<string, string>).filter((row) => !row.pass);
        expect(failures.map((row) => `${row.id} ${row.ratio.toFixed(2)}`)).toEqual([]);
      });
    }
  }

  it('uses dark text on the Nasck orange and the dark algorithm in dark mode', () => {
    expect(buildTheme('nasck').token.colorTextLightSolid).toBe('#0A0A0A');
    expect(buildTheme('nasck', { mode: 'dark', density: 'compact' }).algorithm).toEqual([
      'dark',
      'compact',
    ]);
  });

  it('throws a clear error for unknown presets', () => {
    expect(() => buildTheme('nope')).toThrow(/Preset desconhecido/);
  });

  it('converts tokens to ng-zorro css variables', () => {
    const vars = toCssVariables({ colorPrimary: '#FF5B14', borderRadius: 4, wireframe: false });
    expect(vars).toEqual({ '--ant-color-primary': '#FF5B14', '--ant-border-radius': '4px' });
  });
});
