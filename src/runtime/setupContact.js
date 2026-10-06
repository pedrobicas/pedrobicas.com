import { EMAIL } from '../data/site.js';
import { Wire } from './Wire.js';

export function setupContact(ctx) {
  const { $, $$, state, reduce, finePointer, onTick, on, interval, timeout, clearTimer } = ctx;
  const wire = new Wire($('.contact-wire'), { color: '242,247,255', idle: true, lineWidth: 1.8, gap: 34, text: `${EMAIL}  `, reduceMotion: reduce });

  function layoutContact() {
    wire.resize();
    wire.base = wire.canvasHeight * 0.58;
    wire.height = wire.canvasHeight * 0.34;
    if (reduce) { wire.fillStatic(); wire.draw(); }
  }

  function wireOn() {
    if (!wire.active) {
      wire.restart();
      wire.active = true;
    }
  }

  onTick((dt) => {
    if (!state.contactVisible || reduce || state.mode !== 'portfolio') return;
    wire.rate = Math.max(ctx.hero?.getRate?.() || 1, 1.4);
    if (!finePointer && !wire.active) wireOn();
    wire.step(dt);
    wire.draw();
  });

  $$('.email-big, .contact-actions .pill').forEach((element) => {
    ['pointerenter', 'focus'].forEach((event) => on(element, event, wireOn));
    ['pointerleave', 'blur'].forEach((event) => on(element, event, () => { wire.active = false; }));
  });

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand('copy');
        textarea.remove();
        return ok;
      } catch {
        return false;
      }
    }
  }

  const toast = $('.toast');
  let toastTimer = null;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    if (toastTimer) clearTimer(toastTimer);
    toastTimer = timeout(() => toast.classList.remove('show'), 2600);
  }

  on($('.email-big'), 'click', async () => {
    const ok = await copyText(EMAIL);
    showToast(ok ? 'Email copiado' : `Não deu para copiar. O email é ${EMAIL}`);
  });

  const formatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });
  const tickClock = () => $$('.clock').forEach((element) => { element.textContent = formatter.format(new Date()); });
  tickClock();
  const clockTimer = interval(tickClock, 15000);
  ctx.addCleanup(() => clearTimer(clockTimer));

  ctx.contact = { wire, layoutContact };
  return ctx.contact;
}
