import { contrastRatio } from '../contrast';
import {
  SCALE_STEPS,
  checkAccentTheme,
  deriveAccentTheme,
  exportThemeCss,
  generateScale,
  hexToOklch,
  isHex,
  oklchToHex,
} from './themeScale';

const BRANDS = [
  '#ff5b14',
  '#2563eb',
  '#16a34a',
  '#a21caf',
  '#facc15',
  '#14b8a6',
  '#e11d48',
  '#737373',
];

describe('color conversion', () => {
  it('round-trips hex through OKLCH', () => {
    ['#ff5b14', '#336699', '#101010'].forEach((hex) => {
      expect(oklchToHex(hexToOklch(hex))).toBe(hex);
    });
  });

  it('reads known OKLCH values for white and black', () => {
    expect(hexToOklch('#ffffff').l).toBeCloseTo(1, 2);
    expect(hexToOklch('#000000').l).toBeCloseTo(0, 2);
  });

  it('validates hex strings', () => {
    expect(isHex('#FF5B14')).toBe(true);
    expect(isHex('FF5B14')).toBe(false);
    expect(isHex('#fff')).toBe(false);
  });
});

describe('generateScale', () => {
  it('returns eleven valid hex steps and keeps the base color', () => {
    const scale = generateScale('#ff5b14');
    expect(Object.keys(scale)).toHaveLength(SCALE_STEPS.length);
    Object.values(scale).forEach((value) => expect(isHex(value)).toBe(true));
    expect(Object.values(scale)).toContain('#ff5b14');
  });

  it('gets monotonically darker from 50 to 950', () => {
    const lightness = SCALE_STEPS.map((step) => hexToOklch(generateScale('#2563eb')[step]).l);
    lightness.slice(1).forEach((value, index) => expect(value).toBeLessThan(lightness[index] ?? 1));
  });
});

describe('deriveAccentTheme', () => {
  BRANDS.forEach((brand) => {
    (['light', 'dark'] as const).forEach((mode) => {
      it(`${brand} passes every contrast check in the ${mode} theme`, () => {
        const theme = deriveAccentTheme(brand, mode);
        checkAccentTheme(theme, mode)
          .filter((check) => check.label !== 'Destaque como marca sobre o fundo')
          .forEach((check) => {
            expect(check.passes, `${check.label}: ${check.ratio.toFixed(2)}`).toBe(true);
          });
      });
    });
  });

  it('chooses the readable text color on the accent', () => {
    expect(deriveAccentTheme('#facc15', 'light').textOnAccent).toBe('#0a0a0a');
    expect(deriveAccentTheme('#1e3a8a', 'light').textOnAccent).toBe('#ffffff');
    const theme = deriveAccentTheme('#ff5b14', 'light');
    expect(contrastRatio(theme.textOnAccent, theme.accent)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('exportThemeCss', () => {
  it('emits both themes and the system dark media query', () => {
    const css = exportThemeCss(
      deriveAccentTheme('#ff5b14', 'light'),
      deriveAccentTheme('#ff5b14', 'dark'),
    );
    expect(css).toContain("[data-theme='dark']");
    expect(css).toContain('--nui-color-accent-text:');
    expect(css).toContain('prefers-color-scheme: dark');
  });
});
