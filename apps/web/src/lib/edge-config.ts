/**
 * Vercel Edge Config — wrapper dùng chung cho toàn app web.
 *
 * Trước đây chỉ có `lib/reasoning/runtime-config.ts` đọc Edge Config, và nó
 * chỉ phục vụ riêng nhánh reasoning. Mọi cờ vận hành khác (killswitch từng
 * tính năng, maintenance mode) không có chỗ đọc chuẩn → file này là nguồn duy
 * nhất cho các cờ đó.
 *
 * Nguyên tắc:
 *   - KHÔNG BAO GIỜ throw. Edge Config chưa cấu hình (local dev), mất mạng,
 *     hay key sai kiểu → trả về giá trị mặc định do caller truyền vào.
 *   - Fail SAFE = mặc định "tắt": killswitch mặc định false, maintenance mặc
 *     định false. Một sự cố Edge Config không được tự nó làm sập site.
 *   - Cache 30 giây trong từng instance Function để bật/tắt có hiệu lực trong
 *     vòng nửa phút mà không phải gọi Edge Config mỗi request.
 *
 * Cách bật (không cần deploy lại): thêm key vào Edge Config store
 *   killswitch_mentor      = true
 *   killswitch_tuvi        = true
 *   killswitch_mentor_reason = "AI vendor đang lỗi, tạm dừng 30 phút"
 *   maintenance_mode       = true
 */

import { get } from '@vercel/edge-config';

const CACHE_TTL_MS = 30_000;

const cache = new Map<string, { value: unknown; expiresAt: number }>();

/**
 * Đọc một key bất kỳ trong Edge Config, có kiểm kiểu tại runtime.
 *
 * `fallback` quyết định kiểu trả về: giá trị đọc được chỉ được dùng khi
 * `typeof` của nó trùng với `typeof fallback`, nên một key bị nhập sai kiểu
 * trong dashboard không thể lọt vào code.
 */
export async function getEdgeConfigValue<T extends string | number | boolean>(
  key: string,
  fallback: T,
): Promise<T> {
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.expiresAt > now) return hit.value as T;

  let value: T = fallback;
  try {
    const raw = await get(key);
    if (typeof raw === typeof fallback) value = raw as T;
  } catch {
    // Edge Config chưa cấu hình hoặc lỗi tạm thời → giữ fallback.
  }

  cache.set(key, { value, expiresAt: now + CACHE_TTL_MS });
  return value;
}

/** Các tính năng có nút tắt khẩn riêng. */
export type KillswitchFeature = 'mentor' | 'tuvi';

export interface KillswitchState {
  active: boolean;
  /** Lý do hiển thị cho người dùng khi nút tắt đang bật. */
  reason: string;
}

const DEFAULT_KILLSWITCH_REASON =
  'Tính năng này đang tạm dừng để bảo trì. Bạn vui lòng quay lại sau ít phút.';

/**
 * Nút tắt khẩn cho một tính năng tốn tiền AI. Dùng khi chi phí vượt ngưỡng
 * hoặc worker quá tải: route gọi hàm này và trả 503 thay vì gọi model.
 */
export async function isKillswitchActive(
  feature: KillswitchFeature,
): Promise<KillswitchState> {
  const active = await getEdgeConfigValue(`killswitch_${feature}`, false);
  if (!active) return { active: false, reason: '' };
  const reason = await getEdgeConfigValue(
    `killswitch_${feature}_reason`,
    DEFAULT_KILLSWITCH_REASON,
  );
  return { active: true, reason: reason || DEFAULT_KILLSWITCH_REASON };
}

/** Cờ chặn toàn site (dùng khi DB sập) — middleware đọc cờ này. */
export async function isMaintenanceMode(): Promise<boolean> {
  return getEdgeConfigValue('maintenance_mode', false);
}

/** Test-only: xoá cache để test không ảnh hưởng lẫn nhau. */
export function _resetEdgeConfigCache(): void {
  cache.clear();
}
