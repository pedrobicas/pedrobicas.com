import { clamp, lerp } from '../utils/math.js';

export function setupStackAndJourney(ctx) {
  const { $, $$, reduce, anim, gsap, ScrollTrigger, state, onTick, addCleanup } = ctx;

  const marquees = $$('.mq').map((row, index) => ({ row, track: $('.mq-track', row), dir: index % 2 ? -1 : 1, x: 0, groupWidth: 0, skew: 0 }));
  let measuredWidth = 0;
  function buildMarquees() {
    if (reduce) return;
    if (Math.abs(innerWidth - measuredWidth) < 2) return;
    measuredWidth = innerWidth;
    marquees.forEach((marquee, index) => {
      const groups = $$('.mq-group', marquee.track);
      groups.slice(1).forEach((group) => group.remove());
      marquee.groupWidth = groups[0]?.getBoundingClientRect().width || 0;
      if (!marquee.groupWidth) return;
      const count = Math.ceil(innerWidth / marquee.groupWidth) + 1;
      for (let k = 0; k < count; k += 1) marquee.track.appendChild(groups[0].cloneNode(true));
      marquee.x = -marquee.groupWidth * (0.15 + 0.6 * ((index * 0.37) % 1));
    });
  }

  onTick((dt) => {
    if (reduce || !state.stackVisible || state.mode !== 'portfolio') return;
    const skewTarget = clamp(-state.vel * 0.3, -9, 9);
    for (const marquee of marquees) {
      if (!marquee.groupWidth) continue;
      const speed = (36 + Math.abs(state.vel) * 10) * marquee.dir * state.scrollDir;
      marquee.x -= speed * dt;
      if (marquee.x <= -marquee.groupWidth) marquee.x += marquee.groupWidth;
      if (marquee.x > 0) marquee.x -= marquee.groupWidth;
      marquee.skew = lerp(marquee.skew, skewTarget, 0.12);
      marquee.track.style.transform = `translate3d(${marquee.x.toFixed(2)}px,0,0) skewX(${marquee.skew.toFixed(2)}deg)`;
    }
  });

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
    if (!anim) { year.textContent = nextYear; return; }
    gsap.killTweensOf(year);
    gsap.to(year, {
      yPercent: upward ? -100 : 100,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete() {
        year.textContent = nextYear;
        gsap.fromTo(year, { yPercent: upward ? 100 : -100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'expo.out' });
      },
    });
  }

  if (anim) {
    gsap.fromTo(drawPath, { strokeDashoffset: () => journeyLength }, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: { trigger: body, start: 'top 62%', end: 'bottom 62%', scrub: 0.6, invalidateOnRefresh: true },
    });
    milestones.forEach((item, index) => {
      const trigger = ScrollTrigger.create({
        trigger: item,
        start: 'top 62%',
        onEnter: () => { item.classList.add('reached'); setYear(item.dataset.year, item.dataset.cap); },
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

  ctx.stackJourney = { buildMarquees, buildJourney };
  return ctx.stackJourney;
}
