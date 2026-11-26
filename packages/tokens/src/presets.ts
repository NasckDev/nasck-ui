export type ThemeMode = 'light' | 'dark';

export interface SemanticColors {
  readonly success: string;
  readonly warning: string;
  readonly error: string;
  readonly info: string;
}

export interface ModeSurface {
  readonly bgLayout: string;
  readonly bgContainer: string;
  readonly text: string;
  readonly semantic: SemanticColors;
  /** Cor inicial de links e texto de destaque (ajustada para AA se precisar). Padrao: a primaria. */
  readonly link?: string;
  /** Cor da borda de campos (ajustada para 3:1 se precisar). Padrao: derivada do texto. */
  readonly border?: string;
}

export interface PalettePreset {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  /** Cor de marca (#RRGGBB). */
  readonly primary: string;
  /** Texto sobre a primaria. So vale se passar 4,5:1; senao o tema usa preto ou branco. */
  readonly onPrimary?: string;
  readonly radius: number;
  readonly light: ModeSurface;
  readonly dark: ModeSurface;
}

const SAFE_LIGHT: SemanticColors = {
  success: '#15803D',
  warning: '#9A5B00',
  error: '#B91C1C',
  info: '#1D4ED8',
};

const SAFE_DARK: SemanticColors = {
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
};

export const FONT_FAMILY = "'Geist Variable', 'Geist', Arial, system-ui, -apple-system, sans-serif";
export const FONT_FAMILY_HEADING = FONT_FAMILY;
export const FONT_FAMILY_CODE =
  "'Geist Mono Variable', 'Geist Mono', ui-monospace, 'SFMono-Regular', Consolas, monospace";

export const presets: readonly PalettePreset[] = [
  {
    id: 'nasck',
    label: 'Nasck (planta técnica)',
    description:
      'Grafite e papel com a assinatura laranja. Texto sobre o laranja é sempre #160700, nunca branco.',
    primary: '#F0501C',
    onPrimary: '#160700',
    radius: 3,
    light: {
      bgLayout: '#FAFAF7',
      bgContainer: '#FFFFFF',
      text: '#111111',
      link: '#C73D10',
      border: '#111111',
      semantic: SAFE_LIGHT,
    },
    dark: {
      bgLayout: '#121110',
      bgContainer: '#1A1917',
      text: '#FAFAF7',
      link: '#FF8A5C',
      border: '#A8A39B',
      semantic: SAFE_DARK,
    },
  },
  {
    id: 'insighthub',
    label: 'InsightHub (petroleo)',
    description: 'Editorial e calmo: petroleo sobre papel quente.',
    primary: '#0F766E',
    radius: 10,
    light: { bgLayout: '#FBF8F3', bgContainer: '#FFFFFF', text: '#1B1B3A', semantic: SAFE_LIGHT },
    dark: { bgLayout: '#0E1514', bgContainer: '#151E1D', text: '#EDEDE8', semantic: SAFE_DARK },
  },
  {
    id: 'fiscotrack',
    label: 'FiscoTrack (verde-floresta)',
    description: 'Fintech premium: verde-floresta sobre creme.',
    primary: '#0E3B2E',
    radius: 14,
    light: {
      bgLayout: '#F7F6F1',
      bgContainer: '#FFFFFF',
      text: '#14211C',
      semantic: { success: '#17784F', warning: '#8F6A0C', error: '#C2304A', info: '#1D4ED8' },
    },
    dark: {
      bgLayout: '#0B1512',
      bgContainer: '#11201B',
      text: '#E9F1ED',
      semantic: { success: '#34D399', warning: '#E0B040', error: '#FB7185', info: '#60A5FA' },
    },
  },
  {
    id: 'opsflow',
    label: 'OpsFlow (azul eletrico)',
    description: 'Console corporativo denso: azul eletrico sobre grafite.',
    primary: '#2F6BFF',
    radius: 6,
    light: { bgLayout: '#F6F7F9', bgContainer: '#FFFFFF', text: '#111418', semantic: SAFE_LIGHT },
    dark: { bgLayout: '#111418', bgContainer: '#1C2128', text: '#E6EAF0', semantic: SAFE_DARK },
  },
];

export const DEFAULT_PRESET_ID = 'nasck';

export function getPreset(id: string): PalettePreset {
  const found = presets.find((preset) => preset.id === id);
  if (!found) {
    const available = presets.map((preset) => preset.id).join(', ');
    throw new Error(`Preset desconhecido: "${id}". Disponiveis: ${available}.`);
  }
  return found;
}
