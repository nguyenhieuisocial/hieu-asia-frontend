/**
 * Dữ liệu cụm "Hướng bàn làm việc / bàn học hợp tuổi" (/huong-ban-lam-viec).
 *
 * GROUNDING (chống bịa): KHÔNG có engine riêng — gọi NGUYÊN `computeHuongNha`
 * (lib/huong-nha, Bát Trạch: năm sinh + giới tính → cung phi → 8 hướng, 4 cát
 * 4 hung). Trang này chỉ ÁP DỤNG kết quả đó cho việc đặt BÀN (mặt người ngồi
 * quay về hướng tốt), khác /huong-nha (đặt nhà/cửa/giường/bếp).
 *  - "Hướng ngồi tốt nhất khi LÀM VIỆC" = hướng mang sao Sinh Khí (cát tinh số 1:
 *    công danh, tài lộc, thăng tiến) — chính STAR_INFO.sinh_khi đã ghi "ưu tiên
 *    cho ... bàn làm việc".
 *  - "Hướng ngồi tốt nhất khi HỌC / cần tập trung" = hướng mang sao Phục Vị (ổn
 *    định, tĩnh tâm) — STAR_INFO.phuc_vi đã ghi "hợp ... phòng học".
 *  Mỗi cung phi LUÔN có đúng 1 hướng Sinh Khí và 1 hướng Phục Vị nên 2 gợi ý
 *  trên luôn tồn tại, suy thẳng từ engine — không chế thêm.
 *  - Giọng: tham khảo, không phán số mệnh, không bán "hóa giải".
 */
import {
  computeHuongNha,
  STAR_INFO,
  type Gender,
  type DirectionResult,
} from './huong-nha';

export type { Gender };

export interface DeskDirections {
  year: number;
  gender: Gender;
  cungPhi: string;
  group: 'Đông' | 'Tây';
  /** 4 hướng tốt (xếp Sinh Khí → Thiên Y → Diên Niên → Phục Vị). */
  good: DirectionResult[];
  /** 4 hướng nên tránh. */
  bad: DirectionResult[];
  /** Hướng ngồi nên hướng MẶT về khi làm việc — sao Sinh Khí. */
  workDir: DirectionResult;
  /** Hướng ngồi nên hướng MẶT về khi học / cần tập trung — sao Phục Vị. */
  studyDir: DirectionResult;
}

export function isValidBirthYear(year: number): boolean {
  return Number.isInteger(year) && year >= 1930 && year <= 2026;
}

export function deskDirections(year: number, gender: Gender): DeskDirections | null {
  if (!isValidBirthYear(year)) return null;
  const r = computeHuongNha(year, gender);
  const workDir = r.good.find((d) => d.star === 'sinh_khi') ?? r.good[0]!;
  const studyDir = r.good.find((d) => d.star === 'phuc_vi') ?? r.good[r.good.length - 1]!;
  return {
    year,
    gender,
    cungPhi: r.cungPhi,
    group: r.group,
    good: r.good,
    bad: r.bad,
    workDir,
    studyDir,
  };
}

export interface DeskUseGuide {
  star: DirectionResult['star'];
  name: string;
  use: string;
}

/** Gợi ý ý nghĩa 4 hướng tốt khi đặt bàn — diễn giải từ STAR_INFO (không chế). */
export const DESK_USE: DeskUseGuide[] = [
  { star: 'sinh_khi', name: STAR_INFO.sinh_khi.name, use: 'Tốt nhất cho bàn làm việc — chủ công danh, tài lộc, thăng tiến.' },
  { star: 'dien_nien', name: STAR_INFO.dien_nien.name, use: 'Hợp công việc cần giao tiếp, đối tác, khách hàng — chủ hòa hợp, quan hệ.' },
  { star: 'thien_y', name: STAR_INFO.thien_y.name, use: 'Hợp khi cần sức khỏe, quý nhân nâng đỡ — dịu, bền.' },
  { star: 'phuc_vi', name: STAR_INFO.phuc_vi.name, use: 'Tốt nhất cho bàn học — chủ ổn định, tĩnh tâm, tập trung.' },
];
