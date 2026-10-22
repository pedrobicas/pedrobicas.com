// Rotas da aplicação. Usado pelo runtime no navegador, pela pré-renderização e pelos testes.

export const ROUTES = {
  portfolio: '/',
  projetos: '/projetos',
  cv: '/curriculo',
};

export const projectPath = (slug) => `${ROUTES.projetos}/${encodeURIComponent(slug)}`;

const normalize = (pathname = '/') => pathname.replace(/\/index\.html$/, '').replace(/\/+$/, '') || '/';

export function parseRoute(pathname) {
  const path = normalize(pathname);
  const project = path.match(/^\/projetos(?:\/([^/]+))?$/);
  if (project) return { mode: 'projetos', slug: project[1] ? decodeURIComponent(project[1]) : null };
  if (path === ROUTES.cv) return { mode: 'cv', slug: null };
  return { mode: 'portfolio', slug: null };
}

export function routePath(route) {
  if (route.mode === 'projetos') return route.slug ? projectPath(route.slug) : ROUTES.projetos;
  return ROUTES[route.mode] ?? ROUTES.portfolio;
}

// Só caminhos que a aplicação sabe mostrar são tratados como navegação interna.
export function isAppPath(pathname) {
  const path = normalize(pathname);
  return path === '/' || path === ROUTES.cv || /^\/projetos(?:\/[^/]+)?$/.test(path);
}

// Links antigos usavam hash (#/projetos/stack10). Converte para o caminho equivalente.
export function legacyHashToPath(hash) {
  if (!hash || !hash.startsWith('#/')) return null;
  return routePath(parseRoute(hash.slice(1).split('?')[0]));
}
