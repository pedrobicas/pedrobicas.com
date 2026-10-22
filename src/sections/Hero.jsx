import { ROUTES } from '../routing.js';

export default function Hero() {
  return (
    <section className="hero hero-refined" id="topo" aria-label="Apresentação">
      <div className="hero-main">
        <p className="hero-hello">Olá, eu sou</p>
        <h1 className="hero-name">
          <span className="sr-only">Pedro Bicas</span>
          <span className="row" aria-hidden="true">
            Pedro
          </span>
          <span className="row row-2" aria-hidden="true">
            Bicas
          </span>
        </h1>
      </div>
      <div className="hero-meta">
        <p className="tagline">
          Desenvolvedor full-stack. Trabalho com aplicações web, APIs e ferramentas que desenvolvo por conta própria.
        </p>
        <div className="hero-links">
          <a className="hero-project-link" href={ROUTES.projetos}>
            Ver projetos <span aria-hidden="true">↗</span>
          </a>
          <a className="hero-resume-link" href={ROUTES.cv}>
            Currículo <span aria-hidden="true">↗</span>
          </a>
          <a className="scroll-cue" href="#sobre" aria-label="Role até a seção Sobre">
            <span aria-hidden="true">role</span>
            <i aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
