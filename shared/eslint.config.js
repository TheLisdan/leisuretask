import baseConfig from '../eslint.config.js';

export default [
  ...baseConfig,
  {
    files: ['shared/**/*.ts'],
    rules: {
      // Добавьте специфичные для shared правила здесь
    },
  },
];
