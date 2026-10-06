import js from '@eslint/js';
import globals from 'globals';
import jsxA11y from 'eslint-plugin-jsx-a11y-x';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'playwright-report', 'test-results', 'coverage']),
  {
    files: ['**/*.{js,jsx}'],
    ...jsxA11y.configs.recommended,
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ...jsxA11y.configs.recommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.nodeBuiltin,
      },
      parserOptions: {
        ...jsxA11y.configs.recommended.languageOptions?.parserOptions,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'jsx-a11y-x/no-autofocus': 'off',
    },
  },
]);
