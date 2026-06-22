/**
 * Dữ liệu cụm "Ngũ hành bản mệnh theo năm sinh" (/ban-menh).
 *
 * GROUNDING (chống bịa — thống nhất toàn site):
 *  - Mệnh (nạp âm) của một năm sinh = tính bằng engine THẬT `yearProfile`
 *    (lib/sinh-con → computeBanMenh, bảng nạp âm 60 Giáp Tý cổ điển) → can chi,
 *    con giáp, tên nạp âm, ngũ hành đều deterministic, KHÔNG tra bảng cứng tay.
 *  - "Màu hợp / màu nên hạn chế" suy THEO LUẬT ngũ hành tương sinh / tương khắc
 *    từ bảng `ELEMENTS` (lib/dat-ten-ngu-hanh): hành sinh ra mệnh = bổ trợ; hành
 *    khắc mệnh = nên hạn chế. Không chế từng năm.
 *  - Hướng nhà KHÔNG tự suy ở đây (tránh mâu thuẫn Bát Trạch) → dẫn sang /huong-nha.
 *  - Quy ước dân gian: tuổi theo NĂM ÂM LỊCH (đổi vào Tết). Người sinh tháng 1–2
 *    dương trước Tết có thể thuộc năm âm liền trước — mọi trang phải nêu lưu ý.
 *  - Giọng: tham khảo để hiểu mình, KHÔNG phán số mệnh, không bán "đổi mệnh".
 */
import { yearProfile } from './sinh-con';
import { ELEMENTS, type Element } from './dat-ten-ngu-hanh';
import type { FaqItem } from './seo/jsonld';

/** Dải năm sinh có trang riêng — phủ phần lớn người đang sống + trẻ mới sinh. */
export const FROM_YEAR = 1950;
export const TO_YEAR = 2025;
export const BIRTH_YEARS: number[] = Array.from(
  { length: TO_YEAR - FROM_YEAR + 1 },
  (_, i) => FROM_YEAR + i,
);

export function isValidYear(year: number): boolean {
  return Number.isInteger(year) && year >= FROM_YEAR && year <= TO_YEAR;
}

/** Màu đại diện theo từng hành (quan niệm ngũ hành – màu sắc phổ biến). */
export const ELEMENT_COLORS: Record<Element, string[]> = {
  kim: ['trắng', 'xám', 'ghi', 'bạc'],
  moc: ['xanh lá', 'xanh lục'],
  thuy: ['đen', 'xanh dương', 'xanh nước biển'],
  hoa: ['đỏ', 'hồng', 'cam', 'tím'],
  tho: ['vàng', 'nâu', 'vàng đất'],
};

/** Mã màu để vẽ ô màu minh hoạ (mọi tên màu dùng ở ELEMENT_COLORS đều có mặt). */
export const COLOR_HEX: Record<string, string> = {
  trắng: '#f8fafc',
  xám: '#9ca3af',
  ghi: '#6b7280',
  bạc: '#cbd5e1',
  'xanh lá': '#22c55e',
  'xanh lục': '#16a34a',
  đen: '#1f2937',
  'xanh dương': '#2563eb',
  'xanh nước biển': '#1e3a8a',
  đỏ: '#dc2626',
  hồng: '#ec4899',
  cam: '#f97316',
  tím: '#a855f7',
  vàng: '#eab308',
  nâu: '#92400e',
  'vàng đất': '#ca8a04',
};

export interface BanMenhData {
  year: number;
  canChi: string;
  zodiac: { ten: string; slug: string; emoji: string };
  napAmName: string;
  element: Element;
  elementName: string;
  elementBlurb: string;
  /** Màu của chính hành bản mệnh. */
  banMenhColors: string[];
  /** Hành sinh ra mệnh (tương sinh — bổ trợ) + màu của nó. */
  sinhElementName: string;
  hopColors: string[];
  /** Hành khắc mệnh (nên hạn chế) + màu của nó. */
  khacElementName: string;
  avoidColors: string[];
  faqs: FaqItem[];
  seoTitle: string;
  seoDescription: string;
}

function cap(list: string[]): string {
  // "trắng, xám, ghi" — gọn cho câu văn.
  return list.join(', ');
}

export function buildBanMenh(year: number): BanMenhData | null {
  if (!isValidYear(year)) return null;
  const p = yearProfile(year);
  if (!p) return null;

  const info = ELEMENTS[p.element];
  const sinhInfo = ELEMENTS[info.sinhBy]; // hành sinh ra mệnh (tương sinh)
  const khacInfo = ELEMENTS[info.khacBy]; // hành khắc mệnh (nên hạn chế)

  const banMenhColors = ELEMENT_COLORS[p.element];
  const hopColors = ELEMENT_COLORS[info.sinhBy];
  const avoidColors = ELEMENT_COLORS[info.khacBy];

  const zodiac = { ten: p.zodiac.ten, slug: p.zodiac.slug, emoji: p.zodiac.emoji };

  const faqs: FaqItem[] = [
    {
      q: `Sinh năm ${year} mệnh gì?`,
      a: `Người sinh năm ${year} (tuổi ${p.canChi}) có nạp âm "${p.napAmName}", thuộc hành ${info.name}. Nạp âm tính theo chu kỳ 60 Giáp Tý của năm âm lịch.`,
    },
    {
      q: `Sinh năm ${year} hợp màu gì, kỵ màu gì?`,
      a: `Mệnh ${info.name} hợp nhất với màu bản mệnh (${cap(banMenhColors)}) và màu tương sinh thuộc hành ${sinhInfo.name} (${cap(hopColors)}) — vì ${sinhInfo.name} sinh ${info.name}. Nên hạn chế màu thuộc hành ${khacInfo.name} (${cap(avoidColors)}) vì ${khacInfo.name} khắc ${info.name}. Đây là quan niệm phong thủy ngũ hành, mang tính tham khảo.`,
    },
    {
      q: `Sinh năm ${year} tuổi con gì?`,
      a: `Năm ${year} là năm ${p.canChi}, cầm tinh con ${p.zodiac.ten}. Lưu ý: tuổi tính theo năm âm lịch, nên người sinh tháng 1 hoặc đầu tháng 2 dương (trước Tết) có thể vẫn thuộc tuổi của năm liền trước.`,
    },
    {
      q: `Mệnh có quyết định số phận không?`,
      a: `Không. Ngũ hành bản mệnh chỉ là một lát cắt theo năm sinh, dùng để tham khảo (ví dụ chọn màu sắc cho dễ chịu, hợp gu). Nó không định đoạt cuộc đời bạn. Muốn hiểu sâu hơn, hãy xem lá số Bát Tự hoặc Tử Vi đầy đủ từ ngày giờ sinh.`,
    },
  ];

  const seoTitle = `Sinh năm ${year} mệnh gì? Tuổi ${p.canChi} — ${p.napAmName}, hợp màu gì`;
  const seoDescription = `Người sinh năm ${year} (tuổi ${p.canChi}, con ${p.zodiac.ten}) mệnh ${info.name} — nạp âm ${p.napAmName}. Màu hợp: ${cap([...banMenhColors, ...hopColors])}; màu nên hạn chế: ${cap(avoidColors)}. Tính theo nạp âm 60 Giáp Tý, tham khảo, không phán số mệnh.`;

  return {
    year,
    canChi: p.canChi,
    zodiac,
    napAmName: p.napAmName,
    element: p.element,
    elementName: info.name,
    elementBlurb: info.blurb,
    banMenhColors,
    sinhElementName: sinhInfo.name,
    hopColors,
    khacElementName: khacInfo.name,
    avoidColors,
    faqs,
    seoTitle,
    seoDescription,
  };
}

export interface ElementGuide {
  key: Element;
  name: string;
  blurb: string;
  colors: string[];
}

/** 5 hành cho phần giải thích ở trang hub. */
export function listElementGuide(): ElementGuide[] {
  return (Object.keys(ELEMENTS) as Element[]).map((k) => ({
    key: k,
    name: ELEMENTS[k].name,
    blurb: ELEMENTS[k].blurb,
    colors: ELEMENT_COLORS[k],
  }));
}

/** Vài năm gần đây để liên kết nổi bật ở hub (mới nhất → cũ). */
export function recentYears(count = 24): number[] {
  return Array.from({ length: count }, (_, i) => TO_YEAR - i).filter(isValidYear);
}
