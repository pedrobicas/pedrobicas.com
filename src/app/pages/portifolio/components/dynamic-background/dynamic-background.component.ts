import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface Shape {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  type: 'triangle' | 'square' | 'hexagon' | 'line';
}

@Component({
  selector: 'app-dynamic-background',
  standalone: true,
  template: `
    <div class="dynamic-background" aria-hidden="true">
      <canvas #backgroundCanvas></canvas>
      <div class="gradient-overlay"></div>
      <div class="floating-shape"></div>
      <div class="floating-shape"></div>
      <div class="floating-shape"></div>
    </div>
  `,
  styleUrls: ['./dynamic-background.component.scss']
})
export class DynamicBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('backgroundCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animationId = 0;
  private resizeRaf = 0;
  private particles: Particle[] = [];
  private shapes: Shape[] = [];
  private mouseX = 0;
  private mouseY = 0;
  private time = 0;
  private width = window.innerWidth;
  private height = window.innerHeight;
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private readonly colors = [
    'rgba(47, 111, 184, 0.2)',
    'rgba(79, 142, 232, 0.16)',
    'rgba(114, 167, 255, 0.11)',
    'rgba(231, 240, 255, 0.05)'
  ];

  private readonly handleResize = () => {
    if (this.resizeRaf) return;
    this.resizeRaf = requestAnimationFrame(() => {
      this.resizeCanvas();
      this.createParticles();
      this.createShapes();
      this.resizeRaf = 0;
    });
  };

  private readonly handleMove = (event: MouseEvent) => {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  };

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d', { alpha: true }) as CanvasRenderingContext2D;
    this.resizeCanvas();
    this.createParticles();
    this.createShapes();
    window.addEventListener('resize', this.handleResize, { passive: true });
    window.addEventListener('mousemove', this.handleMove, { passive: true });
    this.animate();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMove);
  }

  private get particleCount(): number {
    if (this.reducedMotion) return 10;
    return this.width < 768 ? 18 : 34;
  }

  private get shapeCount(): number {
    if (this.reducedMotion) return 2;
    return this.width < 768 ? 3 : 6;
  }

  private resizeCanvas(): void {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * ratio);
    this.canvas.height = Math.floor(this.height * ratio);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  private createParticles(): void {
    this.particles = Array.from({ length: this.particleCount }, () => this.createParticle());
  }

  private createShapes(): void {
    const types: Shape['type'][] = ['triangle', 'square', 'hexagon', 'line'];
    this.shapes = Array.from({ length: this.shapeCount }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: Math.random() * 56 + 24,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * (this.reducedMotion ? 0.001 : 0.004),
      opacity: Math.random() * 0.1 + 0.03,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      type: types[Math.floor(Math.random() * types.length)]
    }));
  }

  private createParticle(): Particle {
    const maxLife = Math.random() * 360 + 220;
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: (Math.random() - 0.5) * (this.reducedMotion ? 0.08 : 0.26),
      vy: (Math.random() - 0.5) * (this.reducedMotion ? 0.08 : 0.26),
      size: Math.random() * 1.8 + 0.6,
      opacity: Math.random() * 0.4 + 0.08,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      life: maxLife,
      maxLife
    };
  }

  private animate(): void {
    this.time += this.reducedMotion ? 0.004 : 0.016;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawParticles();
    this.drawShapes();
    if (!this.reducedMotion) {
      this.drawConnections();
      this.drawCursorGlow();
    }
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private drawParticles(): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > this.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.height) particle.vy *= -1;

      particle.life--;
      particle.opacity = (particle.life / particle.maxLife) * 0.42;

      this.ctx.save();
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fillStyle = particle.color;
      this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      this.ctx.restore();

      if (particle.life <= 0) {
        this.particles.splice(i, 1, this.createParticle());
      }
    }
  }

  private drawShapes(): void {
    for (const shape of this.shapes) {
      shape.rotation += shape.rotationSpeed;
      this.ctx.save();
      this.ctx.translate(shape.x, shape.y);
      this.ctx.rotate(shape.rotation);
      this.ctx.globalAlpha = shape.opacity;
      this.ctx.strokeStyle = shape.color;
      this.ctx.lineWidth = 1;
      this.drawShape(shape.type, shape.size);
      this.ctx.restore();

      shape.x += Math.sin(this.time * 0.7 + shape.rotation) * 0.08;
      shape.y += Math.cos(this.time * 0.55 + shape.rotation) * 0.06;
    }
  }

  private drawShape(type: Shape['type'], size: number): void {
    this.ctx.beginPath();

    if (type === 'triangle') {
      this.ctx.moveTo(0, -size / 2);
      this.ctx.lineTo(-size / 2, size / 2);
      this.ctx.lineTo(size / 2, size / 2);
      this.ctx.closePath();
    } else if (type === 'square') {
      this.ctx.rect(-size / 2, -size / 2, size, size);
    } else if (type === 'hexagon') {
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = Math.cos(angle) * size / 2;
        const y = Math.sin(angle) * size / 2;
        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.closePath();
    } else {
      this.ctx.moveTo(-size, 0);
      this.ctx.lineTo(size, 0);
    }

    this.ctx.stroke();
  }

  private drawConnections(): void {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 140) {
          this.ctx.save();
          this.ctx.globalAlpha = ((140 - distance) / 140) * 0.14;
          this.ctx.strokeStyle = 'rgba(47, 111, 184, 0.45)';
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
          this.ctx.restore();
        }
      }
    }
  }

  private drawCursorGlow(): void {
    if (!this.mouseX || !this.mouseY) return;

    const gradient = this.ctx.createRadialGradient(this.mouseX, this.mouseY, 0, this.mouseX, this.mouseY, 180);
    gradient.addColorStop(0, 'rgba(47, 111, 184, 0.14)');
    gradient.addColorStop(0.5, 'rgba(79, 142, 232, 0.07)');
    gradient.addColorStop(1, 'transparent');

    this.ctx.save();
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(this.mouseX - 180, this.mouseY - 180, 360, 360);
    this.ctx.restore();
  }
}
