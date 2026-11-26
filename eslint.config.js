import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const LIBRARY_IMPORTS = [
  { group: ['antd', 'antd/*'], message: 'Use o wrapper App* de src/ui. A lib so entra em src/ui.' },
  {
    group: ['@ant-design/icons', '@ant-design/icons/*'],
    message: 'Use a prop icon dos wrappers App*.',
  },
  {
    group: ['ng-zorro-antd', 'ng-zorro-antd/*'],
    message: 'Use o wrapper app-* de src/ui. A lib so entra em src/ui.',
  },
  {
    group: ['echarts', 'echarts/*', 'echarts-for-react', 'echarts-for-react/*', 'ngx-echarts'],
    message: 'Use AppChart.',
  },
];

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/storybook-static/**',
      '**/.angular/**',
      '**/out-tsc/**',
      'portable-dist/**',
      'coverage/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      '**/*.generated.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,mjs}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': 'error',
    },
  },
  {
    // Nada de import direto das bibliotecas fora de src/ui (padrao do dono: PADRAO-UI-ANTD.md).
    files: ['packages/*/src/**/*.{ts,tsx}', 'packages/*/.storybook/**/*.{ts,tsx}'],
    ignores: ['packages/*/src/ui/**'],
    rules: { 'no-restricted-imports': ['error', { patterns: LIBRARY_IMPORTS }] },
  },
  {
    files: ['packages/react/**/*.{ts,tsx}', 'portable-src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.ts', 'e2e/**/*.ts'],
    rules: { '@typescript-eslint/no-non-null-assertion': 'off' },
  },
  {
    files: ['packages/react/vitest.setup.ts'],
    rules: { '@typescript-eslint/no-empty-function': 'off' },
  },
);
