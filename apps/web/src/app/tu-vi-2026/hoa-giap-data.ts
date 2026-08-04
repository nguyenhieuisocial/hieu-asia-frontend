/**
 * Dữ liệu cho các trang "Tử Vi 2026 theo hoa giáp × giới tính"
 * (/tu-vi-2026/[congiap]/[hoagiap]) — vd "Tử Vi Giáp Tý 2026 Nữ Mạng".
 *
 * THUẦN TÍNH TOÁN, không React, không gọi AI. Mọi dữ kiện lấy từ engine đã có
 * sẵn và đã kiểm chứng — KHÔNG bịa số:
 *   - yearProfile                          (lib/sinh-con.ts) — can chi + nạp âm
 *     + mệnh + con giáp của MỘT NĂM ÂM LỊCH.
 *   - ELEMENTS                             (lib/dat-ten-ngu-hanh.ts) — tương
 *     sinh/tương khắc của mệnh nạp âm.
 *   - canChiOfYear, TAM_TAI_YEARS          (lib/xem-tuoi-cuoi.ts)
 *   - computeSaoHan                        (lib/sao-han.ts)
 *   - relationOf, ZODIAC                   (lib/hop-tuoi-pairs.ts)
 *   - YEAR, YEAR_CANCHI, YEAR_CHI, YEAR_RANGE, YEAR_RELATION, nguHanhVsYear
 *     (./con-giap-data.ts) — MỘT nguồn duy nhất cho khung "năm 2026", tái dùng
 *     nguyên văn thay vì chép lại.
 *
 * Vòng Lục Thập Hoa Giáp: 1984 = Giáp Tý (đầu vòng), 60 năm liên tiếp phủ đủ 60
 * Can Chi. Chỉ số hoa giáp `i` (0..59) → năm đại diện `1984+i`.
 *
 * BATCH 1 (đợt này) = 30 hoa giáp đầu (chỉ số 0..29) × 2 giới = 60 trang. 30
 * hoa giáp còn lại (chỉ số 30..59) CHƯA dựng trang trong đợt này — cổng
 * `dynamicParams = false` ở route khiến chúng 404 thay vì render rỗng, để
 * theo dõi rồi mới mở đợt 2.
 *
 * GIỌNG ON-BRAND: tra cứu phong tục Can Chi để THAM KHẢO, không phán số mệnh,
 * không hù doạ, không bán lễ giải hạn.
 */

import { yearProfile } from '@/lib/sinh-con';
import { ELEMENTS, type Element, type ElementInfo } from '@/lib/dat-ten-ngu-hanh';
import { canChiOfYear, TAM_TAI_YEARS, type Chi } from '@/lib/xem-tuoi-cuoi';
import { computeSaoHan, type SaoInfo, type Gender } from '@/lib/sao-han';
import { relationOf, ZODIAC, type Zodiac, type RelationKind } from '@/lib/hop-tuoi-pairs';
import { isValidYear as isValidBanMenhYear } from '@/lib/ban-menh-data';
import { YEAR, YEAR_CHI, YEAR_RELATION, nguHanhVsYear } from './con-giap-data';

/** Con giáp của năm 2026 (Ngọ) — dùng để xét quan hệ hoa giáp ↔ năm. */
const YEAR_ZODIAC = ZODIAC.find((z) => z.ten === YEAR_CHI)!;

/** Vietnamese-diacritics-strip slug, vd "Giáp Tý" → "giap-ty". */
function slugifyCanChi(canChi: string): string {
  return canChi
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export interface HoaGiapEntry {
  /** 1-based thứ tự trong vòng 60 Hoa Giáp. */
  stt: number;
  /** 0-based, dùng để cắt batch. */
  index: number;
  /** vd "Giáp Tý". */
  canChi: string;
  /** vd "giap-ty". */
  slug: string;
  /** vd "Hải Trung Kim". */
  napAmName: string;
  element: Element;
  elementName: string;
  /** Con giáp (địa chi) nền — dùng để gom nhóm theo /tu-vi-2026/[congiap]. */
  zodiac: Zodiac;
  /** Một năm đại diện (1984+index) — chỉ dùng để tính, KHÔNG phải năm sinh gợi ý. */
  representativeYear: number;
}

/** Trọn vòng 60 Hoa Giáp, tính từ engine `yearProfile` — không tra bảng cứng tay. */
export const HOA_GIAP_CYCLE: HoaGiapEntry[] = Array.from({ length: 60 }, (_, i) => {
  const year = 1984 + i;
  const p = yearProfile(year)!;
  return {
    stt: i + 1,
    index: i,
    canChi: p.canChi,
    slug: slugifyCanChi(p.canChi),
    napAmName: p.napAmName,
    element: p.element,
    elementName: ELEMENTS[p.element].name,
    zodiac: p.zodiac,
    representativeYear: year,
  };
});

/** Batch 1 = 30 hoa giáp đầu vòng (chỉ số 0..29). */
export const BATCH_1_INDICES: number[] = Array.from({ length: 30 }, (_, i) => i);
export const BATCH_1_HOA_GIAP: HoaGiapEntry[] = BATCH_1_INDICES.map((i) => HOA_GIAP_CYCLE[i]!);
export const BATCH_1_SLUGS: ReadonlySet<string> = new Set(BATCH_1_HOA_GIAP.map((h) => h.slug));

/** 5 hoa giáp (trọn vòng 60) của một con giáp, theo đúng thứ tự vòng. */
export function hoaGiapForChi(chiSlug: string): HoaGiapEntry[] {
  return HOA_GIAP_CYCLE.filter((h) => h.zodiac.slug === chiSlug);
}

/** Slug segment cho route `[hoagiap]`, vd ("giap-ty", "nu") → "giap-ty-nu-mang". */
export function hoaGiapParamSlug(hoaGiapSlug: string, gender: Gender): string {
  return `${hoaGiapSlug}-${gender === 'nam' ? 'nam' : 'nu'}-mang`;
}

export interface ParsedHoaGiapParam {
  hoaGiapSlug: string;
  gender: Gender;
}

/** Tách "giap-ty-nu-mang" → { hoaGiapSlug: "giap-ty", gender: "nu" }. */
export function parseHoaGiapParam(param: string): ParsedHoaGiapParam | null {
  if (param.endsWith('-nam-mang')) {
    return { hoaGiapSlug: param.slice(0, -'-nam-mang'.length), gender: 'nam' };
  }
  if (param.endsWith('-nu-mang')) {
    return { hoaGiapSlug: param.slice(0, -'-nu-mang'.length), gender: 'nu' };
  }
  return null;
}

// ── Sao hạn theo năm sinh thực tế (1936–2020), một giới cụ thể ──────

export interface HoaGiapBirthRow {
  birthYear: number;
  tuoiMu: number;
  sao: SaoInfo;
}

/** Năm sinh dương trong 1936–2020 trùng đúng hoa giáp này (thường 1–2 năm). */
function birthYearsFor(canChi: string): number[] {
  const out: number[] = [];
  for (let y = 1936; y <= 2020; y++) {
    if (canChiOfYear(y).name === canChi) out.push(y);
  }
  return out.sort((a, b) => b - a); // trẻ → già
}

const REL_SHORT: Record<RelationKind, string> = {
  'tam-hop': 'Tam Hợp với năm',
  'luc-hop': 'Lục Hợp với năm',
  'luc-xung': 'xung Thái Tuế',
  'luc-hai': 'Lục Hại với năm',
  'dong-tuoi': 'năm tuổi (Thái Tuế)',
  'binh-hoa': 'bình hoà với năm',
};

const SAO_TYPE_WORD: Record<SaoInfo['type'], string> = { tot: 'cát tinh', trung: 'trung tính', xau: 'hung tinh' };

export interface HoaGiap2026Detail {
  hoaGiap: HoaGiapEntry;
  gender: Gender;
  genderLabel: string; // 'Nam' | 'Nữ'
  genderMangLabel: string; // 'Nam Mạng' | 'Nữ Mạng'
  chiSlug: string;
  birthRows: HoaGiapBirthRow[];
  relation: RelationKind;
  relationLabel: string;
  relationLine: string;
  nguHanhLine: string;
  isNamTuoi: boolean;
  isXungThaiTue: boolean;
  isTamTai: boolean;
  tamTaiChis: string[];
  verdictShort: string;
  elementInfo: ElementInfo;
  otherGenderHref: string;
  banMenhHref: string | null;
  seoTitle: string;
  seoDescription: string;
  faqs: { q: string; a: string }[];
}

export function buildHoaGiap2026(
  chiSlug: string,
  hoaGiapSlug: string,
  gioiTinh: Gender,
): HoaGiap2026Detail | null {
  const hoaGiap = BATCH_1_HOA_GIAP.find((h) => h.slug === hoaGiapSlug && h.zodiac.slug === chiSlug);
  if (!hoaGiap) return null;

  const genderLabel = gioiTinh === 'nam' ? 'Nam' : 'Nữ';
  const genderMangLabel = `${genderLabel} Mạng`;

  const birthRows: HoaGiapBirthRow[] = birthYearsFor(hoaGiap.canChi)
    .map((birthYear) => {
      const r = computeSaoHan(birthYear, gioiTinh, YEAR);
      if (!r) return null;
      return { birthYear, tuoiMu: r.tuoiMu, sao: r.sao };
    })
    .filter((r): r is HoaGiapBirthRow => r !== null);

  const relation = relationOf(hoaGiap.zodiac.slug, YEAR_ZODIAC.slug);
  const relCopy = YEAR_RELATION[relation];
  const isNamTuoi = relation === 'dong-tuoi';
  const isXungThaiTue = relation === 'luc-xung';

  const chi = hoaGiap.zodiac.ten as Chi;
  const tamTaiChis = TAM_TAI_YEARS[chi];
  const isTamTai = tamTaiChis.includes(YEAR_CHI);

  const elementInfo = ELEMENTS[hoaGiap.element];

  const verdictParts: string[] = [];
  if (isNamTuoi) verdictParts.push('năm tuổi (Thái Tuế)');
  else if (isXungThaiTue) verdictParts.push('xung Thái Tuế');
  else if (relation === 'tam-hop') verdictParts.push('Tam Hợp với năm');
  else if (relation === 'luc-hop') verdictParts.push('Lục Hợp với năm');
  if (isTamTai) verdictParts.push('có Tam Tai');
  const verdictShort =
    verdictParts.length > 0
      ? `${genderMangLabel} tuổi ${hoaGiap.canChi} năm 2026: ${verdictParts.join(', ')}, mệnh ${hoaGiap.napAmName} (hành ${hoaGiap.elementName}). Tham khảo theo phong tục, không phải lời phán số mệnh.`
      : `${genderMangLabel} tuổi ${hoaGiap.canChi} năm 2026 ở thế bình hoà, không hạn nổi bật theo Can Chi. Mệnh ${hoaGiap.napAmName} (hành ${hoaGiap.elementName}) — năm nay phần lớn do bạn quyết định.`;

  const otherGenderHref = `/tu-vi-2026/${chiSlug}/${hoaGiapParamSlug(hoaGiap.slug, gioiTinh === 'nam' ? 'nu' : 'nam')}`;
  const primaryBirthYear = birthRows[0]?.birthYear;
  const banMenhHref =
    primaryBirthYear && isValidBanMenhYear(primaryBirthYear) ? `/ban-menh/${primaryBirthYear}` : null;

  const seoTitle = `Tử Vi ${hoaGiap.canChi} 2026 ${genderMangLabel}`;
  const relShort = REL_SHORT[relation];
  const descCore = `Tử Vi ${hoaGiap.canChi} 2026 ${genderMangLabel}: mệnh ${hoaGiap.napAmName}, ${relShort}${isTamTai ? ', có Tam Tai' : ''}.`;
  const descWithYears =
    birthRows.length > 0 ? `${descCore} Sinh ${birthRows.map((r) => r.birthYear).join(', ')}.` : descCore;
  const descWithTail = `${descWithYears} Tham khảo phong tục, không phán số mệnh.`;
  const seoDescription =
    descWithTail.length <= 160 ? descWithTail : descWithYears.length <= 160 ? descWithYears : descCore;

  const primaryRow = birthRows[0];
  const faqs: { q: string; a: string }[] = [
    {
      q: `${hoaGiap.canChi} là mệnh gì?`,
      a: `${hoaGiap.canChi} có nạp âm "${hoaGiap.napAmName}", thuộc hành ${hoaGiap.elementName}. ${elementInfo.blurb} Nạp âm tính theo chu kỳ 60 Giáp Tý của năm âm lịch — cứ đúng 60 năm, tuổi ${hoaGiap.canChi} lại quay về.`,
    },
    {
      q: `${genderMangLabel} tuổi ${hoaGiap.canChi} năm 2026 hợp hay xung?`,
      a: relCopy.line(hoaGiap.canChi),
    },
    primaryRow
      ? {
          q: `${genderMangLabel} ${hoaGiap.canChi} sinh năm ${birthRows.map((r) => r.birthYear).join(' hoặc ')} gặp sao gì năm 2026?`,
          a: `${birthRows
            .map(
              (r) =>
                `Sinh năm ${r.birthYear} (tuổi mụ ${r.tuoiMu}): sao ${r.sao.name} (${SAO_TYPE_WORD[r.sao.type]}) — ${r.sao.summary}`,
            )
            .join(' ')} Đây là cách tính sao hạn (Cửu Diệu) theo tuổi mụ và giới tính, đổi mỗi năm.`,
        }
      : {
          q: `Sao hạn ${genderMangLabel} tuổi ${hoaGiap.canChi} năm 2026 tính thế nào?`,
          a: `Sao hạn (Cửu Diệu) tính theo tuổi mụ và giới tính, mỗi năm đổi một sao. Xem bảng theo năm sinh ở trên.`,
        },
    {
      q: `${genderMangLabel} tuổi ${hoaGiap.canChi} có phạm Tam Tai năm 2026 không?`,
      a: isTamTai
        ? `Có. Nhóm tuổi ${chi} (trong đó có ${hoaGiap.canChi}) gặp Tam Tai vào 3 năm ${tamTaiChis.join(', ')}, và 2026 (năm Ngọ) là một trong ba năm đó. Theo phong tục, Tam Tai là giai đoạn nên làm việc thận trọng, tránh khởi sự quá lớn — đây là lưu ý tham khảo, không phải định mệnh, và không phân biệt nam/nữ.`
        : `Không. Nhóm tuổi ${chi} (trong đó có ${hoaGiap.canChi}) gặp Tam Tai vào 3 năm ${tamTaiChis.join(', ')}, còn 2026 là năm Ngọ nên không rơi vào Tam Tai.`,
    },
    {
      q: `Mệnh ${hoaGiap.napAmName} (${hoaGiap.canChi}) hợp mệnh gì, khắc mệnh gì?`,
      a: `Mệnh ${hoaGiap.elementName} được hành ${ELEMENTS[elementInfo.sinhBy].name} sinh cho (tương sinh, bổ trợ tốt) và sinh ra cho hành ${ELEMENTS[elementInfo.sinhTo].name} (cũng hài hoà). Mệnh ${hoaGiap.elementName} khắc hành ${ELEMENTS[elementInfo.khac].name}, và bị hành ${ELEMENTS[elementInfo.khacBy].name} khắc lại — nên hạn chế phối hợp lớn với hành này. Đây là quy luật ngũ hành tham khảo, không phải luật cứng.`,
    },
  ];

  return {
    hoaGiap,
    gender: gioiTinh,
    genderLabel,
    genderMangLabel,
    chiSlug,
    birthRows,
    relation,
    relationLabel: relCopy.label,
    relationLine: relCopy.line(hoaGiap.canChi),
    nguHanhLine: nguHanhVsYear(hoaGiap.zodiac.nguHanh),
    isNamTuoi,
    isXungThaiTue,
    isTamTai,
    tamTaiChis,
    verdictShort,
    elementInfo,
    otherGenderHref,
    banMenhHref,
    seoTitle,
    seoDescription,
    faqs,
  };
}
