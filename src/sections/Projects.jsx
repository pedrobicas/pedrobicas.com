import { FEATURED_PROJECTS, PROJECTS } from '../data/projects.js';
import ProjectLinks from '../components/ProjectLinks.jsx';
import ProjectVisual from '../components/ProjectVisual.jsx';
import Tags from '../components/Tags.jsx';
import { ROUTES, projectPath } from '../routing.js';

function FeaturedProject({ project, index }) {
  return (
    <article className="proj" aria-labelledby={`hp-${project.slug}`}>
      <ProjectVisual project={project} uid={`home-${project.slug}-${index}`} className="proj-visual viz" />
      <div className="proj-info">
        <p className="proj-kind">{project.kind}</p>
        <h3 className="proj-name" id={`hp-${project.slug}`}>
          {project.name}
        </h3>
        <p className="proj-desc">{project.desc}</p>
        <Tags items={project.stack.slice(0, 5)} />
        <div className="proj-links">
          <ProjectLinks links={project.links} />
          <a className="pill" href={projectPath(project.slug)} data-cursor="ver">
            Detalhes
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section className="work" id="projetos" aria-labelledby="proj-t">
      <div className="work-pin">
        <div className="work-track">
          <div className="work-intro">
            <p className="path" aria-hidden="true">
              ~/projetos
            </p>
            <h2 className="sec-title" id="proj-t" data-split>
              Projetos
            </h2>
            <p className="sec-note">Alguns projetos em destaque. A lista completa está na galeria.</p>
          </div>
          {FEATURED_PROJECTS.map((project, index) => (
            <FeaturedProject key={project.slug} project={project} index={index} />
          ))}
          <div className="work-end">
            <a href={ROUTES.projetos} data-cursor="abrir" data-origin>
              Ver todos os projetos
            </a>
            <small className="work-count">{PROJECTS.length} projetos na galeria</small>
          </div>
        </div>
        <div className="work-progress" aria-hidden="true">
          <span></span>
        </div>
      </div>
    </section>
  );
}
