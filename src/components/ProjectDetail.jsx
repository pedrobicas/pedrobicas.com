import { useSyncExternalStore } from 'react';
import { PROJECTS } from '../data/projects.js';
import { AREAS } from '../data/site.js';
import { ROUTES, projectPath } from '../routing.js';
import { getSelectedProject, subscribe } from '../state/selectedProject.js';
import { pad2 } from '../utils/text.js';
import ProjectLinks from './ProjectLinks.jsx';
import { ProjectVisualContent } from './ProjectVisual.jsx';
import Tags from './Tags.jsx';

const STUDY_FIELDS = [
  ['problem', 'problema'],
  ['decision', 'decisão técnica'],
  ['check', 'como avaliar'],
];

function neighbours(index) {
  const total = PROJECTS.length;
  return {
    previous: PROJECTS[(index - 1 + total) % total],
    next: PROJECTS[(index + 1) % total],
  };
}

export default function ProjectDetail() {
  const slug = useSyncExternalStore(subscribe, getSelectedProject, getSelectedProject);
  const index = PROJECTS.findIndex((project) => project.slug === slug);
  const project = index >= 0 ? PROJECTS[index] : null;
  const { previous, next } = project ? neighbours(index) : {};
  const study = project?.study ? STUDY_FIELDS.filter(([key]) => project.study[key]) : [];
  const highlights = project?.highlights ?? [];
  const links = project?.links ?? [];

  return (
    <div className="detail" id="detalhe" hidden data-slug={project?.slug}>
      <div className="d-backdrop" data-close></div>
      <div className="d-panel" role="dialog" aria-modal="true" aria-labelledby="d-name" data-lenis-prevent>
        <div className="d-grab" aria-hidden="true"></div>
        <div className="d-top">
          <span className="d-idx">{project ? `${pad2(index + 1)} / ${pad2(PROJECTS.length)}` : null}</span>
          <div className="d-nav">
            <a className="pill" data-prev href={previous ? projectPath(previous.slug) : ROUTES.projetos}>
              Anterior
            </a>
            <a className="pill" data-next href={next ? projectPath(next.slug) : ROUTES.projetos}>
              Próximo
            </a>
            <button type="button" className="d-close" data-close aria-label="Fechar o projeto">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.8" fill="none" />
              </svg>
            </button>
          </div>
        </div>
        <p className="d-kind">{project?.kind}</p>
        <h2 className="d-name" id="d-name" tabIndex="-1">
          {project?.name ?? 'Detalhes do projeto'}
        </h2>
        <div className="d-cover viz" aria-hidden="true">
          {project ? (
            <ProjectVisualContent key={project.slug} project={project} uid={`detail-${project.slug}`} />
          ) : null}
        </div>
        <div className="d-body">
          <div>
            <h3>sobre</h3>
            <p className="d-desc">{project?.desc}</p>
            <div className="d-study" hidden={study.length === 0}>
              <h3>por trás do projeto</h3>
              <dl className="d-study-fields">
                {study.map(([key, label]) => (
                  <div key={key}>
                    <dt>{label}</dt>
                    <dd>{project.study[key]}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="d-hl-wrap" hidden={highlights.length === 0}>
              <h3>destaques</h3>
              <ul className="d-hl">
                {highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </div>
          <aside className="d-side">
            <h3>stack</h3>
            <Tags items={project?.stack ?? []} className="tags d-stack" />
            <h3>área</h3>
            <p className="d-areas">{project?.areas.map((area) => AREAS[area] || area).join(', ')}</p>
            <div className="d-links" hidden={links.length === 0}>
              <ProjectLinks links={links} />
            </div>
          </aside>
        </div>
        <a className="d-next" href={next ? projectPath(next.slug) : ROUTES.projetos} data-cursor="próximo">
          <small>próximo projeto</small>
          <span>{next?.name}</span>
        </a>
      </div>
    </div>
  );
}
