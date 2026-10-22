import { ROUTES, isAppPath, parseRoute } from '../routing.js';
import { pageMeta } from '../seo.js';

export function setupNavigation(ctx) {
  const { $, $$, root, state, anim, reduce, gsap, lenis, on, addCleanup } = ctx;
  const gallery = ctx.gallery.element;
  const detail = ctx.gallery.detail;
  const cv = $('#curriculo');
  const wipe = $('.wipe');
  const switchButtons = $$('.switch button');
  const thumb = $('.switch-thumb');
  const main = $('main');
  const dots = $('.dots');
  const skip = $('.skip');
  const pages = { projetos: gallery, cv };
  let modeTimeline = null;

  function placeThumb() {
    const button = switchButtons.find((item) => item.dataset.mode === state.mode);
    if (!button) return;
    thumb.style.width = `${button.offsetWidth}px`;
    thumb.style.transform = `translateX(${button.offsetLeft - 5}px)`;
  }
  function updateTitle() {
    const slug = state.mode === 'projetos' ? ctx.gallery.getDetailSlug() : null;
    document.title = pageMeta({ mode: state.mode, slug }).title;
  }
  function setMode(nextMode, options = {}) {
    if (nextMode === state.mode) {
      options.then?.();
      return;
    }
    if (modeTimeline) {
      const previousTimeline = modeTimeline;
      previousTimeline.progress(1);
      previousTimeline.kill();
      modeTimeline = null;
    }
    state.mode = nextMode;
    root.dataset.mode = nextMode;
    switchButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.mode === nextMode)));
    placeThumb();
    ctx.gallery.hidePreview();
    const swap = () => {
      cv.hidden = nextMode !== 'cv';
      gallery.hidden = nextMode !== 'projetos';
      main.inert = nextMode !== 'portfolio';
      dots.inert = nextMode !== 'portfolio';
      skip.inert = nextMode !== 'portfolio';
      if (nextMode !== 'projetos') ctx.gallery.closeDetail(true);
      if (nextMode === 'portfolio') lenis?.start();
      else {
        lenis?.stop();
        pages[nextMode].scrollTop = 0;
      }
      if (nextMode === 'projetos') ctx.gallery.galleryEnter();
      ctx.gallery.updateLive();
      ctx.cursor?.refreshState?.();
      options.then?.();
      if (detail.hidden) {
        if (nextMode === 'cv') $('#cv-title').focus({ preventScroll: true });
        else if (nextMode === 'projetos') $('#g-title').focus({ preventScroll: true });
      }
    };
    if (!anim || options.instant) {
      swap();
      return;
    }
    modeTimeline = gsap.timeline({
      onComplete() {
        modeTimeline = null;
      },
    });
    if (options.origin) {
      const rect = options.origin;
      const from = `inset(${Math.max(0, rect.top).toFixed(0)}px ${Math.max(0, innerWidth - rect.right).toFixed(0)}px ${Math.max(0, innerHeight - rect.bottom).toFixed(0)}px ${Math.max(0, rect.left).toFixed(0)}px round 14px)`;
      modeTimeline
        .set(wipe, { yPercent: 0, clipPath: from, visibility: 'visible' })
        .to(wipe, { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: 0.85, ease: 'expo.inOut' });
    } else {
      modeTimeline
        .set(wipe, { yPercent: 100, visibility: 'visible' })
        .to(wipe, { yPercent: 0, duration: 0.55, ease: 'expo.in' });
    }
    modeTimeline
      .add(swap)
      .to(wipe, { yPercent: -100, duration: 0.75, ease: 'expo.out' })
      .set(wipe, { visibility: 'hidden', clipPath: 'none' });
    if (nextMode === 'cv')
      modeTimeline.from('.cv-sheet', { y: 60, opacity: 0, duration: 0.9, ease: 'expo.out' }, '-=0.6');
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
  function go(path, options = {}) {
    const url = path || ROUTES.portfolio;
    const method = options.replace || url === location.pathname ? 'replaceState' : 'pushState';
    try {
      history[method](null, '', url);
    } catch {
      /* history may be unavailable */
    }
    applyRoute(parseRoute(url), options);
  }
  ctx.go = go;

  const handlePopState = () => applyRoute(parseRoute(location.pathname));
  on(window, 'popstate', handlePopState);
  switchButtons.forEach((button) => on(button, 'click', () => go(ROUTES[button.dataset.mode])));
  on($('[data-back]'), 'click', () => go(ROUTES.portfolio));
  on($('[data-print]'), 'click', () => window.print());
  on(window, 'keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!detail.hidden) go(ROUTES.projetos);
    else if (state.mode !== 'portfolio') go(ROUTES.portfolio);
  });

  on(document, 'click', (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const anchor = event.target.closest('a[href]');
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
    const href = anchor.getAttribute('href');
    // Rotas internas (/projetos, /projetos/:slug, /curriculo) trocam de modo sem recarregar a página.
    if (href.startsWith('/') && !href.startsWith('//')) {
      const url = new URL(href, location.origin);
      if (!isAppPath(url.pathname)) return;
      event.preventDefault();
      go(url.pathname, { origin: anchor.hasAttribute('data-origin') && anim ? anchor.getBoundingClientRect() : null });
      return;
    }
    if (!href.startsWith('#') || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    const scroll = (immediate) => {
      if (lenis) lenis.scrollTo(target, immediate ? { immediate: true, force: true } : { duration: 1.6 });
      else target.scrollIntoView({ behavior: immediate || reduce ? 'auto' : 'smooth' });
    };
    if (state.mode !== 'portfolio') go(ROUTES.portfolio, { then: () => scroll(true) });
    else scroll(false);
    if (anchor.classList.contains('skip')) target.focus({ preventScroll: true });
  });

  const markScrolled = () => root.classList.toggle('is-scrolled', window.scrollY > 40);
  markScrolled();
  on(window, 'scroll', markScrolled, { passive: true });
  addCleanup(() => root.classList.remove('is-scrolled'));

  const dotLinks = $$('.dots a');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        dotLinks.forEach((anchor) => {
          const active = anchor.getAttribute('href') === `#${id}`;
          anchor.classList.toggle('active', active);
          if (active) anchor.setAttribute('aria-current', 'true');
          else anchor.removeAttribute('aria-current');
        });
        root.classList.toggle('on-blue-zone', id === 'contato');
      });
    },
    { rootMargin: '-48% 0px -51% 0px' },
  );
  ['topo', 'projetos', 'sobre', 'trajetoria', 'stack', 'contato'].forEach((id) =>
    sectionObserver.observe(document.getElementById(id)),
  );
  addCleanup(() => sectionObserver.disconnect());

  const visibilityObserver = new IntersectionObserver((entries) =>
    entries.forEach((entry) => {
      if (entry.target.id === 'topo') state.heroVisible = entry.isIntersecting;
      if (entry.target.id === 'stack') state.stackVisible = entry.isIntersecting;
      if (entry.target.id === 'contato') state.contactVisible = entry.isIntersecting;
    }),
  );
  [$('#topo'), $('#stack'), $('#contato')].forEach((element) => visibilityObserver.observe(element));
  addCleanup(() => visibilityObserver.disconnect());
  addCleanup(() => modeTimeline?.kill());

  // Posiciona a pílula do seletor antes da primeira pintura, sem a transição de largura;
  // layoutAll reajusta quando as fontes carregam.
  thumb.style.transition = 'none';
  placeThumb();
  thumb.getBoundingClientRect();
  thumb.style.removeProperty('transition');

  ctx.navigation = { parseRoute, applyRoute, go, setMode, placeThumb, updateTitle };
  return ctx.navigation;
}
