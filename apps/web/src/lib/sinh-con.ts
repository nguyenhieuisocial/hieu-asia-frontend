/**
 * Sinh con theo năm — ghép 2 nguồn sự thật có sẵn:
 *  - Mệnh nạp âm theo năm âm lịch: computeBanMenh (lib/dat-ten-ngu-hanh).
 *  - Quan hệ 12 con giáp (Tam Hợp / Lục Hợp / Lục Xung / Lục Hại): relationOf
 *    (lib/hop-tuoi-pairs).
 * cộng lời diễn giải RIÊNG cho quan hệ bố mẹ – con (RELATION_COPY bên hop-tuoi
 * viết cho cặp đôi nên không tái dùng nguyên văn).
 *
 * Quy ước dân gian: tuổi tính theo NĂM ÂM LỊCH. Người sinh tháng 1–2 dương
 * (trước Tết) có thể thuộc năm âm liền trước — các trang dùng lib này phải nêu
 * lưu ý đó.
 *
 * Định vị thương hiệu: đối chiếu theo quan niệm để THAM KHẢO — em bé nào cũng
 * là phúc; tuyệt đối không có chuyện con "khắc" hay "mang lỗi" với cha mẹ.
 */

import { computeBanMenh, ELEMENTS, type Element } from './dat-ten-ngu-hanh';
import { ZODIAC, relationOf, type RelationKind, type Zodiac } from './hop-tuoi-pairs';

export interface YearProfile {
  year: number;
  /** Can chi của năm âm, vd "Đinh Mùi". */
  canChi: string;
  zodiac: Zodiac;
  /** Tên nạp âm, vd "Thiên Hà Thủy". */
  napAmName: string;
  element: Element;
}

/** Hồ sơ can chi + mệnh nạp âm của một NĂM ÂM LỊCH (1900–2100). */
export function yearProfile(year: number): YearProfile | null {
  // 1/6 dương luôn sau Tết → năm âm trùng năm nhập, đúng quy ước "tuổi theo năm".
  const bm = computeBanMenh(1, 6, year);
  if (!bm) return null;
  const zodiac = ZODIAC[(((year - 4) % 12) + 12) % 12]!;
  return { year, canChi: bm.canChi, zodiac, napAmName: bm.napAmName, element: bm.element };
}

// --- Quan hệ con giáp bố mẹ – con (lời riêng, giọng dung hoà) ----------------

export type RelationTone = 'hop' | 'luu-y' | 'trung-tinh';

export interface ParentChildRelationCopy {
  label: string;
  tone: RelationTone;
  /** 1–2 câu cho quan hệ bố/mẹ – bé, không hù doạ. */
  text: (parentTen: string, childTen: string) => string;
}

export const PARENT_CHILD_COPY: Record<RelationKind, ParentChildRelationCopy> = {
  'tam-hop': {
    label: 'Tam Hợp',
    tone: 'hop',
    text: (p, c) =>
      `Tuổi ${p} và tuổi ${c} cùng nhóm Tam Hợp — theo quan niệm Can Chi, bố/mẹ và bé dễ "bắt nhịp", gần gũi và hiểu ý nhau. Một tín hiệu tham khảo dễ chịu.`,
  },
  'luc-hop': {
    label: 'Lục Hợp',
    tone: 'hop',
    text: (p, c) =>
      `Tuổi ${p} và tuổi ${c} là cặp Lục Hợp — quan niệm xưa xem đây là sự bổ trợ: bé và bố/mẹ có thể cân bằng cho nhau. Tín hiệu tham khảo tích cực.`,
  },
  'luc-xung': {
    label: 'Lục Xung',
    tone: 'luu-y',
    text: (p, c) =>
      `Tuổi ${p} và tuổi ${c} thuộc nhóm Lục Xung theo Can Chi. Cách hiểu lành mạnh: hai "nhịp" tính cách khác nhau, bố/mẹ có thể cần kiên nhẫn hơn khi đồng hành cùng con — hoàn toàn KHÔNG phải điềm xấu hay lỗi của em bé.`,
  },
  'luc-hai': {
    label: 'Lục Hại',
    tone: 'luu-y',
    text: (p, c) =>
      `Tuổi ${p} và tuổi ${c} thuộc nhóm Lục Hại theo Can Chi — quan niệm xưa nhắc bố/mẹ và bé có thể "lệch kênh" giao tiếp đôi chút, cần thêm thấu hiểu. Đây là lời nhắc tham khảo, không phải lời cảnh báo.`,
  },
  'dong-tuoi': {
    label: 'Cùng con giáp',
    tone: 'trung-tinh',
    text: (p) =>
      `Bố/mẹ và bé cùng tuổi ${p} — dân gian xem là dễ đồng cảm vì "cùng tạng". Nét giống nhau ấy là khởi đầu thuận; phần còn lại nằm ở cách gia đình vun đắp mỗi ngày.`,
  },
  'binh-hoa': {
    label: 'Bình hoà',
    tone: 'trung-tinh',
    text: (p, c) =>
      `Tuổi ${p} và tuổi ${c} ở thế bình hoà — không thuộc nhóm hợp đặc biệt, cũng không thuộc nhóm cần lưu ý. Theo Can Chi, mối gắn bó của bố/mẹ và bé gần như hoàn toàn do tình thương và sự đồng hành quyết định.`,
  },
};

// --- Mệnh nạp âm bố mẹ – con (tương sinh / tương khắc, giọng dung hoà) -------

export type MenhRelationKind =
  | 'dong-menh'
  | 'cha-me-sinh-con'
  | 'con-sinh-cha-me'
  | 'cha-me-khac-con'
  | 'con-khac-cha-me'
  | 'trung-tinh';

export interface MenhRelation {
  kind: MenhRelationKind;
  tone: RelationTone;
  text: string;
}

/** Đối chiếu mệnh nạp âm của bố/mẹ với mệnh của bé (quan niệm tham khảo). */
export function menhRelation(parentEl: Element, childEl: Element): MenhRelation {
  const p = ELEMENTS[parentEl];
  const c = ELEMENTS[childEl];
  if (parentEl === childEl) {
    return {
      kind: 'dong-menh',
      tone: 'trung-tinh',
      text: `Bố/mẹ và bé cùng mệnh ${p.name} — dân gian xem là dễ đồng điệu, "cùng chất" nên dễ hiểu nhau.`,
    };
  }
  if (p.sinhTo === childEl) {
    return {
      kind: 'cha-me-sinh-con',
      tone: 'hop',
      text: `Mệnh ${p.name} của bố/mẹ tương sinh cho mệnh ${c.name} của bé (${p.name} sinh ${c.name}) — quan niệm xưa xem là cha mẹ "tiếp sức" tự nhiên cho con.`,
    };
  }
  if (c.sinhTo === parentEl) {
    return {
      kind: 'con-sinh-cha-me',
      tone: 'hop',
      text: `Mệnh ${c.name} của bé tương sinh cho mệnh ${p.name} của bố/mẹ (${c.name} sinh ${p.name}) — dân gian hay gọi vui là "con mang lộc về".`,
    };
  }
  if (p.khac === childEl || c.khac === parentEl) {
    const direction = p.khac === childEl ? `${p.name} khắc ${c.name}` : `${c.name} khắc ${p.name}`;
    return {
      kind: p.khac === childEl ? 'cha-me-khac-con' : 'con-khac-cha-me',
      tone: 'luu-y',
      text: `Theo vòng ngũ hành, mệnh hai bên ở thế tương khắc (${direction}). Cách hiểu lành mạnh: hai "chất" khác nhau, cần dung hoà — tuyệt đối KHÔNG có chuyện em bé "khắc" hay mang lỗi với cha mẹ. Nhiều nhà còn xem đây là sự bù trừ.`,
    };
  }
  return {
    kind: 'trung-tinh',
    tone: 'trung-tinh',
    text: `Mệnh ${p.name} của bố/mẹ và mệnh ${c.name} của bé không sinh không khắc rõ rệt — thế trung tính, mọi gắn bó do gia đình vun đắp.`,
  };
}

// --- Đối chiếu tổng hợp cho 1 phụ huynh --------------------------------------

export interface ParentCheck {
  parent: YearProfile;
  relation: RelationKind;
  relationCopy: ParentChildRelationCopy;
  menh: MenhRelation;
}

/** Đối chiếu 1 phụ huynh (năm âm) với bé (năm âm). Null nếu năm ngoài 1900–2100. */
export function checkParentChild(parentYear: number, childYear: number): ParentCheck | null {
  const parent = yearProfile(parentYear);
  const child = yearProfile(childYear);
  if (!parent || !child) return null;
  const relation = relationOf(parent.zodiac.slug, child.zodiac.slug);
  return {
    parent,
    relation,
    relationCopy: PARENT_CHILD_COPY[relation],
    menh: menhRelation(parent.element, child.element),
  };
}

/** Bảng 12 con giáp bố mẹ × quan hệ với bé sinh năm `childYear` (cho trang năm). */
export function zodiacRelationTable(
  childYear: number,
): Array<{ zodiac: Zodiac; kind: RelationKind; copy: ParentChildRelationCopy }> {
  const child = yearProfile(childYear);
  if (!child) return [];
  return ZODIAC.map((z) => {
    const kind = relationOf(z.slug, child.zodiac.slug);
    return { zodiac: z, kind, copy: PARENT_CHILD_COPY[kind] };
  });
}
