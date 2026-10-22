import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { lerp } from '../utils/math.js';

gsap.registerPlugin(ScrollTrigger);

export function createRuntimeContext() {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const anim = !reduce;
  const cleanups = [];
  const tasks = new Set();
  const timers = new Set();
  const state = {
    mode: 'portfolio',
    vel: 0,
    scrollDir: 1,
    heroVisible: true,
    stackVisible: false,
    contactVisible: false,
    ptr: { x: -999, y: -999, speed: 0, active: false },
  };

  root.dataset.mode = state.mode;
  if (!anim) root.classList.remove('js-anim');

  const on = (target, event, handler, options) => {
    target?.addEventListener(event, handler, options);
    const cleanup = () => target?.removeEventListener(event, handler, options);
    cleanups.push(cleanup);
    return cleanup;
  };
  const addCleanup = (cleanup) => {
    if (typeof cleanup === 'function') cleanups.push(cleanup);
    return cleanup;
  };
  const onTick = (fn) => {
    tasks.add(fn);
    return addCleanup(() => tasks.delete(fn));
  };
  const timeout = (fn, ms) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
    return id;
  };
  const interval = (fn, ms) => {
    const id = window.setInterval(fn, ms);
    timers.add(id);
    return id;
  };
  const clearTimer = (id) => {
    clearTimeout(id);
    clearInterval(id);
    timers.delete(id);
  };

  let lenis = null;
  if (anim) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    addCleanup(() => lenis.destroy());
  }

  let lastY = window.scrollY;
  let lastPX = 0;
  let lastPY = 0;
  const pointerMove = (event) => {
    state.ptr.x = event.clientX;
    state.ptr.y = event.clientY;
    state.ptr.active = true;
  };
  on(window, 'pointermove', pointerMove, { passive: true });

  const ticker = (time, deltaMs) => {
    const dt = Math.min(deltaMs / 1000, 0.05);
    if (lenis) lenis.raf(time * 1000);
    let velocity;
    if (lenis) velocity = lenis.velocity || 0;
    else {
      const y = window.scrollY;
      velocity = (y - lastY) / Math.max(dt, 1 / 120) / 60;
      lastY = y;
    }
    state.vel = lerp(state.vel, velocity, 0.25);
    if (Math.abs(velocity) > 0.4) state.scrollDir = Math.sign(velocity);
    const distance = Math.hypot(state.ptr.x - lastPX, state.ptr.y - lastPY) / Math.max(dt, 1 / 120);
    state.ptr.speed = lerp(state.ptr.speed, Math.min(distance, 4000), 0.15);
    lastPX = state.ptr.x;
    lastPY = state.ptr.y;
    for (const task of tasks) task(dt);
  };
  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);
  addCleanup(() => gsap.ticker.remove(ticker));

  const ctx = {
    $,
    $$,
    root,
    reduce,
    finePointer,
    anim,
    gsap,
    ScrollTrigger,
    lenis,
    state,
    on,
    onTick,
    addCleanup,
    timeout,
    interval,
    clearTimer,
    destroy() {
      [...timers].forEach((id) => {
        clearTimeout(id);
        clearInterval(id);
      });
      timers.clear();
      while (cleanups.length) {
        try {
          cleanups.pop()?.();
        } catch {
          /* cleanup is best-effort */
        }
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      root.classList.remove('has-cursor', 'h-scroll', 'on-blue-zone');
      delete root.dataset.mode;
    },
  };
  return ctx;
}
