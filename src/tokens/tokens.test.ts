import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cssVarName, flattenTokens, tokensToCss } from './css';
import { tokens } from './tokens';

const readGeneratedCss = (): string =>
  readFileSync(resolve(process.cwd(), 'src/styles/tokens.css'), 'utf8');

describe('tokens.css', () => {
  it('is in sync with src/tokens/tokens.ts (run `npm run build:tokens` if this fails)', () => {
    expect(readGeneratedCss()).toBe(tokensToCss(tokens));
  });

  it('defines the same color roles in light and dark themes', () => {
    expect(Object.keys(tokens.color.dark).sort()).toEqual(Object.keys(tokens.color.light).sort());
  });

  it('zeroes every motion duration under prefers-reduced-motion', () => {
    const css = readGeneratedCss();
    const reduced = css.slice(css.indexOf('prefers-reduced-motion'));
    Object.keys(tokens.motion.duration).forEach((name) => {
      expect(reduced).toContain(`--nui-motion-duration-${name}: 0ms;`);
    });
  });
});

describe('cssVarName', () => {
  it('prefixes with nui and converts camelCase to kebab-case', () => {
    expect(cssVarName(['color', 'surfaceRaised'])).toBe('--nui-color-surface-raised');
  });
});

describe('flattenTokens', () => {
  it('flattens nested trees into custom property pairs', () => {
    expect(flattenTokens({ a: '1', b: { c: '2' } }, ['x'])).toEqual([
      ['--nui-x-a', '1'],
      ['--nui-x-b-c', '2'],
    ]);
  });
});
