/**
 * Dữ liệu cho 12 trang "Tử Vi 2026 theo con giáp" (/tu-vi-2026/[con-giap]).
 *
 * THUẦN TÍNH TOÁN, không React, không gọi AI, không gọi backend. Mọi dữ kiện
 * lấy từ engine Can Chi đã có sẵn và đã được kiểm chứng:
 *   - canChiOfYear, TAM_TAI_YEARS  (lib/xem-tuoi-cuoi.ts)
 *   - relationOf, ZODIAC           (lib/hop-tuoi-pairs.ts)
 *   - computeSaoHan, SAO_INFO      (lib/sao-han.ts)
 *
 * Năm 2026 = Bính Ngọ (địa chi Ngọ, hành Hỏa). Mỗi con giáp ra một trang riêng
 * biệt nhờ: quan hệ tuổi với năm (Thái Tuế / Tam Hợp / Lục Hợp / Lục Hại / bình
 * hoà), tương tác ngũ hành với Hỏa, có phạm Tam Tai không, và bảng sao hạn theo
 * từng năm sinh (cả nam lẫn nữ).
 *
 * GIỌNG ON-BRAND: tra cứu phong tục Can Chi để THAM KHẢO, không phán số mệnh,
 * không hù doạ, không bán lễ giải hạn.
 */

import {
  ZODIAC,
  findZodiac,
  relationOf,
  type Zodiac,
  type RelationKind,
  type NguHanh,
} from '@/lib/hop-tuoi-pairs';
import { canChiOfYear, TAM_TAI_YEARS, ANIMAL_BY_CHI, type Chi } from '@/lib/xem-tuoi-cuoi';
import { computeSaoHan, type SaoInfo } from '@/lib/sao-han';

export const YEAR = 2026;
export const YEAR_CANCHI = canChiOfYear(YEAR); // { can:'Bính', chi:'Ngọ', name:'Bính Ngọ', animal:'Ngựa' }
export const YEAR_CHI = YEAR_CANCHI.chi; // 'Ngọ'
/** Con giáp của năm (Ngọ) — dùng để xét quan hệ tuổi ↔ năm. */
const YEAR_ZODIAC = ZODIAC.find((z) => z.ten === YEAR_CHI)!; // slug 'ngo'
export const YEAR_RANGE = '17/02/2026 → 05/02/2027';

/** Danh sách slug 12 con giáp (khớp ZODIAC_LIST trong sitemap). */
export const CON_GIAP_SLUGS: string[] = ZODIAC.map((z) => z.slug);

// ── Quan hệ tuổi ↔ năm Ngọ 2026 ─────────────────────────────────────
// Dùng đúng khung Can Chi (relationOf), nhưng diễn đạt theo ngữ cảnh "tuổi với
// năm" thay vì "hai người".

interface YearRelationCopy {
  label: string;
  line: (ten: string) => string;
}

const YEAR_RELATION: Record<RelationKind, YearRelationCopy> = {
  'tam-hop': {
    label: 'Tam Hợp với năm',
    line: (t) =>
      `Tuổi ${t} nằm trong nhóm Tam Hợp với năm Ngọ 2026 — một tín hiệu tham khảo thuận. Nhịp của năm dễ ăn khớp với bạn, hợp để chủ động đẩy những việc đã chuẩn bị kỹ thay vì khởi sự vội.`,
  },
  'luc-hop': {
    label: 'Lục Hợp với năm',
    line: (t) =>
      `Tuổi ${t} ở thế Lục Hợp với năm Ngọ 2026 — gợi ý một năm tương đối hoà thuận, dễ có người nâng đỡ nếu bạn chịu mở lời nhờ giúp đúng lúc.`,
  },
  'luc-xung': {
    label: 'Lục Xung với năm (xung Thái Tuế)',
    line: (t) =>
      `Tuổi ${t} xung với năm Ngọ 2026 (dân gian gọi là xung Thái Tuế). Đây không phải điềm xấu cố định, mà là lời nhắc năm nay nhiều biến động và va chạm hơn với bạn — nên giữ nhịp chắc, tránh quyết định lớn lúc đang nóng.`,
  },
  'luc-hai': {
    label: 'Lục Hại với năm',
    line: (t) =>
      `Tuổi ${t} ở thế Lục Hại với năm Ngọ 2026 — dễ vướng hiểu lầm vặt và phiền toái nhỏ. Cách hoá giải thực tế nhất là giao tiếp rõ ràng và kiên nhẫn hơn bình thường.`,
  },
  'dong-tuoi': {
    label: 'Năm tuổi (Bản Mệnh Thái Tuế)',
    line: (t) =>
      `2026 là năm tuổi của người tuổi ${t} (Bản Mệnh Thái Tuế). Theo phong tục, năm tuổi nên giữ ổn định và làm việc chắc tay — đây là một lưu ý nhẹ để cẩn trọng, không phải hạn nặng.`,
  },
  'binh-hoa': {
    label: 'Bình hoà với năm',
    line: (t) =>
      `Tuổi ${t} ở thế bình hoà với năm Ngọ 2026 — không hợp cũng không xung nổi bật. Năm nay ra sao phần lớn nằm ở lựa chọn và nỗ lực của bạn, hơn là ở con giáp.`,
  },
};

// ── Tương tác ngũ hành với năm (Hỏa) ────────────────────────────────
// Năm Ngọ = hành Hỏa. Vòng sinh: Mộc→Hỏa→Thổ→Kim→Thủy→Mộc. Vòng khắc:
// Thủy→Hỏa→Kim. Diễn đạt năm-framed, không hù doạ.

function nguHanhVsYear(e: NguHanh): string {
  switch (e) {
    case 'Hỏa':
      return 'Con giáp của bạn cùng hành Hỏa với năm, năng lượng cộng hưởng mạnh: làm việc hăng và dễ có khí thế, nhưng cũng dễ nóng vội — giữ nhịp là chìa khoá.';
    case 'Mộc':
      return 'Hành Mộc của bạn sinh cho Hỏa của năm, nên bạn dễ dồn sức cho việc chung và được ghi nhận. Nhớ giữ lại năng lượng cho bản thân để không kiệt sức.';
    case 'Thổ':
      return 'Hỏa của năm sinh cho Thổ của bạn — một thế được nâng đỡ tự nhiên. Năm tương đối thuận để tích luỹ và xây nền dài hạn.';
    case 'Kim':
      return 'Hỏa của năm khắc Kim của bạn, nên dễ cảm thấy áp lực và bị thử thách. Xem đó là lực rèn: đi chậm mà chắc, tránh phô trương.';
    case 'Thủy':
    default:
      return 'Thủy của bạn khắc Hỏa của năm, bạn có thể chủ động điều tiết nhịp năm nhưng cũng dễ cọ xát. Chọn trận mà đánh, đừng ôm mọi việc cùng lúc.';
  }
}

// ── Sao hạn theo từng năm sinh (cohort) ─────────────────────────────

export interface CohortRow {
  birthYear: number;
  tuoiMu: number;
  saoNam: SaoInfo;
  saoNu: SaoInfo;
}

/** Các năm sinh dương của một con giáp trong khoảng cho người còn sống, kèm sao hạn 2026. */
function cohortsFor(chi: Chi): CohortRow[] {
  const rows: CohortRow[] = [];
  for (let y = 1936; y <= 2020; y++) {
    if (canChiOfYear(y).chi !== chi) continue;
    const nam = computeSaoHan(y, 'nam', YEAR);
    const nu = computeSaoHan(y, 'nu', YEAR);
    if (!nam || !nu) continue;
    rows.push({ birthYear: y, tuoiMu: nam.tuoiMu, saoNam: nam.sao, saoNu: nu.sao });
  }
  return rows.sort((a, b) => b.birthYear - a.birthYear); // trẻ → già
}

// ── Tổng hợp 1 con giáp cho năm 2026 ────────────────────────────────

export interface ConGiap2026 {
  z: Zodiac;
  animal: string;
  relation: RelationKind;
  relationLabel: string;
  relationLine: string;
  nguHanhLine: string;
  isNamTuoi: boolean;
  isXungThaiTue: boolean;
  isTamTai: boolean;
  tamTaiChis: string[];
  cohorts: CohortRow[];
  verdictShort: string;
  seoTitle: string;
  seoDescription: string;
  faqs: { q: string; a: string }[];
}

export function buildConGiap2026(slug: string): ConGiap2026 | null {
  const z = findZodiac(slug);
  if (!z) return null;

  const chi = z.ten as Chi;
  const animalName = ANIMAL_BY_CHI[chi];

  const relation = relationOf(z.slug, YEAR_ZODIAC.slug);
  const relCopy = YEAR_RELATION[relation];
  const isNamTuoi = relation === 'dong-tuoi';
  const isXungThaiTue = relation === 'luc-xung';

  const tamTaiChis = TAM_TAI_YEARS[chi];
  const isTamTai = tamTaiChis.includes(YEAR_CHI);

  const cohorts = cohortsFor(chi);

  // Một câu chốt tổng quan, ghép từ các tín hiệu thật.
  const verdictParts: string[] = [];
  if (isNamTuoi) verdictParts.push('năm tuổi (Thái Tuế)');
  else if (isXungThaiTue) verdictParts.push('xung Thái Tuế');
  else if (relation === 'tam-hop') verdictParts.push('Tam Hợp với năm');
  else if (relation === 'luc-hop') verdictParts.push('Lục Hợp với năm');
  if (isTamTai) verdictParts.push('có Tam Tai');
  const verdictShort =
    verdictParts.length > 0
      ? `Tuổi ${z.ten} năm 2026: ${verdictParts.join(', ')}. Đây là tham khảo theo phong tục, không phải lời phán số mệnh.`
      : `Tuổi ${z.ten} năm 2026 ở thế bình hoà, không hạn nổi bật theo Can Chi. Năm nay phần lớn do bạn quyết định.`;

  const seoTitle = `Tử Vi 2026 tuổi ${z.ten}: hợp xung, sao hạn`;
  const seoDescription = `Tử Vi Bính Ngọ 2026 tuổi ${z.ten} (con ${animalName}): ${relCopy.label.toLowerCase()}, ${
    isTamTai ? 'có Tam Tai' : 'không Tam Tai'
  }, kèm bảng sao hạn theo năm sinh. Tham khảo, không phán số mệnh.`;

  const firstCohort = cohorts.find((c) => c.birthYear >= 1980) ?? cohorts[0];
  const faqs: { q: string; a: string }[] = [
    {
      q: `Tuổi ${z.ten} năm 2026 hợp hay xung?`,
      a: relCopy.line(z.ten),
    },
    {
      q: `Tuổi ${z.ten} có phạm Tam Tai năm 2026 không?`,
      a: isTamTai
        ? `Có. Nhóm tuổi ${z.ten} gặp Tam Tai vào 3 năm ${tamTaiChis.join(
            ', ',
          )}, và 2026 (năm Ngọ) là một trong ba năm đó. Theo phong tục, Tam Tai là giai đoạn nên làm việc thận trọng, tránh khởi sự quá lớn — nhưng đây là lưu ý tham khảo, không phải định mệnh.`
        : `Không. Nhóm tuổi ${z.ten} gặp Tam Tai vào 3 năm ${tamTaiChis.join(
            ', ',
          )}, còn 2026 là năm Ngọ nên không rơi vào Tam Tai.`,
    },
    firstCohort
      ? {
          q: `Tuổi ${z.ten} sinh năm ${firstCohort.birthYear} gặp sao gì năm 2026?`,
          a: `Sinh năm ${firstCohort.birthYear} thì năm 2026 là tuổi mụ ${firstCohort.tuoiMu}. Theo cách tính sao hạn (Cửu Diệu) theo tuổi và giới: nam gặp sao ${firstCohort.saoNam.name} (${firstCohort.saoNam.type === 'tot' ? 'cát tinh' : firstCohort.saoNam.type === 'xau' ? 'hung tinh' : 'trung tính'}), nữ gặp sao ${firstCohort.saoNu.name} (${firstCohort.saoNu.type === 'tot' ? 'cát tinh' : firstCohort.saoNu.type === 'xau' ? 'hung tinh' : 'trung tính'}). Xem bảng đầy đủ các năm sinh ở trên.`,
        }
      : {
          q: `Sao hạn tuổi ${z.ten} năm 2026 tính thế nào?`,
          a: `Sao hạn (Cửu Diệu) tính theo tuổi mụ và giới tính, mỗi năm đổi một sao. Xem bảng theo từng năm sinh ở trên.`,
        },
    {
      q: `Năm 2026 tuổi ${z.ten} nên chú ý gì?`,
      a: `${nguHanhVsYear(z.nguHanh)} Dù lá số chung con giáp chỉ là một lát cắt, bạn có thể dùng nó như một lời nhắc: chọn đúng việc để dồn sức, và đừng để phong tục biến thành nỗi sợ. Muốn chính xác hơn thì cần lá số riêng theo ngày giờ sinh.`,
    },
  ];

  return {
    z,
    animal: animalName,
    relation: relation,
    relationLabel: relCopy.label,
    relationLine: relCopy.line(z.ten),
    nguHanhLine: nguHanhVsYear(z.nguHanh),
    isNamTuoi,
    isXungThaiTue,
    isTamTai,
    tamTaiChis,
    cohorts,
    verdictShort,
    seoTitle,
    seoDescription,
    faqs,
  };
}
