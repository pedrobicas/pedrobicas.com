import { PROJECTS } from './data/projects.js';
import { ROUTES, projectPath } from './routing.js';

export const SITE_URL = 'https://www.pedrobicas.com';
export const DEFAULT_IMAGE = { path: '/og.png', alt: 'Pedro Bicas, desenvolvedor full-stack' };

const HOME = {
  title: 'Pedro Bicas, desenvolvedor full-stack',
  description:
    'Portfólio de Pedro Bicas, desenvolvedor full-stack em São Paulo. Projetos web, ferramentas e aplicações com React, Angular, Java, Node.js e Python.',
};

export function summarize(text, max = 155) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,.;:]+$/, '')}…`;
}

export function pageMeta(route) {
  if (route.mode === 'projetos' && route.slug) {
    const project = PROJECTS.find((item) => item.slug === route.slug);
    if (project) {
      return {
        path: projectPath(project.slug),
        title: `${project.name} | Pedro Bicas`,
        description: summarize(project.desc),
        image: project.image ? { path: project.image, alt: `Captura do projeto ${project.name}` } : DEFAULT_IMAGE,
      };
    }
  }
  if (route.mode === 'projetos') {
    return {
      path: ROUTES.projetos,
      title: 'Projetos | Pedro Bicas',
      description:
        'Projetos de Pedro Bicas: aplicações web, ferramentas, jogos e análise de dados, com código e demos.',
      image: DEFAULT_IMAGE,
    };
  }
  if (route.mode === 'cv') {
    return {
      path: ROUTES.cv,
      title: 'Currículo | Pedro Bicas',
      description: 'Currículo de Pedro Bicas, desenvolvedor full-stack: experiência, formação, projetos e habilidades.',
      image: DEFAULT_IMAGE,
    };
  }
  return { path: ROUTES.portfolio, ...HOME, image: DEFAULT_IMAGE };
}

export function allRoutes() {
  return [
    { mode: 'portfolio', slug: null },
    { mode: 'projetos', slug: null },
    ...PROJECTS.map((project) => ({ mode: 'projetos', slug: project.slug })),
    { mode: 'cv', slug: null },
  ];
}
