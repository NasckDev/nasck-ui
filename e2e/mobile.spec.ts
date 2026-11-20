import { expect, test } from '@playwright/test';
import { gotoRoute } from './helpers';

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

test('tabela em cartões: todas as linhas mostram rótulo e valor em colunas separadas', async ({
  page,
}) => {
  await gotoRoute(page, '/componentes/table');
  const cells = page.locator('.nui-table__td');
  const total = await cells.count();
  expect(total).toBeGreaterThan(8);
  const displays = await cells.evaluateAll((nodes) =>
    nodes
      .filter((node) => !node.classList.contains('nui-table__td--head'))
      .map((node) => getComputedStyle(node).display),
  );
  expect(displays.length).toBeGreaterThan(8);
  expect(displays.every((display) => display === 'flex')).toBe(true);
  // The sort buttons stay visible and reachable in the card layout.
  const sortButton = page.locator('.nui-table__head .nui-table__sort').first();
  await expect(sortButton).toBeVisible();
  const box = await sortButton.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  const text = await page.locator('.nui-table__row').first().innerText();
  expect(text).not.toMatch(/VALORR\$/i);
});

test('painel no celular: as quatro seções ficam em uma linha, sem faixa vazia', async ({
  page,
}) => {
  await gotoRoute(page, '/modelos/painel');
  const links = page.locator('.tpl-dash__nav a');
  await expect(links).toHaveCount(4);
  const boxes = await links.evaluateAll((nodes) =>
    nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { top: Math.round(rect.top), height: Math.round(rect.height) };
    }),
  );
  expect(new Set(boxes.map((box) => box.top)).size).toBe(1);
  expect(Math.min(...boxes.map((box) => box.height))).toBeGreaterThanOrEqual(44);
  const rail = await page.locator('.tpl-dash__rail').boundingBox();
  expect(rail?.height ?? 999).toBeLessThan(170);
});

test('alvos de toque têm pelo menos 44 px nos controles principais', async ({ page }) => {
  await gotoRoute(page, '/');
  const small = await page
    .locator('.pg-topbar button, .pg-topbar a, .pg-hero .nui-button, .pg-install__copy, .pg-cta')
    .evaluateAll((nodes) =>
      nodes
        .map((node) => ({
          name: (node.getAttribute('aria-label') ?? node.textContent ?? '').trim().slice(0, 30),
          rect: node.getBoundingClientRect(),
        }))
        .filter(({ rect }) => rect.width > 0 && (rect.height < 43.5 || rect.width < 43.5))
        .map(({ name, rect }) => `${name}: ${Math.round(rect.width)}x${Math.round(rect.height)}`),
    );
  expect(small).toEqual([]);
});

test('âncoras da página de componente e tabela de API não estouram em 360 px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await gotoRoute(page, '/componentes/table');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  const anatomy = await page.locator('.pg-anatomy__stage').boundingBox();
  expect(anatomy?.width ?? 0).toBeGreaterThan(250);
});
