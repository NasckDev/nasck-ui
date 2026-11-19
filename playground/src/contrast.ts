/** WCAG 2.x relative luminance and contrast ratio helpers (sRGB hex colors only). */

const parseHex = (hex: string): [number, number, number] => {
  const value = hex.replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(value)) throw new Error(`Unsupported color: ${hex}`);
  return [0, 2, 4].map((start) => parseInt(value.slice(start, start + 2), 16)) as [
    number,
    number,
    number,
  ];
};

const channel = (value: number): number => {
  const scaled = value / 255;
  return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
};

export const luminance = (hex: string): number => {
  const [r, g, b] = parseHex(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

export const contrastRatio = (foreground: string, background: string): number => {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

export type ContrastLevel = 'AAA' | 'AA' | 'AA-large' | 'fail';

/** `required` is 4.5 for body text and 3 for large text and UI components. */
export const contrastLevel = (ratio: number): ContrastLevel => {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA-large';
  return 'fail';
};
