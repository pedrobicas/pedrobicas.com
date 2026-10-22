import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('links antigos com hash levam para a rota real', async ({ page }) => {
  await page.goto('/#/projetos/faxina');
  await expect(page).toHaveURL(/\/projetos\/faxina$/);
  await expect(page.locator('#d-name')).toHaveText('Faxina');
  await expect(page).toHaveTitle('Faxina | Pedro Bicas');
});

// Lê o valor de uma meta tag ou do canonical no HTML pré-renderizado.
function head(html, selector) {
  const patterns = {
    canonical: /<link\s+rel="canonical"\s+href="([^"]*)"/,
    title: /<title>([^<]*)<\/title>/,
  };
  const pattern = patterns[selector] ?? new RegExp(`<meta\\s+(?:property|name)="${selector}"\\s+content="([^"]*)"`);
  return html.match(pattern)?.[1];
}

test('cada rota pré-renderizada tem título, canonical e Open Graph próprios', async ({ request }) => {
  const cases = [
    ['/', 'Pedro Bicas, desenvolvedor full-stack', 'https://www.pedrobicas.com/'],
    ['/projetos', 'Projetos | Pedro Bicas', 'https://www.pedrobicas.com/projetos'],
    ['/projetos/stack10', 'STACK10 | Pedro Bicas', 'https://www.pedrobicas.com/projetos/stack10'],
    ['/curriculo', 'Currículo | Pedro Bicas', 'https://www.pedrobicas.com/curriculo'],
  ];
  for (const [path, title, url] of cases) {
    const html = await (await request.get(path)).text();
    expect(head(html, 'title')).toBe(title);
    expect(head(html, 'canonical')).toBe(url);
    expect(head(html, 'og:url')).toBe(url);
    expect(head(html, 'og:title')).toBe(title);
    expect(head(html, 'twitter:title')).toBe(title);
  }
  const stack10 = await (await request.get('/projetos/stack10')).text();
  expect(head(stack10, 'og:image')).toBe('https://www.pedrobicas.com/projects/stack10.png');
  expect(head(stack10, 'description')).toMatch(/^Falling-block puzzle/);
  expect(stack10).toContain('data-slug="stack10"');
});

test('o sitemap lista a home, a galeria, o currículo e todos os projetos', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const path of [
    '/',
    '/projetos',
    '/curriculo',
    '/projetos/stack10',
    '/projetos/chat-tempo-real',
    '/projetos/postlocal',
  ]) {
    expect(sitemap).toContain(`<loc>https://www.pedrobicas.com${path}</loc>`);
  }
});

test('o conteúdo aparece mesmo sem JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.getByText('Atuo em todas as camadas de uma aplicação web')).toBeVisible();
    await expect(page.locator('.loader')).toBeHidden();
    await expect(page.locator('#projetos .proj-name').first()).toHaveText('STACK10');
    await expect(page.locator('#contato')).toContainText('pedro.bicas14@gmail.com');
  } finally {
    await context.close();
  }
});

test('navegar entre projetos atualiza URL e título, e o voltar do navegador funciona', async ({ page }) => {
  await page.goto('/projetos');
  await page
    .locator('#galeria')
    .getByRole('link', { name: /STACK10/ })
    .click();
  await expect(page).toHaveURL(/\/projetos\/stack10$/);
  await expect(page).toHaveTitle('STACK10 | Pedro Bicas');
  await expect(page.locator('#d-name')).toHaveText('STACK10');

  await page.locator('#detalhe [data-next]').click();
  await expect(page).toHaveURL(/\/projetos\/faxina$/);
  await expect(page.locator('#d-name')).toHaveText('Faxina');
  await expect(page.locator('#detalhe .d-links a')).toHaveAttribute('href', 'https://github.com/pedrobicas/faxina');

  await page.goBack();
  await expect(page).toHaveURL(/\/projetos\/stack10$/);
  await expect(page.locator('#d-name')).toHaveText('STACK10');

  await page.goBack();
  await expect(page).toHaveURL(/\/projetos$/);
  await expect(page.locator('#detalhe')).toBeHidden();
  await expect(page).toHaveTitle('Projetos | Pedro Bicas');
});

test('rota de projeto inexistente volta para a galeria', async ({ page }) => {
  await page.goto('/projetos/nao-existe');
  await expect(page).toHaveURL(/\/projetos$/);
  await expect(page.locator('#galeria')).toBeVisible();
  await expect(page.locator('#detalhe')).toBeHidden();
});
