// @ts-check

const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = [
  // 1. Global ignores should be at the very top
  {
    ignores: ['eslint.config.js', 'build/**', 'scripts/**', 'node_modules/**'],
  },

  // 2. Base ESLint and TypeScript recommended configs
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. Prettier will override some formatting rules
  eslintPluginPrettierRecommended,

  // 4. Custom rules
  {
    rules: {
      curly: ['error', 'all'],
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
  },
];
