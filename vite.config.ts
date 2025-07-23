/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';
import electron from 'vite-plugin-electron/simple';
import tsConfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'), // Main entry
        secondary: path.resolve(__dirname, 'secondary.html'), // Secondary HTML
      },
    },
  },
  test: {
    exclude: ['**/node_modules/**', '**/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'lcov', 'html', 'json'],
      reportsDirectory: './coverage',
      // No coverage thresholds - focus on test quality
      // Include source files for coverage even if not tested
      all: true,
      include: ['src/**/*.{ts,tsx}', 'electron/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'dist/',
        'dist-electron/',
        'e2e/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        'playwright-report/',
        'test-results/',
        'resources/',
        'public/',
        '**/*.stories.*',
        '**/index.html',
        '**/secondary.html',
        'src/main.tsx', // Entry point, usually minimal
        'src/Secondary.tsx', // Secondary entry
        'electron/main.ts', // Electron main process
        'electron/preload.ts', // Preload script
        '**/mocks/**',
        '**/__mocks__/**',
      ],
    },
    // Test environment configuration
    environment: 'jsdom',
    globals: true,
    setupFiles: [], // Add setup files if needed
    // Reporter configuration
    reporters: ['verbose', 'json', 'html'],
    outputFile: {
      json: './test-results/test-results.json',
      html: './test-results/test-results.html',
    },
  },
  plugins: [
    react(),
    tsConfigPaths(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: 'electron/main.ts',
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      // Ployfill the Electron and Node.js API for Renderer process.
      // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer:
        process.env.NODE_ENV === 'test'
          ? // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
            undefined
          : {},
    }),
    compression(),
  ],
});
