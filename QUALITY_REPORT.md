# Quality report

Este arquivo registra as verificações feitas na refatoração do portfólio antes da publicação.

## Validado neste pacote

- Estrutura React/Vite modularizada por componentes, seções, dados, hooks, runtime e utilitários.
- React StrictMode ativado.
- Runtime visual com cleanup de listeners, observers, timers, Lenis, GSAP e ScrollTriggers.
- Ilustrações de projetos renderizadas como JSX/SVG, sem `dangerouslySetInnerHTML`.
- CSS visual original preservado byte a byte e protegido por teste de SHA-256.
- Imports relativos resolvidos estaticamente.
- Sintaxe/transpilação de todos os arquivos `.js` e `.jsx` validada.
- Testes unitários executados com sucesso.
- ESLint 10, React Hooks, acessibilidade estática, Prettier, Playwright, GitHub Actions e Dependabot configurados.
- Assets de SEO/social (`og.png`, `robots.txt`, `sitemap.xml`) incluídos.


## Correções da revisão 2.0.1

- ESLint atualizado para a linha 10, que rastreia referências JSX nativamente e elimina os falsos positivos de `no-unused-vars` vistos com ESLint 9.
- Plugin de acessibilidade migrado para `eslint-plugin-jsx-a11y-x`, compatível com ESLint 10.
- Helper `usePreview` renomeado para `shouldUsePreview`, pois não é um React Hook.
- Headings dinâmicos receberam conteúdo acessível estático sem mudança visual.
- Lenis atualizado para 1.3.26, removendo a dependência indireta descontinuada `@darkroom.engineering/tempus`.
- `allowScripts` autoriza explicitamente o postinstall do `esbuild` usado pelo Vite em npm 12.
- `npm run verify` instala/verifica o Chromium do Playwright automaticamente antes do E2E.

## Validação dependente do registry npm

O ambiente em que este pacote foi gerado não conseguiu alcançar o registry do npm; por isso não foi possível baixar `node_modules`, gerar um `package-lock.json` íntegro ou executar aqui os binários de Vite, ESLint, Prettier e Playwright.

Não foi criado um lockfile manual ou incompleto. Em uma máquina com acesso ao npm, rode:

```bash
npm install
npm run verify
```

O primeiro comando gera o `package-lock.json`. Depois de `npm run verify` passar, versione o lockfile antes de tornar o repositório público.
