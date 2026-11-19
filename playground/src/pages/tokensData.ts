import type { ColorRole } from '../../../src/tokens/tokens';

export interface ContrastPair {
  label: string;
  foreground: ColorRole;
  background: ColorRole;
  /** 4.5 for text, 3 for UI components and focus indicators (WCAG 1.4.3 / 1.4.11). */
  required: 3 | 4.5;
}

export const CONTRAST_PAIRS: readonly ContrastPair[] = [
  { label: 'Texto sobre fundo', foreground: 'text', background: 'bg', required: 4.5 },
  { label: 'Texto sobre superfície', foreground: 'text', background: 'surface', required: 4.5 },
  {
    label: 'Texto secundário sobre fundo',
    foreground: 'textMuted',
    background: 'bg',
    required: 4.5,
  },
  {
    label: 'Texto sobre destaque',
    foreground: 'textOnAccent',
    background: 'accent',
    required: 4.5,
  },
  { label: 'Destaque sobre fundo', foreground: 'accent', background: 'bg', required: 4.5 },
  { label: 'Perigo sobre fundo', foreground: 'danger', background: 'bg', required: 4.5 },
  {
    label: 'Perigo sobre superfície de perigo',
    foreground: 'danger',
    background: 'dangerSurface',
    required: 4.5,
  },
  {
    label: 'Sucesso sobre superfície de sucesso',
    foreground: 'success',
    background: 'successSurface',
    required: 4.5,
  },
  {
    label: 'Alerta sobre superfície de alerta',
    foreground: 'warning',
    background: 'warningSurface',
    required: 4.5,
  },
  {
    label: 'Info sobre superfície de info',
    foreground: 'info',
    background: 'infoSurface',
    required: 4.5,
  },
  {
    label: 'Destaque sobre superfície de destaque',
    foreground: 'accent',
    background: 'accentSurface',
    required: 4.5,
  },
  {
    label: 'Borda de controle sobre fundo',
    foreground: 'borderStrong',
    background: 'bg',
    required: 3,
  },
  { label: 'Anel de foco sobre fundo', foreground: 'focusRing', background: 'bg', required: 3 },
];

export const COLOR_GROUPS: ReadonlyArray<{ title: string; roles: readonly ColorRole[] }> = [
  {
    title: 'Superfícies e bordas',
    roles: ['bg', 'surface', 'surfaceRaised', 'border', 'borderStrong', 'skeleton', 'overlay'],
  },
  { title: 'Texto', roles: ['text', 'textMuted', 'textOnAccent'] },
  {
    title: 'Destaque',
    roles: ['accent', 'accentHover', 'accentActive', 'accentSurface', 'focusRing'],
  },
  {
    title: 'Estados',
    roles: [
      'danger',
      'dangerSurface',
      'success',
      'successSurface',
      'warning',
      'warningSurface',
      'info',
      'infoSurface',
    ],
  },
];
