import { expect, test } from '@playwright/test';
import { gotoRoute, runAxe, setTheme, watchProblems } from './helpers';

const ROUTES = [
  '/',
  '/componentes/button',
  '/componentes/table',
  '/componentes/combobox',
  '/componentes/menu',
  '/componentes/dialog',
  '/componentes/tabs',
  '/tokens',
  '/modelos/painel',
  '/modelos/configuracoes',
  '/modelos/login',
];

test.describe('acessibilidade (axe) nas páginas principais', () => {
  for (const route of ROUTES) {
    for (const theme of ['light', 'dark'] as const) {
      test(`${route} no tema ${theme}`, async ({ page }) => {
        const problems = watchProblems(page);
        await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
        await gotoRoute(page, route);
        await setTheme(page, theme);
        await page.waitForTimeout(300);
        const violations = await runAxe(page);
        expect(
          violations.map(
            (v) => `${v.id}: ${JSON.stringify(v.nodes.slice(0, 3).map((n) => n.target))}`,
          ),
        ).toEqual([]);
        expect(problems).toEqual([]);
      });
    }
  }
});

test.describe('responsivo', () => {
  for (const width of [360, 390, 768, 1440]) {
    test(`sem rolagem horizontal em ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ROUTES) {
        await gotoRoute(page, route);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, route).toBeLessThanOrEqual(0);
      }
    });
  }
});

test('recarregar numa rota interna continua funcionando', async ({ page }) => {
  await gotoRoute(page, '/componentes/accordion');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1, name: 'Accordion' })).toBeVisible();
});

test('rota inexistente mostra a página de não encontrada', async ({ page }) => {
  await gotoRoute(page, '/nao-existe');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Página não encontrada' }),
  ).toBeVisible();
});

test('Ctrl+K abre a busca, filtra sem acento e navega', async ({ page }) => {
  await gotoRoute(page, '/');
  await page.keyboard.press('Control+k');
  const input = page.getByRole('combobox', { name: /Buscar componentes/ });
  await expect(input).toBeFocused();
  await input.fill('botao');
  await expect(page.getByRole('option', { name: /Button/ }).first()).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#\/componentes\/button$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('Esc fecha a busca e devolve o foco', async ({ page }) => {
  await gotoRoute(page, '/');
  const trigger = page.getByRole('button', { name: /Buscar/ });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('menu lateral vira drawer no celular, com Esc e foco devolvido', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoRoute(page, '/');
  const open = page.getByRole('button', { name: 'Abrir menu' });
  await expect(page.getByRole('link', { name: 'Tokens e tema' })).toBeHidden();
  await open.click();
  await expect(page.getByRole('link', { name: 'Tokens e tema' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('link', { name: 'Tokens e tema' })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused();
  await open.click();
  await page.getByRole('link', { name: 'Tokens e tema' }).click();
  await expect(page).toHaveURL(/#\/tokens$/);
});

test('alternar o tema persiste após recarregar', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await gotoRoute(page, '/');
  await page.getByRole('button', { name: 'Mudar para o tema escuro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
