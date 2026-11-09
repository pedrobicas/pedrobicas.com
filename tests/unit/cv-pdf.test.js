import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CV_PDF } from '../../src/data/site.js';

test('o PDF do currículo linkado na página existe no build estático', async () => {
  const data = await readFile(new URL(`../../public${CV_PDF}`, import.meta.url));
  assert.equal(data.toString('ascii', 0, 5), '%PDF-');
  assert.ok(data.length > 10 * 1024);
});
