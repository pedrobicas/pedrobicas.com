import { PROJECTS } from '../data/projects.js';
import { AREAS } from '../data/site.js';
import { ProjectVisualContent } from './ProjectVisual.jsx';

export default function ProjectDetail() {
  return (
    <div className="detail" id="detalhe" hidden>
      <div className="d-backdrop" data-close></div>
      <div className="d-panel" role="dialog" aria-modal="true" aria-labelledby="d-name" data-lenis-prevent>
        <div className="d-grab" aria-hidden="true"></div>
        <div className="d-top"><span className="d-idx"></span><div className="d-nav"><a className="pill" data-prev href="#/projetos">Anterior</a><a className="pill" data-next href="#/projetos">Próximo</a><button type="button" className="d-close" data-close aria-label="Fechar o projeto"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.8" fill="none" /></svg></button></div></div>
        <p className="d-kind"></p>
        <h2 className="d-name" id="d-name" tabIndex="-1"><span className="sr-only">Projeto selecionado</span></h2>
        <div className="d-cover viz" aria-hidden="true">
          {PROJECTS.map((project, index) => (
            <ProjectVisualContent project={project} uid={`detail-${project.slug}-${index}`} key={project.slug} />
          ))}
        </div>
        {PROJECTS.map((project) => (
          <div className="d-body" data-project-detail={project.slug} hidden key={project.slug}>
            <div>
              <h3>sobre</h3>
              <p className="d-desc">{project.desc}</p>
              <div className="d-hl-wrap" hidden={!project.highlights?.length}>
                <h3>destaques</h3>
                <ul className="d-hl">{project.highlights?.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
              </div>
            </div>
            <aside className="d-side">
              <h3>stack</h3>
              <ul className="tags d-stack">{project.stack.map((technology) => <li key={technology}>{technology}</li>)}</ul>
              <h3>área</h3>
              <p className="d-areas">{project.areas.map((area) => AREAS[area] || area).join(', ')}</p>
              <div className="d-links" hidden={!project.links.length}>
                {project.links.map((link) => (
                  <a
                    className={`pill${link.demo ? ' solid' : ''}`}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor={link.demo ? 'demo' : 'código'}
                    data-magnetic=".25"
                    key={link.href}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </aside>
          </div>
        ))}
        <a className="d-next" href="#/projetos" data-cursor="próximo"><small>próximo projeto</small><span></span></a>
      </div>
    </div>
  );
}
