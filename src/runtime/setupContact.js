import { EMAIL } from '../data/site.js';

export function setupContact(ctx) {
  const { $, $$, anim, gsap, on, interval, timeout, clearTimer, addCleanup } = ctx;
  const section = $('#contato');
  const email = $('.email-big', section);
  const address = $('.contact-email-address', section);
  const copyState = $('.contact-copy-state', section);
  const toast = $('.toast');
  let toastTimer = null;
  let alive = true;

  function layoutContact() {
    address.style.removeProperty('font-size');
    const available = address.clientWidth;
    if (!available) return;
    const range = document.createRange();
    range.selectNodeContents(address);
    const width = range.getBoundingClientRect().width;
    if (width > available)
      address.style.fontSize = `${(((parseFloat(getComputedStyle(address).fontSize) * available) / width) * 0.98).toFixed(1)}px`;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const textarea = document.createElement('textarea');
      try {
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(textarea);
        textarea.select();
        return document.execCommand('copy');
      } catch {
        return false;
      } finally {
        textarea.remove();
      }
    }
  }

  on(email, 'click', async () => {
    const ok = await copyText(EMAIL);
    if (!alive) return;
    toast.textContent = ok ? 'Email copiado' : `Não deu para copiar. O email é ${EMAIL}`;
    toast.classList.add('show');
    copyState.textContent = ok ? 'Copiado' : 'Copiar';
    email.classList.toggle('is-copied', ok);
    if (toastTimer) clearTimer(toastTimer);
    toastTimer = timeout(() => {
      toast.classList.remove('show');
      copyState.textContent = 'Copiar';
      email.classList.remove('is-copied');
    }, 2600);
  });

  if (anim) {
    const elements = [$('.contact-heading', section), ...$$('.contact-row', section)];
    const reveal = gsap.fromTo(
      elements,
      { y: 22, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 82%', once: true },
      },
    );
    addCleanup(() => {
      reveal.scrollTrigger?.kill();
      reveal.kill();
      gsap.set(elements, { clearProps: 'transform,opacity' });
    });
  }

  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
  });
  const tickClock = () =>
    $$('.clock').forEach((element) => {
      element.textContent = formatter.format(new Date());
    });
  tickClock();
  interval(tickClock, 15000);
  addCleanup(() => {
    alive = false;
  });
  ctx.contact = { layoutContact };
  return ctx.contact;
}
