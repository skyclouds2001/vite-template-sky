import js from '@eslint/js'
import globals from 'globals'
import standard from 'eslint-config-standard'
import prettier from 'eslint-config-prettier'
import nodePlugin from 'eslint-plugin-n'
import promisePlugin from 'eslint-plugin-promise'
import importPlugin from 'eslint-plugin-import'
import jsdocPlugin from 'eslint-plugin-jsdoc'
import vitestPlugin from 'eslint-plugin-vitest'
import typescript from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...typescript.configs.recommended,
  ...typescript.configs.stylistic,
  nodePlugin.configs['flat/recommended'],
  promisePlugin.configs['flat/recommended'],
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  jsdocPlugin.configs['flat/recommended-typescript'],
  {
    name: 'custom',
    files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
    ignores: [],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.es2025,
        ...globals.browser,
        ...globals.worker,
        ...globals.serviceworker,
        ...globals.node,
        ...globals.commonjs,
      },
      parser: typescript.parser,
      parserOptions: {
        ecmaFeatures: {
          globalReturn: false,
          impliedStrict: true,
          jsx: true,
        },
      },
    },
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: 'warn',
    },
    plugins: {},
    rules: {
      ...standard.rules,
      'n/no-missing-import': 'off',
      'n/no-missing-require': 'off',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          directory: 'tsconfig.json',
        },
        node: true,
      },
    },
  },
  {
    name: 'custom-tests',
    files: ['**/tests/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    ...vitestPlugin.configs.recommended,
  },
  {
    name: 'custom-ignore',
    ignores: ['node_modules/**', 'dist/**', '.{idea,fleet,vscode,git}/**', '*.config.*', '*.cache/**'],
  },
  prettier,
]
