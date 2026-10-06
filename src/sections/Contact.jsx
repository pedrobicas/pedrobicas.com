import { EMAIL } from '../data/site.js';

export default function Contact() {
  return (
    <section className="contact" id="contato" aria-labelledby="contato-t">
      <p className="path" aria-hidden="true">~/contato</p>
      <h2 className="contact-title" id="contato-t" data-split data-w="130">Bora conversar?</h2>
      <p className="contact-note">Estou aberto a vagas, freelas e projetos em que eu aprenda algo novo. Respondo por email ou pelo LinkedIn.</p>
      <div className="email-wrap">
        <button type="button" className="email-big" data-cursor="copiar" data-magnetic=".06"><span className="sr-only">Copiar o email </span>{EMAIL}</button>
        <canvas className="contact-wire" aria-hidden="true"></canvas>
      </div>
      <div className="contact-actions">
        <a className="pill" href={`mailto:${EMAIL}`} data-magnetic=".3">Escrever email</a>
        <a className="pill" href="https://linkedin.com/in/pedrobicas" target="_blank" rel="noopener noreferrer" data-magnetic=".3">LinkedIn</a>
        <a className="pill" href="https://github.com/pedrobicas" target="_blank" rel="noopener noreferrer" data-magnetic=".3">GitHub</a>
      </div>
      <footer className="foot">
        <span>© 2026 Pedro Bicas</span>
        <span>São Paulo, <span className="clock">--:--</span></span>
        <a href="#topo">Voltar ao início</a>
      </footer>
    </section>
  );
}
