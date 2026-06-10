/**
 * Per-birth-year landing data for "Xem hướng nhà hợp tuổi".
 *
 * Mỗi năm sinh → một route tĩnh /huong-nha/tuoi-<year>. Nội dung DẪN từ engine
 * thật (cung phi + 4 hướng tốt/xấu cho cả nam và nữ) → không doorway nhân bản.
 */

import { computeHuongNha, groupLabel, STAR_INFO, type HuongNhaResult } from '@/lib/huong-nha';

/** Dải năm sinh có trang riêng — nhóm tuổi xây/mua nhà phổ biến. */
export const BIRTH_YEARS: number[] = Array.from({ length: 36 }, (_, i) => 1965 + i); // 1965–2000

export function slugOf(year: number): string {
  return `tuoi-${year}`;
}

export function yearFromSlug(slug: string): number | null {
  const m = /^tuoi-(\d{4})$/.exec(slug);
  if (!m) return null;
  const y = Number(m[1]);
  return BIRTH_YEARS.includes(y) ? y : null;
}

export interface YearPageData {
  year: number;
  slug: string;
  nam: HuongNhaResult;
  nu: HuongNhaResult;
  seoTitle: string;
  seoDescription: string;
  faqs: { q: string; a: string }[];
}

function goodDirsText(r: HuongNhaResult): string {
  return r.good.map((d) => d.direction).join(', ');
}

export function buildYearPage(year: number): YearPageData {
  const nam = computeHuongNha(year, 'nam');
  const nu = computeHuongNha(year, 'nu');
  const namBest = nam.good[0]!; // luôn có 4 hướng tốt
  const nuBest = nu.good[0]!;

  const seoTitle = `Sinh năm ${year} hợp hướng nhà nào? Hướng tốt theo cung phi (nam & nữ)`;
  const seoDescription = `Gia chủ sinh năm ${year}: nam thuộc cung ${nam.cungPhi} (${groupLabel(nam.group)}) hợp hướng ${namBest.direction}; nữ thuộc cung ${nu.cungPhi} (${groupLabel(nu.group)}) hợp hướng ${nuBest.direction}. Bảng 4 hướng tốt – 4 hướng tránh, tính theo Bát Trạch. Tham khảo, không phán số mệnh.`;

  const faqs: { q: string; a: string }[] = [
    {
      q: `Nam sinh năm ${year} hợp hướng nhà nào?`,
      a: `Nam sinh năm ${year} thuộc cung ${nam.cungPhi} — ${groupLabel(nam.group)}. Theo Bát Trạch, 4 hướng tốt là ${goodDirsText(nam)} (tốt nhất là ${namBest.direction} — sao ${STAR_INFO[namBest.star].name}). Nên tránh: ${nam.bad.map((d) => d.direction).join(', ')}.`,
    },
    {
      q: `Nữ sinh năm ${year} hợp hướng nhà nào?`,
      a: `Nữ sinh năm ${year} thuộc cung ${nu.cungPhi} — ${groupLabel(nu.group)}. 4 hướng tốt là ${goodDirsText(nu)} (tốt nhất là ${nuBest.direction} — sao ${STAR_INFO[nuBest.star].name}). Nên tránh: ${nu.bad.map((d) => d.direction).join(', ')}.`,
    },
    {
      q: `Hướng nhà tính theo hướng cửa hay hướng lưng nhà?`,
      a: `Tùy trường phái. Nhiều thầy tính theo hướng cửa chính nhìn ra; số khác tính theo "tọa" (hướng lưng nhà dựa vào). Bảng trên cho biết hướng nào mang sao tốt/xấu với tuổi bạn — bạn áp cho cửa chính, hướng giường hoặc bàn làm việc đều được.`,
    },
    {
      q: `Vợ chồng khác mệnh (Đông và Tây tứ mệnh) thì chọn hướng sao?`,
      a: `Nếu hai người khác nhóm mệnh, thường ưu tiên tuổi người trụ cột/đứng tên nhà cho hướng cửa chính, rồi bố trí hướng giường, bếp, bàn làm việc sao cho mỗi người được hướng tốt của riêng mình. Đây là cân nhắc tham khảo theo phong tục, không bắt buộc.`,
    },
  ];

  return { year, slug: slugOf(year), nam, nu, seoTitle, seoDescription, faqs };
}
