import test from 'node:test';
import assert from 'node:assert/strict';
import { PROJECTS } from '../../src/data/projects.js';
import { allRoutes, pageMeta, summarize } from '../../src/seo.js';
import { routePath } from '../../src/routing.js';

test('cada rota tem título, descrição curta e imagem', () => {
  for (const route of allRoutes()) {
    const meta = pageMeta(route);
    assert.ok(meta.title.endsWith('Pedro Bicas') || meta.title.startsWith('Pedro Bicas'), meta.title);
    assert.ok(
      meta.description.length >= 50 && meta.description.length <= 160,
      `${meta.path}: ${meta.description.length}`,
    );
    assert.match(meta.image.path, /^\/.+\.(png|webp)$/);
    assert.ok(meta.image.alt);
    assert.equal(meta.path, routePath(route));
  }
});

test('há uma página para cada projeto, além de home, galeria e currículo', () => {
  const paths = allRoutes().map(routePath);
  assert.equal(new Set(paths).size, paths.length);
  assert.equal(paths.length, PROJECTS.length + 3);
  for (const project of PROJECTS) assert.ok(paths.includes(`/projetos/${project.slug}`));
});

test('projetos com captura real usam a imagem como prévia de compartilhamento', () => {
  for (const slug of ['stack10', 'faxina', 'crypto-analysis', 'chat-tempo-real', 'my-spotify-universe', 'postlocal']) {
    assert.equal(pageMeta({ mode: 'projetos', slug }).image.path, `/projects/${slug}/cover.webp`);
  }
  assert.equal(pageMeta({ mode: 'projetos', slug: 'pedrobicas-com' }).image.path, '/og.png');
});

test('summarize corta em limite de palavra', () => {
  const text = 'palavra '.repeat(40).trim();
  const short = summarize(text, 60);
  assert.ok(short.length <= 60);
  assert.ok(short.endsWith('…'));
  assert.ok(!short.includes('palavr…'));
  assert.equal(summarize('curto'), 'curto');
});
