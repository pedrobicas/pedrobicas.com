import test from 'node:test';
import assert from 'node:assert/strict';
import { isAppPath, legacyHashToPath, parseRoute, projectPath, routePath } from '../../src/routing.js';

test('parseRoute reconhece home, galeria, projeto e currículo', () => {
  assert.deepEqual(parseRoute('/'), { mode: 'portfolio', slug: null });
  assert.deepEqual(parseRoute('/projetos'), { mode: 'projetos', slug: null });
  assert.deepEqual(parseRoute('/projetos/stack10'), { mode: 'projetos', slug: 'stack10' });
  assert.deepEqual(parseRoute('/curriculo'), { mode: 'cv', slug: null });
  assert.deepEqual(parseRoute('/qualquer-coisa'), { mode: 'portfolio', slug: null });
});

test('parseRoute aceita barra final e index.html, como servem alguns hosts estáticos', () => {
  assert.deepEqual(parseRoute('/projetos/faxina/'), { mode: 'projetos', slug: 'faxina' });
  assert.deepEqual(parseRoute('/projetos/faxina/index.html'), { mode: 'projetos', slug: 'faxina' });
  assert.deepEqual(parseRoute('/curriculo/'), { mode: 'cv', slug: null });
});

test('routePath é o inverso de parseRoute', () => {
  for (const path of ['/', '/projetos', '/projetos/chat-tempo-real', '/curriculo']) {
    assert.equal(routePath(parseRoute(path)), path);
  }
  assert.equal(projectPath('crypto-analysis'), '/projetos/crypto-analysis');
});

test('links antigos com hash viram caminhos reais', () => {
  assert.equal(legacyHashToPath('#/projetos/stack10'), '/projetos/stack10');
  assert.equal(legacyHashToPath('#/curriculo'), '/curriculo');
  assert.equal(legacyHashToPath('#/projetos'), '/projetos');
  assert.equal(legacyHashToPath('#sobre'), null);
  assert.equal(legacyHashToPath(''), null);
});

test('isAppPath só aceita rotas da aplicação', () => {
  assert.ok(isAppPath('/'));
  assert.ok(isAppPath('/projetos/faxina'));
  assert.ok(isAppPath('/curriculo'));
  assert.ok(!isAppPath('/projects/stack10/cover.webp'));
  assert.ok(!isAppPath('/projetos/a/b'));
});
