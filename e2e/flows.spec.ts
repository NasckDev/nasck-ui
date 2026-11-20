import { expect, test } from '@playwright/test';
import { gotoRoute } from './helpers';

test('playground do Button gera código a partir das propriedades', async ({ page }) => {
  await gotoRoute(page, '/componentes/button');
  const code = page.getByLabel('Código: Button, gerado pelo playground', { exact: true });
  await expect(code).toContainText('<Button>Salvar alterações</Button>');
  await page.getByLabel('variant', { exact: true }).selectOption('danger');
  await page.getByRole('switch', { name: 'loading' }).click();
  await expect(code).toContainText('variant="danger"');
  await expect(code).toContainText('loading');
  await page.getByRole('button', { name: 'Restaurar padrões' }).click();
  await expect(code).not.toContainText('danger');
});

test('botão copiar confirma a cópia do código', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await gotoRoute(page, '/componentes/button');
  await page.getByRole('button', { name: 'Copiar código: Button, gerado pelo playground' }).click();
  await expect(page.getByText('Código copiado')).toBeAttached();
});

test('anatomia destaca a parte ao focar o item da legenda', async ({ page }) => {
  await gotoRoute(page, '/componentes/button');
  await page.getByRole('button', { name: /Rótulo/ }).focus();
  await expect(page.locator('.pg-anat-hl')).toHaveCount(1);
});

test('tabela da documentação ordena e anuncia aria-sort', async ({ page }) => {
  await gotoRoute(page, '/componentes/table');
  const header = page.getByRole('columnheader', { name: /Cliente/ }).first();
  await header.getByRole('button').click();
  await expect(header).toHaveAttribute('aria-sort', 'ascending');
  await header.getByRole('button').click();
  await expect(header).toHaveAttribute('aria-sort', 'descending');
});

test('construtor de tema gera escala, passa no contraste e exporta o CSS', async ({ page }) => {
  await gotoRoute(page, '/tokens');
  await page.getByRole('button', { name: 'Azul' }).click();
  await expect(page.getByLabel('Cor de destaque (hex)')).toHaveValue('#2563eb');
  await expect(page.locator('.pg-tb-step')).toHaveCount(11);
  await expect(page.getByText('Reprovado')).toHaveCount(0);
  await expect(page.getByLabel('Código: CSS do tema gerado', { exact: true })).toContainText(
    '--nui-color-accent: #2563eb',
  );
  await page.getByLabel('Cor de destaque (hex)').fill('zzz');
  await expect(page.getByText('Use o formato #rrggbb.')).toBeVisible();
});

test('painel: menu de ações abre por teclado e a paginação troca as linhas', async ({ page }) => {
  await gotoRoute(page, '/modelos/painel');
  const trigger = page.getByRole('button', { name: /Ações da fatura/ }).first();
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menu')).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Editar' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();

  await page.getByRole('button', { name: 'Página 2' }).click();
  await expect(page.getByText('6–10 de 12 faturas')).toBeVisible();
});

test('configurações: valida o e-mail, salva e confirma a exclusão da conta', async ({ page }) => {
  await gotoRoute(page, '/modelos/configuracoes');
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(page.getByText('Informe um e-mail válido', { exact: false })).toBeVisible();
  await page.getByLabel('E-mail de trabalho').fill('marina@lumen.com.br');
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(page.getByText('Perfil atualizado')).toBeVisible();

  await page.getByRole('tab', { name: 'Conta' }).click();
  await page.getByRole('button', { name: 'Excluir minha conta' }).click();
  const dialog = page.getByRole('alertdialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Cancelar' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Excluir minha conta' })).toBeFocused();
});

test('login: erros em português ligados aos campos e estado de carregamento', async ({ page }) => {
  await gotoRoute(page, '/modelos/login');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  const email = page.getByLabel('E-mail');
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(email).toHaveAccessibleDescription(/e-mail válido/);
  await email.fill('marina@lumen.com.br');
  await page.locator('input[autocomplete="current-password"]').fill('senha-segura-123');
  await page.getByLabel('Mostrar senha').check();
  await expect(page.locator('input[autocomplete="current-password"]')).toHaveAttribute(
    'type',
    'text',
  );
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByRole('button', { name: /Entrando/ })).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByText('Bem-vinda de volta')).toBeVisible();
});
