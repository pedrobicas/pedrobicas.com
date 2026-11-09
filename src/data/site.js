export const EMAIL = 'pedro.bicas14@gmail.com';

// Gerado por `npm run cv:pdf` a partir da página /curriculo.
export const CV_PDF = '/pedro-bicas-curriculo.pdf';

const PROJECT_BODY = [
  'Olá, Pedro.',
  '',
  'O que eu preciso:',
  '',
  'Prazo:',
  '',
  'Links de referência (se tiver):',
  '',
].join('\n');

// Email pré-preenchido: quem tem um projeto descreve por escrito o que precisa.
export const PROJECT_MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent('Sobre um projeto')}&body=${encodeURIComponent(PROJECT_BODY)}`;

export const SERVICES = [
  'Sistemas web sob medida: painéis, cadastros, áreas de cliente e integrações',
  'Sites e landing pages rápidos e preparados para o Google',
  'Assistentes com IA para atendimento e para consulta aos documentos da empresa',
];

export const SECTION_LINKS = [
  ['topo', 'Início'],
  ['sobre', 'Sobre'],
  ['stack', 'Stack'],
  ['trajetoria', 'Trajetória'],
  ['projetos', 'Projetos'],
  ['contato', 'Contato'],
];

export const AREAS = { web: 'Web', 'dados-ia': 'Dados e IA', games: 'Game / Engine', ferramentas: 'Ferramentas' };
