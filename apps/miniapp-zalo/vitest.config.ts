import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Giống apps/web: môi trường `node`, không kéo jsdom vào chỉ để chạy vài bài.
// Bài nào cần `window` thì tự dựng một window tối thiểu (xem posthog.test.ts).
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
