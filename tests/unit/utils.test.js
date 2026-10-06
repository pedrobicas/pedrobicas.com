import test from 'node:test';
import assert from 'node:assert/strict';
import { clamp, lerp, rng } from '../../src/utils/math.js';
import { normalizeCommand, pad2, toBits } from '../../src/utils/text.js';

test('clamp mantém valores dentro do intervalo', () => {
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(-1, 0, 10), 0);
  assert.equal(clamp(11, 0, 10), 10);
});

test('lerp interpola linearmente', () => {
  assert.equal(lerp(10, 20, 0), 10);
  assert.equal(lerp(10, 20, 0.5), 15);
  assert.equal(lerp(10, 20, 1), 20);
});

test('rng é determinístico para a mesma seed', () => {
  const first = rng(42);
  const second = rng(42);
  const firstSequence = Array.from({ length: 8 }, () => first());
  const secondSequence = Array.from({ length: 8 }, () => second());

  assert.deepEqual(firstSequence, secondSequence);
  assert.ok(firstSequence.every((value) => value >= 0 && value < 1));
});

test('helpers de texto preservam o comportamento do terminal e dos visuais', () => {
  assert.equal(normalizeCommand('  PROJÉTOS  '), 'projetos');
  assert.equal(toBits('P'), '01010000');
  assert.equal(pad2(4), '04');
  assert.equal(pad2(12), '12');
});
