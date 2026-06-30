import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops';
}

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies?: string[];
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

interface Language {
  name: string;
  level: string;
}

@Component({
  selector: 'app-resume-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume-portfolio.component.html',
  styleUrl: './resume-portfolio.component.scss'
})
export class ResumePortfolioComponent {
  personalInfo = {
    name: 'Pedro Bicas',
    title: 'Desenvolvedor Full Stack',
    email: 'pedro.bicas14@gmail.com',
    phone: '+55 (11) 99358-5087',
    location: 'São Paulo, SP',
    linkedin: 'https://linkedin.com/in/pedrobicas',
    github: 'https://github.com/pedrobicas'
  };

  about = {
    summary: 'Estudante de Engenharia de Software na FIAP e técnico em Análise e Desenvolvimento de Sistemas pelo SENAI, com base sólida em desenvolvimento de software.',
    highlights: [
      'Aplicações web, APIs RESTful e dashboards em ambientes reais',
      'Experiência em Angular, ReactJS, Spring Boot e NodeJS',
      'Conhecimentos em bancos relacionais MySQL e PostgreSQL',
      'Familiaridade com Git, Docker e rotina de versionamento',
      'Bolsa Mérito na FIAP e 3º lugar no desafio Next 2024',
      'Perfil focado em evolução técnica, clareza e consistência'
    ]
  };

  skills: Skill[] = [
    { name: 'Angular', category: 'frontend' },
    { name: 'ReactJS', category: 'frontend' },
    { name: 'React Native', category: 'frontend' },
    { name: 'TypeScript', category: 'frontend' },
    { name: 'JavaScript', category: 'frontend' },
    { name: 'Bootstrap', category: 'frontend' },
    { name: 'Angular Material', category: 'frontend' },
    { name: 'HTML5', category: 'frontend' },
    { name: 'CSS3', category: 'frontend' },
    { name: 'SCSS', category: 'frontend' },
    { name: 'Java Spring', category: 'backend' },
    { name: 'Spring Boot', category: 'backend' },
    { name: 'Node.js', category: 'backend' },
    { name: 'Java', category: 'backend' },
    { name: 'Python', category: 'backend' },
    { name: 'APIs RESTful', category: 'backend' },
    { name: 'MySQL', category: 'database' },
    { name: 'PostgreSQL', category: 'database' },
    { name: 'Git', category: 'devops' },
    { name: 'GitHub', category: 'devops' },
    { name: 'Docker', category: 'devops' },
    { name: 'Linux', category: 'devops' },
    { name: 'SSH', category: 'devops' }
  ];

  languages: Language[] = [
    { name: 'Português', level: 'Nativo' },
    { name: 'Inglês', level: 'Básico' }
  ];

  experiences: Experience[] = [
    {
      title: 'Desenvolvedor Full Stack - Bolsista',
      company: 'InCor (Instituto do Coração)',
      period: '2024 - Presente',
      description: 'Desenvolvimento de aplicações web e APIs RESTful para sistemas, utilizando Angular no frontend e Spring Boot no backend.',
      technologies: ['Angular', 'Spring Boot', 'TypeScript', 'Java', 'PostgreSQL']
    }
  ];

  education = [
    {
      degree: 'Engenharia de Software',
      institution: 'FIAP',
      period: '2023 - 2026',
      status: 'Em andamento',
      achievements: ['Bolsa Mérito', '3º lugar no desafio Next 2024']
    },
    {
      degree: 'Técnico em Análise e Desenvolvimento de Sistemas',
      institution: 'SENAI',
      period: '2021 - 2022',
      status: 'Concluído',
      achievements: []
    }
  ];

  projects: Project[] = [
    {
      name: 'Postlocal',
      description: 'Plataforma para geração de conteúdo para redes sociais com IA.',
      technologies: ['React', 'Node', 'JavaScript', 'Python'],
      link: 'https://github.com/pedrobicas/postlocal'
    },
    {
      name: 'Crypto Analysis Platform',
      description: 'Plataforma para análise de criptomoedas com dados em tempo real, gráficos interativos e leitura visual de indicadores.',
      technologies: ['Python', 'Pandas', 'Matplotlib', 'Seaborn'],
      link: 'https://github.com/pedrobicas/crypto-platform'
    },
    {
      name: 'Real-time Chat Application',
      description: 'Aplicação de chat em tempo real com salas privadas, compartilhamento de arquivos e notificações.',
      technologies: ['React', 'Socket.io', 'Node.js', 'Express'],
      link: 'https://github.com/pedrobicas/realtime-chat'
    },
    {
      name: 'My Spotify Universe',
      description: 'Dashboard conectado à API do Spotify para visualização de estatísticas musicais e descoberta de novas músicas.',
      technologies: ['React', 'API', 'Chart.js', 'Styled Components'],
      link: 'https://github.com/pedrobicas/my-spotify-universe'
    }
  ];

  getSkillsByCategory(category: string): Skill[] {
    return this.skills.filter(skill => skill.category === category);
  }
}
