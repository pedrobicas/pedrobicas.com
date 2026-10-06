export default function Hero() {
  return (
    <section className="hero" id="topo" aria-label="Apresentação">
      <canvas className="hero-wire" aria-hidden="true"></canvas>
      <div className="hero-main">
        <p className="hero-hello">Olá, eu sou</p>
        <h1 className="hero-name"><span className="sr-only">Pedro Bicas</span><span className="row" aria-hidden="true">Pedro</span><span className="row row-2" aria-hidden="true">Bicas</span></h1>
      </div>
      <div className="hero-meta">
        <div>
          <p className="tagline">Desenvolvedor full-stack. Faço a API, o banco de dados e a interface que as pessoas usam.</p>
        </div>
        <a className="scroll-cue" href="#sobre" aria-label="Ir para a seção Sobre"><span aria-hidden="true">role</span><i aria-hidden="true"></i></a>
        <div className="byte" aria-hidden="true">
          <p className="byte-bits"><span>0</span><span>1</span><span>0</span><span>1</span><span>0</span><span>0</span><span>0</span><span>0</span></p>
          <p className="byte-meta"><span className="byte-char">"P"</span><span>seu nome, em binário</span></p>
          <p className="byte-note">acelera quando você rola a página</p>
        </div>
      </div>
    </section>
  );
}
