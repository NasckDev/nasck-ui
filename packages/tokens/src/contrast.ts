/** Utilitarios de cor e contraste (WCAG 2.2). Sem dependencias. */

export interface Rgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

const HEX = /^#([0-9a-f]{6})$/i;

export function parseHex(hex: string): Rgb {
  const match = HEX.exec(hex.trim());
  if (!match || match[1] === undefined) {
    throw new Error(`Cor invalida: "${hex}". Use o formato #RRGGBB.`);
  }
  const value = parseInt(match[1], 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

function channelToHex(channel: number): string {
  const clamped = Math.max(0, Math.min(255, Math.round(channel)));
  return clamped.toString(16).padStart(2, '0');
}

export function toHex({ r, g, b }: Rgb): string {
  return `#${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}`.toUpperCase();
}

function linearize(channel: number): number {
  const s = channel / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/** Razao de contraste entre duas cores opacas, de 1 a 21. */
export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [light, dark] = a >= b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
}

/** Mistura `foreground` sobre `background` com a opacidade `alpha` (0 a 1). */
export function blend(foreground: string, background: string, alpha: number): string {
  const f = parseHex(foreground);
  const b = parseHex(background);
  return toHex({
    r: f.r * alpha + b.r * (1 - alpha),
    g: f.g * alpha + b.g * (1 - alpha),
    b: f.b * alpha + b.b * (1 - alpha),
  });
}

interface Hsl {
  h: number;
  s: number;
  l: number;
}

function toHsl(hex: string): Hsl {
  const { r, g, b } = parseHex(hex);
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === rn) h = ((gn - bn) / d) % 6;
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return { h: (h * 60 + 360) % 360, s, l };
}

function fromHsl({ h, s, l }: Hsl): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const sector = Math.floor(h / 60) % 6;
  const table: ReadonlyArray<readonly [number, number, number]> = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ];
  const [r, g, b] = table[sector] ?? [0, 0, 0];
  return toHex({ r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 });
}

/**
 * Ajusta a luminosidade de `color` (mantendo matiz e saturacao) ate atingir `minRatio`
 * contra `background`. Clareia sobre fundos escuros e escurece sobre fundos claros.
 */
export function ensureContrast(color: string, background: string, minRatio: number): string {
  if (contrastRatio(color, background) >= minRatio) return color.toUpperCase();
  const hsl = toHsl(color);
  const lighten = relativeLuminance(background) < 0.5;
  let candidate = color.toUpperCase();
  for (let step = 0; step < 100; step += 1) {
    const progress = (step + 1) / 100;
    const l = lighten ? hsl.l + (1 - hsl.l) * progress : hsl.l * (1 - progress);
    candidate = fromHsl({ ...hsl, l });
    if (contrastRatio(candidate, background) >= minRatio) return candidate;
  }
  return lighten ? '#FFFFFF' : '#000000';
}

/** Escolhe preto ou branco, o que tiver mais contraste sobre `background`. */
export function readableOn(background: string): string {
  return contrastRatio('#0A0A0A', background) >= contrastRatio('#FFFFFF', background)
    ? '#0A0A0A'
    : '#FFFFFF';
}

export const AA_TEXT = 4.5;
export const AA_UI = 3;

export interface ContrastCheck {
  readonly id: string;
  readonly label: string;
  readonly foreground: string;
  readonly background: string;
  readonly ratio: number;
  readonly minimum: number;
  readonly pass: boolean;
}

export type ResolvedTokens = Readonly<Record<string, string | number | boolean>>;

function pair(
  tokens: ResolvedTokens,
  id: string,
  label: string,
  foregroundKey: string,
  backgroundKey: string,
  minimum: number,
): ContrastCheck | null {
  const foreground = tokens[foregroundKey];
  const background = tokens[backgroundKey];
  if (typeof foreground !== 'string' || typeof background !== 'string') return null;
  if (!HEX.test(foreground) || !HEX.test(background)) return null;
  const ratio = contrastRatio(foreground, background);
  return { id, label, foreground, background, ratio, minimum, pass: ratio >= minimum };
}

/**
 * Verifica os pares de cor que o tema entrega, a partir dos tokens ja resolvidos pelo
 * algoritmo do antd (use `theme.getDesignToken` no React ou `resolvedTokens` deste pacote).
 */
export function checkTheme(tokens: ResolvedTokens): ContrastCheck[] {
  const rows: Array<ContrastCheck | null> = [
    pair(tokens, 'text', 'Texto', 'colorText', 'colorBgContainer', AA_TEXT),
    pair(
      tokens,
      'text-layout',
      'Texto sobre o fundo da pagina',
      'colorText',
      'colorBgLayout',
      AA_TEXT,
    ),
    pair(
      tokens,
      'text-secondary',
      'Texto secundario',
      'colorTextSecondary',
      'colorBgContainer',
      AA_TEXT,
    ),
    pair(
      tokens,
      'text-description',
      'Descricoes e rotulos',
      'colorTextDescription',
      'colorBgContainer',
      AA_TEXT,
    ),
    pair(tokens, 'link', 'Links e texto de destaque', 'colorLink', 'colorBgContainer', AA_TEXT),
    pair(
      tokens,
      'link-layout',
      'Links sobre o fundo da pagina',
      'colorLink',
      'colorBgLayout',
      AA_TEXT,
    ),
    pair(
      tokens,
      'description-layout',
      'Descricoes sobre o fundo da pagina',
      'colorTextDescription',
      'colorBgLayout',
      AA_TEXT,
    ),
    pair(
      tokens,
      'success-tint',
      'Sucesso sobre o tom claro (tag)',
      'colorSuccess',
      'colorSuccessBg',
      AA_TEXT,
    ),
    pair(
      tokens,
      'warning-tint',
      'Aviso sobre o tom claro (tag)',
      'colorWarning',
      'colorWarningBg',
      AA_TEXT,
    ),
    pair(
      tokens,
      'error-tint',
      'Erro sobre o tom claro (tag)',
      'colorError',
      'colorErrorBg',
      AA_TEXT,
    ),
    pair(
      tokens,
      'info-tint',
      'Informacao sobre o tom claro (tag)',
      'colorInfo',
      'colorInfoBg',
      AA_TEXT,
    ),
    pair(
      tokens,
      'on-primary',
      'Texto sobre a cor primaria',
      'colorTextLightSolid',
      'colorPrimary',
      AA_TEXT,
    ),
    pair(tokens, 'success', 'Sucesso como texto', 'colorSuccess', 'colorBgContainer', AA_TEXT),
    pair(tokens, 'warning', 'Aviso como texto', 'colorWarning', 'colorBgContainer', AA_TEXT),
    pair(tokens, 'error', 'Erro como texto', 'colorError', 'colorBgContainer', AA_TEXT),
    pair(tokens, 'info', 'Informacao como texto', 'colorInfo', 'colorBgContainer', AA_TEXT),
    pair(tokens, 'border', 'Borda de campos', 'colorBorder', 'colorBgContainer', AA_UI),
    pair(
      tokens,
      'primary-ui',
      'Primaria como componente e foco',
      'colorPrimary',
      'colorBgContainer',
      AA_UI,
    ),
  ];
  return rows.filter((row): row is ContrastCheck => row !== null);
}
