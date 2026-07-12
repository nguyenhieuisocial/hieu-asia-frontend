/**
 * birth-profile — "hồ sơ ngày sinh dùng chung" lưu TRÊN MÁY (localStorage) để
 * khách nhập 1 lần ở bất kỳ công cụ nào thì các công cụ khác tự điền, KHÔNG phải
 * nhập lại. Thuần client, KHÔNG gửi máy chủ — khớp cam kết "tính trong trình
 * duyệt, không lưu server" của các trang tra cứu.
 *
 * Shape đầy đủ (ngày/giờ/giới tính) để dùng lại cho mọi tool: tool chỉ cần năm
 * thì đọc `year`; tool cần ngày-giờ (lá số) đọc thêm. Cụm đầu (Slice A) mới ghi
 * year + gender; các trường còn lại để dành cho cụm sau (lá số Bát Tự/Tử Vi).
 *
 * Đồng bộ giữa các component đang mở nhờ CustomEvent `hieu:birth-profile-change`.
 */

export type BirthGender = 'nam' | 'nu';

export interface BirthProfile {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  gender?: BirthGender;
  /** 'duong' = dương lịch · 'am' = âm lịch (mặc định coi như dương nếu thiếu) */
  calendar?: 'duong' | 'am';
}

const KEY = 'hieu:birth-profile';
export const BIRTH_PROFILE_EVENT = 'hieu:birth-profile-change';

/** Đọc hồ sơ đã lưu. Trả về {} khi chưa có / lỗi / chạy phía server. */
export function readBirthProfile(): BirthProfile {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as BirthProfile) : {};
  } catch {
    return {};
  }
}

/** Gộp thêm thông tin vào hồ sơ (chỉ ghi đè trường được truyền vào). */
export function saveBirthProfile(patch: BirthProfile): void {
  if (typeof window === 'undefined') return;
  try {
    const next = { ...readBirthProfile(), ...patch };
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(BIRTH_PROFILE_EVENT, { detail: next }));
  } catch {
    /* localStorage đầy / bị chặn → bỏ qua, không chặn luồng chính */
  }
}

/** Xoá toàn bộ hồ sơ đã lưu (quyền riêng tư của khách). */
export function clearBirthProfile(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent(BIRTH_PROFILE_EVENT, { detail: {} }));
  } catch {
    /* ignore */
  }
}
