import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/tui/__tests__/**/*.{test,spec}.{js,jsx}'],
    exclude: ['tests/e2e/**', 'node_modules/**', 'lib/**'],
  },
  esbuild: {
    jsx: 'automatic',
  },
});
