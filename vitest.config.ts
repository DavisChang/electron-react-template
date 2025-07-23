/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/e2e/**',
      '**/dist/**',
      '**/coverage/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'dist-electron/',
        'build/',
        'coverage/',
        'public/',
        'resources/',
        'e2e/',
        'scripts/',
        '**/__mocks__/**',
        '**/mocks/**',
      ],
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      // No coverage thresholds - focus on test quality over quantity
    },
  },
});
