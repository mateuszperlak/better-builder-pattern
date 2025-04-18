import typescriptEslint from '@typescript-eslint/eslint-plugin'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory:     __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig:         js.configs.all,
})

export default [
  ...compat.extends(
    'standard',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser:      tsParser,
      ecmaVersion: 2023,
      sourceType:  'module',

      parserOptions: {
        project: 'tsconfig.json',
      },
    },

    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-non-null-assertion':         'off',
      '@typescript-eslint/unbound-method':                'off',
      '@typescript-eslint/require-await':                 'off',
      '@typescript-eslint/no-explicit-any':              'off',
      '@typescript-eslint/no-empty-interface':           'off',
      '@typescript-eslint/no-unused-vars':               ['warn', { 'argsIgnorePattern': '^_' }],
      camelcase:                                          0,
      'operator-linebreak':                               ['error', 'before'],
      'comma-dangle':                                     ['error', 'always-multiline'],
      'comma-spacing':                                    'off',
      'key-spacing':                                      [
        'error',
      ],
      'space-before-function-paren': 0,
      'no-useless-constructor':      0,
      indent:                        ['error', 2],
    },
  },
]
