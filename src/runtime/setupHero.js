import { Wire } from './Wire.js';
import { clamp, lerp } from '../utils/math.js';

export function setupHero(ctx) {
  const { $, $$, state, finePointer, reduce, anim, onTick } = ctx;
  const hero = $('#topo');
  const heroName = $('.hero-name');
  const rows = $$('.hero-name .row');
  const chars = [];

  function splitRow(row) {
    const text = row.textContent.trim();
    row.textContent = '';
    const word = document.createElement('span');
    word.className = 'word';
    word.setAttribute('aria-hidden', 'true');
    const result = [];
    for (const char of text) {
      const node = document.createElement('span');
      node.className = 'char';
      node.textContent = char;
      word.appendChild(node);
      result.push(node);
    }
    row.appendChild(word);
    return result;
  }

  rows.forEach((row) => splitRow(row).forEach((element) => chars.push({ element, intro: anim ? 0 : 1, pulse: 0, hover: 0, cx: 0, cy: 0, w: -1, g: -1, o: -1, p: -1 })));
  const message = 'PEDRO BICAS ';
  const messageMap = [];
  let charIndex = 0;
  for (const char of message) messageMap.push(char === ' ' ? -1 : charIndex++);

  const wire = new Wire($('.hero-wire'), { lineWidth: 2.2, text: message, reduceMotion: reduce });
  const byteBits = $$('.byte-bits span');
  const byteChar = $('.byte-char');
  wire.onByte = (char, index, bits) => {
    const mapped = messageMap[index];
    if (mapped >= 0 && chars[mapped]) chars[mapped].pulse = 1;
    byteChar.textContent = char === ' ' ? '"espaço"' : `"${char}"`;
    for (let i = 0; i < 8; i += 1) {
      byteBits[i].textContent = bits[i];
      byteBits[i].classList.remove('on');
    }
  };
  wire.onBit = (index) => byteBits.forEach((span, i) => span.classList.toggle('on', i === index));

  let fontSize = 200;
  let baseWidth = 110;
  let rate = 1;

  function renderChars() {
    for (const char of chars) {
      const width = Math.round(clamp(50 + (baseWidth - 50) * char.intro + 26 * char.pulse + 36 * char.hover, 50, 150));
      const weight = Math.round(clamp(200 + 550 * char.intro + 150 * Math.max(char.pulse, char.hover), 100, 900));
      const opacity = Math.round(clamp(char.intro * 1.6, 0, 1) * 100);
      const pulse = Math.round(char.pulse * 20);
      if (width !== char.w || weight !== char.g) {
        char.element.style.fontVariationSettings = `"wdth" ${width}, "wght" ${weight}`;
        char.w = width;
        char.g = weight;
      }
      if (opacity !== char.o) { char.element.style.opacity = opacity / 100; char.o = opacity; }
      if (pulse !== char.p) { char.element.style.setProperty('--p', (pulse / 20).toFixed(2)); char.p = pulse; }
    }
  }

  function layoutHero() {
    baseWidth = innerWidth < 700 ? 82 : 110;
    chars.forEach((char) => { char.element.style.fontVariationSettings = `"wdth" ${baseWidth}, "wght" 750`; char.w = -1; char.g = -1; });
    heroName.style.fontSize = '100px';
    const widths = rows.map((row) => $$('.char', row).reduce((sum, element) => sum + element.getBoundingClientRect().width, 0));
    const available = heroName.clientWidth;
    fontSize = Math.max(44, Math.min(100 * available * 0.9 / Math.max(...widths), window.innerHeight * 0.3));
    heroName.style.fontSize = `${fontSize.toFixed(1)}px`;
    const heroRect = hero.getBoundingClientRect();
    chars.forEach((char) => {
      const rect = char.element.getBoundingClientRect();
      char.cx = rect.left + rect.width / 2 - heroRect.left;
      char.cy = rect.top + rect.height / 2 - heroRect.top;
    });
    const first = rows[0].getBoundingClientRect();
    const second = rows[1].getBoundingClientRect();
    wire.resize();
    wire.base = (first.bottom + second.top) / 2 - heroRect.top;
    wire.height = Math.max(16, fontSize * 0.15);
    if (reduce) { wire.fillStatic(); wire.draw(); }
    renderChars();
  }

  onTick((dt) => {
    if (!state.heroVisible || state.mode !== 'portfolio') return;
    const heroRect = hero.getBoundingClientRect();
    const px = state.ptr.x - heroRect.left;
    const py = state.ptr.y - heroRect.top;
    wire.pointer = state.ptr.active && !reduce ? { x: px, y: py } : null;
    if (!reduce) { wire.step(dt); wire.draw(); }
    const radius = fontSize * 0.9;
    for (const char of chars) {
      let target = 0;
      if (finePointer && state.ptr.active && !reduce) {
        const distance = Math.hypot(px - char.cx, py - char.cy);
        target = clamp(1 - distance / radius, 0, 1);
        target = target * target * (3 - 2 * target);
      }
      char.hover = lerp(char.hover, target, Math.min(1, dt * 7));
      char.pulse = Math.max(0, char.pulse - dt * 2.4);
    }
    renderChars();
  });

  onTick((dt) => {
    const target = 1 + Math.min(3.2, Math.abs(state.vel) * 0.09 + (state.heroVisible ? state.ptr.speed * 0.0003 : 0));
    rate = lerp(rate, target, Math.min(1, dt * (target > rate ? 3 : 0.7)));
    wire.rate = rate;
  });

  ctx.hero = { hero, chars, wire, layoutHero, renderChars, getRate: () => rate };
  return ctx.hero;
}
