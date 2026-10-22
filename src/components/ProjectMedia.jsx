import { useEffect, useRef } from 'react';

export default function ProjectMedia({ project }) {
  const figureRef = useRef(null);
  const { media } = project;

  useEffect(() => {
    const figure = figureRef.current;
    const video = figure.querySelector('video');
    if (!video || !media.video) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    const preview = figure.closest('.g-preview');
    const host = figure.closest('.g-link, .proj, .d-cover') || figure;
    let hovering = false;
    let focused = false;
    let visible = false;
    let failed = false;
    let wanted = false;

    function pause() {
      video.pause();
      delete figure.dataset.playing;
    }
    function sync() {
      const previewActive = preview?.classList.contains('show') && !figure.hidden;
      wanted = Boolean(preview ? previewActive : hovering || focused);
      if (!wanted || !visible || reduced.matches || !pointer.matches || document.hidden || failed) {
        pause();
        return;
      }
      if (!video.getAttribute('src')) video.src = media.video;
      if (video.paused)
        video.play().catch(() => {
          pause();
        });
    }
    function playing() {
      if (wanted && visible && !reduced.matches && !document.hidden) figure.dataset.playing = 'true';
      else pause();
    }
    function error() {
      failed = true;
      pause();
    }
    function enter() {
      hovering = true;
      sync();
    }
    function leave() {
      hovering = false;
      sync();
    }
    function focus() {
      focused = true;
      sync();
    }
    function blur(event) {
      if (!host.contains(event.relatedTarget)) {
        focused = false;
        sync();
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio > 0;
      sync();
    });
    observer.observe(figure);
    const mutations = new MutationObserver(sync);
    if (preview) {
      for (const element of [preview, figure, figure.parentElement]) {
        mutations.observe(element, { attributes: true, attributeFilter: ['class', 'hidden'] });
      }
    }
    host.addEventListener('pointerenter', enter);
    host.addEventListener('pointerleave', leave);
    host.addEventListener('focusin', focus);
    host.addEventListener('focusout', blur);
    video.addEventListener('playing', playing);
    video.addEventListener('error', error);
    reduced.addEventListener('change', sync);
    pointer.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      pause();
      observer.disconnect();
      mutations.disconnect();
      host.removeEventListener('pointerenter', enter);
      host.removeEventListener('pointerleave', leave);
      host.removeEventListener('focusin', focus);
      host.removeEventListener('focusout', blur);
      video.removeEventListener('playing', playing);
      video.removeEventListener('error', error);
      reduced.removeEventListener('change', sync);
      pointer.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      video.removeAttribute('src');
      video.load();
    };
  }, [media.video]);

  return (
    <figure className="project-media" ref={figureRef} data-project-visual={project.slug}>
      <img
        src={media.cover}
        srcSet={`${media.thumbnail} 800w, ${media.cover} 1600w`}
        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 60vw, 800px"
        width="1600"
        height="900"
        alt=""
        loading="lazy"
        decoding="async"
      />
      {media.video ? <video muted loop playsInline preload="none" aria-hidden="true" /> : null}
    </figure>
  );
}
