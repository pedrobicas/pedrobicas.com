// Pré-renderiza cada rota em HTML estático com título, descrição e Open Graph próprios.
// Roda depois de `vite build` (cliente) e `vite build --ssr` (dist-ssr/entry-server.js).
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { pageMeta, allRoutes, SITE_URL } from '../src/seo.js';
import { routePath } from '../src/routing.js';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const ssrDir = new URL('dist-ssr/', root);
const { render } = await import(new URL('entry-server.js', ssrDir).href);
const template = await readFile(new URL('index.html', dist), 'utf8');

const escape = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Substitui exatamente uma ocorrência. A função de troca evita que "$" no conteúdo vire padrão de regex.
function replaceOnce(html, pattern, build, label) {
  const found = typeof pattern === 'string' ? html.includes(pattern) : pattern.test(html);
  if (!found) throw new Error(`prerender: não encontrei ${label} no index.html`);
  return html.replace(pattern, (...match) => build(...match));
}

function setMeta(html, attr, key, value) {
  const pattern = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`);
  return replaceOnce(html, pattern, (_, start, end) => `${start}${escape(value)}${end}`, `${attr}="${key}"`);
}

async function imageSize(publicPath) {
  // Largura e altura ficam nos bytes 16–23 do cabeçalho IHDR de um PNG.
  const file = await readFile(new URL(`public${publicPath}`, root));
  return { width: file.readUInt32BE(16), height: file.readUInt32BE(20) };
}

async function page(route) {
  const meta = pageMeta(route);
  const url = `${SITE_URL}${meta.path === '/' ? '/' : meta.path}`;
  const image = `${SITE_URL}${meta.image.path}`;
  const { width, height } = await imageSize(meta.image.path);
  let html = template;
  html = replaceOnce(html, /<title>[^<]*<\/title>/, () => `<title>${escape(meta.title)}</title>`, '<title>');
  html = setMeta(html, 'name', 'description', meta.description);
  html = replaceOnce(
    html,
    /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
    (_, start, end) => `${start}${url}${end}`,
    'canonical',
  );
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'property', 'og:title', meta.title);
  html = setMeta(html, 'property', 'og:description', meta.description);
  html = setMeta(html, 'property', 'og:image', image);
  html = setMeta(html, 'property', 'og:image:width', width);
  html = setMeta(html, 'property', 'og:image:height', height);
  html = setMeta(html, 'property', 'og:image:alt', meta.image.alt);
  html = setMeta(html, 'name', 'twitter:title', meta.title);
  html = setMeta(html, 'name', 'twitter:description', meta.description);
  html = setMeta(html, 'name', 'twitter:image', image);
  html = setMeta(html, 'name', 'twitter:image:alt', meta.image.alt);
  html = replaceOnce(
    html,
    '<div id="root"></div>',
    () => `<div id="root">${render(meta.path)}</div>`,
    '<div id="root">',
  );
  return html;
}

const routes = allRoutes();
for (const route of routes) {
  const path = routePath(route);
  const folder = new URL(path === '/' ? './' : `.${path}/`, dist);
  await mkdir(folder, { recursive: true });
  await writeFile(new URL('index.html', folder), await page(route));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${SITE_URL}${routePath(route)}</loc></url>`).join('\n')}
</urlset>
`;
await writeFile(new URL('sitemap.xml', dist), sitemap);
await rm(ssrDir, { recursive: true, force: true });

console.log(`prerender: ${routes.length} rotas em ${fileURLToPath(dist)}`);
