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

test.describe('pagina de entrada', () => {
  test('mostra os numeros reais, sem marcador sobrando', async ({ page }) => {
    await page.goto(BASES[0] ?? '/');
    const stats = page.locator('.stats .value');
    await expect(stats).toHaveCount(4);
    for (const text of await stats.allInnerTexts()) expect(text).toMatch(/^\d+$/);
    expect(await page.content()).not.toMatch(/__[A-Z_]+__/);
    const swatches = page.getByRole('list', { name: /Presets e contraste/ }).getByRole('listitem');
    await expect(swatches).toHaveCount(4);
    for (const text of await swatches.allInnerTexts()) expect(text).toMatch(/\d,\d:1 AA/);
  });

  test('os especimes sao os wrappers reais e respondem ao uso', async ({ page }) => {
    await page.goto(BASES[0] ?? '/');
    const buttons = page.locator('[data-specimen="button"]');
    await expect(buttons.locator('button.ant-btn')).toHaveCount(6);
    await expect(buttons.getByRole('button', { name: 'Primária' })).toBeVisible();
    await expect(buttons.getByRole('button', { name: /Salvando/ })).toHaveAttribute(
      'aria-busy',
      'true',
    );

    const email = page.getByLabel('E-mail do responsável');
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByText('Inclua o domínio completo')).toBeVisible();
    await email.fill('ana@empresa.com.br');
    await expect(email).not.toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByText('Inclua o domínio completo')).toHaveCount(0);

    const toggle = page.getByRole('switch');
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await toggle.press('Space');
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    const terms = page.getByRole('checkbox', { name: 'Aceito os termos de uso' });
    await terms.press('Space');
    await expect(terms).not.toBeChecked();
  });

  test('o tema escuro vale para a pagina, os especimes e os links dos Storybooks', async ({
    page,
  }) => {
    await page.goto(BASES[0] ?? '/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');
    const before = await page
      .getByRole('button', { name: 'Secundária' })
      .evaluate((node) => getComputedStyle(node).backgroundColor);
    await page.getByRole('button', { name: 'Tema escuro' }).click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByRole('button', { name: 'Tema escuro' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.getByRole('link', { name: 'Storybook React' })).toHaveAttribute(
      'href',
      './react/index.html?globals=mode:dark',
    );
    await expect
      .poll(() =>
        page
          .getByRole('button', { name: 'Secundária' })
          .evaluate((node) => getComputedStyle(node).backgroundColor),
      )
      .not.toBe(before);
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });
});

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
