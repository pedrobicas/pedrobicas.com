import { AREAS } from '../data/site.js';
import { PROJECTS } from '../data/projects.js';
import ProjectVisual from './ProjectVisual.jsx';
import { projectPath } from '../routing.js';

const usedAreas = Object.keys(AREAS)
  .map((area) => [area, PROJECTS.filter((project) => project.areas.includes(area)).length])
  .filter(([, count]) => count >= 2 && count < PROJECTS.length);

export default function ProjectGallery() {
  const filters = usedAreas.length
    ? [['todos', 'Todos', PROJECTS.length], ...usedAreas.map(([area, count]) => [area, AREAS[area], count])]
    : [];

  return (
    <section className="gallery" id="galeria" aria-labelledby="g-title" hidden data-lenis-prevent>
      <div className="g-head">
        <div>
          <p className="path" aria-hidden="true">
            ~/projetos
          </p>
          <div className="g-title-wrap">
            <h2 className="sec-title" id="g-title" tabIndex="-1" data-split>
              Projetos
            </h2>
            <span className="g-count" aria-hidden="true">
              {String(PROJECTS.length).padStart(2, '0')}
            </span>
          </div>
        </div>
        <p className="sec-note">
          Projetos próprios, incluindo jogos, ferramentas e aplicações web. Abra um deles para ver os detalhes.
        </p>
      </div>
      <div className="g-bar">
        <div className="g-filters" role="group" aria-label="Filtrar por área">
          {filters.map(([key, label, count]) => (
            <button type="button" className="chip" data-filter={key} aria-pressed={key === 'todos'} key={key}>
              {label}
              <span>{count}</span>
            </button>
          ))}
        </div>
        <div className="g-views" role="group" aria-label="Modo de exibição">
          <button type="button" className="chip" data-view="lista" aria-pressed="true">
            Lista
          </button>
          <button type="button" className="chip" data-view="grade" aria-pressed="false">
            Grade
          </button>
        </div>
      </div>
      <ul className="g-items">
        {PROJECTS.map((project, index) => (
          <li className="g-item" data-slug={project.slug} data-areas={project.areas.join(' ')} key={project.slug}>
            <a className="g-link" href={projectPath(project.slug)} data-cursor="ver">
              <ProjectVisual project={project} uid={`gallery-${project.slug}-${index}`} className="g-cover viz" />
              <div className="g-row">
                <h3 className="g-name">{project.name}</h3>
                <p className="g-kind">{project.kind}</p>
                <p className="g-stack">{project.stack.slice(0, 3).join(', ')}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
      <p className="g-empty" hidden>
        Ainda não tem projeto nesta área.{' '}
        <button type="button" className="g-reset">
          Ver todos
        </button>
      </p>
      <div className="g-foot">
        <p>
          Tem mais coisa no{' '}
          <a href="https://github.com/pedrobicas" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          .
        </p>
        <a className="pill" href="#contato" data-magnetic=".3">
          Falar comigo
        </a>
      </div>
    </section>
  );
}
