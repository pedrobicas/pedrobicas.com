import { EMAIL } from '../data/site.js';

function Arrow() {
  return (
    <svg className="contact-arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function Contact() {
  return (
    <section className="contact contact-refined" id="contato" aria-labelledby="contato-t">
      <p className="path contact-kicker">05 / Contato</p>
      <div className="contact-heading">
        <h2 className="contact-title" id="contato-t">
          Fale comigo.
        </h2>
        <p className="contact-note">
          Respondo por email <br />
          ou pelo LinkedIn.
        </p>
      </div>
      <div className="contact-channels">
        <div className="contact-row contact-email">
          <button type="button" className="email-big" data-cursor="copiar">
            <span className="contact-channel">Email</span>
            <span className="contact-email-address">{EMAIL}</span>
            <span className="contact-copy">
              <span className="contact-copy-state">Copiar</span>
              <svg
                className="contact-copy-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect x="8" y="8" width="11" height="12" rx="1" stroke="currentColor" strokeWidth="1.4" />
                <path d="M15 8V4H4v12h4" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </span>
          </button>
          <a className="contact-compose" href={`mailto:${EMAIL}`} aria-label="Escrever email">
            <Arrow />
          </a>
        </div>
        <a
          className="contact-row contact-social"
          href="https://linkedin.com/in/pedrobicas"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="contact-channel">LinkedIn</span>
          <span className="contact-profile">in/pedrobicas</span>
          <Arrow />
        </a>
        <a
          className="contact-row contact-social"
          href="https://github.com/pedrobicas"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="contact-channel">GitHub</span>
          <span className="contact-profile">pedrobicas</span>
          <Arrow />
        </a>
      </div>
      <footer className="foot">
        <span>© 2026 Pedro Bicas</span>
        <span>
          São Paulo, <span className="clock">--:--</span>
        </span>
        <a href="#topo">
          Voltar ao início <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </section>
  );
}
