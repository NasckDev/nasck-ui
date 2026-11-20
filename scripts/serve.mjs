// Servidor estatico minimo para testar portable-dist/ em um subpath, como o portfolio faz.
// Uso: node scripts/serve.mjs [porta] [prefixo1,prefixo2]
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'portable-dist');
const PORT = Number(process.argv[2] ?? 4173);
const PREFIXES = (process.argv[3] ?? '/projetos/nasck-ui/,/Myportfolio/projetos/nasck-ui/').split(
  ',',
);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.map': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
};

createServer((request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost');
  const prefix = PREFIXES.find((candidate) => url.pathname.startsWith(candidate));
  if (!prefix) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Fora do subpath do portfolio.');
    return;
  }
  let relative = decodeURIComponent(url.pathname.slice(prefix.length));
  if (relative === '' || relative.endsWith('/')) relative += 'index.html';
  const file = normalize(join(ROOT, relative));
  if (!file.startsWith(ROOT) || !existsSync(file) || !statSync(file).isFile()) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Nao encontrado.');
    return;
  }
  response.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(response);
}).listen(PORT, () => {
  process.stdout.write(`Servindo portable-dist em http://localhost:${PORT}${PREFIXES[0]}\n`);
});
