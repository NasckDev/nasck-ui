import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const BASES = ['/projetos/nasck-ui/', '/Myportfolio/projetos/nasck-ui/'];
const SIZES = [
  { name: 'celular', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
];
const SCHEMES = ['light', 'dark'] as const;
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const base of BASES) {
  test.describe(`subpath ${base}`, () => {
    test('a entrada carrega e linka os dois Storybooks sem 404', async ({ page }) => {
      const failed: string[] = [];
      page.on('response', (response) => {
        if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`);
      });
      await page.goto(base);
      await expect(page.getByRole('heading', { level: 1 })).toContainText('uma API só');
      await expect(page.getByRole('link', { name: /Storybook React/ })).toHaveAttribute(
        'href',
        './react/index.html',
      );
      await expect(page.getByRole('link', { name: /Storybook Angular/ })).toHaveAttribute(
        'href',
        './angular/index.html',
      );
      expect(failed).toEqual([]);
    });

    for (const framework of ['react', 'angular'] as const) {
      test(`${framework}: iframe de uma story carrega sem 404`, async ({ page }) => {
        const failed: string[] = [];
        page.on('response', (response) => {
          if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`);
        });
        await page.goto(
          `${base}${framework}/iframe.html?id=componentes-appbutton--padrao&viewMode=story`,
        );
        await expect(page.getByRole('button', { name: /Salvar alterações/ })).toBeVisible();
        expect(failed).toEqual([]);
      });
    }
  });
}

for (const size of SIZES) {
  for (const scheme of SCHEMES) {
    test(`entrada sem violacoes de acessibilidade: ${size.name}, ${scheme}`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        viewport: { width: size.width, height: size.height },
        colorScheme: scheme,
      });
      const page = await context.newPage();
      await page.goto(BASES[0] ?? '/');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(hasHorizontalScroll).toBe(false);
      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      expect(
        results.violations.map((violation) => `${violation.id}: ${violation.nodes.length}`),
      ).toEqual([]);
      await context.close();
    });
  }
}
