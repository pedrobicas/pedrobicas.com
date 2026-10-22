import { useEffect, useLayoutEffect } from 'react';
import { initPortfolioRuntime } from '../runtime/initPortfolioRuntime.js';

// useLayoutEffect no navegador (antes da pintura); no servidor, nenhum efeito roda.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function usePortfolioRuntime() {
  useIsomorphicLayoutEffect(() => initPortfolioRuntime(), []);
}
