import { PROJECTS } from '../data/projects.js';
import { STACK } from '../data/stack.js';
import { JOURNEY } from '../data/journey.js';
import { EMAIL } from '../data/site.js';

const WORK = JOURNEY.find((item) => item.year === '2024');
const EDUCATION = JOURNEY.filter((item) => item.year !== '2024').reverse();
const SELECTED_PROJECTS = PROJECTS.filter((item) =>
  ['stack10', 'faxina', 'chat-tempo-real', 'crypto-analysis'].includes(item.slug),
);

export default function Resume() {
  return (
    <section className="cv" id="curriculo" aria-labelledby="cv-title" hidden data-lenis-prevent>
      <article className="cv-sheet">
        <header className="cv-head">
          <div>
            <h2 id="cv-title" tabIndex="-1">
              Pedro Bicas
            </h2>
            <p className="cv-role">Desenvolvedor full-stack</p>
          </div>
          <ul className="cv-contact">
            <li>São Paulo, SP</li>
            <li>
              <a href="https://pedrobicas.com">pedrobicas.com</a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </li>
            <li>
              <a href="https://linkedin.com/in/pedrobicas" target="_blank" rel="noopener noreferrer">
                linkedin.com/in/pedrobicas
              </a>
            </li>
            <li>
              <a href="https://github.com/pedrobicas" target="_blank" rel="noopener noreferrer">
                github.com/pedrobicas
              </a>
            </li>
          </ul>
        </header>
        <section className="cv-sec">
          <h3>resumo</h3>
          <p>
            Desenvolvedor full-stack, estudante de Engenharia de Software na FIAP e técnico em Análise e Desenvolvimento
            de Sistemas pelo SENAI. Experiência com aplicações web, APIs REST e bancos de dados. Atualmente bolsista no
            InCor (HC-FMUSP).
          </p>
        </section>
        <section className="cv-sec">
          <h3>experiência</h3>
          <div className="cv-item">
            <div className="cv-item-head">
              <h4>{WORK.title}</h4>
              <span>{WORK.when}</span>
            </div>
            <p className="cv-org">{WORK.org}</p>
            <ul className="cv-list">
              {WORK.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="cv-tech">{WORK.tags.join(', ')}</p>
          </div>
        </section>
        <section className="cv-sec">
          <h3>formação</h3>
          {EDUCATION.map((item) => (
            <div className="cv-item" key={item.year}>
              <div className="cv-item-head">
                <h4>{item.title}</h4>
                <span>{item.when}</span>
              </div>
              <p className="cv-org">
                {item.org} · {item.kind}
              </p>
              <p>{item.points.slice(0, 2).join(' · ')}</p>
            </div>
          ))}
        </section>
        <section className="cv-sec">
          <h3>projetos selecionados</h3>
          <div id="cv-projects">
            {SELECTED_PROJECTS.map((project) => (
              <div className="cv-item" key={project.slug}>
                <div className="cv-item-head">
                  <h4>{project.name}</h4>
                  <span>{project.stack.slice(0, 3).join(', ')}</span>
                </div>
                <p>{project.desc}</p>
                <p className="cv-project-links">
                  {project.links
                    .filter((link) => !link.demo)
                    .map((link) => (
                      <a key={link.href} href={link.href}>
                        {link.href.replace('https://', '')}
                      </a>
                    ))}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="cv-sec cv-two">
          <div>
            <h3>habilidades</h3>
            <dl className="cv-dl" id="cv-skills">
              {STACK.map((group) => (
                <div key={group.label}>
                  <dt>{group.label}</dt>
                  <dd>{group.items.join(', ')}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h3>idiomas</h3>
            <dl className="cv-dl">
              <div>
                <dt>português</dt>
                <dd>Nativo</dd>
              </div>
              <div>
                <dt>inglês</dt>
                <dd>Básico</dd>
              </div>
            </dl>
          </div>
        </section>
      </article>
      <div className="cv-actions">
        <button type="button" className="pill solid" data-print>
          Imprimir / salvar PDF
        </button>
        <button type="button" className="pill" data-back>
          Voltar ao portfólio
        </button>
      </div>
    </section>
  );
}
