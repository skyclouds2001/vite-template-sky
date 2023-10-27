import { defineConfig } from 'rollup'
import babel from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.es.js',
      format: 'es',
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
    },
  ],
  external: ['kleur', 'prompts'],
  plugins: [
    babel({
      babelHelpers: 'bundled',
    }),
    typescript({
      sourceMap: false,
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src',
      exclude: ['node_modules/**/*', 'dist/**/*', 'tests/**/*'],
    }),
  ],
})
