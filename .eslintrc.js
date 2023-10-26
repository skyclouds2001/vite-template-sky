module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
  },
  extends: ['eslint:recommended', 'standard-with-typescript', 'plugin:@typescript-eslint/recommended', 'plugin:n/recommended', 'plugin:promise/recommended', 'plugin:import/recommended', 'plugin:import/typescript', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: 'tsconfig.json',
    tsconfigRootDir: '.',
  },
  plugins: [],
  ignorePatterns: ['.eslintrc.js'],
  globals: {},
  rules: {
    'n/no-missing-import': 'off',
    'n/no-missing-require': 'off',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        directory: 'tsconfig.json',
      },
    },
  },
  overrides: [
    {
      files: ['**/?(*.){test,spec}.?(c|m)[jt]s?(x)'],
      extends: ['plugin:vitest/recommended'],
    },
  ],
}
