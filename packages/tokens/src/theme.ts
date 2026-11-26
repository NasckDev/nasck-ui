import { AA_UI, blend, contrastRatio, ensureContrast, readableOn } from './contrast.ts';
import {
  FONT_FAMILY,
  FONT_FAMILY_CODE,
  getPreset,
  type PalettePreset,
  type ThemeMode,
} from './presets.ts';

export type Density = 'default' | 'compact';

type TokenValue = string | number | boolean;

/** Subconjunto do tema do antd (`ThemeConfig`) sem depender do antd. */
export interface NasckTheme {
  readonly algorithm: ReadonlyArray<'dark' | 'compact'>;
  readonly token: Readonly<Record<string, TokenValue>>;
  readonly components: Readonly<Record<string, Readonly<Record<string, TokenValue>>>>;
}

export interface BuildThemeOptions {
  readonly mode?: ThemeMode;
  readonly density?: Density;
  /** Substitui a cor primaria do preset (usado pelo construtor de tema). */
  readonly primary?: string;
}

const MIN_TEXT = 4.6;
const SEMANTIC_ON_TINT = 5.2;

/** Texto sobre a primaria: o do preset quando passa AA, senao preto ou branco. */
function textOn(color: string, preferred: string | undefined): string {
  if (preferred !== undefined && contrastRatio(preferred, color) >= MIN_TEXT) {
    return preferred.toUpperCase();
  }
  return readableOn(color);
}

/**
 * Gera o tema do antd a partir de um preset e de um modo. Os tokens de texto, link e
 * semanticos saem ja ajustados para contraste AA contra os fundos do modo escolhido.
 */
export function buildTheme(
  preset: PalettePreset | string,
  options: BuildThemeOptions = {},
): NasckTheme {
  const base = typeof preset === 'string' ? getPreset(preset) : preset;
  const mode: ThemeMode = options.mode ?? 'light';
  const density: Density = options.density ?? 'default';
  const surface = mode === 'dark' ? base.dark : base.light;
  const requested = options.primary ?? base.primary;

  const container = surface.bgContainer;
  // No escuro a cor primaria precisa de 3:1 contra o fundo para valer como componente e foco.
  const surfacePrimary = mode === 'dark' ? ensureContrast(requested, container, AA_UI) : requested;
  // Se nem preto nem branco passa 4.5:1 sobre a primaria, ela e ajustada o minimo necessario.
  const textOnBase = textOn(surfacePrimary, base.onPrimary);
  const primary = ensureContrast(surfacePrimary, textOnBase, MIN_TEXT);
  const onPrimary = textOn(primary, base.onPrimary);
  const surfaces = [container, surface.bgLayout];
  const onSurfaces = (color: string, minimum: number): string =>
    surfaces.reduce((current, background) => ensureContrast(current, background, minimum), color);
  // Tons claros (fundo de Tag, Alert e item de menu) calculados aqui, e nao pelo antd: a paleta
  // dele fica barrenta quando a cor base e escura, e o contraste precisa ser previsivel.
  const tintAlpha = mode === 'dark' ? 0.2 : 0.12;
  const tint = (color: string, extra = 0): string => blend(color, container, tintAlpha + extra);
  const primaryTint = tint(primary);
  // O link do preset so vale com a primaria do preset; outra cor escolhida no construtor manda.
  const presetPrimary = requested.toUpperCase() === base.primary.toUpperCase();
  const linkBase = presetPrimary ? (surface.link ?? requested) : requested;
  const link = ensureContrast(onSurfaces(linkBase, MIN_TEXT), primaryTint, MIN_TEXT);
  const text = surface.text;
  const secondary = onSurfaces(blend(text, container, 0.82), MIN_TEXT);
  const description = onSurfaces(blend(text, container, 0.7), MIN_TEXT);
  const border = ensureContrast(surface.border ?? blend(text, container, 0.4), container, AA_UI);
  const borderSecondary = blend(text, container, mode === 'dark' ? 0.18 : 0.12);
  // Cores semanticas valem como texto sobre as duas superficies e sobre o proprio tom claro.
  const semantic = (color: string): string => {
    let current = onSurfaces(color, MIN_TEXT);
    for (let pass = 0; pass < 3; pass += 1) {
      current = ensureContrast(current, tint(current), SEMANTIC_ON_TINT);
    }
    return current;
  };
  const success = semantic(surface.semantic.success);
  const warning = semantic(surface.semantic.warning);
  const error = semantic(surface.semantic.error);
  const info = semantic(surface.semantic.info);
  const tones = { Success: success, Warning: warning, Error: error, Info: info };
  const toneTokens: Record<string, TokenValue> = {};
  for (const [name, color] of Object.entries(tones)) {
    toneTokens[`color${name}Bg`] = tint(color);
    toneTokens[`color${name}BgHover`] = tint(color, 0.08);
    toneTokens[`color${name}Border`] = blend(color, container, 0.4);
    toneTokens[`color${name}BorderHover`] = blend(color, container, 0.55);
  }

  const token: Record<string, TokenValue> = {
    colorPrimary: primary,
    colorSuccess: success,
    colorWarning: warning,
    colorError: error,
    colorInfo: info,
    colorLink: link,
    colorPrimaryBg: primaryTint,
    colorPrimaryBgHover: tint(primary, 0.08),
    colorPrimaryBorder: blend(primary, container, 0.4),
    colorPrimaryBorderHover: blend(primary, container, 0.55),
    ...toneTokens,
    colorFill: blend(text, container, 0.18),
    colorFillSecondary: blend(text, container, 0.12),
    colorFillTertiary: blend(text, container, 0.08),
    colorFillQuaternary: blend(text, container, 0.04),
    colorBgBase: container,
    colorBgLayout: surface.bgLayout,
    colorBgContainer: container,
    colorBgElevated: container,
    colorTextBase: text,
    colorText: text,
    colorTextSecondary: secondary,
    colorTextTertiary: description,
    colorTextDescription: description,
    colorTextPlaceholder: description,
    colorTextLightSolid: onPrimary,
    colorBorder: border,
    colorBorderSecondary: borderSecondary,
    fontFamily: FONT_FAMILY,
    fontFamilyCode: FONT_FAMILY_CODE,
    borderRadius: base.radius,
    controlHeight: 36,
    wireframe: false,
  };

  const components: Record<string, Record<string, TokenValue>> = {
    Button: { primaryColor: onPrimary, dangerColor: readableOn(error), fontWeight: 500 },
    Layout: { headerBg: container, siderBg: container, bodyBg: surface.bgLayout },
    Menu: {
      itemSelectedColor: link,
      horizontalItemSelectedColor: link,
      itemSelectedBg: primaryTint,
    },
    Tabs: {
      itemSelectedColor: link,
      itemActiveColor: link,
      itemHoverColor: link,
      inkBarColor: primary,
    },
    Table: { headerBg: surface.bgLayout, borderColor: borderSecondary },
    Card: { headerFontSize: 16 },
  };

  const algorithm: Array<'dark' | 'compact'> = [];
  if (mode === 'dark') algorithm.push('dark');
  if (density === 'compact') algorithm.push('compact');
  return { algorithm, token, components };
}
