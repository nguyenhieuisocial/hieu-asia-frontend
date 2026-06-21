/**
 * Hướng & giờ xuất hành — engine deterministic, GROUNDED.
 *
 * Tái dùng `gio-hoang-dao.ts` (đã khớp lịch vạn niên hieu.asia + có test) để lấy
 * Can-Chi NGÀY và giờ hoàng đạo. Phần thêm ở đây là hai bảng phương vị truyền
 * thống tính theo THIÊN CAN của ngày:
 *
 *  - Hỷ Thần (喜神): khẩu quyết cổ 《考原》 "Giáp Kỷ tại Cấn (Đông Bắc), Ất Canh
 *    Càn (Tây Bắc), Bính Tân Khôn (Tây Nam), Đinh Nhâm Ly (Chính Nam), Mậu Quý
 *    Tốn (Đông Nam)". Đồng thuận tuyệt đối giữa nguồn Việt + Trung (đã loại 1
 *    nguồn chép sai hoán đổi Ất/Canh↔Bính/Tân).
 *
 *  - Tài Thần (財神): dùng bản LỊCH VẠN NIÊN VIỆT NAM (phân biệt từng can, 7
 *    hướng — không dùng Đông Bắc). 3 nguồn VN độc lập (t-van.net / xemvm /
 *    dongphuonglyso / lich365) khớp. LƯU Ý: Tài Thần có nhiều phái Trung Quốc
 *    khác nhau (玉匣记 / 协纪辨方书 / 择吉纲要) — ta chọn bản VN vì đây là chuẩn
 *    phổ biến cho tục "xuất hành đầu năm" của người Việt; trang hiển thị có ghi
 *    chú minh bạch điều này.
 *
 * Xác thực end-to-end với ngày đã công bố:
 *  - 17/02/2026 (Nhâm Tuất): Hỷ Thần Chính Nam, Tài Thần Chính Tây — khớp.
 *  - 29/01/2025 (Mậu Tuất): Hỷ Thần Đông Nam — khớp.
 *
 * Định vị thương hiệu: TRA CỨU PHONG TỤC để tham khảo — không phán số mệnh.
 */

import {
  computeGioHoangDao,
  type DayCanChi,
  type HourInfo,
} from './gio-hoang-dao';

export type Direction =
  | 'Chính Đông'
  | 'Chính Tây'
  | 'Chính Nam'
  | 'Chính Bắc'
  | 'Đông Bắc'
  | 'Đông Nam'
  | 'Tây Bắc'
  | 'Tây Nam';

/** Hỷ Thần theo thiên can NGÀY (《考原》— đồng thuận Việt + Trung). */
export const HY_THAN: Record<string, Direction> = {
  Giáp: 'Đông Bắc',
  Ất: 'Tây Bắc',
  Bính: 'Tây Nam',
  Đinh: 'Chính Nam',
  Mậu: 'Đông Nam',
  Kỷ: 'Đông Bắc',
  Canh: 'Tây Bắc',
  Tân: 'Tây Nam',
  Nhâm: 'Chính Nam',
  Quý: 'Đông Nam',
};

/** Tài Thần theo thiên can NGÀY (bản lịch vạn niên VN, 7 hướng). */
export const TAI_THAN: Record<string, Direction> = {
  Giáp: 'Đông Nam',
  Ất: 'Đông Nam',
  Bính: 'Chính Đông',
  Đinh: 'Chính Đông',
  Mậu: 'Chính Bắc',
  Kỷ: 'Chính Nam',
  Canh: 'Tây Nam',
  Tân: 'Tây Nam',
  Nhâm: 'Chính Tây',
  Quý: 'Tây Bắc',
};

export interface XuatHanhResult {
  dayCanChi: DayCanChi;
  /** Hướng Hỷ Thần — cầu may mắn, hỉ sự. */
  hyThan: Direction;
  /** Hướng Tài Thần — cầu tài lộc (bản lịch VN). */
  taiThan: Direction;
  /** Giờ hoàng đạo (giờ tốt) trong ngày — từ engine giờ hoàng đạo. */
  goodHours: HourInfo[];
}

/**
 * Tính hướng + giờ xuất hành cho một ngày dương lịch.
 * Trả null nếu ngày không hợp lệ (cùng quy ước với computeGioHoangDao).
 */
export function computeXuatHanh(dd: number, mm: number, yy: number): XuatHanhResult | null {
  const g = computeGioHoangDao(dd, mm, yy);
  if (!g) return null;
  const stem = g.dayCanChi.stem;
  const hyThan = HY_THAN[stem];
  const taiThan = TAI_THAN[stem];
  if (!hyThan || !taiThan) return null; // không xảy ra với 10 can hợp lệ
  return {
    dayCanChi: g.dayCanChi,
    hyThan,
    taiThan,
    goodHours: g.hours.filter((h) => h.good),
  };
}
