import { tokens } from '../../src/tokens/tokens';
import { contrastLevel, contrastRatio } from './contrast';
import { CONTRAST_PAIRS } from './pages/tokensData';

describe('contrastRatio', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(4.48, 2);
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5);
  });

  it('classifies ratios by WCAG level', () => {
    expect(contrastLevel(7.1)).toBe('AAA');
    expect(contrastLevel(4.5)).toBe('AA');
    expect(contrastLevel(3.2)).toBe('AA-large');
    expect(contrastLevel(2.9)).toBe('fail');
  });
});

describe('documented token pairs', () => {
  const themes = ['light', 'dark'] as const;
  themes.forEach((theme) => {
    CONTRAST_PAIRS.forEach((pair) => {
      it(`${theme}: ${pair.label} meets ${pair.required}:1`, () => {
        const colors = tokens.color[theme];
        expect(
          contrastRatio(colors[pair.foreground], colors[pair.background]),
        ).toBeGreaterThanOrEqual(pair.required);
      });
    });
  });
});
