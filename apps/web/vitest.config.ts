import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Khớp alias "@/*" → "./src/*" của tsconfig.json. Thiếu dòng này, test nào import
  // một module app có "@/..." trong chuỗi import sẽ chết ngay lúc nạp
  // ("Cannot find package '@/lib/...'") — nên trước đây chỉ test được module lá.
  // Cần cho src/app/sitemap.guard.test.ts (import app/sitemap.ts).
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
