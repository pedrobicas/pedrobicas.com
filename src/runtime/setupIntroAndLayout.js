import { sessionStore } from '../utils/storage.js';

export function setupIntroAndLayout(ctx) {
  const { $, $$, anim, gsap, ScrollTrigger, lenis, on, addCleanup, typography } = ctx;
  let introTimeline = null;
  let resizeTimer = null;
  let cancelled = false;

  function runIntro() {
    const loader = $('.loader');
    if (!loader) return;
    const { chars, wire, renderChars } = ctx.hero;
    if (!anim) {
      loader.hidden = true;
      chars.forEach((char) => { char.intro = 1; });
      renderChars();
      return;
    }
    loader.hidden = false;
    lenis?.stop();
    const seen = sessionStore.get('pb-boot');
    const top = $('.loader-top');
    const bottom = $('.loader-bot');
    const line = $('.loader-line');
    const count = $('.loader-count');
    introTimeline = gsap.timeline({
      onComplete() {
        loader.hidden = true;
        if (lenis && ctx.state.mode === 'portfolio') lenis.start();
        sessionStore.set('pb-boot', '1');
        ScrollTrigger.refresh();
      },
    });
    if (!seen) {
      introTimeline.to('.lt-cmd', { opacity: 1, duration: 0.2 }, 0)
        .fromTo('.lt-cmd span', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.55, ease: 'steps(21)' }, 0.1);
      $$('.lt').forEach((item, index) => {
        introTimeline.to(item, { opacity: 1, duration: 0.15 }, 0.75 + index * 0.3)
          .to($('.ok', item), { opacity: 1, duration: 0.1 }, 0.95 + index * 0.3);
      });
      const counter = { value: 0 };
      introTimeline.to(counter, { value: 100, duration: 1.75, ease: 'power2.inOut', onUpdate() { count.textContent = String(Math.round(counter.value)).padStart(3, '0'); } }, 0);
      introTimeline.to(line, { scaleX: 1, duration: 0.6, ease: 'expo.inOut' }, 1.6);
      introTimeline.addLabel('split', 2.2);
    } else {
      count.textContent = '100';
      introTimeline.set(line, { scaleX: 1 });
      introTimeline.addLabel('split', 0.15);
    }
    introTimeline.add(() => { wire.reset(); wire.restart(); }, 'split')
      .to(top, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, 'split')
      .to(bottom, { yPercent: 100, duration: 1.1, ease: 'expo.inOut' }, 'split')
      .to(line, { opacity: 0, duration: 0.3 }, 'split+=0.2')
      .to(chars, { intro: 1, duration: 1.6, ease: 'expo.out', stagger: 0.065 }, 'split+=0.35')
      .from('.topbar, .dots', { y: -20, opacity: 0, duration: 0.9, ease: 'power3.out' }, 'split+=0.6')
      .from('.hero-hello, .hero-meta > *', { y: 28, opacity: 0, duration: 1, stagger: 0.08, ease: 'power3.out' }, 'split+=0.7');
    const skip = () => introTimeline?.timeScale(6);
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
    ctx.stackJourney.buildMarquees();
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
  addCleanup(() => { cancelled = true; introTimeline?.kill(); });

  const fontsReady = document.fonts?.ready || Promise.resolve();
  Promise.race([fontsReady, new Promise((resolve) => setTimeout(resolve, 2500))]).then(() => {
    if (cancelled) return;
    layoutAll();
    const initialRoute = ctx.navigation.parseRoute(location.hash);
    if (initialRoute.mode !== 'portfolio') ctx.navigation.applyRoute(initialRoute, { instant: true });
    runIntro();
  });

  ctx.layout = { layoutAll, runIntro };
  return ctx.layout;
}
