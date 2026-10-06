import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
});

test('carrega a home e mantém as seções principais acessíveis', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1, name: 'Pedro Bicas' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Pedro Bicas, voltar ao início' })).toBeVisible();
  await expect(page.locator('#sobre')).toBeAttached();
  await expect(page.locator('#stack')).toBeAttached();
  await expect(page.locator('#trajetoria')).toBeAttached();
  await expect(page.locator('#projetos')).toBeAttached();
  await expect(page.locator('#contato')).toBeAttached();
});

test('alternância entre portfólio, projetos e currículo funciona', async ({ page }) => {
  const modeSwitch = page.locator('.switch');

  await modeSwitch.getByRole('button', { name: 'Projetos' }).click();
  await expect(page).toHaveURL(/#\/projetos$/);
  await expect(page.locator('#galeria')).toBeVisible();
  await expect(page.locator('#g-title')).toContainText('Projetos');

  await modeSwitch.getByRole('button', { name: 'Currículo' }).click();
  await expect(page).toHaveURL(/#\/curriculo$/);
  await expect(page.locator('#curriculo')).toBeVisible();
  await expect(page.locator('#cv-title')).toHaveText('Pedro Bicas');

  await modeSwitch.getByRole('button', { name: 'Portfólio' }).click();
  await expect(page).not.toHaveURL(/#\/curriculo|#\/projetos/);
  await expect(page.locator('#conteudo')).not.toHaveAttribute('inert', '');
});

test('abre e fecha detalhes de um projeto', async ({ page }) => {
  const modeSwitch = page.locator('.switch');

  await modeSwitch.getByRole('button', { name: 'Projetos' }).click();
  await page.locator('.g-link').first().click();

  await expect(page.locator('#detalhe')).toBeVisible();
  await expect(page.locator('#d-name')).not.toBeEmpty();
  await expect(page.locator('.d-body:not([hidden])')).toBeVisible();
  await expect(page.locator('.d-cover [data-project-visual]:not([hidden])')).toHaveCount(1);

  await page.getByRole('button', { name: 'Fechar o projeto' }).click();
  await expect(page.locator('#detalhe')).toBeHidden();
});

test('não registra erros JavaScript durante o fluxo principal', async ({ page }) => {
  const errors = [];
  const modeSwitch = page.locator('.switch');
  page.on('pageerror', (error) => errors.push(error.message));

  await modeSwitch.getByRole('button', { name: 'Projetos' }).click();
  await page.getByRole('button', { name: 'Grade' }).click();
  await modeSwitch.getByRole('button', { name: 'Portfólio' }).click();

  expect(errors).toEqual([]);
});
