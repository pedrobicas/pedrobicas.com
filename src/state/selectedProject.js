import { flushSync } from 'react-dom';
import { parseRoute } from '../routing.js';

// Projeto mostrado no painel de detalhe. O React renderiza o conteúdo a partir
// deste estado; o runtime só decide quando abrir, fechar e animar o painel.

const listeners = new Set();
let selected = readInitial();

function readInitial() {
  if (typeof document === 'undefined') return null;
  // Na hidratação, o estado inicial precisa ser o mesmo que gerou o HTML.
  if (document.getElementById('root')?.hasChildNodes()) {
    return document.getElementById('detalhe')?.dataset.slug || null;
  }
  return parseRoute(location.pathname).slug;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSelectedProject() {
  return selected;
}

// Usado na pré-renderização, antes de gerar o HTML de cada rota.
export function setInitialProject(slug) {
  selected = slug ?? null;
}

// Atualiza o DOM de forma síncrona para que o runtime possa medir o título e
// mover o foco logo em seguida.
export function showProject(slug) {
  if (slug === selected) return;
  flushSync(() => {
    selected = slug;
    listeners.forEach((listener) => listener());
  });
}
