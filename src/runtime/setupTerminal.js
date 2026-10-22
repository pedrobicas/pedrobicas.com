import { EMAIL } from '../data/site.js';
import { PROJECTS } from '../data/projects.js';
import { STACK } from '../data/stack.js';
import { normalizeCommand } from '../utils/text.js';
import { ROUTES } from '../routing.js';

export function setupTerminal(ctx) {
  const { $, $$, on, reduce, timeout } = ctx;
  const output = $('.term-out');
  output.textContent = '';
  const form = $('.term-form');
  const input = $('#term-in');
  const history = [];
  let historyIndex = 0;

  function print(text, className = '') {
    const line = document.createElement('div');
    line.className = `tl ${className}`;
    if (text instanceof Node) line.appendChild(text);
    else line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function link(label, href) {
    const fragment = document.createDocumentFragment();
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.textContent = label;
    if (href.startsWith('http')) {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }
    fragment.appendChild(anchor);
    return fragment;
  }

  const sections = {
    sobre: 'sobre',
    stack: 'stack',
    trajetoria: 'trajetoria',
    projetos: 'projetos',
    contato: 'contato',
    inicio: 'topo',
    '~': 'topo',
    '..': 'topo',
  };
  function goTo(id) {
    const target = document.getElementById(id);
    if (!target) return;
    if (ctx.lenis) ctx.lenis.scrollTo(target, { duration: 1.6 });
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }

  function run(raw) {
    const command = normalizeCommand(raw);
    const echo = document.createElement('span');
    const prompt = document.createElement('b');
    prompt.textContent = 'pedro@bicas:~$ ';
    echo.append(prompt, raw);
    print(echo, 'echo');
    if (!command) return;
    history.push(raw);
    historyIndex = history.length;
    const [name, ...rest] = command.split(/\s+/);
    const arg = rest.join(' ');
    switch (name) {
      case 'help':
      case 'ajuda':
        print(
          'comandos:\n  whoami      quem sou eu\n  ls          seções do site\n  cd <seção>  vai até a seção (ex.: cd projetos)\n  stack       o que eu uso\n  projetos    abre a galeria de projetos\n  contato     como falar comigo\n  curriculo   abre o currículo\n  clear       limpa a tela',
        );
        break;
      case 'whoami':
        print('Pedro Bicas. Desenvolvedor full-stack, de São Paulo. Estudo Engenharia de Software na FIAP.');
        break;
      case 'ls':
        print('sobre/  stack/  trajetoria/  projetos/  contato/', 'hl');
        break;
      case 'cd': {
        const id = sections[arg.replace(/\/$/, '')];
        if (id) {
          print(`indo para ~/${id === 'topo' ? '' : id}`);
          goTo(id);
        } else print(`cd: ${arg || '?'}: diretório não encontrado. tente ls`);
        break;
      }
      case 'stack':
        print(STACK.map((group) => group.label.padEnd(12) + group.items.join(', ')).join('\n'));
        break;
      case 'projetos':
      case 'projects':
      case 'galeria':
        print(`${PROJECTS.map((project) => project.name).join(', ')}\nabrindo a galeria`);
        timeout(() => ctx.go?.(ROUTES.projetos), 400);
        break;
      case 'contato':
      case 'contact':
      case 'email': {
        const fragment = document.createDocumentFragment();
        fragment.append(
          'email: ',
          link(EMAIL, `mailto:${EMAIL}`),
          '\nlinkedin: ',
          link('linkedin.com/in/pedrobicas', 'https://linkedin.com/in/pedrobicas'),
          '\ngithub: ',
          link('github.com/pedrobicas', 'https://github.com/pedrobicas'),
        );
        print(fragment);
        break;
      }
      case 'github':
        print(link('github.com/pedrobicas', 'https://github.com/pedrobicas'));
        break;
      case 'linkedin':
        print(link('linkedin.com/in/pedrobicas', 'https://linkedin.com/in/pedrobicas'));
        break;
      case 'curriculo':
      case 'cv':
      case 'resume':
        print('abrindo o currículo');
        timeout(() => ctx.go?.(ROUTES.cv), 300);
        break;
      case 'oi':
      case 'ola':
      case 'hello':
      case 'hi':
        print('oi! digite help para ver o que dá para fazer aqui.');
        break;
      case 'clear':
      case 'limpar':
        output.textContent = '';
        break;
      case 'date':
      case 'data':
        print(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
        break;
      default:
        print(`comando não encontrado: ${name}. digite help`);
    }
  }

  print('bem-vindo. digite help ou toque num comando abaixo.', 'hl');
  on(form, 'submit', (event) => {
    event.preventDefault();
    const value = input.value;
    input.value = '';
    run(value);
  });
  on(input, 'keydown', (event) => {
    if (event.key === 'ArrowUp' && history.length) {
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = history[historyIndex];
      event.preventDefault();
    }
    if (event.key === 'ArrowDown' && history.length) {
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.value = history[historyIndex] || '';
      event.preventDefault();
    }
  });
  $$('.term-chips button').forEach((button) => on(button, 'click', () => run(button.dataset.cmd)));

  ctx.terminal = { run };
  return ctx.terminal;
}
