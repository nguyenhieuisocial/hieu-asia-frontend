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

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * Hồ sơ → cặp ('YYYY-MM-DD', 'HH:mm') để đổ thẳng vào form lá số.
 *
 * Trả null khi hồ sơ mới chỉ có NĂM (cụm công cụ tra theo tuổi chỉ ghi year +
 * gender) — lá số cần đủ ngày/tháng nên không được đoán bừa. Giờ thiếu thì lấy
 * 12:00, đúng quy ước "không nhớ giờ sinh" đang dùng khắp site.
 */
export function birthProfileToDateTime(
  p: BirthProfile,
): { date: string; time: string } | null {
  if (!p.year || !p.month || !p.day) return null;
  // Lá số tính theo dương lịch; hồ sơ ghi âm lịch thì KHÔNG tự đổ vào form
  // (đổi lịch là việc của engine, đoán ở đây sẽ ra lá số sai).
  if (p.calendar === 'am') return null;
  return {
    date: `${p.year}-${pad2(p.month)}-${pad2(p.day)}`,
    time: `${pad2(p.hour ?? 12)}:${pad2(p.minute ?? 0)}`,
  };
}

/**
 * Ghi ngày 'YYYY-MM-DD' + giờ 'HH:mm' (dương lịch) vào hồ sơ dùng chung, để
 * công cụ khác tự điền. Chuỗi sai định dạng thì bỏ qua, không ghi rác.
 */
export function saveBirthDateTime(
  date: string,
  time: string,
  gender: BirthGender,
): void {
  const d = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(date);
  if (!d) return;
  const t = /^(\d{1,2}):(\d{2})$/.exec(time);
  saveBirthProfile({
    year: Number(d[1]),
    month: Number(d[2]),
    day: Number(d[3]),
    hour: t ? Number(t[1]) : 12,
    minute: t ? Number(t[2]) : 0,
    gender,
    calendar: 'duong',
  });
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
