export function createLiveVisuals(ctx) {
  const { $, $$, reduce, interval, clearTimer } = ctx;
  const typers = new Map();

  function activeScope(container) {
    return $('[data-project-visual]:not([hidden])', container) || container;
  }

  function typeCaption(container, on) {
    const caption = $('.pl-caption', activeScope(container));
    if (!caption) return;
    const existing = typers.get(caption);
    if (existing) clearTimer(existing);
    const text = caption.dataset.text;
    if (!on || reduce) {
      caption.textContent = text;
      return;
    }
    let index = 0;
    let hold = 0;
    caption.textContent = '';
    const id = interval(() => {
      if (index <= text.length) {
        caption.textContent = text.slice(0, index++);
        return;
      }
      hold += 1;
      if (hold > 50) {
        index = 0;
        hold = 0;
      }
    }, 42);
    typers.set(caption, id);
  }

  function setLive(visual, on) {
    if (!visual || visual._live === on) return;
    visual._live = on;
    visual.classList.toggle('live', on);
    const svg = $('svg.smil', activeScope(visual));
    if (svg?.pauseAnimations) {
      if (on && !reduce) svg.unpauseAnimations();
      else svg.pauseAnimations();
    }
    typeCaption(visual, on);
  }

  function pauseSmil(root) {
    $$('svg.smil', root).forEach((svg) => svg.pauseAnimations?.());
  }

  return { setLive, pauseSmil };
}
