import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/**
 * Abre cada story de cada Storybook (iframe de preview) e roda o axe. Zero violacoes.
 * Variaveis: A11Y_FRAMEWORKS=react,angular  A11Y_MODES=light,dark  A11Y_PRESETS=nasck,...
 *            A11Y_FILTER=<trecho do id da story>
 */
const BASE = '/projetos/nasck-ui/';
const FRAMEWORKS = (process.env['A11Y_FRAMEWORKS'] ?? 'react,angular').split(',');
const MODES = (process.env['A11Y_MODES'] ?? 'light,dark').split(',');
const PRESETS = (process.env['A11Y_PRESETS'] ?? 'nasck').split(',');
const FILTER = process.env['A11Y_FILTER'];
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

interface IndexEntry {
  id: string;
  type: string;
}

/** O addon a11y do Storybook tambem roda o axe na pagina; se houver sobreposicao, tenta de novo. */
async function analyze(page: Page) {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await new AxeBuilder({ page }).withTags(TAGS).analyze();
    } catch (error) {
      const overlapping = String(error).includes('Axe is already running');
      if (!overlapping || attempt >= 6) throw error;
      await page.waitForTimeout(1000);
    }
  }
}

async function storyIds(page: Page, framework: string): Promise<string[]> {
  const response = await page.request.get(`${BASE}${framework}/index.json`);
  expect(response.ok(), `index.json de ${framework}`).toBe(true);
  const index = (await response.json()) as { entries: Record<string, IndexEntry> };
  return Object.values(index.entries)
    .filter((entry) => entry.type === 'story')
    .map((entry) => entry.id)
    .filter((id) => !FILTER || id.includes(FILTER));
}

for (const framework of FRAMEWORKS) {
  for (const preset of PRESETS) {
    for (const mode of MODES) {
      test(`${framework}/${preset}/${mode}: todas as stories sem violacoes de acessibilidade`, async ({
        page,
      }) => {
        const ids = await storyIds(page, framework);
        expect(ids.length).toBeGreaterThan(FILTER ? 0 : 20);
        const problems: string[] = [];
        for (const id of ids) {
          await page.goto(
            `${BASE}${framework}/iframe.html?id=${id}&viewMode=story&globals=mode:${mode};preset:${preset}`,
          );
          await page.waitForSelector('body.sb-show-main', { timeout: 30_000 });
          await page.waitForFunction(
            () => (document.querySelector('#storybook-root')?.children.length ?? 0) > 0,
          );
          await page.waitForTimeout(450);
          const results = await analyze(page);
          for (const violation of results.violations) {
            const target = violation.nodes[0]?.target.join(' ') ?? '';
            problems.push(`${id} [${violation.id}] x${violation.nodes.length} ${target}`);
          }
        }
        expect(problems).toEqual([]);
      });
    }
  }
}
