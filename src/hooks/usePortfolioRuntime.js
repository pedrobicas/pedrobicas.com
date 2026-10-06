import { useLayoutEffect } from 'react';
import { initPortfolioRuntime } from '../runtime/initPortfolioRuntime.js';

export function usePortfolioRuntime() {
  useLayoutEffect(() => initPortfolioRuntime(), []);
}
