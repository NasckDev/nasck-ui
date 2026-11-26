// Monta o build estatico unico para o portfolio: portable-dist/ com index.html (entrada gerada
// pelo Vite a partir de portable-src/), react/ e angular/ (os dois Storybooks). Todos os caminhos
// sao relativos, entao funciona em qualquer subpath (/projetos/nasck-ui/ e
// /Myportfolio/projetos/nasck-ui/).
//
// SKIP_STORYBOOK=1 reaproveita os storybook-static ja gerados (uso local e no CI depois de
// `npm run build-storybook`).
import { execSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
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

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function countStories(dir) {
  const index = JSON.parse(readFileSync(join(dir, 'index.json'), 'utf8'));
  return Object.values(index.entries).filter((entry) => entry.type === 'story').length;
}

run('npm run build:tokens');
if (process.env.SKIP_STORYBOOK !== '1') run('npm run build-storybook');
for (const dir of [REACT, ANGULAR]) {
  if (!existsSync(join(dir, 'index.html'))) {
    throw new Error(`Storybook nao encontrado em ${dir}. Rode "npm run build-storybook" antes.`);
  }
}

// Pagina de entrada (HTML estatico + especimes React reais), gerada pelo Vite. Os numeros dela
// saem de scripts/portable-stats.ts, lidos do contrato, dos presets e dos Storybooks buildados.
rmSync(OUT, { recursive: true, force: true });
run('npx vite build --config portable-src/vite.config.ts --logLevel warn');
const entryPath = join(OUT, 'index.html');
if (!existsSync(entryPath)) throw new Error('A pagina de entrada nao foi gerada.');
const leftover = /__[A-Z_]+__/.exec(readFileSync(entryPath, 'utf8'));
if (leftover) throw new Error(`Marcador sem valor na pagina de entrada: ${leftover[0]}`);

cpSync(REACT, join(OUT, 'react'), { recursive: true });
cpSync(ANGULAR, join(OUT, 'angular'), { recursive: true });
writeFileSync(join(OUT, '.nojekyll'), '');

// Mapas de origem nao entram na demo (peso).
for (const path of walk(OUT)) if (path.endsWith('.map')) rmSync(path);

// Verificacao: nenhum HTML pode apontar para a raiz do dominio (quebraria em subpath).
const ABSOLUTE = /(?:src|href)=["']\/(?!\/)/;
const offenders = walk(OUT)
  .filter((path) => path.endsWith('.html'))
  .filter((path) => ABSOLUTE.test(readFileSync(path, 'utf8')))
  .map((path) => relative(OUT, path));
if (offenders.length > 0) {
  throw new Error(`Caminhos absolutos encontrados (quebram em subpath): ${offenders.join(', ')}`);
}

const contract = JSON.parse(readFileSync(join(ROOT, 'contract/contract.json'), 'utf8'));
const stories = countStories(REACT) + countStories(ANGULAR);
process.stdout.write(
  `portable-dist pronto: ${Object.keys(contract.components).length} componentes, ${stories} stories.\n`,
);
