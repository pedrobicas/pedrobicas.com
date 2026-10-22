export function setupStackUsage(ctx) {
  const { $, $$, on } = ctx;
  const stack = $('#stack');
  const grid = $('.stk', stack);
  const buttons = $$('.stk-item[data-tech]', stack);
  const uses = $$('.stk-use', stack);
  const hint = $('.stk-hint', stack);
  let pinned = null;
  let preview = null;

  function show(tech) {
    grid.classList.toggle('has-active', Boolean(tech));
    buttons.forEach((button) => {
      const active = button.dataset.tech === tech;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active && pinned === tech));
    });
    uses.forEach((use) => {
      use.hidden = use.dataset.for !== tech;
    });
    hint.hidden = Boolean(tech);
  }
  buttons.forEach((button) => {
    on(button, 'pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      preview = button.dataset.tech;
      show(pinned || preview);
    });
    on(button, 'focus', () => show(pinned || button.dataset.tech));
    on(button, 'click', () => {
      pinned = pinned === button.dataset.tech ? null : button.dataset.tech;
      show(pinned || preview);
    });
  });
  // Keep the readout open while the pointer travels from a technology to its links.
  on(stack, 'pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;
    preview = null;
    show(pinned);
  });
  on(stack, 'focusout', (event) => {
    if (!stack.contains(event.relatedTarget)) show(pinned);
  });
  on(stack, 'keydown', (event) => {
    if (event.key !== 'Escape' || (!pinned && !preview)) return;
    pinned = null;
    preview = null;
    show(null);
    event.stopPropagation();
  });
}
