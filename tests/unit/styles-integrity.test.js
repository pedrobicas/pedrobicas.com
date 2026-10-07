import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const EXPECTED_STYLES_SHA256 = 'd445eb86049247ac9b69f9c16c2468dd34c4f2f31dc550e62241c104860bba9a';
const stylesUrl = new URL('../../src/styles.css', import.meta.url);

test('o CSS visual aprovado permanece byte a byte intacto', async () => {
  const css = await readFile(fileURLToPath(stylesUrl));
  const digest = createHash('sha256').update(css).digest('hex');
  assert.equal(digest, EXPECTED_STYLES_SHA256);
});
