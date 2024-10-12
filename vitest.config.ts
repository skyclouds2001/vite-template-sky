import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [],
  test: {
    root: '.',
    include: ['tests/**'],
    exclude: ['node_modules/**', 'dist/**', '.{idea,fleet,vscode,git}/**', '*.config.*', '*.cache/**'],
    watch: false,
    environment: 'node',
    reporters: ['default', 'json', 'html'],
    outputFile: {
      json: './vitest-report/report.json',
      html: './vitest-report/report.html',
    },
    coverage: {
      provider: 'v8',
      enabled: true,
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage-report',
      include: ['src/**'],
      exclude: ['*.{test,spec}.*'],
    },
  },
})
