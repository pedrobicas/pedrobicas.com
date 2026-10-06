export default function Header() {
  return (
    <header className="topbar">
      <a className="brand" href="#topo" aria-label="Pedro Bicas, voltar ao início"><span className="brand-long">pedrobicas.com</span><span className="brand-short">pb</span><span className="caret" aria-hidden="true"></span></a>
      <div className="switch" role="group" aria-label="Modo de visualização">
        <span className="switch-thumb" aria-hidden="true"></span>
        <button type="button" data-mode="portfolio" aria-pressed="true">Portfólio</button>
        <button type="button" data-mode="projetos" aria-pressed="false">Projetos</button>
        <button type="button" data-mode="cv" aria-pressed="false">Currículo</button>
      </div>
      <a className="top-cta" href="#contato" data-magnetic=".35">Contato</a>
    </header>
  );
}
