export default function About() {
  return (
    <section className="about" id="sobre" aria-labelledby="sobre-t">
      <h2 className="sr-only" id="sobre-t">Sobre mim</h2>
      <p className="path" aria-hidden="true">~/sobre</p>
      <p className="about-text">Sou o Pedro, desenvolvedor full-stack de São Paulo. Estudo Engenharia de Software na FIAP, me formei técnico no SENAI e hoje desenvolvo aplicações web e APIs para pesquisa no InCor. Trabalho do banco de dados à interface: Angular e React na frente, Spring Boot e Node.js atrás, Python para automatizar o resto.</p>
      <div className="about-grid">
        <dl className="facts">
          <div><dt>agora</dt><dd>Bolsista em desenvolvimento no InCor (HC-FMUSP)</dd></div>
          <div><dt>estudando</dt><dd>Engenharia de Software na FIAP, com Bolsa Mérito</dd></div>
          <div><dt>destaque</dt><dd>3º lugar no desafio Next 2024</dd></div>
          <div><dt>formação técnica</dt><dd>Análise e Desenvolvimento de Sistemas, SENAI</dd></div>
          <div><dt>base</dt><dd>São Paulo, agora são <span className="clock">--:--</span></dd></div>
        </dl>
        <div className="term" data-cursor-zone="text">
          <div className="term-bar"><span className="term-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>pedro@bicas: ~</span></div>
          <div className="term-out" role="log" aria-live="polite" aria-label="Saída do terminal" data-lenis-prevent></div>
          <form className="term-form" autoComplete="off">
            <label className="term-prompt" htmlFor="term-in">pedro@bicas:~$</label>
            <input id="term-in" type="text" spellCheck="false" autoCapitalize="off" autoCorrect="off" enterKeyHint="send" aria-label="Digite um comando" aria-describedby="term-help" />
          </form>
          <div className="term-chips" id="term-help">
            <span>experimente:</span>
            <button type="button" data-cmd="help">help</button>
            <button type="button" data-cmd="whoami">whoami</button>
            <button type="button" data-cmd="stack">stack</button>
            <button type="button" data-cmd="projetos">projetos</button>
          </div>
        </div>
      </div>
    </section>
  );
}
