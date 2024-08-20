/// <reference types="vitest" />

import { fileURLToPath } from 'url'

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@app',
        replacement: fileURLToPath(new URL('app', import.meta.url)),
      },
      {
        find: '@tests',
        replacement: fileURLToPath(new URL('tests', import.meta.url)),
      },
    ],
  },
  test: {
    resolveSnapshotPath: (testPath, snapshotExtension) =>
      `./tests/snapshots/${testPath.split('/').at(-1)}${snapshotExtension}`,
    globals: true,
    environment: 'happy-dom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        '**/node_modules/**',
        '**/.next/**',
        '**/modules/**',
        '**/pages/**',
        '**/types/**',
        '**/constants/**',
        '**/tests/**',
        '**/index.ts',
        '**/*.config.ts',
        '**/*.config.js',
        '**/*.d.ts',
        '**/*.svg.*',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/*.stories.tsx',
        '**/*.skeleton.tsx',
        '**/.storybook/**',
        '**/storybook-static/**',
        '**/app/components/ui/**',
        '.eslintrc.cjs',
        'env.ts',
        'postcss.config.mjs',
        'next.config.mjs',
      ],
      all: true,
    },
    exclude: ['**/tests/**', '**/node_modules/**'],
  },
})
