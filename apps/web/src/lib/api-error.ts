/**
 * Map an error thrown by a tool's fetch call to a user-friendly Vietnamese
 * message. Network/CORS failures surface in the browser as
 * `TypeError: Failed to fetch` (Chrome appends the host) — opaque + scary.
 * A common cause on hieu.asia is the api.hieu.asia edge rate-limit returning a
 * non-CORS 429 when the visitor clicks through tools quickly. App-thrown errors
 * (validation, "không tính được kết quả", HTTP status messages) keep their own
 * message — only the raw network failure + unknown cases get rewritten.
 */
export function describeApiError(e: unknown): string {
  const msg = e instanceof Error ? e.message : typeof e === 'string' ? e : '';
  if (/failed to fetch|networkerror|load failed|fetch failed/i.test(msg)) {
    return 'Không kết nối được máy chủ. Có thể bạn thao tác hơi nhanh (hệ thống đang giới hạn lượt) — vui lòng đợi vài giây rồi thử lại.';
  }
  return msg || 'Đã có lỗi xảy ra, vui lòng thử lại sau ít phút.';
}
