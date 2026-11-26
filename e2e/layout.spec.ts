import { expect, test, type Page } from '@playwright/test';

/**
 * Nada pode vazar na horizontal: a pagina nunca rola de lado (conteudo largo rola dentro da
 * propria caixa). Entrada e paginas de documentacao em 8 larguras e nos dois temas; todas as
 * stories dos dois Storybooks na largura mais estreita (320 px).
 * Variaveis: LAYOUT_FRAMEWORKS=react,angular  LAYOUT_FILTER=<trecho do id da story>
 */
const BASE = '/projetos/nasck-ui/';
const WIDTHS = [320, 375, 390, 768, 1024, 1280, 1440, 1920];
const SCHEMES = ['light', 'dark'] as const;
const FRAMEWORKS = (process.env['LAYOUT_FRAMEWORKS'] ?? 'react,angular').split(',');
const FILTER = process.env['LAYOUT_FILTER'];
const DOCS: Record<string, string[]> = {
  react: [
    'story/visão-geral-introdução--introducao',
    'docs/componentes-appbutton--docs',
    'story/tema-construtor-de-tema--construtor',
    'story/tema-tokens--atual',
  ],
  angular: ['story/visão-geral-introdução--introducao', 'docs/componentes-appbutton--docs'],
};

async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

/** Textos cortados com reticencias (titulo de card, rotulo...): o conteudo nao cabe e some. */
function clippedText(root: HTMLElement): string[] {
  return Array.from(root.querySelectorAll<HTMLElement>('*'))
    .filter((el) => getComputedStyle(el).textOverflow === 'ellipsis')
    .filter((el) => el.offsetParent !== null && el.scrollWidth > el.clientWidth + 1)
    .map((el) => (el.textContent ?? '').trim().slice(0, 40));
}

test.describe('sem rolagem horizontal nem texto cortado', () => {
  for (const scheme of SCHEMES) {
    test(`entrada em ${WIDTHS.length} larguras, ${scheme}`, async ({ browser }) => {
      const problems: string[] = [];
      for (const width of WIDTHS) {
        const context = await browser.newContext({
          viewport: { width, height: 900 },
          colorScheme: scheme,
        });
        const page = await context.newPage();
        await page.goto(BASE);
        await expect(page.locator('[data-specimen="button"] button').first()).toBeVisible();
        const overflow = await horizontalOverflow(page);
        if (overflow > 0) problems.push(`${width}px: ${overflow}px a mais`);
        const clipped = await page.locator('body').evaluate(clippedText);
        for (const text of clipped) problems.push(`${width}px: texto cortado "${text}"`);
        await context.close();
      }
      expect(problems).toEqual([]);
    });

    for (const framework of FRAMEWORKS) {
      test(`${framework}: documentacao em ${WIDTHS.length} larguras, ${scheme}`, async ({
        browser,
      }) => {
        const problems: string[] = [];
        for (const path of DOCS[framework] ?? []) {
          for (const width of WIDTHS) {
            const context = await browser.newContext({
              viewport: { width, height: 900 },
              colorScheme: scheme,
            });
            const page = await context.newPage();
            await page.goto(`${BASE}${framework}/index.html?path=/${path}`);
            const preview = page.frameLocator('#storybook-preview-iframe');
            await preview
              .locator('#storybook-root > *, #storybook-docs .sbdocs-content')
              .first()
              .waitFor({ timeout: 60_000 });
            const manager = await horizontalOverflow(page);
            if (manager > 0) problems.push(`${path} ${width}px: manager ${manager}px`);
            const inner = await preview
              .locator('html')
              .evaluate((html) => html.scrollWidth - html.clientWidth);
            if (inner > 0) problems.push(`${path} ${width}px: preview ${inner}px`);
            const clipped = await preview.locator('body').evaluate(clippedText);
            for (const text of clipped)
              problems.push(`${path} ${width}px: texto cortado "${text}"`);
            await context.close();
          }
        }
        expect(problems).toEqual([]);
      });
    }
  }
});

for (const framework of FRAMEWORKS) {
  test(`${framework}: todas as stories cabem em 320 px`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 320, height: 720 } });
    const page = await context.newPage();
    const response = await page.request.get(`${BASE}${framework}/index.json`);
    expect(response.ok()).toBe(true);
    const index = (await response.json()) as {
      entries: Record<string, { id: string; type: string }>;
    };
    const ids = Object.values(index.entries)
      .filter((entry) => entry.type === 'story')
      .map((entry) => entry.id)
      .filter((id) => !FILTER || id.includes(FILTER));
    expect(ids.length).toBeGreaterThan(FILTER ? 0 : 20);
    const problems: string[] = [];
    // O tema nao muda a largura; o escuro ja passa pelas paginas de documentacao acima.
    for (const id of ids) {
      await page.goto(`${BASE}${framework}/iframe.html?id=${id}&viewMode=story`);
      await page.waitForSelector('body.sb-show-main', { timeout: 30_000 });
      await page.waitForFunction(
        () => (document.querySelector('#storybook-root')?.children.length ?? 0) > 0,
      );
      await page.waitForTimeout(300);
      const overflow = await horizontalOverflow(page);
      if (overflow > 0) problems.push(`${id}: ${overflow}px`);
    }
    await context.close();
    expect(problems).toEqual([]);
  });
}
