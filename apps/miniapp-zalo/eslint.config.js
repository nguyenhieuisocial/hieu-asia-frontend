// Minimal flat config — keeps the workspace `pnpm turbo lint` task green
// while the Zalo Mini App scaffold matures.
// TODO: tighten with react/hooks rules once full UI shipped.
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        navigator: 'readonly',
        process: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    rules: {},
  },
  {
    ignores: ['dist/**', 'node_modules/**', '.turbo/**'],
  },
];
