import { PROJECTS } from '../data/projects.js';
import { AREAS } from '../data/site.js';
import { clamp, lerp } from '../utils/math.js';
import { localStore } from '../utils/storage.js';
import { pad2 } from '../utils/text.js';

export function setupGallery(ctx, live) {
  const { $, $$, state, finePointer, reduce, anim, gsap, on, onTick, addCleanup, typography } = ctx;
  const gallery = $('#galeria');
  const items = $$('.g-item', gallery);
  const empty = $('.g-empty', gallery);
  const preview = $('.g-preview');
  const previewVisual = $('.g-preview .viz');
  const detail = $('#detalhe');
  const panel = $('.d-panel', detail);
  const backdrop = $('.d-backdrop', detail);
  const filterButtons = $$('.g-filters .chip', gallery);
  const viewButtons = $$('.g-views .chip', gallery);
  let filter = 'todos';
  let view = localStore.get('pb-view') || (innerWidth < 700 ? 'grade' : 'lista');
  let detailSlug = null;

  live.pauseSmil(gallery);

  const near = new Set();
  const itemObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) near.add(entry.target); else near.delete(entry.target);
    });
    updateLive();
  }, { rootMargin: '160px 0px' });
  items.forEach((item) => itemObserver.observe(item));
  addCleanup(() => itemObserver.disconnect());

  function bySlug(slug) { return PROJECTS.find((project) => project.slug === slug); }
  function showProjectVisual(container, slug) {
    $$('[data-project-visual]', container).forEach((visual) => {
      const hidden = visual.dataset.projectVisual !== slug;
      visual.toggleAttribute('hidden', hidden);
      visual.style.display = hidden ? 'none' : '';
    });
  }
  showProjectVisual(previewVisual, null);
  showProjectVisual($('.d-cover', detail), null);
  live.pauseSmil(previewVisual);
  live.pauseSmil(detail);
  function updateLive() {
    const on = state.mode === 'projetos' && view === 'grade';
    items.forEach((item) => live.setLive($('.g-cover', item), on && !item.hidden && near.has(item)));
  }
  function revealItems() {
    const visible = items.filter((item) => !item.hidden);
    if (anim) gsap.fromTo(visible, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: 'expo.out', overwrite: true });
  }
  function applyFilter(next) {
    filter = next;
    filterButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filter === next)));
    let visibleCount = 0;
    items.forEach((item) => {
      const show = next === 'todos' || item.dataset.areas.split(' ').includes(next);
      item.hidden = !show;
      if (show) visibleCount += 1;
    });
    empty.hidden = visibleCount > 0;
    updateLive();
    revealItems();
  }
  function applyView(next) {
    view = next;
    gallery.classList.toggle('is-grid', next === 'grade');
    viewButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.view === next)));
    localStore.set('pb-view', next);
    hidePreview();
    updateLive();
    revealItems();
  }

  on($('.g-filters', gallery), 'click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (button) applyFilter(button.dataset.filter);
  });
  on($('.g-views', gallery), 'click', (event) => {
    const button = event.target.closest('[data-view]');
    if (button) applyView(button.dataset.view);
  });
  on($('.g-reset', gallery), 'click', () => applyFilter('todos'));
  gallery.classList.toggle('is-grid', view === 'grade');
  viewButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.view === view)));

  function galleryEnter() {
    if (typography.galleryTitle) {
      typography.fitOne(typography.galleryTitle.element, typography.galleryTitle.base);
      if (anim) gsap.fromTo(typography.galleryTitle.chars, { '--sw': 50, opacity: 0 }, { '--sw': typography.galleryTitle.base, opacity: 1, duration: 1.3, ease: 'expo.out', stagger: 0.05, delay: 0.25 });
    }
    applyFilter(filter);
  }

  const previewCard = $('.pv-card');
  const previewIndex = $('.pv-idx');
  const previewKind = $('.pv-kind');
  const previewState = { x: 0, y: 0, r: 0, slug: null };
  let previewTimeline = null;
  let previewHideTimer = null;
  const shouldUsePreview = () => finePointer && !reduce && view === 'lista' && state.mode === 'projetos' && detail.hidden;
  function previewTarget() {
    const width = preview.offsetWidth;
    const height = preview.offsetHeight;
    return {
      x: state.ptr.x < innerWidth * 0.58 ? state.ptr.x + 56 : state.ptr.x - 56 - width,
      y: clamp(state.ptr.y - height / 2, 80, innerHeight - height - 20),
    };
  }
  function fillPreview(slug) {
    const project = bySlug(slug);
    const visible = items.filter((item) => !item.hidden);
    live.setLive(previewVisual, false);
    showProjectVisual(previewVisual, project.slug);
    previewIndex.textContent = `${pad2(visible.findIndex((item) => item.dataset.slug === slug) + 1)} / ${pad2(visible.length)}`;
    previewKind.textContent = project.kind;
    live.setLive(previewVisual, true);
  }
  function showPreview(slug) {
    if (!shouldUsePreview()) return;
    if (previewHideTimer) clearTimeout(previewHideTimer);
    const visible = preview.classList.contains('show');
    if (previewState.slug !== slug) {
      previewState.slug = slug;
      if (visible && anim) {
        previewTimeline?.kill();
        previewTimeline = gsap.timeline()
          .to(previewCard, { scale: 0.88, filter: 'blur(10px)', opacity: 0.3, duration: 0.14, ease: 'power2.in' })
          .add(() => fillPreview(slug))
          .to(previewCard, { scale: 1, filter: 'blur(0px)', opacity: 1, duration: 0.5, ease: 'expo.out' });
      } else {
        fillPreview(slug);
        if (anim) gsap.set(previewCard, { scale: 1, filter: 'blur(0px)', opacity: 1 });
      }
    } else if (!previewVisual._live) live.setLive(previewVisual, true);
    if (!visible) {
      const target = previewTarget();
      previewState.x = target.x;
      previewState.y = target.y;
      preview.classList.add('show');
    }
  }
  function hidePreview() {
    if (previewHideTimer) clearTimeout(previewHideTimer);
    preview.classList.remove('show');
    live.setLive(previewVisual, false);
  }
  items.forEach((item) => {
    const anchor = $('.g-link', item);
    on(anchor, 'pointerenter', () => showPreview(item.dataset.slug));
    on(anchor, 'pointerleave', () => {
      if (previewHideTimer) clearTimeout(previewHideTimer);
      previewHideTimer = setTimeout(hidePreview, 90);
    });
  });
  addCleanup(() => { clearTimeout(previewHideTimer); previewTimeline?.kill(); });
  onTick((dt) => {
    if (!preview.classList.contains('show')) return;
    const target = previewTarget();
    const k = Math.min(1, dt * 10);
    previewState.r = lerp(previewState.r, clamp((target.x - previewState.x) * 0.03, -7, 7), k);
    previewState.x = lerp(previewState.x, target.x, k);
    previewState.y = lerp(previewState.y, target.y, k);
    preview.style.transform = `translate3d(${previewState.x.toFixed(1)}px,${previewState.y.toFixed(1)}px,0) rotate(${previewState.r.toFixed(2)}deg)`;
  });

  const isSheet = () => matchMedia('(max-width: 700px)').matches;
  function populateDetail(project, index) {
    const next = PROJECTS[(index + 1) % PROJECTS.length];
    const previous = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
    $('.d-idx').textContent = `${pad2(index + 1)} / ${pad2(PROJECTS.length)}`;
    $('.d-kind').textContent = project.kind;
    const name = $('.d-name');
    name.textContent = project.name;
    const cover = $('.d-cover');
    live.setLive(cover, false);
    showProjectVisual(cover, project.slug);
    $('.d-desc').textContent = project.desc;
    const highlights = project.highlights || [];
    $('.d-hl').replaceChildren(...highlights.map((highlight) => {
      const item = document.createElement('li');
      item.textContent = highlight;
      return item;
    }));
    $('.d-hl-wrap').hidden = highlights.length === 0;
    $('.d-stack').replaceChildren(...project.stack.map((technology) => {
      const item = document.createElement('li');
      item.textContent = technology;
      return item;
    }));
    $('.d-areas').textContent = project.areas.map((area) => AREAS[area] || area).join(', ');
    const links = $('.d-links');
    links.replaceChildren(...project.links.map((link) => {
      const anchor = document.createElement('a');
      anchor.className = `pill${link.demo ? ' solid' : ''}`;
      anchor.href = link.href;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.dataset.cursor = link.demo ? 'demo' : 'código';
      anchor.dataset.magnetic = '.25';
      anchor.textContent = link.label;
      return anchor;
    }));
    links.hidden = project.links.length === 0;
    $('[data-prev]').href = `#/projetos/${previous.slug}`;
    $('[data-next]').href = `#/projetos/${next.slug}`;
    $('.d-next').href = `#/projetos/${next.slug}`;
    $('.d-next span').textContent = next.name;
    return { name, cover };
  }
  function openDetail(slug, instant) {
    const index = PROJECTS.findIndex((project) => project.slug === slug);
    if (index < 0) { ctx.go?.('#/projetos', { replace: true }); return; }
    const project = PROJECTS[index];
    const wasOpen = !detail.hidden;
    detailSlug = slug;
    const { name, cover } = populateDetail(project, index);
    hidePreview();
    detail.hidden = false;
    gallery.inert = true;
    panel.scrollTop = 0;
    typography.fitOne(name, 110);
    live.setLive(cover, true);
    ctx.cursor?.refreshMagnetics?.();
    ctx.cursor?.refreshState?.();
    if (anim && !instant) {
      if (!wasOpen) {
        gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out', overwrite: true });
        gsap.fromTo(panel, isSheet() ? { xPercent: 0, yPercent: 100, y: 0 } : { xPercent: 100, yPercent: 0, y: 0 }, { xPercent: 0, yPercent: 0, duration: 0.85, ease: 'expo.out', overwrite: true });
      }
      gsap.fromTo('.d-panel > :not(.d-top):not(.d-grab)', { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'expo.out', delay: wasOpen ? 0 : 0.18, overwrite: true });
    }
    name.focus({ preventScroll: true });
  }
  function closeDetail(instant) {
    if (detail.hidden) return;
    const from = detailSlug;
    detailSlug = null;
    const done = () => {
      detail.hidden = true;
      gallery.inert = false;
      gsap.set([panel, backdrop], { clearProps: 'transform,opacity' });
      live.setLive($('.d-cover'), false);
      const link = from && gallery.querySelector(`[data-slug="${from}"] .g-link`);
      if (link && state.mode === 'projetos') link.focus({ preventScroll: true });
      ctx.cursor?.refreshState?.();
    };
    if (anim && !instant) {
      gsap.to(backdrop, { opacity: 0, duration: 0.45, ease: 'power2.in', overwrite: true });
      gsap.to(panel, { ...(isSheet() ? { yPercent: 100 } : { xPercent: 100 }), duration: 0.55, ease: 'expo.in', overwrite: true, onComplete: done });
    } else done();
  }

  $$('[data-close]', detail).forEach((element) => on(element, 'click', () => ctx.go?.('#/projetos')));
  let drag = null;
  on(panel, 'touchstart', (event) => {
    if (!isSheet() || panel.scrollTop > 0) { drag = null; return; }
    drag = { y0: event.touches[0].clientY, dy: 0 };
  }, { passive: true });
  on(panel, 'touchmove', (event) => {
    if (!drag) return;
    drag.dy = Math.max(0, event.touches[0].clientY - drag.y0);
    gsap.set(panel, { y: drag.dy });
  }, { passive: true });
  on(panel, 'touchend', () => {
    if (!drag) return;
    const dy = drag.dy;
    drag = null;
    if (dy > 110) ctx.go?.('#/projetos');
    else gsap.to(panel, { y: 0, duration: 0.45, ease: 'expo.out' });
  });

  ctx.gallery = {
    element: gallery,
    detail,
    openDetail,
    closeDetail,
    galleryEnter,
    updateLive,
    hidePreview,
    getDetailSlug: () => detailSlug,
    getView: () => view,
  };
  return ctx.gallery;
}
