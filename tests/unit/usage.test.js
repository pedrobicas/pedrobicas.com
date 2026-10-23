import test from 'node:test';
import assert from 'node:assert/strict';
import { PROJECTS } from '../../src/data/projects.js';
import { JOURNEY } from '../../src/data/journey.js';
import { STACK } from '../../src/data/stack.js';
import { whereUsed } from '../../src/utils/usage.js';

test('a Stack cruza as tecnologias com os projetos e a trajetória', () => {
  const spring = whereUsed('Spring Boot', PROJECTS, JOURNEY);
  assert.deepEqual(spring, [
    { kind: 'project', slug: 'chat-tempo-real', label: 'Chat em tempo real' },
    { kind: 'journey', label: 'FIAP' },
    { kind: 'journey', label: 'InCor (HC-FMUSP)' },
  ]);
  assert.deepEqual(whereUsed('C#', PROJECTS, JOURNEY), [{ kind: 'journey', label: 'InCor (HC-FMUSP)' }]);
  assert.ok(!whereUsed('React', PROJECTS, JOURNEY).some((use) => use.label === 'InCor (HC-FMUSP)'));
});

test('a Stack distingue Java de JavaScript e reconhece Sass nos projetos SCSS', () => {
  assert.ok(!whereUsed('Java', PROJECTS, JOURNEY).some((use) => use.slug === 'stack10'));
  assert.deepEqual(whereUsed('React Native', PROJECTS, JOURNEY), []);
  assert.deepEqual(whereUsed('Sass', PROJECTS, JOURNEY), [
    { kind: 'project', slug: 'chat-tempo-real', label: 'Chat em tempo real' },
  ]);
  assert.deepEqual(whereUsed('Git', PROJECTS, JOURNEY), [{ kind: 'journey', label: 'SENAI' }]);
});

test('todos os links da Stack apontam para projetos existentes', () => {
  const slugs = new Set(PROJECTS.map((project) => project.slug));
  for (const group of STACK) {
    for (const tech of group.items) {
      for (const use of whereUsed(tech, PROJECTS, JOURNEY)) {
        if (use.kind === 'project') assert.ok(slugs.has(use.slug), `${tech}: ${use.slug}`);
      }
    }
  }
});
