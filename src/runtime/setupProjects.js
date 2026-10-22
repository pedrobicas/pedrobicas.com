export function setupProjects(ctx, live) {
  const { $, $$, anim, gsap, root, addCleanup } = ctx;
  const projects = $$('.proj');
  const progressBar = $('.work-progress span');
  live.pauseSmil($('.work-track'));

  function setInView(project, on) {
    live.setLive($('.viz', project), on);
  }
  function projectObserver() {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setInView(entry.target, entry.isIntersecting)),
      { threshold: 0.25 },
    );
    projects.forEach((project) => observer.observe(project));
    addCleanup(() => observer.disconnect());
    return observer;
  }

  if (anim) {
    const media = gsap.matchMedia();
    media.add('(min-width: 900px)', () => {
      root.classList.add('h-scroll');
      const track = $('.work-track');
      const distance = () => Math.max(0, track.scrollWidth - innerWidth);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: '.work-pin',
          pin: true,
          scrub: 0.8,
          start: 'top top',
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progressBar.style.transform = `scaleX(${self.progress.toFixed(4)})`;
          },
        },
      });
      projects.forEach((project) => {
        ctx.ScrollTrigger.create({
          trigger: project,
          containerAnimation: tween,
          start: 'left 78%',
          end: 'right 22%',
          onToggle: (self) => setInView(project, self.isActive),
        });
        gsap.fromTo(
          $('.proj-visual', project),
          { xPercent: 6 },
          {
            xPercent: -6,
            ease: 'none',
            scrollTrigger: {
              trigger: project,
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        );
      });
      return () => {
        root.classList.remove('h-scroll');
        projects.forEach((project) => setInView(project, false));
      };
    });
    media.add('(max-width: 899px)', () => {
      const observer = projectObserver();
      return () => observer.disconnect();
    });
    addCleanup(() => media.revert());
  } else {
    projectObserver();
  }

  ctx.projects = { projects, setInView };
  return ctx.projects;
}
