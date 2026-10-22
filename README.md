# Pedro Bicas — Portfólio

[![CI](https://github.com/pedrobicas/pedrobicas.com/actions/workflows/ci.yml/badge.svg)](https://github.com/pedrobicas/pedrobicas.com/actions/workflows/ci.yml)

Portfólio pessoal em React + Vite, com HTML pré-renderizado no build e uma camada de animação com GSAP e Lenis.

[**Abrir pedrobicas.com**](https://pedrobicas.com)

![Preview do portfólio](./public/portfolio-preview.png)

## Stack

- React 18 e Vite 6
- GSAP (ScrollTrigger) e Lenis para animação e rolagem
- SVG para as capas ilustradas dos projetos
- ESLint, Prettier, Node Test Runner e Playwright
- GitHub Actions e Dependabot

## Como funciona

- **Rotas reais.** Cada projeto tem uma URL própria (`/projetos/stack10`), além de `/projetos` e `/curriculo`. Links antigos no formato `#/projetos/...` são redirecionados.
- **Pré-renderização.** O build gera um `index.html` por rota, com título, descrição, canonical e Open Graph próprios, e um `sitemap.xml`. O conteúdo aparece mesmo sem JavaScript; no navegador, o React hidrata a página.
- **React e runtime.** O React renderiza a estrutura e o conteúdo, inclusive o painel de detalhe de cada projeto. O runtime (`src/runtime/`) cuida do que precisa de acesso direto ao DOM: animações, rolagem, medições de layout, cursor e transições entre os modos.
- **Acessibilidade.** Foco preso no painel de detalhe, navegação por teclado, `inert` fora do modal e respeito a `prefers-reduced-motion`.

Detalhes em [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## Estrutura

```text
src/
├── components/      # UI reutilizável, galeria, detalhe e currículo
├── sections/        # Seções da home
├── data/            # Projetos, stack, trajetória e constantes
├── state/           # Projeto selecionado (useSyncExternalStore)
├── hooks/           # Liga o lifecycle do React ao runtime
├── runtime/         # GSAP, Lenis, observers, cursor e navegação
├── utils/           # Funções puras
├── routing.js       # Rotas, usado no navegador, no build e nos testes
├── seo.js           # Título, descrição e imagem de cada rota
├── entry-server.jsx # Renderização no build
└── main.jsx         # Hidratação no navegador
scripts/
└── prerender.mjs    # Gera o HTML de cada rota e o sitemap
tests/
├── unit/            # Rotas, SEO, dados e utilitários
└── e2e/             # Fluxos em Chromium contra o build de produção
```

## Rodando localmente

Node `22.19.0` (ver `.nvmrc`).

```bash
npm ci
npm run dev       # desenvolvimento
npm run build     # build + pré-renderização em dist/
npm run preview   # serve dist/ como em produção
```

## Qualidade

```bash
npm run lint          # ESLint
npm run format:check  # Prettier
npm run test:unit     # testes sem navegador
npm run test:e2e      # Playwright (faz o build e testa o resultado)
npm run check         # lint + formatação + unit + build
npm run verify        # check + Chromium + e2e
```

O CI roda lint, formatação, testes unitários, build e os testes E2E.

## Deploy

`dist/` é estático. O host precisa servir `dist/projetos/stack10/index.html` para `/projetos/stack10`, o que Vercel, Netlify, Cloudflare Pages e GitHub Pages já fazem por padrão.

## Conteúdo

- `src/data/projects.js` — projetos, links e estudos de caso
- `src/data/stack.js` — tecnologias
- `src/data/journey.js` — trajetória
- `src/data/site.js` — email, seções e áreas

## Código e uso

O repositório é público para mostrar a implementação. **Não é open source e não tem licença de reutilização.**

© 2026 Pedro Bicas. Todos os direitos reservados.
