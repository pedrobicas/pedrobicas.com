import { PROJECTS } from '../data/projects.js';
import { ProjectVisualContent } from './ProjectVisual.jsx';

export default function ProjectPreview() {
  return (
    <div className="g-preview" aria-hidden="true">
      <div className="pv-card">
        <div className="viz">
          {PROJECTS.map((project, index) => (
            <ProjectVisualContent
              project={project}
              uid={`preview-${project.slug}-${index}`}
              key={project.slug}
            />
          ))}
        </div>
        <div className="pv-meta"><span className="pv-idx"></span><span className="pv-kind"></span><span className="pv-cta">ver projeto</span></div>
      </div>
    </div>
  );
}
