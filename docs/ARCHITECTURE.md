# Arquitetura

## Objetivo

A arquitetura separa a estrutura declarativa do React da camada imperativa necessária para uma interface com GSAP, ScrollTrigger, Lenis, Canvas, SVG e medições de layout. O objetivo não é eliminar acesso direto ao DOM a qualquer custo, e sim restringi-lo aos lugares em que ele é apropriado.

## Camada declarativa

`components/` e `sections/` descrevem o DOM estável da aplicação. Projetos, stack e trajetória são renderizados a partir de `data/`, sem duplicar conteúdo dentro da lógica de animação.

As capas dos projetos são componentes React/SVG. Preview e detalhe mantêm versões pré-renderizadas das ilustrações e o runtime apenas alterna qual está ativa, evitando geração de HTML por string e `dangerouslySetInnerHTML`.

## Runtime visual

`runtime/` concentra integrações com APIs imperativas. `createRuntimeContext` fornece seletores, estado efêmero, timers, listeners, ticker e registro centralizado de cleanup. Cada módulo configura uma responsabilidade visual específica.

`initPortfolioRuntime` compõe esses módulos e devolve uma única função de cleanup. `usePortfolioRuntime` conecta esse ciclo ao `useLayoutEffect` do React.

## Lifecycle e StrictMode

A aplicação é montada dentro de `React.StrictMode`. Isso ajuda a revelar efeitos sem cleanup durante desenvolvimento. Listeners, observers, timeouts, intervals, Lenis e ticker do GSAP são registrados no contexto e liberados quando a árvore desmonta.

## Dados

`data/` é a única fonte de verdade para conteúdo repetível. A home, a galeria e o painel de detalhes consomem os mesmos objetos de projeto, reduzindo o risco de informações divergentes.

## Qualidade

O projeto usa quatro camadas complementares:

1. ESLint para erros de JavaScript, Hooks, Fast Refresh e acessibilidade estática.
2. Prettier para consistência de formatação, com exceção deliberada do CSS visual legado aprovado.
3. `node:test` para funções puras, invariantes dos dados e integridade do CSS.
4. Playwright para fluxos críticos no navegador.

O teste de integridade de `styles.css` usa SHA-256. Se o arquivo mudar, o teste falha e força uma decisão explícita sobre a alteração visual.
