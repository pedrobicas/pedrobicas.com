import { PROJECTS } from '../data/projects.js';
import { STACK } from '../data/stack.js';
import { EMAIL } from '../data/site.js';

export default function Resume() {
  return (
    <div className="cv" id="curriculo" role="dialog" aria-modal="true" aria-labelledby="cv-title" hidden data-lenis-prevent>
      <article className="cv-sheet">
        <header className="cv-head">
          <div><h2 id="cv-title" tabIndex="-1">Pedro Bicas</h2><p className="cv-role">Desenvolvedor full-stack</p></div>
          <ul className="cv-contact">
            <li>São Paulo, SP</li><li><a href="https://pedrobicas.com">pedrobicas.com</a></li><li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            <li><a href="https://linkedin.com/in/pedrobicas" target="_blank" rel="noopener noreferrer">linkedin.com/in/pedrobicas</a></li>
            <li><a href="https://github.com/pedrobicas" target="_blank" rel="noopener noreferrer">github.com/pedrobicas</a></li>
          </ul>
        </header>
        <section className="cv-sec"><h3>resumo</h3><p>Estudante de Engenharia de Software na FIAP e técnico em Análise e Desenvolvimento de Sistemas pelo SENAI. Bolsista no InCor (HC-FMUSP), onde desenvolvo aplicações web e APIs REST para pesquisa.</p></section>
        <section className="cv-sec"><h3>experiência</h3><div className="cv-item"><div className="cv-item-head"><h4>Bolsista em desenvolvimento</h4><span>2024 – atual</span></div><p className="cv-org">InCor (HC-FMUSP)</p><ul className="cv-list"><li>APIs REST para integrar sistemas internos de pesquisa</li><li>Dashboards interativos para visualização de dados clínicos</li><li>Integração contínua e ambientes com Docker</li></ul><p className="cv-tech">Python, Django, React, TypeScript, PostgreSQL, Docker</p></div></section>
        <section className="cv-sec"><h3>formação</h3><div className="cv-item"><div className="cv-item-head"><h4>Bacharelado em Engenharia de Software</h4><span>2023 – 2026</span></div><p className="cv-org">FIAP, em andamento. Bolsa Mérito. 3º lugar no desafio Next 2024.</p></div><div className="cv-item"><div className="cv-item-head"><h4>Técnico em Análise e Desenvolvimento de Sistemas</h4><span>2021 – 2022</span></div><p className="cv-org">SENAI</p></div></section>
        <section className="cv-sec"><h3>projetos</h3><div id="cv-projects">{PROJECTS.map((project) => <div className="cv-item" key={project.slug}><div className="cv-item-head"><h4>{project.name}</h4><span>{project.stack.slice(0, 2).join(', ')}</span></div><p>{project.desc}</p></div>)}</div></section>
        <section className="cv-sec cv-two"><div><h3>habilidades</h3><dl className="cv-dl" id="cv-skills">{STACK.map((group) => <div key={group.label}><dt>{group.label}</dt><dd>{group.items.join(', ')}</dd></div>)}</dl></div><div><h3>idiomas</h3><dl className="cv-dl"><div><dt>português</dt><dd>Nativo</dd></div><div><dt>inglês</dt><dd>Básico</dd></div></dl></div></section>
      </article>
      <div className="cv-actions"><button type="button" className="pill" data-back>Voltar ao portfólio</button></div>
    </div>
  );
}
