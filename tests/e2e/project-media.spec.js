import { expect, test } from '@playwright/test';

test('capa real e capturas dos detalhes carregam sem iniciar o vídeo', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/projetos/stack10');
  const cover = page.locator('.d-cover .project-media');
  await expect(cover).toBeVisible();
  await expect(cover.locator('img')).toHaveJSProperty('complete', true);
  expect(await cover.locator('img').evaluate((img) => img.naturalWidth)).toBeGreaterThan(0);
  await expect(cover.locator('video')).not.toHaveAttribute('src');
  await cover.hover();
  await expect(cover.locator('video')).not.toHaveAttribute('src');
  await expect(page.locator('.project-captures figure').first()).toBeVisible();
});

test('hover reproduz a interação real e sair restaura a capa', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projetos/stack10');
  await expect(page.locator('.loader')).toBeHidden();
  const cover = page.locator('.d-cover .project-media');
  const video = cover.locator('video');
  await expect(cover).toBeVisible();
  await expect(video).not.toHaveAttribute('src');
  await cover.hover();
  await expect(cover).toHaveAttribute('data-playing', 'true');
  await expect.poll(() => video.evaluate((element) => element.currentTime)).toBeGreaterThan(0.1);
  await page.mouse.move(1, 1);
  await expect(video).toHaveJSProperty('paused', true);
  await expect(cover).not.toHaveAttribute('data-playing');
});

test('preferência de movimento alterada durante hover pausa o vídeo', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projetos/stack10');
  const cover = page.locator('.d-cover .project-media');
  await cover.hover();
  await expect(cover).toHaveAttribute('data-playing', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(cover.locator('video')).toHaveJSProperty('paused', true);
  await expect(cover).not.toHaveAttribute('data-playing');
});

test('falha no vídeo mantém a captura estática visível', async ({ page }) => {
  await page.route('**/interaction.webm', (route) => route.abort());
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projetos/stack10');
  const cover = page.locator('.d-cover .project-media');
  await cover.hover();
  await expect.poll(() => cover.locator('video').evaluate((video) => Boolean(video.error))).toBe(true);
  await expect(cover).not.toHaveAttribute('data-playing');
  await expect(cover.locator('img')).toBeVisible();
});
