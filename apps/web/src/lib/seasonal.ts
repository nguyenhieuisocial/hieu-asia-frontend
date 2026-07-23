// S10 — cơ chế mùa vụ cho các trang SEO theo thời điểm.
//
// Một số trang chỉ có nghĩa trong năm của chúng ("Tháng cô hồn 2026", "Xuất hành
// 2027"). Khi năm đó qua, trang thành lỗi thời: nó phải (1) tự chuyển hướng 308
// về bản evergreen tương ứng, và (2) rụng khỏi sitemap — nhưng KHÔNG xoá file
// (giữ backlink/SEO lịch sử; Next tự dựng redirect).
//
// LƯU Ý: trang tử vi theo năm (/tu-vi-2026, /tu-vi-2027) CỐ TÌNH không nằm ở đây
// — chúng còn giá trị tra cứu lại (người ta vẫn tìm "tử vi 2026" ở 2027), nên
// giữ sống + index bình thường.

export interface SeasonalPage {
  /** Từ ngày này (ISO, tính theo UTC) trở đi → 308 về `evergreen`. */
  redirectFrom: string;
  /** Trang evergreen thay thế khi hết mùa. */
  evergreen: string;
}

export const SEASONAL_PAGES: Record<string, SeasonalPage> = {
  '/thang-co-hon-2026': { redirectFrom: '2027-01-01', evergreen: '/lich-van-nien' },
  '/xuat-hanh-2027': { redirectFrom: '2028-01-01', evergreen: '/xuat-hanh' },
  // Dịp tình duyên. Thất Tịch 2026 = 7/7 âm = 19/8/2026; hết năm thì trỏ về
  // /hop-tuoi (tool evergreen mà trang này dẫn tới).
  '/that-tich-2026': { redirectFrom: '2027-01-01', evergreen: '/hop-tuoi' },
  // Valentine 2027 = 14/2/2027. Mùa vụ kết thúc sau ngày lễ, không cần đợi
  // hết năm — sau 01/3 thì trang thành lỗi thời.
  '/valentine-2027': { redirectFrom: '2027-03-01', evergreen: '/hop-tuoi' },
};

/**
 * Nếu `path` là trang mùa vụ đã qua thời điểm (>= redirectFrom) → trả về đích
 * evergreen để chuyển hướng; ngược lại (chưa tới hạn, hoặc không phải trang mùa
 * vụ) → null.
 */
export function expiredSeasonalTarget(path: string, now: Date = new Date()): string | null {
  const s = SEASONAL_PAGES[path];
  if (!s) return null;
  return now >= new Date(`${s.redirectFrom}T00:00:00Z`) ? s.evergreen : null;
}

// ── Cụm trang mùa vụ THEO THÁNG (/tu-vi-thang/…) ────────────────────
// Khác các trang ở trên: URL sinh theo lịch nên không liệt kê từng path được
// (SEASONAL_PAGES là bảng path cố định). Cùng ý tưởng: hết tháng → trang rụng
// khỏi sitemap + 308 về evergreen, file vẫn giữ nguyên.

/** Evergreen thay thế khi một trang tử vi tháng hết hạn. */
export const MONTHLY_EVERGREEN = '/tu-vi-hom-nay';

/**
 * Tháng (year, month 1–12) đã kết thúc so với `now` chưa?
 * Hết tháng = sang ngày 1 của tháng kế (giờ UTC — lệch tối đa 7h so với VN,
 * chấp nhận được vì trang chỉ rụng khỏi sitemap chứ không mất nội dung).
 */
export function monthEnded(year: number, month: number, now: Date = new Date()): boolean {
  return now >= new Date(Date.UTC(month === 12 ? year + 1 : year, month === 12 ? 0 : month, 1));
}

/** Trang tử vi tháng đã qua → đích evergreen để 308; còn hạn → null. */
export function expiredMonthTarget(
  year: number,
  month: number,
  now: Date = new Date(),
): string | null {
  return monthEnded(year, month, now) ? MONTHLY_EVERGREEN : null;
}
