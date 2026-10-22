import { expect, test, devices } from '@playwright/test';

test.use({ ...devices['Pixel 7'], reducedMotion: 'reduce' });

test('em celular a home não apresenta rolagem horizontal inesperada', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Pedro Bicas' })).toBeVisible();
  await expect(page.locator('.proj')).toHaveCount(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test('modal no celular fecha com botão e devolve foco ao projeto', async ({ page }) => {
  await page.goto('/projetos');
  const origin = page.locator('.g-link').first();
  await origin.tap();
  await expect(page.locator('.d-panel')).toBeVisible();
  await page.getByRole('button', { name: 'Fechar o projeto' }).tap();
  await expect(page.locator('#detalhe')).toBeHidden();
  await expect(origin).toBeFocused();
});

test('currículo no celular mostra controles de exportação', async ({ page }) => {
  await page.goto('/curriculo');
  await expect(page.getByRole('button', { name: 'Imprimir / salvar PDF' })).toBeVisible();
  await expect(page.locator('.cv-sheet')).toBeVisible();
});
