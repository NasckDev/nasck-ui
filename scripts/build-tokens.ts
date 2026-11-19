// Generates src/styles/tokens.css from the typed token source.
// Runs with Node >= 22.18 native type stripping: `node scripts/build-tokens.ts`.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { tokens } from '../src/tokens/tokens.ts';
import { tokensToCss } from '../src/tokens/css.ts';

const target = fileURLToPath(new URL('../src/styles/tokens.css', import.meta.url));

writeFileSync(target, tokensToCss(tokens), 'utf8');
process.stdout.write(`tokens written to ${target}\n`);
