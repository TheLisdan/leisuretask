import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import node from 'eslint-plugin-node';
import jest from 'eslint-plugin-jest';

export default [
  {
    ignores: ['node_modules', '**/dist/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: true,
        document: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      node: node,
      jest: jest,
    },
    rules: {
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: false,
            orderImportKind: 'asc',
          },
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      curly: ['error', 'all'],
      'no-irregular-whitespace': [
        'error',
        {
          skipTemplates: true,
          skipStrings: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-var-requires': 'error',
      'node/no-process-env': ['error'],
      'jest/no-focused-tests': 'error',
    },
  },
  {
    files: ['webapp/**/*.{ts,tsx}'],
    ignores: ['node_modules', '**/dist/**', '*.config.js'],
    rules: {
      'no-console': [
        'error',
        {
          allow: ['info', 'error', 'warn'],
        },
      ],
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@leisuretask/backend/**',
                '!@leisuretask/backend/**/',
                '!@leisuretask/backend/**/input',
              ],
              allowTypeImports: true,
              message:
                'Only types and input schemas are allowed to be imported from backend workspace',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: '[object.type=MetaProperty][property.name=env]',
          message: "Use instead import { env } from 'lib/env'",
        },
      ],
    },
  },
  {
    files: ['backend/**/*.ts'],
    ignores: ['node_modules', '**/dist/**'],
    rules: {
      'no-console': ['error'],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: '{.,..}/**/test/integration',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: '{.,..}/**/env',
              group: 'builtin',
              position: 'before',
            },
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: false,
            orderImportKind: 'asc',
          },
        },
      ],
    },
  },

  {
    files: ['shared/**/*.ts'],
    ignores: ['node_modules', '**/dist/**'],
    rules: {},
  },
];
