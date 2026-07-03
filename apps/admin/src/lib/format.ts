/**
 * Formatter dùng chung cho TOÀN BỘ app admin — nguồn duy nhất, đừng copy.
 *
 * Gom từ audit UX 2026-07-03 (69 bản formatter local trùng nhau). Chuẩn:
 *   - Tiền VND        → fmtVnd     → "1.234.567 ₫" (Intl vi-VN currency)
 *   - Ngày + giờ      → fmtDateTime → "14:05 3/7/26" (vi-VN short/short)
 *   - Ngày (không giờ) → fmtDate    → "3/7/26"
 *   - Tương đối       → fmtRelative → "vừa xong" / "5 phút trước" / "3 ngày trước"
 *   - Phần trăm       → fmtPct(ratio 0–1) → "12.3%"
 *   - Thời lượng      → fmtDuration(giây) → "45s" / "1m 23s"
 *   - Số trần vi-VN   → fmtNumber  → "1.234.567" (khi đơn vị nằm trong label)
 *
 * Ngoại lệ CỐ TÌNH không dùng module này (đừng "sửa" lại):
 *   - Chi phí LLM bằng USD (app/page.tsx fmtUsdSmall, ValidatorTab fmtUsd…) — giữ en-US $.
 *   - audit/format.ts fmtAuditDate — cần giây (timeStyle 'medium') cho forensics.
 *   - Trục chart rút gọn kiểu "1.2tr / 500k" (vndShort) — không phải chuẩn hiển thị tiền.
 */

export { formatDateOrEmpty, formatRelativeOrEmpty, isMissingDate } from './format-date';

type DateInput = string | number | Date | null | undefined;

function parseDate(input: string | number | Date): Date {
  let d = input instanceof Date ? input : new Date(input);
  // Backend sepay trả 'YYYY-MM-DD HH:mm:ss' (thiếu chữ T) — thử lại trước khi bỏ cuộc.
  if (Number.isNaN(d.getTime()) && typeof input === 'string' && input.includes(' ')) {
    d = new Date(input.replace(' ', 'T'));
  }
  return d;
}

/** Tiền VND → "1.234.567 ₫". Null/NaN → "—". */
export function fmtVnd(amount: number | null | undefined): string {
  if (amount == null || !Number.isFinite(amount)) return '—';
  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${Math.round(amount).toLocaleString('vi-VN')} ₫`;
  }
}

/** Ngày + giờ vi-VN short/short → "14:05 3/7/26". Null/rỗng → "—", parse fail → trả nguyên chuỗi. */
export function fmtDateTime(input: DateInput): string {
  if (input == null || input === '') return '—';
  const d = parseDate(input);
  if (Number.isNaN(d.getTime())) return String(input);
  try {
    return d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return String(input);
  }
}

/** Ngày (không giờ) vi-VN short → "3/7/26". Null/rỗng → "—". */
export function fmtDate(input: DateInput): string {
  if (input == null || input === '') return '—';
  const d = parseDate(input);
  if (Number.isNaN(d.getTime())) return String(input);
  try {
    return d.toLocaleDateString('vi-VN', { dateStyle: 'short' });
  } catch {
    return String(input);
  }
}

/** Thời gian tương đối kiểu VN: "vừa xong", "5 phút trước", "2 giờ trước", "3 ngày trước"… Thiếu → "". */
export function fmtRelative(input: DateInput): string {
  if (input == null || input === '') return '';
  const t = parseDate(input).getTime();
  if (Number.isNaN(t)) return '';
  const mins = Math.floor((Date.now() - t) / 60_000);
  if (mins < 1) return 'vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
  if (days < 365) return `${Math.floor(days / 30)} tháng trước`;
  return `${Math.floor(days / 365)} năm trước`;
}

/** Tỉ lệ 0–1 → "12.3%". digits mặc định 1. Null/NaN → "—". */
export function fmtPct(ratio: number | null | undefined, digits = 1): string {
  if (ratio == null || !Number.isFinite(ratio)) return '—';
  return `${(ratio * 100).toFixed(digits)}%`;
}

/** Thời lượng theo giây → "45s" / "1m 23s". Null → "—". */
export function fmtDuration(sec: number | null | undefined): string {
  if (sec == null) return '—';
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

/** Số trần vi-VN → "1.234.567" — dùng khi đơn vị đã nằm trong label. Null/NaN → "—". */
export function fmtNumber(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(n);
}
