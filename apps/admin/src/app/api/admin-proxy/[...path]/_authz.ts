// Phân quyền theo vai trò cho admin-proxy — TÁCH RA ĐỂ TEST ĐƯỢC.
//
// Vì sao tách: `requiredRank` là cổng an ninh DUY NHẤT (backend `requireAdmin`
// mù vai trò — proxy này bơm master token cho mọi phiên). Bất biến "endpoint tốn
// tiền/lộ PII phải yêu cầu quyền cao hơn" ĐÃ BỊ VI PHẠM HAI LẦN:
//   • admin/cockpit/attention lọt qua vì là GET (mặc định = viewer);
//   • admin/llm/probe (thêm 2026-07-21) đốt 3 lượt gọi LLM/request nhưng KHÔNG
//     được xếp loại — chính commit đặt ra bất biến này bị commit sau vi phạm sau
//     7 phút.
// Logic ở file route.ts không test được (Next chỉ cho export handler HTTP). Đưa
// ra đây để có test canh, và để lần vi phạm thứ ba bị chặn ngay ở CI.

export const ROLE_RANK = { viewer: 0, admin: 1, owner: 2 } as const;

// Owner cho MỌI method: secrets, quản lý admin-user, tiền, key, PII.
export const OWNER_PATH_PREFIXES = [
  'admin/secrets',
  'admin/users',
  'admin/ledger/journal',
  'admin/ledger/close',
  'ai/keys',
  'admin/sepay/refund',
  'admin/sepay/reconcile',
  'admin/sepay/drift/fix',
  'admin/infra/supabase/rows',
] as const;

// GET tốn tiền (gọi LLM tính phí) hoặc đắt — cần ÍT NHẤT admin, dù trả dữ liệu.
// Bất cứ endpoint nào tốn tiền/request phải nằm ở đây, bất kể method.
export const AI_SPEND_PATH_PREFIXES = [
  'admin/cockpit/attention', // GET → gom tín hiệu + tóm tắt qua AI gateway
  'admin/copilot/ask',       // POST (đã admin) — liệt kê cho tường minh
  'admin/llm/probe',         // GET → gọi thẳng 3 vendor LLM để đo (thêm 2026-07-22)
] as const;

/** True khi `path` bằng `prefix` hoặc là sub-path của nó (tôn trọng ranh giới '/'). */
export function underPrefix(path: string, prefix: string): boolean {
  return path === prefix || path.startsWith(prefix + '/');
}

/**
 * Quyền tối thiểu để chuyển tiếp một request.
 *   - GET (đọc)                     → viewer  (dashboard đọc được)
 *   - mutation (POST/PATCH/DELETE)  → admin
 *   - OWNER_PATH_PREFIXES, cấp quyền đọc-trả-phí, ghi settings phá tín hiệu → owner
 *   - AI_SPEND_PATH_PREFIXES        → admin (GET tốn tiền không phải đọc miễn phí)
 */
export function requiredRank(method: string, segments: string[]): number {
  const path = segments.join('/');
  if (OWNER_PATH_PREFIXES.some((p) => underPrefix(path, p))) return ROLE_RANK.owner;
  if (segments[0] === 'admin' && segments[1] === 'sessions' && segments[3] === 'access') {
    return ROLE_RANK.owner;
  }
  if (
    method !== 'GET' &&
    (path === 'admin/settings/alert-thresholds' || path === 'admin/settings/retention')
  ) {
    return ROLE_RANK.owner;
  }
  // Đặt TRƯỚC mặc định để thắng `GET → viewer`.
  if (AI_SPEND_PATH_PREFIXES.some((p) => underPrefix(path, p))) return ROLE_RANK.admin;
  // Mặc định: đọc mở cho viewer; mọi ghi cần admin.
  // ⚠️ FAIL-OPEN CÓ CHỦ ĐÍCH: lật mọi GET lạ thành admin sẽ âm thầm phá dashboard
  // viewer chưa liệt kê. Giảm nhẹ bằng các danh sách trên — thêm endpoint tốn
  // tiền/PII thì thêm vào danh sách trong CÙNG một thay đổi.
  return method === 'GET' ? ROLE_RANK.viewer : ROLE_RANK.admin;
}
