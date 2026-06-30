import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { NavigationService } from '../../services/navigation.service';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';
import { DynamicBackgroundComponent } from './components/dynamic-background/dynamic-background.component';
import { ExperienceSectionComponent } from './components/experience-section/experience-section.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { ProjectsSectionComponent } from './components/projects-section/projects-section.component';
import { SkillsSectionComponent } from './components/skills-section/skills-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeroSectionComponent,
    SkillsSectionComponent,
    ProjectsSectionComponent,
    ContactSectionComponent,
    ExperienceSectionComponent,
    DynamicBackgroundComponent
  ],
  templateUrl: './portifolio.component.html',
  styleUrls: ['./portifolio.component.scss']
})
export class PortifolioComponent implements AfterViewInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly navigationService = inject(NavigationService);
  private navigationSubscription?: Subscription;
  private intersectionObserver?: IntersectionObserver;
  private sectionElements: HTMLElement[] = [];
  private scrollRaf = 0;

  darkTheme = signal(true);
  activeSection = signal('home');
  isMobileMenuOpen = signal(false);
  submitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal('');
  isMobile = window.innerWidth <= 768;

  sectionIds = ['home', 'studio', 'skills', 'experience', 'projects', 'contact'];

  socialLinks = [
    { icon: 'fab fa-github', url: 'https://github.com/pedrobicas', label: 'GitHub' },
    { icon: 'fab fa-linkedin-in', url: 'https://linkedin.com/in/pedrobicas', label: 'LinkedIn' }
  ];

  studioOverview = {
    url: 'https://studio.pedrobicas.dev',
    title: 'Pedro Bicas Studio',
    subtitle: 'Projeto complementar para explorar direção visual, navegação e variações de apresentação.',
    description: 'O Studio existe como laboratório de apresentação visual. Ele ajuda a experimentar identidade, navegação e responsividade em demos publicadas, conectadas ao portfólio principal.',
    metrics: [
      { value: '6', label: 'demos publicadas' },
      { value: 'React + Vite', label: 'base do hub comercial' },
      { value: 'studio.pedrobicas.dev', label: 'domínio em produção' }
    ],
    demos: ['Aurora Dental', 'Forge Lab', 'Maison Orla', 'Obsidian Summit', 'Brasa Bento', 'Northline Advisory']
  };

  projects = [
    {
      name: 'Pedro Bicas Studio',
      tag: 'Commercial Lab',
      year: '2026',
      role: 'React + Vite',
      type: 'Hub de demos',
      impact: 'Laboratório de apresentação visual complementar ao portfólio principal.',
      description: 'Hub em studio.pedrobicas.dev com demos para saúde, fitness, decoração, eventos, gastronomia e consultoria B2B. Funciona como complemento visual e técnico do portfólio principal.',
      techs: ['React', 'Vite', 'CSS', 'Lucide', 'Vercel'],
      live: 'https://studio.pedrobicas.dev'
    },
    {
      name: 'Postlocal',
      tag: 'AI Content Ops',
      year: '2026',
      role: 'Full-stack',
      type: 'Produto SaaS',
      impact: 'Ferramenta para acelerar criação de conteúdo com revisão assistida.',
      description: 'Plataforma para planejar, gerar e revisar conteúdo de redes sociais com foco em fluxo simples e útil.',
      techs: ['React', 'Node', 'JavaScript', 'Python'],
      github: 'https://github.com/pedrobicas/postlocal'
    },
    {
      name: 'Crypto Analysis',
      tag: 'Data Product',
      year: '2025',
      role: 'Python app',
      type: 'Analytics',
      impact: 'Transforma dados em leitura visual de risco, tendência e simulação.',
      description: 'Dashboard de análise técnica com indicadores, previsão SARIMAX, simulação e integração com CoinGecko.',
      techs: ['Python', 'Streamlit', 'Pandas', 'Plotly', 'CoinGecko API'],
      github: 'https://github.com/pedrobicas/crypto-platform',
      live: 'https://crypto-plataform.streamlit.app/'
    },
    {
      name: 'Realtime Chat',
      tag: 'WebSocket System',
      year: '2025',
      role: 'Angular + Java',
      type: 'Sistema real-time',
      impact: 'Comunicação pública e privada com WebSocket e presença online.',
      description: 'Interface Angular e backend Spring Boot para chat em tempo real com STOMP/WebSocket e mensagens privadas.',
      techs: ['Angular', 'TypeScript', 'Java', 'Spring Boot', 'WebSocket', 'RxJS'],
      github: 'https://github.com/pedrobicas/web-realtime-chat'
    },
    {
      name: 'My Spotify Universe',
      tag: 'OAuth Experience',
      year: '2025',
      role: 'Frontend + API',
      type: 'Aplicação integrada',
      impact: 'Explora dados do Spotify em um dashboard logado.',
      description: 'Aplicação com autenticação OAuth2, consumo da API do Spotify e visualização dos dados do usuário.',
      techs: ['React', 'Node', 'JavaScript'],
      github: 'https://github.com/pedrobicas/my-spotify-universe',
      live: 'https://my-universe-spotify.vercel.app/dashboard'
    },
    {
      name: 'pedrobicas.dev',
      tag: 'Personal Brand',
      year: '2026',
      role: 'Angular',
      type: 'Portfolio',
      impact: 'Portfolio pessoal com foco em clareza, performance visual e contato.',
      description: 'Portfolio pessoal responsivo com seções editoriais, cases, timeline e formulário de contato.',
      techs: ['Angular', 'TypeScript', 'SCSS'],
      github: 'https://github.com/pedrobicas/pedrobicas.dev',
      live: 'https://pedrobicas.dev'
    }
  ];

  experiences = [
    {
      year: '2024-Atual',
      title: 'Bolsista em Desenvolvimento - INCOR',
      description: 'Desenvolvimento de sistemas para pesquisa no Hospital das Clínicas da FMUSP, com foco em aplicações web, APIs, dashboards e automações para fluxos clínicos.',
      type: 'Trabalho',
      details: [
        'Aplicações web para equipes de pesquisa',
        'APIs REST para integração entre sistemas',
        'Dashboards para visualização de dados clínicos'
      ],
      technologies: ['Python', 'Django', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'Linux', 'REST APIs']
    },
    {
      year: '2023-2026',
      title: 'Engenharia de Software - FIAP',
      description: 'Formação com foco em arquitetura, qualidade de código, produtos escaláveis e práticas modernas de entrega.',
      type: 'Formação',
      details: [
        'Arquitetura e padrões de projeto',
        'DevOps, CI/CD e testes automatizados',
        'Projetos enterprise com Java e Spring Boot'
      ],
      technologies: ['Java', 'Spring Boot', 'Angular', 'Python', 'Docker', 'Oracle', 'Maven', 'JUnit', 'AWS']
    },
    {
      year: '2021-2022',
      title: 'Técnico em Desenvolvimento de Sistemas - SENAI',
      description: 'Base técnica em programação, banco de dados, desenvolvimento web, versionamento e fundamentos de UX/UI.',
      type: 'Formação',
      details: [
        'Fundamentos de POO e estruturas de dados',
        'Modelagem e administração de bancos relacionais',
        'Desenvolvimento web responsivo'
      ],
      technologies: ['JavaScript', 'Node.js', 'React', 'MySQL', 'HTML5', 'CSS3', 'Git', 'Figma', 'Java']
    }
  ];

  skillCategories = [
    {
      name: 'Front-end',
      description: 'Interfaces responsivas, estado de aplicação e experiência de produto.',
      skills: [
        { name: 'Angular', icon: 'devicon-angularjs-plain' },
        { name: 'React', icon: 'devicon-react-original' },
        { name: 'TypeScript', icon: 'devicon-typescript-plain' },
        { name: 'JavaScript', icon: 'devicon-javascript-plain' },
        { name: 'HTML5', icon: 'devicon-html5-plain' },
        { name: 'CSS3', icon: 'devicon-css3-plain' },
        { name: 'Sass', icon: 'devicon-sass-original' }
      ]
    },
    {
      name: 'Back-end',
      description: 'APIs, regras de negócio, integrações e sistemas em tempo real.',
      skills: [
        { name: 'Node.js', icon: 'devicon-nodejs-plain' },
        { name: 'Java', icon: 'devicon-java-plain' },
        { name: 'Spring Boot', icon: 'devicon-spring-plain' },
        { name: 'Python', icon: 'devicon-python-plain' }
      ]
    },
    {
      name: 'Banco de Dados',
      description: 'Modelagem, consultas, persistência e leitura analítica.',
      skills: [
        { name: 'PostgreSQL', icon: 'devicon-postgresql-plain' },
        { name: 'MySQL', icon: 'devicon-mysql-plain' },
        { name: 'MongoDB', icon: 'devicon-mongodb-plain' }
      ]
    },
    {
      name: 'Operação',
      description: 'Entrega, versionamento, ambientes e rotina de desenvolvimento.',
      skills: [
        { name: 'Docker', icon: 'devicon-docker-plain' },
        { name: 'Git', icon: 'devicon-git-plain' },
        { name: 'Linux', icon: 'devicon-linux-plain' }
      ]
    }
  ];

  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(5)]],
    projectType: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
  });

  @ViewChild('homeSection') homeSection!: ElementRef<HTMLElement>;
  @ViewChild('studioSection') studioSection!: ElementRef<HTMLElement>;
  @ViewChild('skillsSection') skillsSection!: ElementRef<HTMLElement>;
  @ViewChild('experienceSection') experienceSection!: ElementRef<HTMLElement>;
  @ViewChild('projectsSection') projectsSection!: ElementRef<HTMLElement>;
  @ViewChild('contactSection') contactSection!: ElementRef<HTMLElement>;

  constructor() {
    this.setTheme();
    this.navigationSubscription = this.navigationService.navigation$.subscribe(sectionId => {
      this.scrollToSection(sectionId);
    });
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
    this.scrollToInitialHash();
  }

  ngOnDestroy(): void {
    this.navigationSubscription?.unsubscribe();
    this.intersectionObserver?.disconnect();
    if (this.scrollRaf) cancelAnimationFrame(this.scrollRaf);
  }

  getSectionDisplayName(sectionId: string): string {
    const names: Record<string, string> = {
      home: 'Início',
      studio: 'Studio',
      skills: 'Stack',
      experience: 'Experiência',
      projects: 'Cases',
      contact: 'Contato'
    };

    return names[sectionId] ?? sectionId;
  }

  scrollToSection(sectionId: string): void {
    this.isMobileMenuOpen.set(false);
    const element = document.getElementById(sectionId);
    if (!element) return;

    const top = element.getBoundingClientRect().top + window.scrollY - this.getHeaderOffset();
    this.activeSection.set(sectionId);
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    history.replaceState(null, '', `#${sectionId}`);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.isMobileMenuOpen.set(false);
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(isOpen => !isOpen);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.scrollRaf) return;
    this.scrollRaf = requestAnimationFrame(() => {
      this.updateActiveSectionFromScroll();
      this.scrollRaf = 0;
    });
  }

  onContactFormSubmit = (formData: unknown): void => {
    if (this.submitting()) return;

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.submitSuccess.set(false);
    this.submitError.set('');

    window.setTimeout(() => {
      console.info('Mensagem recebida pelo portfolio:', formData);
      this.submitSuccess.set(true);
      this.contactForm.reset({ projectType: '' });
      this.submitting.set(false);

      window.setTimeout(() => {
        this.submitSuccess.set(false);
      }, 4500);
    }, 700);
  };

  private setTheme(): void {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }

  private setupIntersectionObserver(): void {
    const sectionRefs = [
      this.homeSection,
      this.studioSection,
      this.skillsSection,
      this.experienceSection,
      this.projectsSection,
      this.contactSection
    ].filter(Boolean) as Array<ElementRef<HTMLElement>>;

    this.sectionElements = sectionRefs.map(section => section.nativeElement);
    this.homeSection?.nativeElement.classList.add('is-visible');

    this.intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });

      this.updateActiveSectionFromScroll();
    }, {
      root: null,
      rootMargin: '0px 0px -18% 0px',
      threshold: [0.08, 0.2, 0.42]
    });

    this.sectionElements.forEach(section => this.intersectionObserver?.observe(section));
    this.updateActiveSectionFromScroll();
  }

  private updateActiveSectionFromScroll(): void {
    if (!this.sectionElements.length) return;

    const anchor = window.scrollY + this.getHeaderOffset() + window.innerHeight * 0.3;
    let current = this.sectionElements[0];

    for (const section of this.sectionElements) {
      if (section.offsetTop <= anchor) {
        current = section;
      }
    }

    if (current?.id && current.id !== this.activeSection()) {
      this.activeSection.set(current.id);
    }
  }

  private getHeaderOffset(): number {
    const header = document.querySelector('.site-header') as HTMLElement | null;
    return (header?.offsetHeight || 76) + 14;
  }

  private scrollToInitialHash(): void {
    const hash = window.location.hash.replace('#', '');
    if (hash && this.sectionIds.includes(hash)) {
      window.setTimeout(() => this.scrollToSection(hash), 140);
    }
  }
}






