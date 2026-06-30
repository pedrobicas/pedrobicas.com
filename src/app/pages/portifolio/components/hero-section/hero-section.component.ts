import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, inject } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  @Input() name = 'Pedro Bicas';
  @Input() role = 'Desenvolvedor Full-stack';
  @Input() socialLinks: { icon: string; url: string; label: string }[] = [];

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    const bounds = this.host.nativeElement.getBoundingClientRect();
    const x = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1);
    const y = Math.min(Math.max((event.clientY - bounds.top) / bounds.height, 0), 1);

    const style = this.host.nativeElement.style;
    style.setProperty('--mx', `${x * 100}%`);
    style.setProperty('--my', `${y * 100}%`);
    style.setProperty('--rx', `${(0.5 - y) * 4}deg`);
    style.setProperty('--ry', `${(x - 0.5) * 4}deg`);
  }

  @HostListener('pointerleave')
  onPointerLeave(): void {
    const style = this.host.nativeElement.style;
    style.setProperty('--mx', '50%');
    style.setProperty('--my', '50%');
    style.setProperty('--rx', '0deg');
    style.setProperty('--ry', '0deg');
  }
}
