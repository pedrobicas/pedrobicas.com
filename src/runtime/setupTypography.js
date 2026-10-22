export function setupTypography(ctx) {
  const { $, $$, gsap, anim, addCleanup } = ctx;
  let probe = null;

  function split(element, label = true) {
    const text = element.textContent.trim();
    if (label) element.setAttribute('aria-label', text);
    element.textContent = '';
    const chars = [];
    text.split(' ').forEach((word, index, words) => {
      const wrapper = document.createElement('span');
      wrapper.className = 'word';
      wrapper.setAttribute('aria-hidden', 'true');
      for (const char of word) {
        const node = document.createElement('span');
        node.className = 'char';
        node.textContent = char;
        wrapper.appendChild(node);
        chars.push(node);
      }
      element.appendChild(wrapper);
      if (index < words.length - 1) element.appendChild(document.createTextNode(' '));
    });
    return chars;
  }

  function fitOne(element, base) {
    if (!element?.clientWidth) return;
    if (!probe) {
      probe = document.createElement('span');
      probe.setAttribute('aria-hidden', 'true');
      probe.style.cssText =
        'position:absolute;left:-9999px;top:0;visibility:hidden;white-space:nowrap;font-family:var(--display);font-weight:800;letter-spacing:-.01em';
      document.body.appendChild(probe);
    }
    element.style.fontSize = '';
    const max = parseFloat(getComputedStyle(element).fontSize);
    probe.style.fontSize = `${max}px`;
    probe.style.fontVariationSettings = `"wdth" ${base}, "wght" 800`;
    const words = (element.getAttribute('aria-label') || element.textContent).trim().split(/\s+/);
    const widest = Math.max(
      ...words.map((word) => {
        probe.textContent = word;
        return probe.getBoundingClientRect().width;
      }),
    );
    const available = element.clientWidth * 0.97;
    if (widest > available) element.style.fontSize = `${((max * available) / widest).toFixed(1)}px`;
  }

  const titleSets = $$('[data-split]').map((element) => {
    const chars = split(element, true);
    const base = +element.dataset.w || 125;
    chars.forEach((char) => char.style.setProperty('--sw', base));
    return { element, chars, base };
  });
  const galleryTitle = titleSets.find((set) => set.element.closest('.gallery'));

  if (anim) {
    titleSets.forEach(({ element, chars, base }) => {
      if (element.closest('.gallery')) return;
      gsap.fromTo(
        chars,
        { '--sw': 50, opacity: 0 },
        {
          '--sw': base,
          opacity: 1,
          duration: 1.3,
          ease: 'expo.out',
          stagger: 0.04,
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        },
      );
    });
  }

  const aboutText = $('.about-text');
  if (anim && aboutText) {
    // Reveal whole text blocks through a mask: no duplicated words, font resizing,
    // pointer handlers or layout-changing per-character transforms.
    const lines = $$('.about-reveal-inner', aboutText);
    const accent = $('.about-emphasis', aboutText);
    const entrances = gsap.timeline({
      scrollTrigger: {
        trigger: aboutText,
        start: 'top 68%',
        toggleActions: 'restart none none reverse',
      },
    });
    lines.forEach((line, index) => {
      entrances.fromTo(
        line,
        { yPercent: 110, x: index === 1 ? 30 : -30, opacity: 0 },
        { yPercent: 0, x: 0, opacity: 1, duration: 1.05, ease: 'power3.out' },
        index * 0.24,
      );
    });
    entrances.fromTo(
      aboutText,
      { '--about-progress': 0 },
      { '--about-progress': 1, duration: 1.45, ease: 'power2.out' },
      0,
    );
    if (accent) entrances.to(accent, { '--accent-progress': '100%', duration: 0.55, ease: 'power2.out' }, 0.96);

    addCleanup(() => {
      entrances.scrollTrigger?.kill();
      entrances.kill();
      gsap.set(lines, { clearProps: 'opacity,transform' });
      if (accent) gsap.set(accent, { clearProps: '--accent-progress' });
      aboutText.style.removeProperty('--about-progress');
    });
  }

  const fitTitles = () => $$('[data-split]').forEach((element) => fitOne(element, +element.dataset.w || 125));
  ctx.typography = { fitOne, fitTitles, titleSets, galleryTitle };
  addCleanup(() => probe?.remove());
  return ctx.typography;
}
