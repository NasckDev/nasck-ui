// Publishes the generated tokens stylesheet as `dist/tokens.css` (package export `./tokens.css`).
import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../src/styles/tokens.css', import.meta.url));
const targetDir = fileURLToPath(new URL('../dist/', import.meta.url));

mkdirSync(targetDir, { recursive: true });
copyFileSync(source, `${targetDir}tokens.css`);
process.stdout.write('tokens.css copied to dist\n');
