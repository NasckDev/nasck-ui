import { contrastRatio } from '../contrast';

/** Color scale and theme derivation for the theme builder. Works in OKLCH for even steps. */

export interface Oklch {
  l: number;
  c: number;
  h: number;
}

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const srgbToLinear = (value: number): number =>
  value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;

const linearToSrgb = (value: number): number =>
  value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055;

export const isHex = (value: string): boolean => /^#[0-9a-f]{6}$/i.test(value);

const hexToRgb = (hex: string): [number, number, number] => {
  const raw = hex.replace('#', '');
  return [0, 2, 4].map((start) => parseInt(raw.slice(start, start + 2), 16) / 255) as [
    number,
    number,
    number,
  ];
};

export const hexToOklch = (hex: string): Oklch => {
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear) as [number, number, number];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const chroma = Math.hypot(a, bb);
  const hue = chroma < 1e-4 ? 0 : ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360;
  return { l: lightness, c: chroma, h: hue };
};

const oklchToLinearRgb = ({ l, c, h }: Oklch): [number, number, number] => {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const lp = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mp = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const sp = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * lp - 3.3077115913 * mp + 0.2309699292 * sp,
    -1.2684380046 * lp + 2.6097574011 * mp - 0.3413193965 * sp,
    -0.0041960863 * lp - 0.7034186147 * mp + 1.707614701 * sp,
  ];
};

const inGamut = (rgb: readonly number[]): boolean => rgb.every((v) => v >= -0.0005 && v <= 1.0005);

const toHex = (rgb: readonly number[]): string =>
  `#${rgb
    .map((v) =>
      Math.round(clamp01(linearToSrgb(clamp01(v))) * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;

/** Converts to hex, reducing chroma until the color fits in sRGB (keeps lightness and hue). */
export const oklchToHex = (color: Oklch): string => {
  let { c } = color;
  for (let i = 0; i < 24; i += 1) {
    const rgb = oklchToLinearRgb({ ...color, c });
    if (inGamut(rgb)) return toHex(rgb);
    c *= 0.92;
  }
  return toHex(oklchToLinearRgb({ ...color, c: 0 }));
};

export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type ScaleStep = (typeof SCALE_STEPS)[number];

const LIGHTNESS: Record<ScaleStep, number> = {
  50: 0.97,
  100: 0.935,
  200: 0.875,
  300: 0.81,
  400: 0.73,
  500: 0.66,
  600: 0.58,
  700: 0.5,
  800: 0.42,
  900: 0.34,
  950: 0.25,
};

const CHROMA_FACTOR: Record<ScaleStep, number> = {
  50: 0.14,
  100: 0.26,
  200: 0.48,
  300: 0.72,
  400: 0.92,
  500: 1,
  600: 1,
  700: 0.92,
  800: 0.78,
  900: 0.62,
  950: 0.46,
};

export type Scale = Record<ScaleStep, string>;

/** Eleven steps (50-950) sharing the hue of `base`. The step nearest in lightness is `base` itself. */
export const generateScale = (base: string): Scale => {
  const origin = hexToOklch(base);
  const chroma = Math.max(origin.c, 0.02);
  const nearest = SCALE_STEPS.reduce((best, step) =>
    Math.abs(LIGHTNESS[step] - origin.l) < Math.abs(LIGHTNESS[best] - origin.l) ? step : best,
  );
  return Object.fromEntries(
    SCALE_STEPS.map((step) => [
      step,
      step === nearest
        ? base.toLowerCase()
        : oklchToHex({ l: LIGHTNESS[step], c: chroma * CHROMA_FACTOR[step], h: origin.h }),
    ]),
  ) as Scale;
};

export const ACCENT_ROLES = [
  'accent',
  'accentHover',
  'accentActive',
  'accentText',
  'accentSurface',
  'textOnAccent',
  'focusRing',
] as const;
export type AccentRole = (typeof ACCENT_ROLES)[number];
export type AccentTheme = Record<AccentRole, string>;

export interface ThemeBackdrop {
  bg: string;
  surface: string;
  ink: string;
  paper: string;
}

export const LIGHT_BACKDROP: ThemeBackdrop = {
  bg: '#ffffff',
  surface: '#f5f5f5',
  ink: '#0a0a0a',
  paper: '#ffffff',
};
export const DARK_BACKDROP: ThemeBackdrop = {
  bg: '#0a0a0a',
  surface: '#141414',
  ink: '#fafafa',
  paper: '#0a0a0a',
};

const firstPassing = (
  candidates: readonly string[],
  against: readonly string[],
  required: number,
  fallback: string,
): string =>
  candidates.find((candidate) => against.every((bg) => contrastRatio(candidate, bg) >= required)) ??
  fallback;

const shift = (hex: string, delta: number): string => {
  const color = hexToOklch(hex);
  return oklchToHex({ ...color, l: clamp01(color.l + delta) });
};

/** Derives the accent roles of a theme from one chosen color, honoring WCAG contrast limits. */
export const deriveAccentTheme = (base: string, mode: 'light' | 'dark'): AccentTheme => {
  const scale = generateScale(base);
  const steps = SCALE_STEPS.map((step) => scale[step]);
  const backdrop = mode === 'light' ? LIGHT_BACKDROP : DARK_BACKDROP;

  const textOnAccent =
    contrastRatio('#0a0a0a', base) >= contrastRatio('#ffffff', base) ? '#0a0a0a' : '#ffffff';

  if (mode === 'light') {
    const surface = scale[50];
    const accentText = firstPassing(steps.slice(5), [backdrop.bg, surface], 4.5, scale[950]);
    const focusRing = firstPassing(steps.slice(4), [backdrop.bg, backdrop.surface], 3, scale[900]);
    return {
      accent: base.toLowerCase(),
      accentHover: shift(base, 0.06),
      accentActive: shift(base, -0.06),
      accentText,
      accentSurface: surface,
      textOnAccent,
      focusRing,
    };
  }

  const surface = oklchToHex({ ...hexToOklch(scale[950]), l: 0.2 });
  // Prefer the base-ish tone and go lighter only if needed: readable without glaring.
  const accentText = firstPassing(
    steps.slice(0, 6).reverse(),
    [backdrop.bg, surface],
    4.5,
    scale[50],
  );
  const focusRing = firstPassing(
    [base, ...steps.slice(0, 6).reverse()],
    [backdrop.bg, backdrop.surface],
    3,
    scale[50],
  );
  return {
    accent: base.toLowerCase(),
    accentHover: shift(base, 0.06),
    accentActive: shift(base, -0.06),
    accentText,
    accentSurface: surface,
    textOnAccent,
    focusRing,
  };
};

export interface ContrastCheck {
  label: string;
  foreground: string;
  background: string;
  required: 3 | 4.5;
  ratio: number;
  passes: boolean;
}

/** Contrast checks for every pair the accent participates in, per mode. */
export const checkAccentTheme = (theme: AccentTheme, mode: 'light' | 'dark'): ContrastCheck[] => {
  const backdrop = mode === 'light' ? LIGHT_BACKDROP : DARK_BACKDROP;
  const pairs: Array<Omit<ContrastCheck, 'ratio' | 'passes'>> = [
    {
      label: 'Texto sobre o destaque',
      foreground: theme.textOnAccent,
      background: theme.accent,
      required: 4.5,
    },
    {
      label: 'Texto de destaque sobre o fundo',
      foreground: theme.accentText,
      background: backdrop.bg,
      required: 4.5,
    },
    {
      label: 'Texto de destaque sobre a superfície de destaque',
      foreground: theme.accentText,
      background: theme.accentSurface,
      required: 4.5,
    },
    {
      label: 'Anel de foco sobre o fundo',
      foreground: theme.focusRing,
      background: backdrop.bg,
      required: 3,
    },
    {
      label: 'Anel de foco sobre a superfície',
      foreground: theme.focusRing,
      background: backdrop.surface,
      required: 3,
    },
    {
      label: 'Destaque como marca sobre o fundo',
      foreground: theme.accent,
      background: backdrop.bg,
      required: 3,
    },
  ];
  return pairs.map((pair) => {
    const ratio = contrastRatio(pair.foreground, pair.background);
    return { ...pair, ratio, passes: ratio >= pair.required };
  });
};

const toKebab = (value: string): string =>
  value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const declarations = (theme: AccentTheme): string =>
  ACCENT_ROLES.map((role) => `  --nui-color-${toKebab(role)}: ${theme[role]};`).join('\n');

/** CSS that overrides the accent roles in both themes (same selectors the library uses). */
export const exportThemeCss = (light: AccentTheme, dark: AccentTheme): string =>
  [
    '/* Tema Nasck UI: gerado pelo construtor de tema */',
    `:root,\n[data-theme='light'] {\n${declarations(light)}\n}`,
    `[data-theme='dark'] {\n${declarations(dark)}\n}`,
    `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme='light']) {\n${declarations(
      dark,
    )
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n')}\n  }\n}`,
    '',
  ].join('\n\n');
