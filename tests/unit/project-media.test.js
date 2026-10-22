import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { PROJECTS } from '../../src/data/projects.js';

test('os seis projetos prioritários têm capturas reais disponíveis no build estático', async () => {
  const slugs = ['stack10', 'faxina', 'crypto-analysis', 'chat-tempo-real', 'my-spotify-universe', 'postlocal'];
  for (const slug of slugs) {
    const project = PROJECTS.find((item) => item.slug === slug);
    assert.ok(project.media, slug);
    assert.equal(project.image, project.media.cover);
    assert.ok(
      project.media.shots.some((shot) => shot.mobile),
      slug,
    );
    const files = [
      project.media.cover,
      project.media.thumbnail,
      project.media.video,
      ...project.media.shots.map((shot) => shot.src),
    ];
    for (const file of files) {
      assert.ok(file.startsWith(`/projects/${slug}/`));
      const data = await readFile(new URL(`../../public${file}`, import.meta.url));
      assert.ok(data.length > 0, file);
      if (file.endsWith('.webp')) {
        assert.equal(data.toString('ascii', 0, 4), 'RIFF');
        assert.equal(data.toString('ascii', 8, 12), 'WEBP');
      }
    }
  }
});

test('capas e loops respeitam os limites de peso definidos para o portfólio', async () => {
  let thumbnailBytes = 0;
  for (const { media } of PROJECTS.filter((project) => project.media)) {
    const size = async (file) => (await stat(new URL(`../../public${file}`, import.meta.url))).size;
    assert.ok((await size(media.cover)) < 250 * 1024, media.cover);
    assert.ok((await size(media.video)) < 1024 * 1024, media.video);
    thumbnailBytes += await size(media.thumbnail);
  }
  assert.ok(thumbnailBytes < 500 * 1024);
});

test('capturas de demonstração e execução parcial são identificadas nas legendas', () => {
  assert.match(PROJECTS.find((p) => p.slug === 'crypto-analysis').media.note, /sintéticos/);
  assert.match(PROJECTS.find((p) => p.slug === 'my-spotify-universe').media.note, /demo oficial/);
  assert.match(PROJECTS.find((p) => p.slug === 'postlocal').media.note, /não foram exercitados/);
});
