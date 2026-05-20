/**
 * Shared ESLint preset for hieu.asia frontend monorepo.
 * Apps extend this via `extends: ['@hieu-asia/config/eslint']`.
 */
module.exports = {
  extends: [
    'next/core-web-vitals',
    'next/typescript',
    'prettier',
  ],
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
  ignorePatterns: ['.next', 'node_modules', 'dist', '.turbo', 'next-env.d.ts'],
};
