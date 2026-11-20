import { expect, test, type Page } from '@playwright/test';
import { gotoRoute, runAxe, setTheme } from './helpers';

const expectNoViolations = async (page: Page, label: string): Promise<void> => {
  const violations = await runAxe(page);
  expect(
    violations.map(
      (v) => `${label} ${v.id}: ${JSON.stringify(v.nodes.slice(0, 3).map((n) => n.target))}`,
    ),
  ).toEqual([]);
};

for (const theme of ['light', 'dark'] as const) {
  test.describe(`axe com camadas abertas (${theme})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
    });

    test('menu aberto', async ({ page }) => {
      await gotoRoute(page, '/componentes/menu');
      await setTheme(page, theme);
      await page.getByRole('button', { name: 'Ações', exact: true }).first().click();
      await expect(page.getByRole('menu')).toBeVisible();
      await expectNoViolations(page, 'menu');
    });

    test('combobox aberto, com resultados e sem resultados', async ({ page }) => {
      await gotoRoute(page, '/componentes/combobox');
      await setTheme(page, theme);
      const input = page.getByRole('combobox').first();
      await input.click();
      await page.keyboard.press('ArrowDown');
      await expect(page.getByRole('listbox').first()).toBeVisible();
      await expectNoViolations(page, 'combobox com resultados');

      await input.fill('zzzz');
      await expect(page.getByText('Nenhum resultado').first()).toBeVisible();
      await expectNoViolations(page, 'combobox sem resultados');
    });

    test('diálogo aberto e confirmação destrutiva', async ({ page }) => {
      await gotoRoute(page, '/componentes/dialog');
      await setTheme(page, theme);
      await page.getByRole('button', { name: 'Abrir diálogo' }).first().click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expectNoViolations(page, 'dialog');
    });

    test('paleta de busca aberta', async ({ page }) => {
      await gotoRoute(page, '/');
      await setTheme(page, theme);
      await page.keyboard.press('Control+k');
      await expect(page.getByRole('dialog', { name: 'Buscar na documentação' })).toBeVisible();
      await expectNoViolations(page, 'paleta');
    });
  });
}

test('Esc num menu aberto fecha só o menu e mantém a tela', async ({ page }) => {
  await gotoRoute(page, '/modelos/configuracoes');
  await page.getByRole('tab', { name: 'Equipe' }).click();
  await page.getByRole('button', { name: /Ações de Marina/ }).click();
  await expect(page.getByRole('menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(page.getByRole('tab', { name: 'Equipe' })).toBeVisible();
});

test('a paleta fecha ao trocar de rota', async ({ page }) => {
  await gotoRoute(page, '/');
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog', { name: 'Buscar na documentação' })).toBeVisible();
  await page.evaluate(() => {
    window.location.hash = '#/tokens';
  });
  await expect(page.getByRole('dialog', { name: 'Buscar na documentação' })).toHaveCount(0);
});

test('o código copiado do playground é um exemplo completo, com import e dados', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await gotoRoute(page, '/componentes/combobox');
  await page
    .getByRole('button', { name: 'Copiar código: Combobox, gerado pelo playground' })
    .click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("import { Combobox } from '@nasckdev/nasck-ui';");
  expect(copied).toContain('const options = [');
  expect(copied).toContain('export function Example()');
  expect(copied).toContain('options={options}');
});

test('o playground do Menu e do Combobox expõe as opções editáveis', async ({ page }) => {
  await gotoRoute(page, '/componentes/menu');
  await page.getByLabel('items', { exact: true }).fill('Abrir, Renomear, Excluir');
  await expect(
    page.getByLabel('Código: Menu, gerado pelo playground', { exact: true }),
  ).toContainText("label: 'Renomear'");
  await gotoRoute(page, '/componentes/combobox');
  await page.getByLabel('emptyMessage', { exact: true }).fill('Nada por aqui');
  await page.getByRole('combobox').first().fill('zzzz');
  await expect(page.getByText('Nada por aqui').first()).toBeVisible();
});

test('o construtor de tema avisa quando a cor reprova e ajusta automaticamente', async ({
  page,
}) => {
  await gotoRoute(page, '/tokens');
  await page.getByLabel('Cor de destaque (hex)').fill('#ffe600');
  const banner = page.getByRole('status').filter({ hasText: 'reprovam o contraste AA' });
  await expect(banner).toBeVisible();
  await expect(
    page.getByText(/reprovam o contraste AA: ajuste a cor antes de usar este CSS/),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Ajustar automaticamente' }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'passam no contraste AA' }),
  ).toBeVisible();
  await page.getByLabel('Cor de destaque (hex)').fill('#fff');
  await expect(page.getByLabel('Cor de destaque (hex)')).toHaveValue('#fff');
  await page.getByLabel('Cor de destaque (hex)').blur();
  await expect(page.getByLabel('Cor de destaque (hex)')).toHaveValue('#ffffff');
});
