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
