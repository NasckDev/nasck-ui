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

  it('uses the on-brand ink on the Nasck orange and the dark algorithm in dark mode', () => {
    expect(buildTheme('nasck').token.colorTextLightSolid).toBe('#160700');
    expect(buildTheme('nasck', { mode: 'dark' }).token.colorTextLightSolid).toBe('#160700');
    expect(buildTheme('nasck', { mode: 'dark', density: 'compact' }).algorithm).toEqual([
      'dark',
      'compact',
    ]);
  });

  it('applies the Nasck identity tokens (brand, brand text, paper, radius and Geist)', () => {
    const light = buildTheme('nasck').token;
    expect(light.colorPrimary).toBe('#F0501C');
    // O laranja de texto do design so e escurecido o minimo para passar sobre o tom do menu.
    expect(light.colorLink).toBe(ensureContrast('#C73D10', String(light.colorPrimaryBg), 4.6));
    expect(light.colorBgLayout).toBe('#FAFAF7');
    expect(light.colorText).toBe('#111111');
    expect(light.colorBorder).toBe('#111111');
    expect(light.borderRadius).toBe(3);
    expect(String(light.fontFamily)).toMatch(/^'Geist Variable'/);
    expect(String(light.fontFamilyCode)).toMatch(/^'Geist Mono Variable'/);
    const dark = buildTheme('nasck', { mode: 'dark' }).token;
    expect(dark.colorBgLayout).toBe('#121110');
    expect(dark.colorLink).toBe('#FF8A5C');
  });

  it('never puts white text on an orange primary', () => {
    for (const color of ['#F0501C', '#FF5B14', '#E8604C', '#FF8A00']) {
      for (const mode of ['light', 'dark'] as const) {
        const { token } = buildTheme('nasck', { mode, primary: color });
        expect(token.colorTextLightSolid).not.toBe('#FFFFFF');
        expect(
          contrastRatio(String(token.colorTextLightSolid), String(token.colorPrimary)),
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('falls back to black or white when the preset on-color fails on a custom primary', () => {
    const { token } = buildTheme('nasck', { primary: '#1D1D6B' });
    expect(token.colorTextLightSolid).toBe('#FFFFFF');
    expect(contrastRatio('#FFFFFF', String(token.colorPrimary))).toBeGreaterThanOrEqual(4.5);
  });

  it('derives the link from a custom primary instead of the preset brand text', () => {
    const { token } = buildTheme('nasck', { primary: '#2F6BFF' });
    expect(token.colorLink).not.toBe('#C73D10');
    expect(contrastRatio(String(token.colorLink), '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps the derived border for presets without a border override', () => {
    const { token } = buildTheme('opsflow');
    expect(token.colorBorder).not.toBe('#111418');
    expect(
      contrastRatio(String(token.colorBorder), String(token.colorBgContainer)),
    ).toBeGreaterThanOrEqual(3);
  });

  it('throws a clear error for unknown presets', () => {
    expect(() => buildTheme('nope')).toThrow(/Preset desconhecido/);
  });

  it('converts tokens to ng-zorro css variables', () => {
    const vars = toCssVariables({ colorPrimary: '#FF5B14', borderRadius: 4, wireframe: false });
    expect(vars).toEqual({ '--ant-color-primary': '#FF5B14', '--ant-border-radius': '4px' });
  });
});
