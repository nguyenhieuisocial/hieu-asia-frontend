/**
 * Dữ liệu cụm "Màu xe hợp mệnh / hợp tuổi" (/mau-xe-hop-menh).
 *
 * GROUNDING (chống bịa — thống nhất toàn site):
 *  - Mệnh (nạp âm) + "màu hợp / màu nên hạn chế" của một năm sinh = lấy NGUYÊN từ
 *    engine `buildBanMenh` (lib/ban-menh-data): nạp âm 60 Giáp Tý → hành bản mệnh,
 *    rồi suy màu theo LUẬT ngũ hành tương sinh/khắc (hành sinh ra mệnh = bổ trợ;
 *    hành khắc mệnh = nên hạn chế). KHÔNG chế từng năm, KHÔNG tra bảng cứng tay.
 *  - Bảng "màu sơn xe phổ biến → hành" lấy thẳng từ quan niệm ngũ hành – màu sắc
 *    (cùng hệ với ELEMENT_COLORS): Kim=trắng/bạc/xám, Thủy=đen/xanh dương,
 *    Hỏa=đỏ/cam/tím, Mộc=xanh lá, Thổ=vàng/nâu/be. → màu xe hợp/kỵ = lọc bảng này
 *    theo hành hợp/khắc đã suy ở trên. Mọi khẳng định đều truy được về luật ngũ hành.
 *  - Giọng: tham khảo khi chọn màu xe cho ưng ý, KHÔNG phán số mệnh, không bán
 *    "đổi vận". Có nhắc yếu tố AN TOÀN thực dụng (xe màu sáng dễ nhận biết) để cân bằng.
 */
import { buildBanMenh, isValidYear, FROM_YEAR, TO_YEAR, recentYears } from './ban-menh-data';
import { ELEMENTS, type Element } from './dat-ten-ngu-hanh';
import type { FaqItem } from './seo/jsonld';

export { FROM_YEAR, TO_YEAR, isValidYear, recentYears };

/** Một màu sơn xe phổ biến trên thị trường VN + hành ngũ hành tương ứng. */
export interface CarColor {
  /** Tên màu xe thường gọi. */
  name: string;
  element: Element;
  /** Mã màu để vẽ ô minh hoạ. */
  hex: string;
}

/**
 * Màu sơn xe phổ biến → hành (quan niệm ngũ hành – màu sắc, cùng hệ ELEMENT_COLORS).
 * Chỉ liệt kê các màu xe thực tế hay gặp; mỗi màu gắn đúng một hành.
 */
export const CAR_COLORS: CarColor[] = [
  { name: 'Trắng', element: 'kim', hex: '#f8fafc' },
  { name: 'Bạc', element: 'kim', hex: '#cbd5e1' },
  { name: 'Xám / Ghi', element: 'kim', hex: '#6b7280' },
  { name: 'Đen', element: 'thuy', hex: '#1f2937' },
  { name: 'Xanh dương / Xanh lam', element: 'thuy', hex: '#2563eb' },
  { name: 'Đỏ', element: 'hoa', hex: '#dc2626' },
  { name: 'Cam', element: 'hoa', hex: '#f97316' },
  { name: 'Tím', element: 'hoa', hex: '#a855f7' },
  { name: 'Xanh lá / Xanh rêu', element: 'moc', hex: '#16a34a' },
  { name: 'Vàng / Vàng cát', element: 'tho', hex: '#eab308' },
  { name: 'Nâu', element: 'tho', hex: '#92400e' },
  { name: 'Be / Kem', element: 'tho', hex: '#d6c9a8' },
];

export interface MauXeData {
  year: number;
  canChi: string;
  zodiac: { ten: string; slug: string; emoji: string };
  napAmName: string;
  /** Hành bản mệnh. */
  element: Element;
  elementName: string;
  elementBlurb: string;
  /** Hành sinh ra mệnh (tương sinh — bổ trợ). */
  sinhElementName: string;
  /** Hành khắc mệnh (nên hạn chế). */
  khacElementName: string;
  /** Màu xe hợp nhất (thuộc hành bản mệnh + hành tương sinh). */
  hopCarColors: CarColor[];
  /** Màu xe trung tính (không xung, không đặc biệt hợp). */
  neutralCarColors: CarColor[];
  /** Màu xe nên cân nhắc/hạn chế (thuộc hành khắc mệnh). */
  avoidCarColors: CarColor[];
  faqs: FaqItem[];
  seoTitle: string;
  seoDescription: string;
}

function names(list: CarColor[]): string {
  return list.map((c) => c.name).join(', ');
}

export function buildMauXe(year: number): MauXeData | null {
  const bm = buildBanMenh(year);
  if (!bm) return null;

  const info = ELEMENTS[bm.element];
  // Hợp = hành bản mệnh + hành sinh ra mệnh; Kỵ = hành khắc mệnh. (Mirror /ban-menh.)
  const hopElements: Element[] = [bm.element, info.sinhBy];
  const avoidElement: Element = info.khacBy;

  const hopCarColors = CAR_COLORS.filter((c) => hopElements.includes(c.element));
  const avoidCarColors = CAR_COLORS.filter((c) => c.element === avoidElement);
  const neutralCarColors = CAR_COLORS.filter(
    (c) => !hopElements.includes(c.element) && c.element !== avoidElement,
  );

  const faqs: FaqItem[] = [
    {
      q: `Sinh năm ${year} hợp màu xe gì?`,
      a: `Người sinh năm ${year} (tuổi ${bm.canChi}) mệnh ${bm.elementName}. Theo quan niệm ngũ hành, màu xe hợp nhất là màu thuộc hành bản mệnh và hành tương sinh: ${names(hopCarColors)}. Đây là gợi ý để tham khảo khi chọn màu xe cho ưng ý, không phải quy tắc bắt buộc.`,
    },
    {
      q: `Mệnh ${bm.elementName} kỵ màu xe nào?`,
      a: `Mệnh ${bm.elementName} bị hành ${bm.khacElementName} khắc, nên dân gian khuyên cân nhắc các màu xe thuộc hành ${bm.khacElementName}: ${names(avoidCarColors)}. "Kỵ" ở đây chỉ là nên cân nhắc theo phong thủy — nếu bạn thích màu đó thì vẫn dùng được, an toàn khi lái mới là yếu tố quan trọng nhất.`,
    },
    {
      q: 'Chọn màu xe theo mệnh hay theo tuổi?',
      a: 'Hai cách thường quy về một: "mệnh" (ngũ hành bản mệnh) được tính từ năm sinh (tức là từ tuổi âm lịch). Vì vậy tra theo năm sinh là đủ — công cụ ở trên sẽ cho biết bạn mệnh gì và các màu xe hợp/nên hạn chế tương ứng.',
    },
    {
      q: 'Màu xe có thật sự ảnh hưởng tài lộc, may mắn không?',
      a: 'Đây là quan niệm phong thủy mang tính tham khảo, không có gì đảm bảo về tài lộc hay may mắn. Giá trị thực tế là giúp bạn chọn màu mình thấy hợp gu và tự tin. Về an toàn, các nghiên cứu giao thông cho thấy xe màu sáng (trắng, vàng) dễ được nhận biết hơn trong điều kiện thiếu sáng — đó mới là yếu tố nên ưu tiên.',
    },
  ];

  const seoTitle = `Sinh năm ${year} hợp màu xe gì? Mệnh ${bm.elementName} (tuổi ${bm.canChi}) chọn màu xe nào`;
  const seoDescription = `Người sinh năm ${year} (tuổi ${bm.canChi}, mệnh ${bm.elementName}) hợp màu xe: ${names(hopCarColors)}; nên cân nhắc màu: ${names(avoidCarColors)}. Tính theo ngũ hành nạp âm, tham khảo, không phán số mệnh.`;

  return {
    year,
    canChi: bm.canChi,
    zodiac: bm.zodiac,
    napAmName: bm.napAmName,
    element: bm.element,
    elementName: bm.elementName,
    elementBlurb: bm.elementBlurb,
    sinhElementName: bm.sinhElementName,
    khacElementName: bm.khacElementName,
    hopCarColors,
    neutralCarColors,
    avoidCarColors,
    faqs,
    seoTitle,
    seoDescription,
  };
}

export interface ElementCarGuide {
  key: Element;
  name: string;
  blurb: string;
  carColors: CarColor[];
}

/** 5 hành + màu xe đại diện — cho bảng tham chiếu ở trang hub. */
export function listElementCarGuide(): ElementCarGuide[] {
  return (Object.keys(ELEMENTS) as Element[]).map((k) => ({
    key: k,
    name: ELEMENTS[k].name,
    blurb: ELEMENTS[k].blurb,
    carColors: CAR_COLORS.filter((c) => c.element === k),
  }));
}
