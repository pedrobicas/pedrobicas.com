const FACTS = [
  ['agora', 'Bolsista em desenvolvimento, InCor (HC\u2011FMUSP)'],
  ['graduação', 'Engenharia de Software, FIAP · Bolsa Mérito'],
  ['técnico', 'Análise e Desenvolvimento de Sistemas, SENAI'],
  ['destaque', '3º lugar no desafio Next 2024'],
];

export default function About() {
  return (
    <section className="about" id="sobre" aria-labelledby="sobre-t">
      <h2 className="sr-only" id="sobre-t">
        Sobre mim
      </h2>
      <p className="path" aria-hidden="true">
        ~/sobre
      </p>
      <p className="about-text">
        <span className="about-reveal">
          <span className="about-reveal-inner">Sou Pedro Bicas, tenho 21 anos e sou{' '}</span>
        </span>
        <span className="about-reveal">
          <span className="about-reveal-inner">
            <span className="about-emphasis">desenvolvedor fullstack.</span>{' '}
          </span>
        </span>
        <span className="about-reveal about-muted">
          <span className="about-reveal-inner"> Curso Engenharia de Software na FIAP, 
            sou técnico em Desenvolvimento de Sistemas
            pelo SENAI e trabalho no InCor desde 2024.</span>
        </span>
      </p>
      <div className="about-grid">
        <dl className="facts">
          {FACTS.map(([term, description]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{description}</dd>
            </div>
          ))}
          <div>
            <dt>base</dt>
            <dd>
              São Paulo · <span className="clock">--:--</span>
            </dd>
          </div>
        </dl>
        <div className="term" data-cursor-zone="text">
          <div className="term-bar">
            <span className="term-dots" aria-hidden="true">
              <i></i>
              <i></i>
              <i></i>
            </span>
            <span>pedro@bicas: ~</span>
          </div>
          <div
            className="term-out"
            role="log"
            aria-live="polite"
            aria-label="Saída do terminal"
            data-lenis-prevent
          ></div>
          <form className="term-form" autoComplete="off">
            <label className="term-prompt" htmlFor="term-in">
              pedro@bicas:~$
            </label>
            <input
              id="term-in"
              type="text"
              spellCheck="false"
              autoCapitalize="off"
              autoCorrect="off"
              enterKeyHint="send"
              aria-label="Digite um comando"
              aria-describedby="term-help"
            />
          </form>
          <div className="term-chips" id="term-help">
            <span>experimente:</span>
            <button type="button" data-cmd="help">
              help
            </button>
            <button type="button" data-cmd="whoami">
              whoami
            </button>
            <button type="button" data-cmd="stack">
              stack
            </button>
            <button type="button" data-cmd="projetos">
              projetos
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
