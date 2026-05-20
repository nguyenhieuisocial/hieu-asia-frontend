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
 */
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
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
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**', '.turbo/**', 'next-env.d.ts'],
  },
];
