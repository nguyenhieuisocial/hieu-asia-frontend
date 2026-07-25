/**
 * birth-profile — "hồ sơ ngày sinh dùng chung" để khách nhập 1 lần ở bất kỳ công
 * cụ nào thì các công cụ khác tự điền, KHÔNG phải nhập lại.
 *
 * ⚠️ RANH GIỚI QUYỀN RIÊNG TƯ — ĐỌC TRƯỚC KHI SỬA (cập nhật 2026-07-25):
 *
 *   • KHÁCH CHƯA ĐĂNG NHẬP → **thuần máy, KHÔNG gửi đi đâu cả.** Đây là cam kết
 *     đang in trên trang tra cứu ("tính ngay trong trình duyệt"). Mọi hàm đồng bộ
 *     dưới đây đều đòi `userId` — không có thì KHÔNG có request nào rời máy.
 *     ĐỪNG bao giờ gọi chúng cho khách vãng lai.
 *
 *   • ĐÃ ĐĂNG NHẬP → hồ sơ được lưu vào tài khoản (qua `/api/user/preferences`)
 *     để dùng lại trên thiết bị khác. Cơ sở pháp lý: chính sách riêng tư `/privacy`
 *     ĐÃ liệt kê "ngày — tháng — năm — giờ sinh" trong dữ liệu thu thập cho tài
 *     khoản, và câu Hỏi–Đáp ở `/tra-cuu-tuoi` đã được sửa cho khớp (không còn nói
 *     "không lưu" chung chung). Founder chốt 25/07. Nếu ai đổi hành vi ở đây thì
 *     PHẢI sửa cả 2 chỗ đó — lệch nhau là nói sai với khách (Luật BVDLCN 91/2025:
 *     quyền được biết).
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
  /**
   * Epoch ms của lần ghi cuối. Dùng để hoà giải máy ↔ tài khoản khi đăng nhập:
   * bản MỚI HƠN thắng. Không có mốc này thì phải đoán, và đoán sai nghĩa là ghi
   * đè thứ khách vừa gõ.
   */
  updatedAt?: number;
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
    const next = { ...readBirthProfile(), ...patch, updatedAt: Date.now() };
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

// ── Đồng bộ với TÀI KHOẢN (chỉ khi đã đăng nhập) ────────────────────────────
//
// Dùng lại đường `/api/user/preferences` sẵn có (worker shallow-merge theo khoá)
// thay vì dựng đường đồng bộ thứ hai: một nguồn, một chỗ để rà quyền riêng tư.
// Mọi hàm dưới đây BEST-EFFORT: hỏng mạng / 401 / server lỗi đều im lặng bỏ qua,
// vì hồ sơ trên máy vẫn dùng được — đồng bộ hỏng KHÔNG được phép chặn công cụ.

const PREFS_URL = '/api/user/preferences';
const PREFS_KEY = 'birthProfile';

function isProfile(v: unknown): v is BirthProfile {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

/** Đẩy hồ sơ trên máy lên tài khoản. Chỉ gọi khi CHẮC CHẮN đã đăng nhập. */
export async function pushBirthProfileToAccount(profile: BirthProfile): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    await fetch(PREFS_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prefs: { [PREFS_KEY]: profile } }),
    });
  } catch {
    /* best-effort */
  }
}

/** Lấy hồ sơ đã lưu ở tài khoản. `null` khi chưa có / lỗi / chưa đăng nhập. */
export async function pullBirthProfileFromAccount(): Promise<BirthProfile | null> {
  if (typeof window === 'undefined') return null;
  try {
    const r = await fetch(PREFS_URL, { cache: 'no-store' });
    if (!r.ok) return null;
    const j = (await r.json()) as { ok?: boolean; preferences?: Record<string, unknown> };
    const p = j?.preferences?.[PREFS_KEY];
    return isProfile(p) ? p : null;
  } catch {
    return null;
  }
}

/**
 * Hoà giải máy ↔ tài khoản, gọi 1 lần khi biết người dùng đã đăng nhập.
 *
 * Luật hoà giải (cố ý đơn giản để đoán được kết quả):
 *   • chỉ 1 bên có dữ liệu  → bên đó thắng (bên kia được cập nhật)
 *   • cả hai đều có         → bản `updatedAt` MỚI HƠN thắng
 *   • không bên nào có mốc  → ưu tiên bản TRÊN MÁY (là thứ khách vừa dùng),
 *                             rồi đẩy lên — thà giữ cái khách vừa gõ.
 * Trả về `true` nếu hồ sơ trên máy bị thay đổi (để component báo cho UI biết).
 */
export async function reconcileBirthProfileWithAccount(): Promise<boolean> {
  const local = readBirthProfile();
  const remote = await pullBirthProfileFromAccount();
  const localHas = Object.keys(local).some((k) => k !== 'updatedAt');
  const remoteHas = !!remote && Object.keys(remote).some((k) => k !== 'updatedAt');

  if (!remoteHas) {
    if (localHas) await pushBirthProfileToAccount(local);
    return false;
  }
  if (!localHas) {
    saveBirthProfile(remote as BirthProfile);
    return true;
  }
  const lt = local.updatedAt ?? 0;
  const rt = remote!.updatedAt ?? 0;
  if (rt > lt) {
    saveBirthProfile(remote as BirthProfile);
    return true;
  }
  await pushBirthProfileToAccount(local);
  return false;
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
