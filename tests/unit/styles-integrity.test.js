import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const EXPECTED_STYLES_SHA256 = 'cd7b26fe5679523d29eab41b4bef9e8070c1fb1a67dde88b5f1adb15e164738d';
const stylesUrl = new URL('../../src/styles.css', import.meta.url);

test('o CSS visual aprovado permanece byte a byte intacto', async () => {
  const css = await readFile(fileURLToPath(stylesUrl));
  const digest = createHash('sha256').update(css).digest('hex');
  assert.equal(digest, EXPECTED_STYLES_SHA256);
});
