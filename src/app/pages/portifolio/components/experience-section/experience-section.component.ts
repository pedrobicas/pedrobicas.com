import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild, signal } from '@angular/core';

interface Experience {
  year: string;
  title: string;
  description: string;
  type?: string;
  technologies?: string[];
  details?: string[];
}

@Component({
  selector: 'app-experience-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience-section.component.html',
  styleUrls: ['./experience-section.component.scss']
})
export class ExperienceSectionComponent implements AfterViewInit, OnDestroy {
  @Input() experiences: Experience[] = [];
  @ViewChild('timelineContainer') timelineContainer!: ElementRef<HTMLElement>;

  isVisible = signal(false);
  animatedIndexes = signal<Set<number>>(new Set());
  private observer?: IntersectionObserver;
  private timers: number[] = [];

  ngAfterViewInit(): void {
    const element = this.timelineContainer?.nativeElement ?? document.querySelector('.experience-section');
    if (!element) return;

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isVisible.set(true);
          this.revealItems();
          entry.target.classList.add('is-visible');
        }
      });
    }, { rootMargin: '0px 0px -15% 0px', threshold: 0.18 });

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.timers.forEach(timer => clearTimeout(timer));
  }

  isExperienceAnimated(index: number): boolean {
    return this.animatedIndexes().has(index);
  }

  private revealItems(): void {
    if (!this.isVisible()) return;

    this.timers.forEach(timer => clearTimeout(timer));
    this.timers = [];

    this.experiences.forEach((_, index) => {
      const timer = window.setTimeout(() => {
        const current = new Set(this.animatedIndexes());
        current.add(index);
        this.animatedIndexes.set(current);
      }, index * 180);
      this.timers.push(timer);
    });
  }
}
