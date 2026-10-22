import { expect, test } from '@playwright/test';

test('Sobre revela os três trechos ao entrar no viewport sem alterar o conteúdo', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.loader')).toBeHidden({ timeout: 10000 });
  const lines = page.locator('.about-reveal-inner');
  await expect(lines).toHaveCount(3);
  const before = await page.locator('.about-text').textContent();
  await page.locator('.about-text').scrollIntoViewIfNeeded();
  await expect
    .poll(() => lines.evaluateAll((items) => items.every((item) => Number(getComputedStyle(item).opacity) > 0.99)), {
      timeout: 5000,
    })
    .toBe(true);
  expect(await page.locator('.about-text').textContent()).toBe(before);
  await expect
    .poll(() =>
      page
        .locator('.about-text')
        .evaluate((element) => Number(getComputedStyle(element).getPropertyValue('--about-progress'))),
    )
    .toBeGreaterThan(0.99);
});

test('Sobre mantém todo o texto visível com movimento reduzido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const lines = page.locator('.about-reveal-inner');
  await expect(lines).toHaveCount(3);
  await expect
    .poll(() => lines.evaluateAll((items) => items.every((item) => Number(getComputedStyle(item).opacity) === 1)))
    .toBe(true);
});
