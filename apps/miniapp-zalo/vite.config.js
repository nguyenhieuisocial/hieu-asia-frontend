import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Bản sao JS của vite.config.ts — chỉ để zmp-cli đọc được.
 *
 * zmp-cli@2.1.0 (build/index.js) hardcode
 * `configFile: path.join(cwd, 'vite.config.js')` khi gọi Vite build API —
 * không tự dò `vite.config.ts` như Vite CLI thường làm. Không sửa được
 * node_modules (bị ghi đè mỗi lần cài lại), nên phải có file .js này.
 *
 * `vite dev`/`vitest`/mọi lệnh khác trong repo vẫn dùng vite.config.ts như
 * cũ (Vite tự dò .ts trước). File này CHỈ được zmp-cli đọc.
 *
 * QUAN TRỌNG: sửa vite.config.ts thì phải sửa CẢ file này theo — hai file
 * phải luôn giống nhau. Không có bài test nào canh việc này.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
