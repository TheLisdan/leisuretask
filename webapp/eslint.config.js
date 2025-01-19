import baseConfig from '../eslint.config.js';

export default [
  ...baseConfig,
  {
    files: ['webapp/**/*.{ts,tsx}'],
    rules: {
      // Добавьте специфичные для webapp правила здесь
    },
  },
];
