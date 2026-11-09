// Gera o PDF do currículo a partir da página /curriculo do build, para o link "Baixar PDF".
// Uso: npm run build && npm run cv:pdf  (precisa do Chromium do Playwright: npm run test:e2e:install)
import { copyFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { chromium } from '@playwright/test';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = fileURLToPath(new URL('../public/pedro-bicas-curriculo.pdf', import.meta.url));
const built = fileURLToPath(new URL('../dist/pedro-bicas-curriculo.pdf', import.meta.url));

if (!existsSync(fileURLToPath(new URL('../dist/curriculo/index.html', import.meta.url)))) {
  console.error('cv:pdf: rode "npm run build" antes.');
  process.exit(1);
}

const server = await preview({ root, preview: { port: 4174, strictPort: true, host: '127.0.0.1' } });
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});

try {
  const page = await browser.newPage();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:4174/curriculo', { waitUntil: 'networkidle' });
  await page.locator('.cv-sheet').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await mkdir(fileURLToPath(new URL('../public/', import.meta.url)), { recursive: true });
  await page.pdf({ path: output, format: 'A4', printBackground: false, preferCSSPageSize: true });
  await copyFile(output, built);
  console.log('cv:pdf: public/pedro-bicas-curriculo.pdf atualizado.');
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
