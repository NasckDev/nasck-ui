/**
 * Source of truth for every Nasck UI design token.
 *
 * Tokens are plain data so they can be exported to CSS custom properties
 * (see `scripts/build-tokens.ts`), consumed from TypeScript, or synced to design tools.
 * Color tokens are semantic (role-based) and defined once per theme.
 */

const lightColors = {
  bg: '#ffffff',
  surface: '#f5f5f5',
  surfaceRaised: '#ffffff',
  border: '#e5e5e5',
  borderStrong: '#737373',
  text: '#0a0a0a',
  textMuted: '#525252',
  textOnAccent: '#0a0a0a',
  primary: '#0a0a0a',
  primaryHover: '#262626',
  primaryActive: '#404040',
  textOnPrimary: '#ffffff',
  accent: '#ff5b14',
  accentHover: '#ff7433',
  accentActive: '#e64a0a',
  accentText: '#c2410c',
  accentSurface: '#fff1ea',
  danger: '#b42318',
  dangerSurface: '#fef3f2',
  success: '#067647',
  successSurface: '#ecfdf3',
  warning: '#93370d',
  warningSurface: '#fffaeb',
  info: '#175cd3',
  infoSurface: '#eff8ff',
  focusRing: '#e8470b',
  overlay: 'rgb(10 10 10 / 0.6)',
  skeleton: '#ececec',
} as const;

type ColorRole = keyof typeof lightColors;

const darkColors: Record<ColorRole, string> = {
  bg: '#0a0a0a',
  surface: '#141414',
  surfaceRaised: '#1a1a1a',
  border: '#2e2e2e',
  borderStrong: '#8a8a8a',
  text: '#fafafa',
  textMuted: '#a3a3a3',
  textOnAccent: '#0a0a0a',
  primary: '#fafafa',
  primaryHover: '#e5e5e5',
  primaryActive: '#d4d4d4',
  textOnPrimary: '#0a0a0a',
  accent: '#ff5b14',
  accentHover: '#ff7433',
  accentActive: '#e64a0a',
  accentText: '#ff7a3d',
  accentSurface: '#2a1409',
  danger: '#fda29b',
  dangerSurface: '#3b1714',
  success: '#75e0a7',
  successSurface: '#0f2e20',
  warning: '#fec84b',
  warningSurface: '#3a2a0a',
  info: '#84caff',
  infoSurface: '#102a43',
  focusRing: '#ff5b14',
  overlay: 'rgb(0 0 0 / 0.7)',
  skeleton: '#262626',
};

export const tokens = {
  color: {
    light: lightColors,
    dark: darkColors,
  },
  font: {
    family: {
      display:
        "'Space Grotesk Variable', 'Space Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif",
      sans: "'DM Sans Variable', 'DM Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      mono: "'Space Mono', ui-monospace, 'SFMono-Regular', Consolas, monospace",
    },
    size: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.375rem',
      xxl: '1.75rem',
      xxxl: '2.5rem',
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
    16: '4rem',
  },
  radius: {
    none: '0',
    sm: '2px',
    md: '4px',
    lg: '6px',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 2px rgb(0 0 0 / 0.08)',
    md: '0 4px 14px rgb(0 0 0 / 0.12)',
    lg: '0 20px 48px rgb(0 0 0 / 0.22)',
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
    menu: '1050',
    overlay: '1100',
    dialog: '1200',
    toast: '1300',
  },
} as const;

export type Tokens = typeof tokens;
export type ThemeName = keyof Tokens['color'];
export type { ColorRole };
