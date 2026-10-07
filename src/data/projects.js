export const PROJECTS = [
  {
    slug: 'stack10', name: 'STACK10', kind: 'game engine client-side', areas: ['web', 'games'], viz: 'image', image: '/projects/stack10.png', featured: true,
    desc: 'Falling-block puzzle para navegador com simulação determinística a 120 Hz, replays compactos, desafio diário e progressão local. A engine separa simulação, renderização e input para que a mesma partida possa ser reproduzida apenas com seed e eventos por tick.',
    highlights: [
      'Simulação em fixed timestep de 120 Hz, 7-bag determinístico e replay baseado em seed + eventos de input por tick',
      'Maratona, Sprint 40, Blitz e desafio diário, com SRS, wall kicks, T-Spins, combos, back-to-back, perfect clears e finesse',
      'Teclado, Gamepad API e controles touch, com DAS, ARR e SDF configuráveis',
      'PWA offline, progresso e recordes no navegador, temas desbloqueáveis e áudio sintetizado com Web Audio API',
    ],
    stack: ['JavaScript', 'Canvas 2D', 'Web Audio API', 'Service Worker', 'Vite'],
    links: [{ label: 'Abrir demo', href: 'https://stack10.pedrobicas.com', demo: true }, { label: 'Ver código', href: 'https://github.com/pedrobicas/stack10' }],
  },
  {
    slug: 'faxina', name: 'Faxina', kind: 'utilitário local em Python', areas: ['ferramentas'], viz: 'image', image: '/projects/faxina.png', featured: true,
    desc: 'Ferramenta local para descobrir onde o armazenamento está sendo usado e liberar espaço com segurança. Analisa discos e pastas, encontra arquivos grandes, duplicados e diretórios regeneráveis e envia remoções para uma quarentena reversível.',
    highlights: [
      'Varredura iterativa com os.scandir e arrays compactos para manter baixo o uso de memória mesmo em árvores muito grandes',
      'Busca de duplicados em funil: tamanho, hard links, hash BLAKE2 parcial e somente então leitura completa do conteúdo',
      'Quarentena no mesmo disco, restauração sem sobrescrever arquivos existentes e bloqueio explícito de pastas críticas do sistema',
      'Servidor somente local em 127.0.0.1 com token por execução, validação de Host e interface responsiva em HTML, CSS e JavaScript puros',
    ],
    stack: ['Python', 'HTML', 'CSS', 'JavaScript', 'SQLite', 'PyInstaller'],
    links: [{ label: 'Ver código', href: 'https://github.com/pedrobicas/faxina' }],
  },
  {
    slug: 'crypto-analysis', name: 'Crypto Analysis', kind: 'dados e previsão', areas: ['dados-ia'], viz: 'crypto', featured: true,
    desc: 'Plataforma de análise técnica e previsão de criptomoedas. Coleta dados da CoinGecko, calcula indicadores, projeta preços com SARIMAX e mede o risco de cada investimento.',
    highlights: [
      'Indicadores técnicos como RSI, MACD, Bandas de Bollinger, ADX e OBV, com níveis de suporte e resistência identificados automaticamente',
      'Previsão de preços com SARIMAX, intervalos de confiança e backtesting para medir a precisão do modelo',
      'Simulação de investimento em uma ou várias moedas, com cenários otimista, realista e pessimista',
      'Análise de risco com VaR, maximum drawdown, Sharpe, Sortino e uma nota de risco de 0 a 10',
    ],
    stack: ['Python', 'Streamlit', 'Pandas', 'Plotly', 'statsmodels', 'CoinGecko API'],
    links: [{ label: 'Abrir demo', href: 'https://crypto-plataform.streamlit.app/', demo: true }, { label: 'Ver código', href: 'https://github.com/pedrobicas/crypto-platform' }],
  },
  {
    slug: 'chat-tempo-real', name: 'Chat em tempo real', kind: 'tempo real, full-stack', areas: ['web'], viz: 'chat',
    desc: 'Chat com sala pública e conversas privadas. O back-end em Spring Boot distribui as mensagens por WebSocket (STOMP), e o front em Angular mostra quem está online, quem está digitando e o que ainda não foi lido.',
    highlights: [
      'Mensagens públicas e privadas via WebSocket (STOMP), com filas por usuário para as conversas privadas',
      'Indicador de digitação, lista de usuários online e histórico de mensagens',
      'Contador de não lidas, menções e notificações de novas conversas',
      'Tema claro e escuro com CSS variables e layout responsivo',
    ],
    stack: ['Angular', 'TypeScript', 'RxJS', 'SCSS', 'Java', 'Spring Boot', 'WebSocket'],
    links: [{ label: 'Código do front-end', href: 'https://github.com/pedrobicas/web-realtime-chat' }, { label: 'Código do back-end', href: 'https://github.com/pedrobicas/java-realtime-chat' }],
  },
  {
    slug: 'my-spotify-universe', name: 'My Spotify Universe', kind: 'API e OAuth2', areas: ['web'], viz: 'universe',
    desc: 'Integração com a API do Spotify: login com OAuth2 e um painel com os dados da sua conta.',
    highlights: ['Login com a conta do Spotify via OAuth2', 'Painel com os dados da conta do usuário', 'Front-end em React e servidor em Node.js'],
    stack: ['React', 'Node.js', 'JavaScript', 'OAuth2'],
    links: [{ label: 'Abrir demo', href: 'https://my-universe-spotify.vercel.app/dashboard', demo: true }],
  },
  {
    slug: 'postlocal', name: 'Postlocal', kind: 'IA, full-stack', areas: ['web', 'dados-ia'], viz: 'post',
    desc: 'Plataforma que usa IA para criar conteúdo para negócios locais: posts para redes sociais, artigos de blog e campanhas de email, adaptados ao tipo de negócio, ao público e ao tom de voz.',
    highlights: [
      'Arquitetura em serviços: front em Next.js, API em Node.js com Express e um serviço de IA em FastAPI',
      'Vários provedores de IA, com Ollama rodando localmente e OpenAI, Google AI e Hugging Face como alternativas',
      'Planos de assinatura com Stripe e autenticação com JWT',
      'Previsão de desempenho para cada conteúdo gerado',
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'FastAPI', 'PostgreSQL', 'Stripe', 'Docker'],
    links: [{ label: 'Ver código', href: 'https://github.com/pedrobicas/postlocal' }],
  },
  {
    slug: 'pedrobicas-com', name: 'pedrobicas.com', kind: 'este site', areas: ['web'], viz: 'wire',
    desc: 'O portfólio que você está vendo: um sinal digital transmite meu nome em binário, e o resto do site é animado com GSAP e scroll suave.',
    highlights: ['Nome transmitido em binário num canvas, letra por letra', 'Rolagem horizontal, títulos que esticam com fonte variável e um terminal interativo', 'Respeita a preferência do sistema por menos movimento'],
    stack: ['React', 'Vite', 'JavaScript', 'GSAP', 'Lenis', 'Canvas'],
    links: [{ label: 'Ver código', href: 'https://github.com/pedrobicas/pedrobicas.dev' }],
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((project) => project.featured);
