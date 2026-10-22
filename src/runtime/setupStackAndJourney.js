import { setupStackUsage } from './setupStackUsage.js';

export function setupStackAndJourney(ctx) {
  const { $, $$, anim, gsap, ScrollTrigger, addCleanup } = ctx;
  setupStackUsage(ctx);

  const body = $('.journey-body');
  const svg = $('.journey-line');
  const basePath = $('.jl-base');
  const drawPath = $('.jl-draw');
  const milestones = $$('.milestone');
  let journeyLength = 1;
  function buildJourney() {
    const height = body.offsetHeight;
    svg.setAttribute('viewBox', `0 0 64 ${height}`);
    svg.setAttribute('height', height);
    svg.style.height = `${height}px`;
    const x = innerWidth <= 700 ? 9 : 12;
    let path = `M ${x} 0`;
    milestones.forEach((item) => {
      const y = item.offsetTop + 30;
      path += ` L ${x} ${y} L ${x + 24} ${y} L ${x + 24} ${y + 28} L ${x} ${y + 28}`;
    });
    path += ` L ${x} ${height}`;
    basePath.setAttribute('d', path);
    drawPath.setAttribute('d', path);
    journeyLength = drawPath.getTotalLength();
    drawPath.style.strokeDasharray = journeyLength;
    if (!anim) drawPath.style.strokeDashoffset = 0;
  }

  const year = $('.year-num');
  const yearCap = $('.year-cap');
  let currentYear = year.textContent;
  function setYear(nextYear, cap) {
    yearCap.textContent = cap;
    if (nextYear === currentYear) return;
    const upward = +nextYear > +currentYear;
    currentYear = nextYear;
    if (!anim) {
      year.textContent = nextYear;
      return;
    }
    gsap.killTweensOf(year);
    gsap.to(year, {
      yPercent: upward ? -100 : 100,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete() {
        year.textContent = nextYear;
        gsap.fromTo(
          year,
          { yPercent: upward ? 100 : -100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.6, ease: 'expo.out' },
        );
      },
    });
  }

  if (anim) {
    gsap.fromTo(
      drawPath,
      { strokeDashoffset: () => journeyLength },
      {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: body, start: 'top 62%', end: 'bottom 62%', scrub: 0.6, invalidateOnRefresh: true },
      },
    );
    milestones.forEach((item, index) => {
      const trigger = ScrollTrigger.create({
        trigger: item,
        start: 'top 62%',
        onEnter: () => {
          item.classList.add('reached');
          setYear(item.dataset.year, item.dataset.cap);
        },
        onLeaveBack: () => {
          item.classList.remove('reached');
          const previous = milestones[Math.max(0, index - 1)];
          setYear(previous.dataset.year, previous.dataset.cap);
        },
      });
      addCleanup(() => trigger.kill());
    });
  } else {
    milestones.forEach((item) => item.classList.add('reached'));
    const last = milestones[milestones.length - 1];
    year.textContent = last.dataset.year;
    yearCap.textContent = last.dataset.cap;
  }

  ctx.stackJourney = { buildJourney };
  return ctx.stackJourney;
}
