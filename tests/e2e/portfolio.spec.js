import { expect, test } from '@playwright/test';

async function movePointerTo(page, locator) {
  const box = await locator.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
});

test('carrega a home e mantém as seções principais acessíveis', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1, name: 'Pedro Bicas' })).toBeVisible();
  await expect(page.getByRole('link', { name: /^pedrobicas\.com\s*,\s*voltar ao início$/ })).toBeVisible();
  await expect(page.locator('#sobre')).toBeAttached();
  await expect(page.locator('#stack')).toBeAttached();
  await expect(page.locator('#trajetoria')).toBeAttached();
  await expect(page.locator('#projetos')).toBeAttached();
  await expect(page.locator('#contato')).toBeAttached();
});

test('a Stack mostra onde cada tecnologia foi usada e abre o projeto correspondente', async ({ page }) => {
  const stack = page.locator('#stack');
  const react = stack.getByRole('button', { name: 'React', exact: true });
  await expect(react).toBeVisible();
  await react.click();
  await expect(react).toHaveAttribute('aria-pressed', 'true');
  const readout = stack.locator('.stk-use[data-for="React"]');
  await expect(readout).toBeVisible();
  await readout.getByRole('link', { name: 'My Spotify Universe', exact: true }).click();
  await expect(page.locator('#d-name')).toHaveText('My Spotify Universe');
  await expect(page.locator('#detalhe')).toBeVisible();
});

test('a Stack permite chegar ao link por hover e selecionar pelo teclado', async ({ page }) => {
  const stack = page.locator('#stack');
  const react = stack.getByRole('button', { name: 'React', exact: true });
  await react.hover();
  const link = stack
    .locator('.stk-use[data-for="React"]')
    .getByRole('link', { name: 'My Spotify Universe', exact: true });
  await link.hover();
  await expect(link).toBeVisible();
  await react.focus();
  await page.keyboard.press('Enter');
  await expect(react).toHaveAttribute('aria-pressed', 'true');
  for (let step = 0; step < 25; step += 1) {
    if ((await link.count()) && (await link.evaluate((element) => element === document.activeElement))) break;
    await page.keyboard.press('Tab');
  }
  await expect(link).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(react).toHaveAttribute('aria-pressed', 'false');
  await expect(stack.locator('.stk-hint')).toBeVisible();
});

test('a Stack funciona por toque no celular', async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  try {
    const mobile = await context.newPage();
    await mobile.goto('/');
    const stack = mobile.locator('#stack');
    const react = stack.getByRole('button', { name: 'React', exact: true });
    await react.tap();
    await expect(react).toHaveAttribute('aria-pressed', 'true');
    await stack
      .locator('.stk-use[data-for="React"]')
      .getByRole('link', { name: 'My Spotify Universe', exact: true })
      .tap();
    await expect(mobile.locator('#detalhe')).toBeVisible();
    await expect(mobile.locator('#d-name')).toHaveText('My Spotify Universe');
  } finally {
    await context.close();
  }
});

test('o nome permanece inteiro nas quatro larguras', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() =>
        page.locator('.hero-name .row').evaluateAll(
          (rows) =>
            rows.length > 0 &&
            rows.every((row) => {
              const range = document.createRange();
              range.selectNodeContents(row);
              const rect = range.getBoundingClientRect();
              return rect.left >= 0 && rect.right <= innerWidth;
            }),
        ),
      )
      .toBe(true);
  }
});

test('a abertura anima o terminal e o contador na primeira visita da sessão', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => sessionStorage.removeItem('pb-boot'));
  await page.reload();
  const loader = page.locator('.loader');
  await expect(loader).toBeVisible();
  await expect
    .poll(() => loader.locator('.lt-cmd').evaluate((el) => +getComputedStyle(el).opacity), { timeout: 1500 })
    .toBeGreaterThan(0.99);
  await expect
    .poll(() => loader.locator('.loader-count').textContent(), { timeout: 1500 })
    .toMatch(/^(?!000|100)\d{3}$/);
  await expect
    .poll(() => loader.locator('.lt').evaluateAll((lines) => lines.some((el) => +getComputedStyle(el).opacity > 0.9)))
    .toBe(true);
  await page.keyboard.press('Escape');
  await expect(loader).toBeHidden({ timeout: 2000 });
  await page.getByRole('link', { name: 'Ver projetos', exact: true }).click();
  await expect(page.locator('#galeria')).toBeVisible();
});

test('o cursor altera a largura e o peso da fonte sem cortar o nome', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload();
  await expect(page.locator('.loader')).toBeHidden({ timeout: 10000 });
  await expect
    .poll(() =>
      page
        .locator('.hero-name .char')
        .evaluateAll((chars) => chars.length > 0 && chars.every((char) => +getComputedStyle(char).opacity === 1)),
    )
    .toBe(true);
  await page.addStyleTag({ content: '.grain,.cursor{visibility:hidden!important}' });
  const name = page.locator('.hero-name');
  await movePointerTo(page, name);
  await page.mouse.move(5, 5);
  await expect
    .poll(() =>
      name
        .locator('.char')
        .evaluateAll((chars) =>
          chars.every((char) => getComputedStyle(char).fontVariationSettings.includes('"wght" 750')),
        ),
    )
    .toBe(true);
  const before = await name.screenshot();
  const widths = await name
    .locator('.char')
    .evaluateAll((chars) => chars.map((char) => char.getBoundingClientRect().width));
  await movePointerTo(page, name.locator('.char').nth(3));
  await expect
    .poll(() => name.evaluate((element) => +element.style.getPropertyValue('--spot-strength')))
    .toBeGreaterThan(0.9);
  const after = await name.screenshot();
  expect(before.equals(after)).toBe(false);
  await expect
    .poll(() =>
      name
        .locator('.char')
        .nth(3)
        .evaluate((char) => char.getBoundingClientRect().width),
    )
    .toBeGreaterThan(widths[3] * 1.04);
  expect((await name.locator('.char').nth(3).boundingBox()).width).toBeLessThan(widths[3] * 1.2);
  await expect
    .poll(() =>
      name
        .locator('.char')
        .nth(3)
        .evaluate((char) => +getComputedStyle(char).fontVariationSettings.match(/"wght"\s+(\d+)/)[1]),
    )
    .toBeGreaterThan(775);
  expect(
    await name
      .locator('.char')
      .nth(3)
      .evaluate((char) => +getComputedStyle(char).fontVariationSettings.match(/"wght"\s+(\d+)/)[1]),
  ).toBeLessThanOrEqual(795);
  expect(
    await name.locator('.char').evaluateAll((chars) =>
      chars.every((char) => {
        const r = char.getBoundingClientRect();
        return r.left >= 0 && r.right <= innerWidth;
      }),
    ),
  ).toBe(true);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await page.mouse.move(5, 5);
  await expect
    .poll(() =>
      name
        .locator('.char')
        .nth(3)
        .evaluate((char) => char.getBoundingClientRect().width),
    )
    .toBeLessThan(widths[3] + 0.5);
});

test('a onda do nome acompanha o cursor e retorna ao repouso', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload();
  await expect(page.locator('.loader')).toBeHidden({ timeout: 10000 });
  const letter = page.locator('.hero-name .char').nth(3);
  await movePointerTo(page, letter);
  await page.mouse.move(5, 5);
  await expect.poll(() => letter.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
  const resting = await letter.boundingBox();
  await movePointerTo(page, letter);
  await expect.poll(async () => resting.y - (await letter.boundingBox()).y).toBeGreaterThan(0.75);
  expect(resting.y - (await letter.boundingBox()).y).toBeLessThan(4);
  await page.mouse.move(5, 5);
  await expect.poll(async () => Math.abs(resting.y - (await letter.boundingBox()).y)).toBeLessThan(0.2);
});

test('a fonte dinâmica permanece dentro da tela nas quatro larguras', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload();
  await expect(page.locator('.loader')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.loader')).toBeHidden();
  const name = page.locator('.hero-name');
  for (const width of [320, 390, 768, 1440]) {
    const previousFont = await name.evaluate((el) => el.style.fontSize);
    await page.mouse.move(0, 0);
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => name.evaluate((el) => el.style.fontSize)).not.toBe(previousFont);
    await movePointerTo(page, name.locator('.char').nth(3));
    await expect
      .poll(() =>
        name
          .locator('.char')
          .nth(3)
          .evaluate((el) => +getComputedStyle(el).fontVariationSettings.match(/"wght"\s+(\d+)/)[1]),
      )
      .toBeGreaterThan(770);
    expect(
      await name.locator('.char').evaluateAll((chars) =>
        chars.every((char) => {
          const r = char.getBoundingClientRect();
          return r.left >= 0 && r.right <= innerWidth;
        }),
      ),
    ).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('movimento reduzido mantém a fonte estática e dispensa a abertura', async ({ page }) => {
  await expect(page.locator('.loader')).toBeHidden();
  const name = page.locator('.hero-name');
  const read = () =>
    name.locator('.char').evaluateAll((chars) =>
      chars.map((el) => ({
        font: getComputedStyle(el).fontVariationSettings,
        transform: getComputedStyle(el).transform,
      })),
    );
  const before = await read();
  await movePointerTo(page, name.locator('.char').nth(3));
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  expect(await read()).toEqual(before);
  expect(before.every((char) => char.transform === 'none')).toBe(true);
});

test('o contato confirma a cópia inline e mantém os destinos reais', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const contact = page.locator('#contato');
  await contact.getByRole('button', { name: /^Email pedro\.bicas14@gmail\.com/ }).click();
  await expect(contact.locator('.contact-copy-state')).toHaveText('Copiado');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('pedro.bicas14@gmail.com');
  await expect(contact.getByRole('link', { name: 'Escrever email', exact: true })).toHaveAttribute(
    'href',
    'mailto:pedro.bicas14@gmail.com',
  );
  await expect(contact.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute(
    'href',
    'https://linkedin.com/in/pedrobicas',
  );
  await expect(contact.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/pedrobicas');
});

test('alternância entre portfólio, projetos e currículo funciona', async ({ page }) => {
  const modeSwitch = page.locator('.switch');

  await modeSwitch.getByRole('button', { name: 'Projetos' }).click();
  await expect(page).toHaveURL(/\/projetos$/);
  await expect(page.locator('#galeria')).toBeVisible();
  await expect(page.locator('#g-title')).toContainText('Projetos');

  await modeSwitch.getByRole('button', { name: 'Currículo' }).click();
  await expect(page).toHaveURL(/\/curriculo$/);
  await expect(page.locator('#curriculo')).toBeVisible();
  await expect(page.locator('#cv-title')).toHaveText('Pedro Bicas');

  await modeSwitch.getByRole('button', { name: 'Portfólio' }).click();
  await expect(page).not.toHaveURL(/\/(curriculo|projetos)/);
  await expect(page.locator('#conteudo')).not.toHaveAttribute('inert', '');
});

test('trocas rápidas de modo concluem na última escolha sem erro', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload();
  await expect(page.locator('.loader')).toBeHidden({ timeout: 10000 });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const modes = page.locator('.switch');
  await modes.getByRole('button', { name: 'Projetos', exact: true }).click();
  await modes.getByRole('button', { name: 'Portfólio', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'portfolio');
  await expect(page.locator('#galeria')).toBeHidden();
  await expect(page.locator('#conteudo')).not.toHaveAttribute('inert', '');
  expect(errors).toEqual([]);
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
  await page.goto('/projetos/my-spotify-universe');

  await expect(page.locator('#detalhe')).toBeVisible();
  await expect(page.locator('#d-name')).toHaveText('My Spotify Universe');
  await expect(page.locator('.d-desc')).toContainText('Spotify');
  await expect(page.locator('.d-desc')).not.toContainText('CoinGecko');
  await expect(page.locator('.d-stack')).toContainText('React');
  await expect(page.locator('.d-stack')).not.toContainText('Streamlit');
  await expect(page.locator('.d-cover [data-project-visual]:not([hidden])')).toHaveCount(1);

  await page.goto('/projetos/faxina');
  await expect(page.locator('#d-name')).toHaveText('Faxina');
  await expect(page.locator('.d-desc')).toContainText('armazenamento');
  await expect(page.locator('.d-stack')).toContainText('Python');

  await page.goto('/projetos/stack10');
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

  for (const route of ['/projetos', '/projetos/crypto-analysis']) {
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

test('a home preserva a ordem original e os acessos diretos aos projetos e currículo', async ({ page }) => {
  const order = await page.locator('main > section').evaluateAll((sections) => sections.map((section) => section.id));
  expect(order).toEqual(['topo', 'sobre', 'stack', 'trajetoria', 'projetos', 'contato']);
  await expect(page.locator('.scroll-cue')).toHaveAttribute('href', '#sobre');
  await expect(page.locator('.hero-meta .tagline')).not.toContainText('InCor');
  await expect(page.getByRole('link', { name: 'Currículo', exact: true })).toHaveAttribute('href', '/curriculo');
  await expect(page.locator('.proj')).toHaveCount(4);
});

test('detalhe isola o fundo, contém Tab e devolve o foco ao fechar', async ({ page }) => {
  await page.locator('.switch').getByRole('button', { name: 'Projetos', exact: true }).click();
  const origin = page.locator('.g-link').first();
  await origin.click();
  const panel = page.locator('.d-panel');
  await expect(panel).toHaveAttribute('aria-modal', 'true');
  for (const selector of ['.topbar', '.dots', '.skip', '#galeria']) {
    await expect(page.locator(selector)).toHaveAttribute('inert', '');
  }
  await expect(page.locator('#d-name')).toBeFocused();
  const last = panel.locator('a[href]').last();
  await page.keyboard.press('Shift+Tab');
  await expect(last).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(panel.locator('a[href]').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#detalhe')).toBeHidden();
  await expect(origin).toBeFocused();
  await expect(page.locator('.topbar')).not.toHaveAttribute('inert', '');
});

test('currículo permite impressão e preserva o cabeçalho navegável', async ({ page }) => {
  await page.locator('.switch').getByRole('button', { name: 'Currículo', exact: true }).click();
  await expect(page.locator('#curriculo')).toBeVisible();
  await expect(page.locator('#curriculo')).not.toHaveAttribute('aria-modal', 'true');
  await expect(page.locator('.topbar')).not.toHaveAttribute('inert', '');
  await expect(page.locator('.dots')).toHaveAttribute('inert', '');
  const button = page.getByRole('button', { name: 'Imprimir / salvar PDF' });
  await page.evaluate(() => {
    window.print = () => {
      document.body.dataset.printCalled = 'yes';
    };
  });
  await button.click();
  await expect(page.locator('body')).toHaveAttribute('data-print-called', 'yes');
  await page.emulateMedia({ media: 'print' });
  expect(await page.locator('main').evaluate((node) => getComputedStyle(node).display)).toBe('none');
  expect(await page.locator('#curriculo').evaluate((node) => getComputedStyle(node).position)).toBe('static');
});

test('animações decorativas ficam desativadas com movimento reduzido', async ({ page }) => {
  const videos = page.locator('.project-media video');
  expect(await videos.count()).toBeGreaterThan(0);
  for (const video of await videos.all()) {
    await expect(video).toHaveJSProperty('paused', true);
    await expect(video).not.toHaveAttribute('src');
  }
});

test('a trajetória mantém desenho da linha e transição de anos quando as animações estão ativadas', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload();
  await expect(page.locator('.loader')).toBeHidden({ timeout: 10000 });
  const milestones = page.locator('#trajetoria .milestone');
  await milestones.first().scrollIntoViewIfNeeded();
  await expect(milestones.first()).toHaveClass(/reached/, { timeout: 5000 });
  await milestones.last().scrollIntoViewIfNeeded();
  await expect(milestones.last()).toHaveClass(/reached/, { timeout: 5000 });
  await expect(page.locator('#trajetoria .year-num')).toHaveText('2024', { timeout: 5000 });
  const line = await page.locator('#trajetoria .jl-draw').evaluate((node) => ({
    total: node.getTotalLength(),
    offset: parseFloat(getComputedStyle(node).strokeDashoffset),
  }));
  expect(line.total).toBeGreaterThan(0);
  expect(line.offset).toBeLessThan(line.total);
});

test('Sobre mantém o texto estável ao mover o cursor, sem cópias e sem reflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload();
  await expect(page.locator('.loader')).toBeHidden({ timeout: 10000 });
  const about = page.locator('.about-text');
  await about.scrollIntoViewIfNeeded();
  await expect
    .poll(() => about.evaluate((element) => Number(getComputedStyle(element).getPropertyValue('--about-progress'))), {
      timeout: 5000,
    })
    .toBeGreaterThan(0.99);
  const initial = await about.evaluate((element) => ({
    text: element.textContent,
    height: element.getBoundingClientRect().height,
    lines: Math.round(element.getBoundingClientRect().height / parseFloat(getComputedStyle(element).lineHeight)),
    markup: element.querySelectorAll('.w, .w-ink, [data-word]').length,
  }));
  await movePointerTo(page, about);
  await page.mouse.move(8, 8);
  const after = await about.evaluate((element) => ({
    text: element.textContent,
    height: element.getBoundingClientRect().height,
    lines: Math.round(element.getBoundingClientRect().height / parseFloat(getComputedStyle(element).lineHeight)),
    markup: element.querySelectorAll('.w, .w-ink, [data-word]').length,
  }));
  expect(initial.markup).toBe(0);
  expect(after).toEqual(initial);
});

test('Sobre é legível e não animado com movimento reduzido', async ({ page }) => {
  const about = page.locator('.about-text');
  await about.scrollIntoViewIfNeeded();
  await expect(about).toBeVisible();
  expect(await about.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
  expect(await about.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  expect(await about.locator('.w-ink').count()).toBe(0);
});

test('o loader roda uma vez por sessão e não aparece na revisita', async ({ page }) => {
  await page.evaluate(() => sessionStorage.removeItem('pb-boot'));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload();
  await expect(page.locator('.loader')).toBeHidden({ timeout: 10000 });
  expect(await page.evaluate(() => sessionStorage.getItem('pb-boot'))).toBe('1');

  await page.reload();
  await expect(page.locator('html')).toHaveClass(/no-intro/);
  expect(await page.locator('.loader').isVisible()).toBe(false);
  await page.waitForTimeout(1400);
  await expect(page.locator('.loader')).toBeHidden();
  await expect(page.locator('.loader')).not.toHaveClass(/is-loading/);
});
