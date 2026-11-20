/**
 * Resolve, com o algoritmo real do antd, os tokens de cada preset e modo e grava
 * src/resolved.generated.ts. O Angular (NG-ZORRO) consome esse arquivo para montar
 * as variaveis CSS, sem depender do antd em tempo de execucao.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import antd from 'antd';
import { presets } from '../src/presets.ts';
import { buildTheme } from '../src/theme.ts';

const { theme } = antd;
const KEEP = /^(color|borderRadius|controlHeight|fontFamily|fontSize|lineWidth|boxShadow)/;

const result: Record<string, Record<string, Record<string, string | number>>> = {};
for (const preset of presets) {
  result[preset.id] = {};
  for (const mode of ['light', 'dark'] as const) {
    const built = buildTheme(preset, { mode });
    const base = built.algorithm.includes('dark') ? theme.darkAlgorithm : theme.defaultAlgorithm;
    // Mesma cadeia do React: o ultimo passo fixa os tokens calculados pelo pacote.
    const enforce = (_seed: object, map?: object) => ({ ...map, ...built.token });
    const resolved = theme.getDesignToken({
      algorithm: [base, enforce as typeof theme.darkAlgorithm],
      token: built.token,
    });
    const picked: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(resolved).sort(([a], [b]) => a.localeCompare(b))) {
      if (KEEP.test(key) && (typeof value === 'string' || typeof value === 'number')) {
        picked[key] = value;
      }
    }
    result[preset.id][mode] = picked;
  }
}

const target = fileURLToPath(new URL('../src/resolved.generated.ts', import.meta.url));
const body = `// Gerado por scripts/generate-resolved.ts. Nao edite a mao.\nimport type { ResolvedTokens } from './contrast.ts';\n\nexport const resolvedTokens: Readonly<Record<string, Readonly<Record<'light' | 'dark', ResolvedTokens>>>> = ${JSON.stringify(result, null, 2)};\n`;
writeFileSync(target, body);
process.stdout.write(`resolved tokens: ${Object.keys(result).length} presets\n`);
