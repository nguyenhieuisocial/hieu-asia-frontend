/**
 * Canonical agent prompt roles — MỘT nguồn dùng chung cho cả trang danh sách
 * `/prompts` và trang chi tiết `/prompts/[role]`.
 *
 * Trước đây mỗi trang giữ một mảng `ROLES` riêng → thêm role ở backend mà quên
 * một trang là role mới không hiện (list) hoặc bị chặn "không tồn tại" (detail).
 * Gom về đây để chỉ cần sửa một chỗ.
 *
 * PHẢI khớp `PROMPT_ROLES` trong worker (backend/prompts/index.ts):
 *  - 9 role pipeline + 2 standalone (kể từ #348/#351)
 *  - 5 công cụ tính cách/tarot + Cẩm Nang Cuộc Đời (kể từ #353, 2026-07-04)
 */
export const PROMPT_ROLES = [
  'vision',
  'logic',
  'psychology',
  'alignment',
  'report',
  'mentor',
  'judge',
  'decisions',
  'ops_copilot',
  'mbti',
  'disc',
  'enneagram',
  'bigfive',
  'tarot',
  'life_manual',
] as const;

export type PromptRole = (typeof PROMPT_ROLES)[number];
