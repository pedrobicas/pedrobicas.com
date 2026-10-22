import { PROJECT_MEDIA } from './projectMedia.js';

export const PROJECTS = [
  {
    slug: 'stack10',
    name: 'STACK10',
    kind: 'game engine client-side',
    areas: ['web', 'games'],
    featured: true,
    study: {
      problem: 'Construir um puzzle em que regras, controles e replay não dependam da taxa de quadros do navegador.',
      decision:
        'Separar a simulação em ticks fixos de 120 Hz e registrar seed + ações por tick; isso permite verificar o mesmo estado a partir da mesma sequência de entrada.',
      check: 'Veja no repositório como a seed e os eventos por tick permitem reproduzir uma partida.',
    },
    desc: 'Falling-block puzzle para navegador com simulação determinística a 120 Hz, replays compactos, desafio diário e progressão local. A engine separa simulação, renderização e input para que a mesma partida possa ser reproduzida apenas com seed e eventos por tick.',
    highlights: [
      'Simulação em fixed timestep de 120 Hz, 7-bag determinístico e replay baseado em seed + eventos de input por tick',
      'Maratona, Sprint 40, Blitz e desafio diário, com SRS, wall kicks, T-Spins, combos, back-to-back, perfect clears e finesse',
      'Teclado, Gamepad API e controles touch, com DAS, ARR e SDF configuráveis',
      'PWA offline, progresso e recordes no navegador, temas desbloqueáveis e áudio sintetizado com Web Audio API',
    ],
    stack: ['JavaScript', 'Canvas 2D', 'Web Audio API', 'Service Worker', 'Vite'],
    links: [
      { label: 'Abrir demo', href: 'https://stack10.pedrobicas.com', demo: true },
      { label: 'Ver código', href: 'https://github.com/pedrobicas/stack10' },
    ],
  },
  {
    slug: 'faxina',
    name: 'Faxina',
    kind: 'utilitário local em Python',
    areas: ['ferramentas'],
    featured: true,
    study: {
      problem: 'Identificar arquivos que ocupam espaço sem transformar a limpeza em uma ação irreversível.',
      decision:
        'Filtrar possíveis duplicados por tamanho e hashes antes de ler o conteúdo completo; mover remoções para quarentena reversível, com bloqueios para diretórios críticos.',
      check:
        'Teste o cenário de restaurar arquivos com nomes conflitantes e analise como a ferramenta impede a remoção de pastas protegidas.',
    },
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
    slug: 'crypto-analysis',
    name: 'Crypto Analysis',
    kind: 'dados e previsão',
    areas: ['dados-ia'],
    featured: true,
    study: {
      problem: 'Distinguir previsões de preços de uma análise que também considere incerteza e risco.',
      decision:
        'Combinar projeções SARIMAX com intervalos de confiança, backtesting e indicadores de risco como drawdown e VaR.',
      check: 'Veja a implementação do backtesting e os critérios usados para avaliar as previsões.',
    },
    desc: 'Plataforma de análise técnica e previsão de criptomoedas. Coleta dados da CoinGecko, calcula indicadores, projeta preços com SARIMAX e mede o risco de cada investimento.',
    highlights: [
      'Indicadores técnicos como RSI, MACD, Bandas de Bollinger, ADX e OBV, com níveis de suporte e resistência identificados automaticamente',
      'Previsão de preços com SARIMAX, intervalos de confiança e backtesting para medir a precisão do modelo',
      'Simulação de investimento em uma ou várias moedas, com cenários otimista, realista e pessimista',
      'Análise de risco com VaR, maximum drawdown, Sharpe, Sortino e uma nota de risco de 0 a 10',
    ],
    stack: ['Python', 'Streamlit', 'Pandas', 'Plotly', 'statsmodels', 'CoinGecko API'],
    links: [
      { label: 'Abrir demo', href: 'https://crypto-plataform.streamlit.app/', demo: true },
      { label: 'Ver código', href: 'https://github.com/pedrobicas/crypto-platform' },
    ],
  },
  {
    slug: 'chat-tempo-real',
    name: 'Chat em tempo real',
    kind: 'tempo real, full-stack',
    areas: ['web'],
    featured: true,
    study: {
      problem: 'Manter comunicação entre usuários, com atualização rápida de conversas públicas e privadas.',
      decision:
        'Usar Spring Boot e WebSocket/STOMP para distribuir mensagens, enquanto Angular organiza a interface e os estados de presença, digitação e não lidas.',
      check: 'Veja como o Angular trata presença e digitação e como o Spring Boot distribui mensagens via STOMP.',
    },
    desc: 'Chat com sala pública e conversas privadas. O back-end em Spring Boot distribui as mensagens por WebSocket (STOMP), e o front em Angular mostra quem está online, quem está digitando e o que ainda não foi lido.',
    highlights: [
      'Mensagens públicas e privadas via WebSocket (STOMP), com filas por usuário para as conversas privadas',
      'Indicador de digitação, lista de usuários online e histórico de mensagens',
      'Contador de não lidas, menções e notificações de novas conversas',
      'Tema claro e escuro com CSS variables e layout responsivo',
    ],
    stack: ['Angular', 'TypeScript', 'RxJS', 'SCSS', 'Java', 'Spring Boot', 'WebSocket'],
    links: [
      { label: 'Código do front-end', href: 'https://github.com/pedrobicas/web-realtime-chat' },
      { label: 'Código do back-end', href: 'https://github.com/pedrobicas/java-realtime-chat' },
    ],
  },
  {
    slug: 'my-spotify-universe',
    name: 'My Spotify Universe',
    kind: 'API e OAuth2',
    areas: ['web'],
    desc: 'Integração com a API do Spotify: login com OAuth2 e um painel com os dados da sua conta.',
    highlights: [
      'Login com a conta do Spotify via OAuth2',
      'Painel com os dados da conta do usuário',
      'Front-end em React e servidor em Node.js',
    ],
    stack: ['React', 'Node.js', 'JavaScript', 'OAuth2'],
    links: [
      { label: 'Abrir demo', href: 'https://my-universe-spotify.vercel.app/dashboard', demo: true },
      { label: 'Ver código', href: 'https://github.com/pedrobicas/my-universe-spotify' },
    ],
  },
  {
    slug: 'postlocal',
    name: 'Postlocal',
    kind: 'IA, full-stack',
    areas: ['web', 'dados-ia'],
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
    slug: 'pedrobicas-com',
    name: 'pedrobicas.com',
    kind: 'este site',
    areas: ['web'],
    desc: 'Este portfólio. Páginas pré-renderizadas no build, com rota própria para cada projeto, e uma camada de animação com GSAP e Lenis sobre componentes React.',
    highlights: [
      'HTML gerado no build para cada rota, com título e prévia de compartilhamento por projeto',
      'Detalhe dos projetos renderizado pelo React; animações, rolagem e medições ficam em módulos de runtime com cleanup',
      'Testes unitários e E2E com Playwright no CI, contra o build de produção',
      'Respeita a preferência do sistema por menos movimento',
    ],
    stack: ['React', 'Vite', 'JavaScript', 'GSAP', 'Lenis', 'Playwright'],
    links: [{ label: 'Ver código', href: 'https://github.com/pedrobicas/pedrobicas.com' }],
  },
].map((project) => {
  const media = PROJECT_MEDIA[project.slug];
  return media ? { ...project, image: media.cover, media } : project;
});

export const FEATURED_PROJECTS = PROJECTS.filter((project) => project.featured);
