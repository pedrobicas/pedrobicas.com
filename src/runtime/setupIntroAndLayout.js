import { sessionStore } from '../utils/storage.js';

export function setupIntroAndLayout(ctx) {
  const { $, $$, root, anim, gsap, ScrollTrigger, lenis, on, addCleanup, typography, timeout, clearTimer } = ctx;
  let introTimeline = null;
  let resizeTimer = null;
  let cancelled = false;

  function runIntro() {
    const loader = $('.loader');
    if (!loader) return;
    const { chars, renderChars } = ctx.hero;
    const revealHero = () => {
      chars.forEach((char) => {
        char.intro = 1;
      });
      renderChars();
      ctx.hero.hintPass();
    };
    const hideLoader = () => {
      loader.hidden = true;
      loader.style.display = 'none';
      ctx.cursor?.refreshState?.();
    };

    // A abertura roda só na primeira visita da sessão à home. Rotas internas
    // abrem direto no conteúdo. A classe no-intro é decidida no <head>
    // (index.html), antes da primeira pintura, para o loader não piscar.
    if (!anim || ctx.state.mode !== 'portfolio' || root.classList.contains('no-intro')) {
      revealHero();
      hideLoader();
      return;
    }

    loader.hidden = false;
    loader.style.removeProperty('display');
    loader.classList.add('is-loading');
    lenis?.stop();
    const top = $('.loader-top');
    const bottom = $('.loader-bot');
    const line = $('.loader-line');
    const count = $('.loader-count');
    gsap.set([top, bottom], { yPercent: 0 });
    gsap.set(line, { scaleX: 0, opacity: 1 });
    gsap.set($$('.lt,.lt-cmd,.lt .ok', loader), { opacity: 0 });
    count.textContent = '000';
    let watchdog = null;
    introTimeline = gsap.timeline({
      onComplete() {
        sessionStore.set('pb-boot', '1');
        hideLoader();
        loader.classList.remove('is-loading');
        if (watchdog) clearTimer(watchdog);
        if (lenis && ctx.state.mode === 'portfolio') lenis.start();
        ScrollTrigger.refresh();
        ctx.hero.hintPass();
      },
    });
    introTimeline
      .to('.lt-cmd', { opacity: 1, duration: 0.12 }, 0)
      .fromTo(
        '.lt-cmd span',
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.28, ease: 'steps(21)' },
        0.05,
      );
    $$('.lt').forEach((item, index) => {
      introTimeline
        .to(item, { opacity: 1, duration: 0.1 }, 0.2 + index * 0.12)
        .to($('.ok', item), { opacity: 1, duration: 0.08 }, 0.27 + index * 0.12);
    });
    const counter = { value: 0 };
    introTimeline.to(
      counter,
      {
        value: 100,
        duration: 0.8,
        ease: 'power2.inOut',
        onUpdate() {
          count.textContent = String(Math.round(counter.value)).padStart(3, '0');
        },
      },
      0,
    );
    introTimeline.to(line, { scaleX: 1, duration: 0.25, ease: 'expo.inOut' }, 0.58);
    introTimeline.addLabel('split', 0.86);
    introTimeline
      .to(top, { yPercent: -100, duration: 0.55, ease: 'expo.inOut' }, 'split')
      .to(bottom, { yPercent: 100, duration: 0.55, ease: 'expo.inOut' }, 'split')
      .to(line, { opacity: 0, duration: 0.2 }, 'split+=0.1')
      .to(chars, { intro: 1, duration: 0.65, ease: 'expo.out', stagger: 0.025, onUpdate: renderChars }, 'split+=0.2')
      .from('.topbar, .dots', { y: -14, opacity: 0, duration: 0.4, ease: 'power3.out' }, 'split+=0.35')
      .from(
        '.hero-hello, .hero-meta > *',
        { y: 16, opacity: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out' },
        'split+=0.38',
      );
    const skip = () => {
      if (!loader.hidden) introTimeline?.progress(1);
    };
    watchdog = timeout(skip, 3500);
    on(loader, 'click', skip);
    const keyHandler = (event) => {
      if (['Escape', 'Enter', ' '].includes(event.key)) skip();
    };
    on(window, 'keydown', keyHandler);
  }

  function layoutAll() {
    typography.fitTitles();
    if (!ctx.gallery.detail.hidden) typography.fitOne($('.d-name'), 110);
    ctx.hero.layoutHero();
    ctx.contact.layoutContact();
    ctx.stackJourney.buildJourney();
    ctx.navigation.placeThumb();
    ScrollTrigger.refresh();
  }

  let lastWidth = innerWidth;
  on(window, 'resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const widthChanged = Math.abs(innerWidth - lastWidth) > 1;
      lastWidth = innerWidth;
      if (!widthChanged && ctx.finePointer === false) {
        ctx.hero.layoutHero();
        ScrollTrigger.refresh();
        return;
      }
      layoutAll();
    }, 160);
  });
  addCleanup(() => clearTimeout(resizeTimer));
  addCleanup(() => {
    cancelled = true;
    introTimeline?.kill();
    $('.loader')?.classList.remove('is-loading');
  });
  // Refit native text if remote fonts finish after the initial readiness timeout.
  if (document.fonts?.addEventListener) {
    on(document.fonts, 'loadingdone', () => {
      if (!cancelled) layoutAll();
    });
  }

  const initialRoute = ctx.navigation.parseRoute(location.pathname);
  const opensInternalRoute = initialRoute.mode !== 'portfolio';
  // Sem abertura, o nome (já pré-renderizado) aparece antes da primeira pintura,
  // em vez de sumir até as fontes carregarem.
  const revealNow = opensInternalRoute || !anim || root.classList.contains('no-intro');
  if (opensInternalRoute) ctx.navigation.applyRoute(initialRoute, { instant: true });
  if (revealNow) runIntro();

  const fontsReady = document.fonts?.ready || Promise.resolve();
  Promise.race([fontsReady, new Promise((resolve) => setTimeout(resolve, 1000))]).then(() => {
    if (cancelled) return;
    layoutAll();
    if (!revealNow) runIntro();
  });

  ctx.layout = { layoutAll, runIntro };
  return ctx.layout;
}
