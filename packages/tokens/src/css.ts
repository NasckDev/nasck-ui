import { readableOn, type ResolvedTokens } from './contrast.ts';

function kebab(name: string): string {
  return name.replace(/[A-Z0-9]/g, (char) => `-${char.toLowerCase()}`);
}

const PX_KEYS = /^(borderRadius|controlHeight|fontSize|size)/;

/**
 * Converte tokens resolvidos do antd em variaveis CSS no padrao do NG-ZORRO
 * (`colorPrimary` vira `--ant-color-primary`). Booleanos sao ignorados.
 */
export function toCssVariables(tokens: ResolvedTokens, prefix = '--ant-'): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens)) {
    if (typeof value === 'boolean') continue;
    const unit = typeof value === 'number' && PX_KEYS.test(key) ? 'px' : '';
    out[`${prefix}${kebab(key)}`] = `${value}${unit}`;
  }
  return out;
}

export function toCssText(tokens: ResolvedTokens, selector = ':root'): string {
  const lines = Object.entries(toCssVariables(tokens)).map(
    ([name, value]) => `  ${name}: ${value};`,
  );
  return `${selector} {\n${lines.join('\n')}\n}\n`;
}

function pick(tokens: ResolvedTokens, key: string): string | undefined {
  const value = tokens[key];
  return typeof value === 'string' ? value : undefined;
}

/**
 * Variaveis para o NG-ZORRO: os nomes antigos que o CSS dele le (`--ant-primary-color`,
 * `--ant-error-color`...) mais todos os tokens com o prefixo `--ant-color-*` usados pelo
 * `nasck-overrides.css` do pacote Angular.
 */
export function toNgZorroVariables(tokens: ResolvedTokens): Record<string, string> {
  const out = toCssVariables(tokens);
  const set = (name: string, key: string): void => {
    const value = pick(tokens, key);
    if (value !== undefined) out[name] = value;
  };
  set('--ant-primary-color', 'colorPrimary');
  set('--ant-primary-color-hover', 'colorPrimaryHover');
  set('--ant-primary-color-active', 'colorPrimaryActive');
  set('--ant-primary-color-outline', 'colorPrimaryBg');
  set('--ant-primary-1', 'colorPrimaryBg');
  set('--ant-primary-2', 'colorPrimaryBgHover');
  set('--ant-primary-3', 'colorPrimaryBorder');
  set('--ant-primary-4', 'colorPrimaryBorderHover');
  set('--ant-primary-5', 'colorPrimaryHover');
  set('--ant-primary-6', 'colorPrimary');
  set('--ant-primary-7', 'colorPrimaryActive');
  for (const tone of ['success', 'warning', 'error', 'info'] as const) {
    const key = `color${tone[0]?.toUpperCase() ?? ''}${tone.slice(1)}`;
    set(`--ant-${tone}-color`, key);
    set(`--ant-${tone}-color-hover`, `${key}Hover`);
    set(`--ant-${tone}-color-active`, `${key}Active`);
    set(`--ant-${tone}-color-outline`, `${key}Bg`);
    set(`--ant-${tone}-color-deprecated-bg`, `${key}Bg`);
    set(`--ant-${tone}-color-deprecated-border`, `${key}Border`);
  }
  const error = pick(tokens, 'colorError');
  if (error !== undefined) out['--nasck-on-error'] = readableOn(error);
  return out;
}
