/**
 * Source of truth for every Nasck UI design token.
 *
 * Tokens are plain data so they can be exported to CSS custom properties
 * (see `scripts/build-tokens.ts`), consumed from TypeScript, or synced to design tools.
 * Color tokens are semantic (role-based) and defined once per theme.
 */

const lightColors = {
  bg: '#ffffff',
  surface: '#f6f7f9',
  surfaceRaised: '#ffffff',
  border: '#d0d5dd',
  borderStrong: '#667085',
  text: '#16181d',
  textMuted: '#475467',
  textOnAccent: '#ffffff',
  accent: '#4338ca',
  accentHover: '#3730a3',
  accentActive: '#312e81',
  accentSurface: '#eef2ff',
  danger: '#b42318',
  dangerSurface: '#fef3f2',
  success: '#067647',
  successSurface: '#ecfdf3',
  warning: '#93370d',
  warningSurface: '#fffaeb',
  info: '#175cd3',
  infoSurface: '#eff8ff',
  focusRing: '#1d4ed8',
  overlay: 'rgb(16 24 40 / 0.6)',
  skeleton: '#e4e7ec',
} as const;

type ColorRole = keyof typeof lightColors;

const darkColors: Record<ColorRole, string> = {
  bg: '#0f1115',
  surface: '#171a21',
  surfaceRaised: '#1f232c',
  border: '#3a404d',
  borderStrong: '#98a2b3',
  text: '#f2f4f7',
  textMuted: '#b0b8c6',
  textOnAccent: '#101828',
  accent: '#a5b4fc',
  accentHover: '#c7d2fe',
  accentActive: '#e0e7ff',
  accentSurface: '#252a4a',
  danger: '#fda29b',
  dangerSurface: '#3b1714',
  success: '#75e0a7',
  successSurface: '#0f2e20',
  warning: '#fec84b',
  warningSurface: '#3a2a0a',
  info: '#84caff',
  infoSurface: '#102a43',
  focusRing: '#93c5fd',
  overlay: 'rgb(0 0 0 / 0.7)',
  skeleton: '#2a2f3a',
};

export const tokens = {
  color: {
    light: lightColors,
    dark: darkColors,
  },
  font: {
    family: {
      sans: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      mono: "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Consolas, monospace",
    },
    size: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.375rem',
      xxl: '1.75rem',
    },
    weight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
    },
  },
  space: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
  },
  radius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 2px rgb(16 24 40 / 0.08)',
    md: '0 4px 12px rgb(16 24 40 / 0.12)',
    lg: '0 16px 40px rgb(16 24 40 / 0.2)',
  },
  motion: {
    duration: {
      fast: '120ms',
      normal: '200ms',
      slow: '320ms',
    },
    easing: {
      standard: 'cubic-bezier(0.2, 0, 0, 1)',
      emphasized: 'cubic-bezier(0.3, 0, 0, 1)',
    },
  },
  zIndex: {
    tooltip: '1000',
    overlay: '1100',
    dialog: '1200',
    toast: '1300',
  },
} as const;

export type Tokens = typeof tokens;
export type ThemeName = keyof Tokens['color'];
export type { ColorRole };
