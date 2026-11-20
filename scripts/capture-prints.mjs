// Gera os prints de docs/prints a partir do portable-dist servido em subpath.
// Pre-requisito: `npm run build:portable` e `node scripts/serve.mjs 4173` rodando.
// Uso: PLAYWRIGHT_CORE=<caminho do playwright-core> node scripts/capture-prints.mjs [filtro]
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE ?? 'playwright-core');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'docs', 'prints');
const BASE = process.env.PRINTS_BASE ?? 'http://localhost:4173/projetos/nasck-ui/';
const FILTER = process.argv[2];
mkdirSync(OUT, { recursive: true });

const DESKTOP = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };
const MOBILE = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
};

const manager = (framework, id, extra = '') =>
  `${BASE}${framework}/index.html?path=/story/${id}${extra}`;

async function settle(page, ms = 1200) {
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(ms);
}

function preview(page) {
  return page.frameLocator('#storybook-preview-iframe');
}

const shots = [
  {
    name: 'desktop-visao-geral',
    device: DESKTOP,
    run: async (page) => {
      await page.goto(BASE);
      await settle(page, 600);
    },
  },
  {
    name: 'desktop-componente-button',
    device: DESKTOP,
    run: async (page) => {
      await page.goto(manager('react', 'componentes-appbutton--variantes', '&panel=bottom'));
      await preview(page).getByRole('button', { name: 'primary' }).waitFor();
      await settle(page);
    },
  },
  {
    name: 'desktop-componente-combobox',
    device: DESKTOP,
    run: async (page) => {
      await page.goto(manager('react', 'componentes-appselect--com-busca', '&panel=bottom'));
      const combo = preview(page).getByRole('combobox', { name: 'Estado' });
      await combo.waitFor();
      await combo.click();
      await combo.fill('rio');
      await preview(page).getByText('Rio de Janeiro').first().waitFor();
      await settle(page, 700);
    },
  },
  {
    name: 'desktop-construtor-tema',
    device: DESKTOP,
    run: async (page) => {
      await page.goto(
        manager('react', 'tema-construtor-de-tema--construtor', '&nav=0&panel=false'),
      );
      await preview(page).getByRole('heading', { name: 'Construtor de tema' }).waitFor();
      await settle(page);
    },
  },
  {
    name: 'desktop-modelo-painel',
    device: DESKTOP,
    run: async (page) => {
      await page.goto(manager('react', 'modelos-painel--padrao', '&nav=0&panel=false'));
      await preview(page).getByRole('heading', { name: 'Painel comercial' }).waitFor();
      await settle(page, 2000);
    },
  },
  {
    name: 'desktop-modelo-configuracoes',
    device: DESKTOP,
    run: async (page) => {
      await page.goto(manager('angular', 'modelos-configurações--padrao', '&nav=0&panel=false'));
      await preview(page).getByRole('heading', { name: 'Configurações da conta' }).waitFor();
      await settle(page, 1500);
    },
  },
  {
    name: 'desktop-tokens-escuro',
    device: DESKTOP,
    run: async (page) => {
      await page.goto(
        manager('react', 'tema-tokens--atual', '&nav=0&panel=false&globals=mode:dark;preset:nasck'),
      );
      await preview(page).getByRole('heading', { name: 'Tokens do tema' }).waitFor();
      await settle(page);
    },
  },
  {
    name: 'mobile-visao-geral',
    device: MOBILE,
    run: async (page) => {
      await page.goto(BASE);
      await settle(page, 600);
    },
  },
  {
    name: 'mobile-exemplo-composto',
    device: MOBILE,
    run: async (page) => {
      await page.goto(`${BASE}react/iframe.html?id=modelos-painel--padrao&viewMode=story`);
      await page.getByRole('heading', { name: 'Painel comercial' }).waitFor();
      await settle(page, 2000);
    },
  },
  {
    name: 'mobile-modelo-login',
    device: MOBILE,
    run: async (page) => {
      await page.goto(`${BASE}react/iframe.html?id=modelos-login--erro&viewMode=story`);
      await page.getByRole('heading', { name: 'Entrar na conta' }).waitFor();
      await settle(page);
    },
  },
  {
    name: 'mobile-menu',
    device: MOBILE,
    run: async (page) => {
      await page.goto(manager('react', 'componentes-appbutton--padrao'));
      await settle(page, 800);
      await page.getByRole('button', { name: /navigation menu|menu de navegação/i }).click();
      await settle(page, 700);
    },
  },
];

const browser = await chromium.launch({ channel: 'chrome' });
try {
  for (const shot of shots) {
    if (FILTER && !shot.name.includes(FILTER)) continue;
    const context = await browser.newContext({
      ...shot.device,
      colorScheme: 'light',
      locale: 'pt-BR',
    });
    const page = await context.newPage();
    await shot.run(page);
    await page.screenshot({ path: join(OUT, `${shot.name}.png`), fullPage: false });
    process.stdout.write(`ok ${shot.name}\n`);
    await context.close();
  }
} finally {
  await browser.close();
}
