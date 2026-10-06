import { clamp } from '../utils/math.js';
import { toBits } from '../utils/text.js';

export class Wire {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.reduceMotion = options.reduceMotion ?? false;
    this.color = options.color || '61,139,255';
    this.lineWidth = options.lineWidth || 2;
    this.gap = options.gap || 44;
    this.text = options.text || '';
    this.active = !options.idle;
    this.rate = 1;
    this.queue = [];
    this.current = { v: 1 };
    this.left = 0;
    this.charIndex = 0;
    this.head = 0;
    this.headCol = 0;
    this.base = 0;
    this.height = 30;
    this.pointer = null;
    this.onByte = null;
    this.onBit = null;
    this.resize();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const rect = this.canvas.getBoundingClientRect();
    this.width = Math.max(2, Math.round(rect.width));
    this.canvasHeight = Math.max(2, Math.round(rect.height));
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.canvasHeight * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.speed = clamp(this.width * 0.26, 200, 400);
    this.bitPx = clamp(this.width * 0.016, 12, 23);
    this.buffer = new Float32Array(this.width).fill(NaN);
    this.labels = new Array(this.width).fill(null);
    this.head = 0;
    this.headCol = 0;
  }

  reset() { this.buffer.fill(NaN); this.labels.fill(null); this.head = 0; this.headCol = 0; this.queue.length = 0; this.left = 0; }
  restart() { this.queue.length = 0; this.charIndex = 0; this.left = 0; }

  frame() {
    if (!this.active || !this.text) { this.queue.push({ v: 1 }); return; }
    const idx = this.charIndex % this.text.length;
    const char = this.text[idx];
    const bits = toBits(char);
    this.charIndex += 1;
    this.queue.push({ v: 0, ch: char, idx, bits });
    for (let i = 0; i < 8; i += 1) this.queue.push({ v: +bits[i], bit: i });
    this.queue.push({ v: 1, stop: true }, { v: 1 });
  }

  nextBit() {
    if (!this.queue.length) this.frame();
    this.current = this.queue.shift();
    this.left = this.bitPx / this.rate;
    if (this.current.ch !== undefined) this.onByte?.(this.current.ch, this.current.idx, this.current.bits);
    if (this.current.bit !== undefined) this.onBit?.(this.current.bit);
    if (this.current.stop) this.onBit?.(-1);
    return this.current.ch;
  }

  level() { return this.base + (this.current.v ? -this.height / 2 : this.height / 2); }

  step(dt) {
    const advance = Math.min(this.speed * dt, this.width * 0.5);
    const from = Math.floor(this.head);
    const to = Math.floor(this.head + advance);
    for (let x = from + 1; x <= to; x += 1) {
      const xi = x % this.width;
      let label = null;
      this.left -= 1;
      if (this.left <= 0) {
        const char = this.nextBit();
        if (char !== undefined && char !== ' ') label = char;
      }
      let y = this.level();
      if (this.pointer) {
        const dx = Math.abs(this.pointer.x - xi);
        const dy = Math.abs(this.pointer.y - this.base);
        if (dx < 150 && dy < 240) {
          const strength = (1 - dx / 150) * (1 - dy / 240);
          y += (Math.random() - 0.5) * this.height * 1.1 * strength;
        }
      }
      this.buffer[xi] = y;
      this.labels[xi] = label;
      const gapIndex = (xi + this.gap) % this.width;
      this.buffer[gapIndex] = NaN;
      this.labels[gapIndex] = null;
    }
    this.head += advance;
    if (this.head > this.width * 4096) this.head %= this.width;
    this.headCol = to % this.width;
  }

  fillStatic() {
    const byteCallback = this.onByte;
    const bitCallback = this.onBit;
    const active = this.active;
    this.onByte = null;
    this.onBit = null;
    this.active = true;
    this.reset();
    this.restart();
    for (let x = 0; x < this.width; x += 1) {
      this.left -= 1;
      if (this.left <= 0) {
        const char = this.nextBit();
        if (char !== undefined && char !== ' ') this.labels[x] = char;
      }
      this.buffer[x] = this.level();
    }
    this.headCol = this.width - 1;
    this.onByte = byteCallback;
    this.onBit = bitCallback;
    this.active = active;
  }

  draw() {
    const { ctx, width, canvasHeight, buffer, labels } = this;
    ctx.clearRect(0, 0, width, canvasHeight);
    const head = this.headCol;
    const chunk = 40;
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    for (let pass = 0; pass < 2; pass += 1) {
      ctx.lineWidth = pass ? this.lineWidth : this.lineWidth * 5;
      for (let k0 = 0; k0 < width; k0 += chunk) {
        const fraction = (k0 + chunk) / width;
        const alpha = pass ? 0.07 + 0.93 * fraction * fraction : 0.12 * fraction * fraction * fraction;
        ctx.strokeStyle = `rgba(${this.color},${alpha.toFixed(3)})`;
        ctx.beginPath();
        let pen = false;
        let prevX = -1;
        const k1 = Math.min(width - 1, k0 + chunk);
        for (let k = k0; k <= k1; k += 1) {
          const x = (head + 1 + k) % width;
          const y = buffer[x];
          if (Number.isNaN(y)) { pen = false; prevX = x; continue; }
          if (x < prevX) pen = false;
          if (!pen) { ctx.moveTo(x, y); pen = true; } else ctx.lineTo(x, y);
          prevX = x;
        }
        ctx.stroke();
      }
    }
    ctx.font = '500 12px "Fira Code", ui-monospace, monospace';
    ctx.textBaseline = 'bottom';
    const labelY = this.base - this.height / 2 - 9;
    for (let k = 0; k < width; k += 1) {
      const x = (head + 1 + k) % width;
      const char = labels[x];
      if (!char) continue;
      const fraction = (k + 1) / width;
      ctx.fillStyle = `rgba(${this.color},${(0.12 + 0.88 * fraction * fraction).toFixed(3)})`;
      ctx.fillText(char, x + 3, labelY);
    }
    const headY = buffer[head];
    if (!Number.isNaN(headY) && !this.reduceMotion) {
      ctx.fillStyle = `rgba(${this.color},.2)`; ctx.fillRect(head - 7, headY - 7, 14, 14);
      ctx.fillStyle = `rgba(${this.color},1)`; ctx.fillRect(head - 3, headY - 3, 6, 6);
    }
  }
}
