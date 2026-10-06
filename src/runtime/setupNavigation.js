import { PROJECTS } from '../data/projects.js';

export function setupNavigation(ctx) {
  const { $, $$, root, state, anim, reduce, gsap, lenis, on, addCleanup } = ctx;
  const gallery = ctx.gallery.element;
  const detail = ctx.gallery.detail;
  const cv = $('#curriculo');
  const wipe = $('.wipe');
  const switchButtons = $$('.switch button');
  const thumb = $('.switch-thumb');
  const main = $('main');
  const pages = { projetos: gallery, cv };
  const titles = { portfolio: 'Pedro Bicas, desenvolvedor full-stack', projetos: 'Projetos | Pedro Bicas', cv: 'Currículo | Pedro Bicas' };
  let modeTimeline = null;

  function placeThumb() {
    const button = switchButtons.find((item) => item.dataset.mode === state.mode);
    if (!button) return;
    thumb.style.width = `${button.offsetWidth}px`;
    thumb.style.transform = `translateX(${button.offsetLeft - 5}px)`;
  }
  function updateTitle() {
    const slug = ctx.gallery.getDetailSlug();
    const project = state.mode === 'projetos' && slug ? PROJECTS.find((item) => item.slug === slug) : null;
    document.title = project ? `${project.name} | Pedro Bicas` : titles[state.mode];
  }
  function setMode(nextMode, options = {}) {
    if (nextMode === state.mode) { options.then?.(); return; }
    if (modeTimeline) { modeTimeline.progress(1); modeTimeline.kill(); modeTimeline = null; }
    state.mode = nextMode;
    root.dataset.mode = nextMode;
    switchButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.mode === nextMode)));
    placeThumb();
    ctx.gallery.hidePreview();
    const swap = () => {
      cv.hidden = nextMode !== 'cv';
      gallery.hidden = nextMode !== 'projetos';
      main.inert = nextMode !== 'portfolio';
      if (nextMode !== 'projetos') ctx.gallery.closeDetail(true);
      if (nextMode === 'portfolio') lenis?.start();
      else { lenis?.stop(); pages[nextMode].scrollTop = 0; }
      if (nextMode === 'projetos') ctx.gallery.galleryEnter();
      ctx.gallery.updateLive();
      options.then?.();
      if (detail.hidden) {
        if (nextMode === 'cv') $('#cv-title').focus({ preventScroll: true });
        else if (nextMode === 'projetos') $('#g-title').focus({ preventScroll: true });
      }
    };
    if (!anim || options.instant) { swap(); return; }
    modeTimeline = gsap.timeline({ onComplete() { modeTimeline = null; } });
    if (options.origin) {
      const rect = options.origin;
      const from = `inset(${Math.max(0, rect.top).toFixed(0)}px ${Math.max(0, innerWidth - rect.right).toFixed(0)}px ${Math.max(0, innerHeight - rect.bottom).toFixed(0)}px ${Math.max(0, rect.left).toFixed(0)}px round 14px)`;
      modeTimeline.set(wipe, { yPercent: 0, clipPath: from, visibility: 'visible' }).to(wipe, { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: 0.85, ease: 'expo.inOut' });
    } else {
      modeTimeline.set(wipe, { yPercent: 100, visibility: 'visible' }).to(wipe, { yPercent: 0, duration: 0.55, ease: 'expo.in' });
    }
    modeTimeline.add(swap).to(wipe, { yPercent: -100, duration: 0.75, ease: 'expo.out' }).set(wipe, { visibility: 'hidden', clipPath: 'none' });
    if (nextMode === 'cv') modeTimeline.from('.cv-sheet', { y: 60, opacity: 0, duration: 0.9, ease: 'expo.out' }, '-=0.6');
  }

  function parseRoute(hash) {
    const match = (hash || '').match(/^#\/([^/?]+)(?:\/([^/?]+))?/);
    if (!match) return { mode: 'portfolio' };
    if (match[1] === 'projetos') return { mode: 'projetos', slug: match[2] ? decodeURIComponent(match[2]) : null };
    if (match[1] === 'curriculo') return { mode: 'cv' };
    return { mode: 'portfolio' };
  }
  function applyRoute(route, options = {}) {
    setMode(route.mode, {
      instant: options.instant,
      origin: options.origin,
      then() {
        if (route.mode === 'projetos') {
          if (route.slug) ctx.gallery.openDetail(route.slug, options.instant);
          else ctx.gallery.closeDetail(options.instant);
        }
        updateTitle();
        options.then?.();
      },
    });
  }
  function go(hash, options = {}) {
    const url = hash && hash !== '#/' ? hash : location.pathname + location.search;
    try { history[options.replace ? 'replaceState' : 'pushState'](null, '', url); } catch { /* history may be unavailable */ }
    applyRoute(parseRoute(hash), options);
  }
  ctx.go = go;

  const handlePopState = () => applyRoute(parseRoute(location.hash));
  on(window, 'popstate', handlePopState);
  const routes = { portfolio: '', projetos: '#/projetos', cv: '#/curriculo' };
  switchButtons.forEach((button) => on(button, 'click', () => go(routes[button.dataset.mode])));
  on($('[data-back]'), 'click', () => go(''));
  on(window, 'keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!detail.hidden) go('#/projetos');
    else if (state.mode !== 'portfolio') go('');
  });

  on(document, 'click', (event) => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (href.startsWith('#/')) {
      event.preventDefault();
      go(href, { origin: anchor.hasAttribute('data-origin') && anim ? anchor.getBoundingClientRect() : null });
      return;
    }
    if (href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    const scroll = (immediate) => {
      if (lenis) lenis.scrollTo(target, immediate ? { immediate: true, force: true } : { duration: 1.6 });
      else target.scrollIntoView({ behavior: immediate || reduce ? 'auto' : 'smooth' });
    };
    if (state.mode !== 'portfolio') go('', { then: () => scroll(true) }); else scroll(false);
    if (anchor.classList.contains('skip')) target.focus({ preventScroll: true });
  });

  const dotLinks = $$('.dots a');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      dotLinks.forEach((anchor) => {
        const active = anchor.getAttribute('href') === `#${id}`;
        anchor.classList.toggle('active', active);
        if (active) anchor.setAttribute('aria-current', 'true'); else anchor.removeAttribute('aria-current');
      });
      root.classList.toggle('on-blue-zone', id === 'contato');
    });
  }, { rootMargin: '-48% 0px -51% 0px' });
  ['topo', 'sobre', 'stack', 'trajetoria', 'projetos', 'contato'].forEach((id) => sectionObserver.observe(document.getElementById(id)));
  addCleanup(() => sectionObserver.disconnect());

  const visibilityObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.target.id === 'topo') state.heroVisible = entry.isIntersecting;
    if (entry.target.id === 'stack') state.stackVisible = entry.isIntersecting;
    if (entry.target.id === 'contato') state.contactVisible = entry.isIntersecting;
  }));
  [$('#topo'), $('#stack'), $('#contato')].forEach((element) => visibilityObserver.observe(element));
  addCleanup(() => visibilityObserver.disconnect());
  addCleanup(() => modeTimeline?.kill());

  ctx.navigation = { parseRoute, applyRoute, go, setMode, placeThumb, updateTitle };
  return ctx.navigation;
}
