import test from 'node:test';
import assert from 'node:assert/strict';
import { FEATURED_PROJECTS, PROJECTS } from '../../src/data/projects.js';

test('projetos possuem slugs únicos e campos obrigatórios', () => {
  const slugs = PROJECTS.map((project) => project.slug);
  assert.equal(new Set(slugs).size, slugs.length);

  for (const project of PROJECTS) {
    assert.ok(project.name);
    assert.ok(project.kind);
    assert.ok(project.desc);
    assert.ok(project.areas.length > 0);
    assert.ok(project.stack.length > 0);
    assert.ok(Array.isArray(project.links));
  }
});

test('links externos dos projetos usam HTTPS', () => {
  for (const project of PROJECTS) {
    for (const link of project.links) assert.match(link.href, /^https:\/\//);
  }
});

test('destaques são derivados da mesma fonte de dados', () => {
  assert.deepEqual(
    FEATURED_PROJECTS,
    PROJECTS.filter((project) => project.featured),
  );
  assert.ok(FEATURED_PROJECTS.length > 0);
});

test('o projeto do portfólio descreve a stack atual', () => {
  const portfolio = PROJECTS.find((project) => project.slug === 'pedrobicas-com');
  assert.ok(portfolio.stack.includes('React'));
  assert.ok(portfolio.stack.includes('Vite'));
  assert.ok(portfolio.stack.includes('GSAP'));
  assert.ok(portfolio.stack.includes('Lenis'));
});

test('a demo do Spotify também aponta para o repositório de código', () => {
  const spotify = PROJECTS.find((project) => project.slug === 'my-spotify-universe');
  assert.ok(spotify.links.some((link) => link.demo));
  assert.ok(spotify.links.some((link) => link.href === 'https://github.com/pedrobicas/my-universe-spotify'));
});

test('estudos de caso descrevem verificações sem anunciar métricas inexistentes', () => {
  for (const project of PROJECTS) {
    if (!project.study) continue;
    assert.ok(project.study.problem);
    assert.ok(project.study.decision);
    assert.ok(project.study.check);
    assert.doesNotMatch(project.study.check, /não há|não apresenta|taxa de acerto publicada|mensagens perdidas/i);
  }
});
