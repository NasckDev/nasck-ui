import { create } from 'storybook/theming';

// Identidade "planta tecnica": grafite, papel, laranja so de assinatura, cantos de 3 px e Geist.
// Igual em packages/react e packages/angular, para os dois Storybooks parecerem um produto so.
const FONT_BASE = '"Geist Variable", "Geist", Arial, system-ui, sans-serif';
const FONT_CODE = '"Geist Mono Variable", "Geist Mono", ui-monospace, monospace';

function brandTitle(ink: string, paper: string): string {
  return [
    '<span style="display:inline-flex;align-items:center;gap:10px">',
    `<svg width="26" height="26" viewBox="0 0 28 28" aria-hidden="true"><rect width="28" height="28" rx="3" fill="${ink}"/><path d="M8 20V8l12 12V8" stroke="${paper}" stroke-width="2.6" fill="none" stroke-linejoin="round"/><rect x="19" y="3" width="6" height="6" fill="#F0501C"/></svg>`,
    `<span style="font-family:${FONT_BASE.replace(/"/g, "'")};font-size:17px;font-weight:800;letter-spacing:-0.02em;color:${ink}">Nasck UI</span>`,
    `<span style="font-family:${FONT_CODE.replace(/"/g, "'")};font-size:11px;font-weight:500;border:1px solid ${ink};padding:0 5px;color:${ink}">v1.0</span>`,
    '</span>',
  ].join('');
}

export const nasckLight = create({
  base: 'light',
  brandTitle: brandTitle('#111111', '#FAFAF7'),
  brandUrl: '../',
  brandTarget: '_self',
  colorPrimary: '#F0501C',
  colorSecondary: '#111111',
  appBg: '#FAFAF7',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FAFAF7',
  appBorderColor: '#111111',
  appBorderRadius: 3,
  textColor: '#111111',
  textInverseColor: '#FAFAF7',
  textMutedColor: '#5E5A55',
  barTextColor: '#5E5A55',
  barHoverColor: '#111111',
  barSelectedColor: '#C73D10',
  barBg: '#FAFAF7',
  buttonBg: '#FFFFFF',
  buttonBorder: '#111111',
  booleanBg: '#E9E6DE',
  booleanSelectedBg: '#FFFFFF',
  inputBg: '#FFFFFF',
  inputBorder: '#111111',
  inputTextColor: '#111111',
  inputBorderRadius: 3,
  fontBase: FONT_BASE,
  fontCode: FONT_CODE,
});

export const nasckDark = create({
  base: 'dark',
  brandTitle: brandTitle('#FAFAF7', '#121110'),
  brandUrl: '../',
  brandTarget: '_self',
  colorPrimary: '#F0501C',
  colorSecondary: '#3A3835',
  appBg: '#121110',
  appContentBg: '#1A1917',
  appPreviewBg: '#121110',
  appBorderColor: '#33312E',
  appBorderRadius: 3,
  textColor: '#FAFAF7',
  textInverseColor: '#160700',
  textMutedColor: '#A8A39B',
  barTextColor: '#A8A39B',
  barHoverColor: '#FAFAF7',
  barSelectedColor: '#FF8A5C',
  barBg: '#121110',
  buttonBg: '#1A1917',
  buttonBorder: '#A8A39B',
  booleanBg: '#2A2826',
  booleanSelectedBg: '#1A1917',
  inputBg: '#1A1917',
  inputBorder: '#A8A39B',
  inputTextColor: '#FAFAF7',
  inputBorderRadius: 3,
  fontBase: FONT_BASE,
  fontCode: FONT_CODE,
});

export function prefersDark(): boolean {
  return (
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

export function nasckTheme(): typeof nasckLight {
  return prefersDark() ? nasckDark : nasckLight;
}
