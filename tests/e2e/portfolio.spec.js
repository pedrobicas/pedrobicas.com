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

test('cada rota de projeto mostra apenas os dados do projeto correto', async ({ page }) => {
  await page.goto('/#/projetos/my-spotify-universe');

  await expect(page.locator('#detalhe')).toBeVisible();
  await expect(page.locator('#d-name')).toHaveText('My Spotify Universe');
  await expect(page.locator('.d-desc')).toContainText('Spotify');
  await expect(page.locator('.d-desc')).not.toContainText('CoinGecko');
  await expect(page.locator('.d-stack')).toContainText('React');
  await expect(page.locator('.d-stack')).not.toContainText('Streamlit');
  await expect(page.locator('.d-cover [data-project-visual]:not([hidden])')).toHaveCount(1);

  await page.goto('/#/projetos/faxina');
  await expect(page.locator('#d-name')).toHaveText('Faxina');
  await expect(page.locator('.d-desc')).toContainText('armazenamento');
  await expect(page.locator('.d-stack')).toContainText('Python');

  await page.goto('/#/projetos/stack10');
  await expect(page.locator('#d-name')).toHaveText('STACK10');
  await expect(page.locator('.d-desc')).toContainText('120 Hz');
  await expect(page.locator('.d-stack')).toContainText('Canvas 2D');
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


test('refresh direto em projetos e detalhes não prende o loader nem o cursor', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });

  for (const route of ['/#/projetos', '/#/projetos/crypto-analysis']) {
    await page.goto(route);
    await expect(page.locator('#galeria')).toBeVisible();
    await expect(page.locator('.loader')).toBeHidden();
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'projetos');

    if (route.includes('crypto-analysis')) {
      await expect(page.locator('#detalhe')).toBeVisible();
      await expect(page.locator('#d-name')).toHaveText('Crypto Analysis');
    }

    await page.mouse.move(320, 220);
    await expect(page.locator('.cursor-label')).not.toHaveText('pular');

    await page.reload();
    await expect(page.locator('#galeria')).toBeVisible();
    await expect(page.locator('.loader')).toBeHidden();
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'projetos');
    await page.mouse.move(360, 260);
    await expect(page.locator('.cursor-label')).not.toHaveText('pular');
  }
});
