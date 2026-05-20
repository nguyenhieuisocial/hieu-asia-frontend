import { defineConfig } from 'vite';
import path from 'node:path';

/**
 * Vite config for Zalo Mini App.
 *
 * zmp-cli wraps Vite internally; this config layers in workspace aliases so
 * `@hieu-asia/*` packages resolve from source without an extra build step.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@hieu-asia/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
      '@hieu-asia/types': path.resolve(__dirname, '../../packages/types/src/index.ts'),
      '@hieu-asia/api-client': path.resolve(__dirname, '../../packages/api-client/src/index.ts'),
    },
  },
  server: {
    port: 3003,
  },
});
