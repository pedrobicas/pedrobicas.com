import { lerp } from '../utils/math.js';

export function setupCursor(ctx) {
  const { $, root, finePointer, reduce, anim, gsap, state, on, onTick } = ctx;
  const cursor = $('.cursor');
  const dot = $('.cursor-dot');
  const ring = $('.cursor-ring');
  const label = $('.cursor-label');
  let ringX = -100;
  let ringY = -100;

  function updateCursorState(target) {
    if (!target || !(target instanceof Element)) {
      cursor.classList.remove('is-text', 'is-label', 'is-hover', 'on-blue');
      label.textContent = '';
      return;
    }
    const labelled = target.closest('[data-cursor]');
    const hoverable = target.closest('a,button');
    const text = target.closest('input,.term-out');
    cursor.classList.toggle('is-text', Boolean(text));
    cursor.classList.toggle('is-label', Boolean(labelled) && !text);
    cursor.classList.toggle('is-hover', !labelled && Boolean(hoverable) && !text);
    cursor.classList.toggle('on-blue', Boolean(target.closest('.contact')));
    label.textContent = labelled ? labelled.dataset.cursor : '';
  }

  function refreshState() {
    if (!finePointer || reduce || !state.ptr.active) {
      updateCursorState(null);
      return;
    }
    updateCursorState(document.elementFromPoint(state.ptr.x, state.ptr.y));
  }

  if (finePointer && !reduce) {
    root.classList.add('has-cursor');
    onTick((dt) => {
      if (!state.ptr.active) return;
      ringX = lerp(ringX, state.ptr.x, Math.min(1, dt * 12));
      ringY = lerp(ringY, state.ptr.y, Math.min(1, dt * 12));
      dot.style.transform = `translate3d(${state.ptr.x}px,${state.ptr.y}px,0)`;
      ring.style.transform = `translate3d(${ringX.toFixed(1)}px,${ringY.toFixed(1)}px,0)`;
    });
    on(document, 'pointerover', (event) => updateCursorState(event.target));
    on(document.documentElement, 'pointerleave', () => cursor.classList.add('is-out'));
    on(document.documentElement, 'pointerenter', () => cursor.classList.remove('is-out'));
  }

  const magnetic = new WeakMap();
  function magneticHandlers(element) {
    if (!finePointer || !anim || magnetic.has(element)) return;
    const strength = +element.dataset.magnetic || 0.3;
    const xTo = gsap.quickTo(element, 'x', { duration: 0.7, ease: 'power3' });
    const yTo = gsap.quickTo(element, 'y', { duration: 0.7, ease: 'power3' });
    const move = (event) => {
      const rect = element.getBoundingClientRect();
      xTo((event.clientX - rect.left - rect.width / 2) * strength);
      yTo((event.clientY - rect.top - rect.height / 2) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    on(element, 'pointermove', move);
    on(element, 'pointerleave', leave);
    magnetic.set(element, true);
  }
  function refreshMagnetics() {
    document.querySelectorAll('[data-magnetic]').forEach(magneticHandlers);
  }
  refreshMagnetics();
  ctx.cursor = { refreshMagnetics, refreshState };
  return ctx.cursor;
}
