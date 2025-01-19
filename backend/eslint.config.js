import baseConfig from '../eslint.config.js';

export default [
  ...baseConfig,
  {
    files: ['backend/**/*.ts'],
    rules: {
      // Добавьте специфичные для backend правила здесь
    },
  },
];
