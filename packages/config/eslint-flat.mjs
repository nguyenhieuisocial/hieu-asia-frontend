/**
 * Shared ESLint v9 flat preset for hieu.asia frontend monorepo.
 *
 * Apps consume this via:
 *
 *   import preset from '@hieu-asia/config/eslint-flat';
 *   export default preset;
 *
 * Uses FlatCompat to bridge `eslint-config-next` (still legacy-format) into
 * ESLint v9 flat-config land. Mirrors the legacy preset rules.
 *
 * Wave 60.70: registers local `rsc-discipline/no-server-to-client-function-prop`
 * rule from `./eslint-rules/`. See that file's header for full rationale.
 */
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import noServerToClientFunctionProp from './eslint-rules/no-server-to-client-function-prop.mjs';
import noSearchParamsInChildrenWrapper from './eslint-rules/no-search-params-in-children-wrapper.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const rscDisciplinePlugin = {
  rules: {
    'no-server-to-client-function-prop': noServerToClientFunctionProp,
    'no-search-params-in-children-wrapper': noSearchParamsInChildrenWrapper,
  },
};

export default [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      'rsc-discipline': rscDisciplinePlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      'react/no-unescaped-entities': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      // Wave 60.70 — RSC discipline: ban non-serializable JSX prop values
      // (inline arrow fns, Lucide icon refs) that crash the Server→Client
      // RSC boundary. See packages/config/eslint-rules/ for the rule.
      'rsc-discipline/no-server-to-client-function-prop': 'error',
      // Hydration discipline: ban useSearchParams() inside a {children}-wrapping
      // component — it intermittently de-opts hydration of the whole route.
      // Isolate it in a Suspense-wrapped leaf. See PR #470 + the rule's header.
      'rsc-discipline/no-search-params-in-children-wrapper': 'error',
    },
  },
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      '.turbo/**',
      'next-env.d.ts',
      'storybook-static/**',
    ],
  },
];
