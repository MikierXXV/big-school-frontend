/**
 * ============================================
 * VITEST CONFIGURATION
 * ============================================
 *
 * Configuracion de Vitest para tests unitarios y de integracion.
 * Alineado con TDD y Clean Architecture.
 */

import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],

  test: {
    environment: 'jsdom',
    include: ['tests/**/*.{test,spec}.ts'],
    exclude: ['tests/e2e/**/*', 'node_modules'],
    globals: true,

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules',
        'tests',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/index.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },

    testTimeout: 10000,
    hookTimeout: 10000,
  },

  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, './src/domain'),
      '@application': path.resolve(__dirname, './src/application'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@presentation': path.resolve(__dirname, './src/presentation'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
});
