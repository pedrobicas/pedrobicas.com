import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild, computed, signal } from '@angular/core';

interface SkillItem {
  name: string;
  icon: string;
}

interface SkillCategory {
  name: string;
  description: string;
  skills: SkillItem[];
}

@Component({
  selector: 'app-skills-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills-section.component.html',
  styleUrls: ['./skills-section.component.scss']
})
export class SkillsSectionComponent implements AfterViewInit, OnDestroy {
  @Input() skillCategories: SkillCategory[] = [];
  @ViewChild('skillsSection') skillsSection!: ElementRef<HTMLElement>;

  selectedCategory = signal('all');
  hoveredIndex = signal<number | null>(null);
  isVisible = signal(false);
  private observer?: IntersectionObserver;

  flatIcons = computed(() => {
    const skills: Array<SkillItem & { _category: string }> = [];
    this.skillCategories.forEach(category => {
      category.skills.forEach(skill => skills.push({ ...skill, _category: category.name }));
    });
    return skills;
  });

  filteredIcons = computed(() => {
    const category = this.selectedCategory();
    return category === 'all'
      ? this.flatIcons()
      : this.flatIcons().filter(skill => skill._category === category);
  });

  ngAfterViewInit(): void {
    const element = this.skillsSection?.nativeElement ?? document.querySelector('.skills-section');
    if (!element) return;

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isVisible.set(true);
          entry.target.classList.add('is-visible');
        }
      });
    }, { rootMargin: '0px 0px -15% 0px', threshold: 0.18 });

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  filterByCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  onIconEnter(index: number): void {
    this.hoveredIndex.set(index);
  }

  onIconLeave(): void {
    this.hoveredIndex.set(null);
  }
}
