// Nomes alternativos que aparecem nos dados (ex.: o projeto lista "SCSS", a stack lista "Sass").
const ALIASES = { Sass: ['Sass', 'SCSS'] };

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/*
 * Onde uma tecnologia aparece no conteúdo real do site: na stack dos projetos
 * e nas tags ou pontos da trajetória. Só cruza dados existentes; não infere nada.
 */
export function whereUsed(tech, projects, journey) {
  const names = (ALIASES[tech] || [tech]).map((name) => name.toLowerCase());
  const inList = (list = []) => list.some((item) => names.includes(item.toLowerCase()));
  const patterns = names.map((name) => new RegExp(`(^|[^\\p{L}\\p{N}.])${escapeRegExp(name)}(?![\\p{L}\\p{N}])`, 'iu'));
  const inText = (text = '') => patterns.some((pattern) => pattern.test(text));

  const projectHits = projects
    .filter((project) => inList(project.stack))
    .map((project) => ({ kind: 'project', slug: project.slug, label: project.name }));
  const journeyHits = journey
    .filter((item) => inList(item.tags) || (item.points || []).some(inText))
    .map((item) => ({ kind: 'journey', label: item.short || item.org }));
  return [...projectHits, ...journeyHits];
}
