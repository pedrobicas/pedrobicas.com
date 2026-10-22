import { clamp, lerp } from '../utils/math.js';

export function setupHero(ctx) {
  const { $, $$, state, reduce, anim, on, onTick, addCleanup, ScrollTrigger } = ctx;
  const hero = $('#topo');
  const heroName = $('.hero-name');
  const rows = $$('.hero-name .row');
  const chars = [];
  const words = [];
  const line = { chars, budget: 0 };
  let motionGroups = words;
  let stacked = false;
  let baseWidth = 90;
  let x = 0,
    y = 0,
    targetX = 0,
    targetY = 0;
  let strength = 0;
  let over = false;
  let hint = null;
  let lastSpot = '';
  let scroll = 0;
  let nameWidth = 0;
  let fontScale = 1;

  rows.forEach((row) => {
    const text = row.textContent.trim();
    row.textContent = '';
    const word = document.createElement('span');
    word.className = 'word';
    const group = { chars: [], budget: 0 };
    for (const letter of text) {
      const element = document.createElement('span');
      element.className = 'char';
      element.textContent = letter;
      word.appendChild(element);
      const char = {
        element,
        intro: anim ? 0 : 1,
        motion: 0,
        w: -1,
        g: -1,
        o: -1,
        cy: 0,
        cx: 0,
        y: 0,
        velocity: 0,
        lastTransform: '',
        advance: 0,
        narrowSlope: 0,
        wideSlope: 0,
        weightAdvance: 0,
      };
      chars.push(char);
      group.chars.push(char);
    }
    row.appendChild(word);
    words.push(group);
  });

  function estimateAdvance(char, width, weight) {
    const slope = width < baseWidth ? char.narrowSlope : char.wideSlope;
    return char.advance + (width - baseWidth) * slope + ((weight - 750) / 150) * char.weightAdvance;
  }

  function renderChars() {
    for (const char of chars) {
      char.desiredWidth = baseWidth - 12 * (1 - char.intro) + char.motion * (stacked ? 10 : 14);
      char.desiredWeight = Math.round(630 + 120 * char.intro + 45 * char.motion);
    }
    // Redistribute real font width between neighbours, using advances measured only on resize.
    // This keeps the word inside its original footprint without scaling or overlapping glyphs.
    for (const word of motionGroups) {
      const widthAt = (char, compression) => clamp(char.desiredWidth - compression * (1 - char.motion * 0.8), 50, 150);
      const advanceAt = (compression) =>
        word.chars.reduce(
          (sum, char) => sum + estimateAdvance(char, widthAt(char, compression), char.desiredWeight),
          0,
        );
      let compression = 0;
      if (word.budget && advanceAt(0) > word.budget) {
        let low = 0,
          high = 100;
        for (let i = 0; i < 9; i += 1) {
          const middle = (low + high) / 2;
          if (advanceAt(middle) > word.budget) low = middle;
          else high = middle;
        }
        compression = high;
      }
      word.chars.forEach((char) => {
        char.width = widthAt(char, compression);
      });
    }
    for (const [index, char] of chars.entries()) {
      const width = Math.round(char.width * 10) / 10;
      const weight = char.desiredWeight;
      const opacity = Math.round(clamp(char.intro * 1.6, 0, 1) * 100);
      if (width !== char.w || weight !== char.g) {
        char.element.style.fontVariationSettings = `"wdth" ${width}, "wght" ${weight}`;
        char.w = width;
        char.g = weight;
      }
      if (opacity !== char.o) {
        char.element.style.opacity = opacity / 100;
        char.o = opacity;
      }
      const lift = reduce ? 0 : (1 - char.intro) * 22 + char.y - scroll * (6 + index * 0.25);
      const transform = Math.abs(lift) < 0.015 ? 'none' : `translate3d(0,${lift.toFixed(2)}px,0)`;
      if (transform !== char.lastTransform) {
        char.element.style.transform = transform;
        char.lastTransform = transform;
      }
    }
    words.forEach((word, index) => {
      const advances = word.chars.map((char) => estimateAdvance(char, char.w, char.g) * fontScale);
      let offset = index === 1 ? nameWidth - advances.reduce((sum, advance) => sum + advance, 0) : 0;
      word.chars.forEach((char, i) => {
        const next = `${offset.toFixed(1)}px`;
        if (next !== char.lastX) {
          char.element.style.setProperty('--glyph-x', next);
          char.lastX = next;
        }
        offset += advances[i];
      });
    });
  }

  function layoutHero() {
    if (!heroName.clientWidth) return;
    stacked = innerWidth < 700 || innerHeight > innerWidth * 1.15;
    heroName.classList.toggle('is-stacked', stacked);
    baseWidth = stacked ? 95 : 85;
    heroName.style.fontSize = '100px';
    chars.forEach((char) => {
      char.element.style.transform = 'none';
      const measure = (width, weight = 750) => {
        char.element.style.fontVariationSettings = `"wdth" ${width}, "wght" ${weight}`;
        return char.element.getBoundingClientRect().width;
      };
      char.advance = measure(baseWidth);
      char.narrowSlope = (char.advance - measure(50)) / (baseWidth - 50);
      char.wideSlope = (measure(150) - char.advance) / (150 - baseWidth);
      char.weightAdvance = measure(baseWidth, 900) - char.advance;
      measure(baseWidth);
      char.lastTransform = '';
      char.w = -1;
      char.g = -1;
    });
    const widths = words.map((word) => {
      word.budget = word.chars.reduce((sum, char) => sum + char.advance, 0);
      return word.budget;
    });
    line.budget = widths.reduce((sum, width) => sum + width, 0);
    motionGroups = stacked ? words : [line];
    const measured = stacked ? Math.max(...widths) : widths.reduce((sum, width) => sum + width, 0) + 19;
    const fit = (100 * heroName.clientWidth * 0.97) / measured;
    const size = Math.max(44, Math.min(fit, innerHeight * (stacked ? 0.245 : 0.34)));
    heroName.style.fontSize = `${size.toFixed(1)}px`;
    fontScale = size / 100;
    nameWidth = heroName.clientWidth;
    heroName.style.setProperty('--spot-radius', `${Math.max(105, size * 1.15).toFixed(1)}px`);
    const nameRect = heroName.getBoundingClientRect();
    chars.forEach((char) => {
      const rect = char.element.getBoundingClientRect();
      char.cx = rect.left + rect.width / 2 - nameRect.left;
      char.cy = rect.top + rect.height / 2 - nameRect.top;
      char.element.style.setProperty('--glyph-y', `${(rect.top - nameRect.top).toFixed(1)}px`);
    });
    renderChars();
  }

  function position(event) {
    if (reduce) return;
    const rect = heroName.getBoundingClientRect();
    targetX = event.clientX - rect.left;
    targetY = event.clientY - rect.top;
    if (!over && strength < 0.01) {
      x = targetX;
      y = targetY;
    }
    over = true;
    hint = null;
  }
  on(heroName, 'pointerenter', position, { passive: true });
  on(heroName, 'pointermove', position, { passive: true });
  on(heroName, 'pointerleave', () => {
    over = false;
  });
  on(heroName, 'pointerup', (event) => {
    if (event.pointerType !== 'mouse') over = false;
  });
  on(heroName, 'pointercancel', () => {
    over = false;
  });
  on(window, 'blur', () => {
    over = false;
  });

  if (anim) {
    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        scroll = self.progress;
      },
    });
    addCleanup(() => trigger.kill());
  }

  function hintPass() {
    if (!reduce && !over) hint = 0;
  }
  onTick((dt) => {
    if (!state.heroVisible || state.mode !== 'portfolio' || document.hidden) return;
    if (reduce) {
      renderChars();
      return;
    }
    const radius = parseFloat(heroName.style.getPropertyValue('--spot-radius')) || 180;
    let targetStrength = over ? 1 : 0;
    if (hint !== null) {
      hint += dt / 2.8;
      if (hint >= 1) hint = null;
      else {
        targetX = -radius + (heroName.clientWidth + radius * 2) * hint;
        targetY = heroName.clientHeight * (heroName.classList.contains('is-stacked') ? 0.18 + hint * 0.64 : 0.52);
        targetStrength = Math.sin(Math.PI * hint) * 0.5;
      }
    }
    for (const char of chars) {
      const distance = Math.hypot(targetX - char.cx, targetY - char.cy);
      const proximity = Math.max(0, 1 - distance / (radius * 1.15));
      const influence = over ? proximity * proximity * (3 - 2 * proximity) : 0;
      char.motion = lerp(char.motion, influence, 1 - Math.exp(-dt * 11));
      if (char.motion < 0.001) char.motion = 0;
      const target = -3 * char.motion;
      char.velocity = (char.velocity + (target - char.y) * 175 * dt) * Math.exp(-19 * dt);
      char.y += char.velocity * dt;
      if (Math.abs(char.y) < 0.008 && Math.abs(char.velocity) < 0.008) {
        char.y = 0;
        char.velocity = 0;
      }
    }
    renderChars();
    x = lerp(x, targetX, Math.min(1, dt * 10));
    y = lerp(y, targetY, Math.min(1, dt * 10));
    strength = lerp(strength, targetStrength, Math.min(1, dt * 7));
    if (strength < 0.001) strength = 0;
    const next = `${x.toFixed(1)}|${y.toFixed(1)}|${strength.toFixed(3)}`;
    if (next === lastSpot) return;
    lastSpot = next;
    heroName.style.setProperty('--spot-x', `${x.toFixed(1)}px`);
    heroName.style.setProperty('--spot-y', `${y.toFixed(1)}px`);
    heroName.style.setProperty('--spot-strength', strength.toFixed(3));
  });
  addCleanup(() => {
    ['font-size', '--spot-radius', '--spot-x', '--spot-y', '--spot-strength'].forEach((property) =>
      heroName.style.removeProperty(property),
    );
    chars.forEach(({ element }) =>
      ['transform', '--glyph-x', '--glyph-y'].forEach((property) => element.style.removeProperty(property)),
    );
  });
  ctx.hero = {
    hero,
    chars,
    layoutHero,
    renderChars,
    hintPass,
    getRate: () => 1 + Math.min(2, Math.abs(state.vel) * 0.06),
  };
  return ctx.hero;
}
