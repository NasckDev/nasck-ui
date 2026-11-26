// Numeros e trechos da pagina de entrada, lidos do proprio repositorio (nada digitado a mao):
// contrato, presets, pares de contraste e stories dos dois Storybooks ja buildados.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTheme, checkTheme, presets } from '../packages/tokens/src/index.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STORYBOOKS = {
  react: join(ROOT, 'packages/react/storybook-static/index.json'),
  angular: join(ROOT, 'packages/angular/storybook-static/index.json'),
};

export interface PresetSwatch {
  readonly id: string;
  readonly name: string;
  readonly background: string;
  readonly foreground: string;
  readonly ratio: number;
  readonly text: string;
}

export interface PortableStats {
  readonly version: string;
  readonly components: number;
  readonly names: readonly string[];
  readonly icons: number;
  readonly presets: number;
  readonly pairs: number;
  readonly storiesReact: number | null;
  readonly storiesAngular: number | null;
  readonly stories: number | null;
  readonly swatches: readonly PresetSwatch[];
}

interface StoryIndex {
  entries: Record<string, { type: string }>;
}

function countStories(file: string): number | null {
  if (!existsSync(file)) return null;
  const index = JSON.parse(readFileSync(file, 'utf8')) as StoryIndex;
  return Object.values(index.entries).filter((entry) => entry.type === 'story').length;
}

/** Arredonda para baixo: a pagina nunca mostra um contraste maior que o real. */
export function formatRatio(ratio: number): string {
  return (Math.floor(ratio * 10) / 10).toFixed(1).replace('.', ',');
}

export function ratioVerdict(ratio: number): string {
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'só texto grande';
  return 'abaixo de AA';
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"]/g, (char) => `&#${char.charCodeAt(0)};`);
}

export function presetSwatches(): PresetSwatch[] {
  return presets.map((preset) => {
    const { token } = buildTheme(preset, { mode: 'light' });
    const background = String(token['colorPrimary']);
    const foreground = String(token['colorTextLightSolid']);
    const check = checkTheme(token).find((row) => row.id === 'on-primary');
    const ratio = check ? check.ratio : 0;
    return {
      id: preset.id,
      name: preset.label.split(' (')[0] ?? preset.id,
      background,
      foreground,
      ratio,
      text: `${formatRatio(ratio)}:1 ${ratioVerdict(ratio)}`,
    };
  });
}

export function portableStats(): PortableStats {
  const contract = JSON.parse(readFileSync(join(ROOT, 'contract/contract.json'), 'utf8')) as {
    components: Record<string, unknown>;
    icons: unknown[];
  };
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as { version: string };
  const names = Object.keys(contract.components);
  const react = countStories(STORYBOOKS.react);
  const angular = countStories(STORYBOOKS.angular);
  const first = presets[0];
  const pairs = first ? checkTheme(buildTheme(first, { mode: 'light' }).token).length : 0;
  return {
    version: pkg.version.split('.').slice(0, 2).join('.'),
    components: names.length,
    names,
    icons: contract.icons.length,
    presets: presets.length,
    pairs,
    storiesReact: react,
    storiesAngular: angular,
    stories: react !== null && angular !== null ? react + angular : null,
    swatches: presetSwatches(),
  };
}

function swatchHtml(swatch: PresetSwatch, index: number): string {
  const classes = index === 0 ? 'swatch is-current' : 'swatch';
  return [
    `<li class="${classes}">`,
    `<span class="swatch-chip" style="background:${swatch.background};color:${swatch.foreground}" aria-hidden="true">Aa</span>`,
    `<span class="swatch-name">${escapeHtml(swatch.name)}</span>`,
    `<span class="swatch-ratio">${escapeHtml(swatch.text)}</span>`,
    '</li>',
  ].join('');
}

/** Troca os marcadores __NOME__ do index.html pelos valores reais. */
export function applyStats(html: string, stats: PortableStats): string {
  const missing = '—';
  const values: Record<string, string> = {
    __VERSION__: stats.version,
    __COMPONENTS__: String(stats.components),
    __ICONS__: String(stats.icons),
    __PRESETS__: String(stats.presets),
    __PAIRS__: String(stats.pairs),
    __STORIES_REACT__: stats.storiesReact === null ? missing : String(stats.storiesReact),
    __STORIES_ANGULAR__: stats.storiesAngular === null ? missing : String(stats.storiesAngular),
    __STORIES__: stats.stories === null ? missing : String(stats.stories),
    __CHIPS__: stats.names.map((name) => `<li>${escapeHtml(name)}</li>`).join(''),
    __SWATCHES__: stats.swatches.map(swatchHtml).join(''),
  };
  return Object.entries(values).reduce((out, [key, value]) => out.replaceAll(key, value), html);
}
