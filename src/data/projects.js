export const PROJECTS = [
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
    slug: 'chat-tempo-real', name: 'Chat em tempo real', kind: 'tempo real, full-stack', areas: ['web'], viz: 'chat', featured: true,
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
    slug: 'my-spotify-universe', name: 'My Spotify Universe', kind: 'API e OAuth2', areas: ['web'], viz: 'universe', featured: true,
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
