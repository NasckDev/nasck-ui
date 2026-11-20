// Monta o build estatico unico para o portfolio: portable-dist/ com index.html (entrada),
// react/ e angular/ (os dois Storybooks). Todos os caminhos sao relativos, entao funciona em
// qualquer subpath (/projetos/nasck-ui/ e /Myportfolio/projetos/nasck-ui/).
//
// SKIP_STORYBOOK=1 reaproveita os storybook-static ja gerados (uso local e no CI depois de
// `npm run build-storybook`).
import { execSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'portable-dist');
const REACT = join(ROOT, 'packages/react/storybook-static');
const ANGULAR = join(ROOT, 'packages/angular/storybook-static');

function run(command) {
  execSync(command, { cwd: ROOT, stdio: 'inherit', env: process.env });
}

if (process.env.SKIP_STORYBOOK !== '1') run('npm run build-storybook');
for (const dir of [REACT, ANGULAR]) {
  if (!existsSync(join(dir, 'index.html'))) {
    throw new Error(`Storybook nao encontrado em ${dir}. Rode "npm run build-storybook" antes.`);
  }
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(REACT, join(OUT, 'react'), { recursive: true });
cpSync(ANGULAR, join(OUT, 'angular'), { recursive: true });

// Fontes auto-hospedadas da pagina de entrada.
mkdirSync(join(OUT, 'fonts'), { recursive: true });
const fonts = [
  ['@fontsource-variable/space-grotesk', 'space-grotesk-latin-wght-normal.woff2'],
  ['@fontsource-variable/dm-sans', 'dm-sans-latin-wght-normal.woff2'],
  ['@fontsource/space-mono', 'space-mono-latin-400-normal.woff2'],
];
for (const [pkg, file] of fonts) {
  const candidates = [join(ROOT, 'node_modules', pkg, 'files', file)];
  const source = candidates.find((path) => existsSync(path));
  if (!source) throw new Error(`Fonte ${file} nao encontrada em ${pkg}.`);
  cpSync(source, join(OUT, 'fonts', file));
}

writeFileSync(
  join(OUT, 'favicon.svg'),
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="3" fill="#0a0a0a"/><path d="M8 24V8h3.6l8.8 11V8H24v16h-3.6L11.6 13v11z" fill="#ff5b14"/></svg>\n',
);
writeFileSync(join(OUT, '.nojekyll'), '');

// Mapas de origem nao entram na demo (peso).
for (const path of walkFiles(OUT)) if (path.endsWith('.map')) rmSync(path);

function walkFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walkFiles(path) : [path];
  });
}

function countStories(dir) {
  const index = JSON.parse(readFileSync(join(dir, 'index.json'), 'utf8'));
  return Object.values(index.entries).filter((entry) => entry.type === 'story').length;
}

const contract = JSON.parse(readFileSync(join(ROOT, 'contract/contract.json'), 'utf8'));
const names = Object.keys(contract.components);
const presetsSource = readFileSync(join(ROOT, 'packages/tokens/src/presets.ts'), 'utf8');
const presetCount = (presetsSource.match(/^\s{4}id: '/gm) ?? []).length;
const stories = countStories(REACT) + countStories(ANGULAR);

const html = readFileSync(join(ROOT, 'portable-src/index.html'), 'utf8')
  .replace('__COMPONENTS__', String(names.length))
  .replace('__STORIES__', String(stories))
  .replace('__PRESETS__', String(presetCount))
  .replace('__ICONS__', String(contract.icons.length))
  .replace('__CHIPS__', names.map((name) => `<li>${name}</li>`).join('\n            '));
writeFileSync(join(OUT, 'index.html'), html);

// Verificacao: nenhum HTML pode apontar para a raiz do dominio (quebraria em subpath).
function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}
const ABSOLUTE = /(?:src|href)=["']\/(?!\/)/;
const offenders = walk(OUT)
  .filter((path) => path.endsWith('.html'))
  .filter((path) => ABSOLUTE.test(readFileSync(path, 'utf8')))
  .map((path) => relative(OUT, path));
if (offenders.length > 0) {
  throw new Error(`Caminhos absolutos encontrados (quebram em subpath): ${offenders.join(', ')}`);
}

process.stdout.write(
  `portable-dist pronto: ${names.length} componentes, ${stories} stories, ${presetCount} presets.\n`,
);
