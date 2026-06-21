/**
 * Dữ liệu cho 12 trang "Tử Vi 2027 theo con giáp" (/tu-vi-2027/[congiap]).
 *
 * THUẦN TÍNH TOÁN, không React, không gọi AI, không gọi backend. Mọi dữ kiện lấy
 * từ engine Can Chi đã có sẵn và đã được kiểm chứng:
 *   - canChiOfYear, TAM_TAI_YEARS  (lib/xem-tuoi-cuoi.ts)
 *   - relationOf, ZODIAC           (lib/hop-tuoi-pairs.ts)
 *   - computeSaoHan, SAO_INFO      (lib/sao-han.ts)
 *
 * Năm 2027 = Đinh Mùi (địa chi Mùi, hành Thổ). Mỗi con giáp ra một trang riêng
 * biệt nhờ: quan hệ tuổi với năm (Thái Tuế / Tam Hợp / Lục Hợp / Lục Hại / bình
 * hoà), tương tác ngũ hành với Thổ, có phạm Tam Tai không, và bảng sao hạn theo
 * từng năm sinh (cả nam lẫn nữ). Phần văn vận-trình 4 mảng nằm ở
 * `tu-vi-2027-content.ts` (đã qua phản biện chống over-claim), ghép ở tầng trang.
 *
 * GIỌNG ON-BRAND: tra cứu phong tục Can Chi để THAM KHẢO, không phán số mệnh,
 * không hù doạ, không bán lễ giải hạn.
 *
 * Đây là bản mirror của `tu-vi-2026/con-giap-data.ts` cho năm Đinh Mùi 2027 —
 * giữ nguyên cấu trúc + engine, chỉ đổi năm (Ngọ/Hỏa → Mùi/Thổ).
 */

import {
  ZODIAC,
  findZodiac,
  relationOf,
  type Zodiac,
  type RelationKind,
  type NguHanh,
} from '../../lib/hop-tuoi-pairs';
import { canChiOfYear, TAM_TAI_YEARS, ANIMAL_BY_CHI, type Chi } from '../../lib/xem-tuoi-cuoi';
import { computeSaoHan, type SaoInfo } from '../../lib/sao-han';

export const YEAR = 2027;
export const YEAR_CANCHI = canChiOfYear(YEAR); // { can:'Đinh', chi:'Mùi', name:'Đinh Mùi', animal:'Dê' }
export const YEAR_CHI = YEAR_CANCHI.chi; // 'Mùi'
/** Con giáp của năm (Mùi) — dùng để xét quan hệ tuổi ↔ năm. */
const YEAR_ZODIAC = ZODIAC.find((z) => z.ten === YEAR_CHI)!; // slug 'mui'
export const YEAR_RANGE = '06/02/2027 → 25/01/2028';

/** Danh sách slug 12 con giáp (khớp ZODIAC_LIST trong sitemap). */
export const CON_GIAP_SLUGS: string[] = ZODIAC.map((z) => z.slug);

// ── Quan hệ tuổi ↔ năm Mùi 2027 ─────────────────────────────────────
// Dùng đúng khung Can Chi (relationOf), diễn đạt theo ngữ cảnh "tuổi với năm".

interface YearRelationCopy {
  label: string;
  line: (ten: string) => string;
}

const YEAR_RELATION: Record<RelationKind, YearRelationCopy> = {
  'tam-hop': {
    label: 'Tam Hợp với năm',
    line: (t) =>
      `Tuổi ${t} nằm trong nhóm Tam Hợp với năm Mùi 2027 — một tín hiệu tham khảo thuận. Nhịp của năm dễ ăn khớp với bạn, hợp để chủ động đẩy những việc đã chuẩn bị kỹ thay vì khởi sự vội.`,
  },
  'luc-hop': {
    label: 'Lục Hợp với năm',
    line: (t) =>
      `Tuổi ${t} ở thế Lục Hợp với năm Mùi 2027 — gợi ý một năm tương đối hoà thuận, dễ có người nâng đỡ nếu bạn chịu mở lời nhờ giúp đúng lúc.`,
  },
  'luc-xung': {
    label: 'Lục Xung với năm (xung Thái Tuế)',
    line: (t) =>
      `Tuổi ${t} xung với năm Mùi 2027 (dân gian gọi là xung Thái Tuế). Đây không phải điềm xấu cố định, mà là lời nhắc năm nay nhiều biến động và va chạm hơn với bạn — nên giữ nhịp chắc, tránh quyết định lớn lúc đang nóng.`,
  },
  'luc-hai': {
    label: 'Lục Hại với năm',
    line: (t) =>
      `Tuổi ${t} ở thế Lục Hại với năm Mùi 2027 — dễ vướng hiểu lầm vặt và phiền toái nhỏ. Cách hoá giải thực tế nhất là giao tiếp rõ ràng và kiên nhẫn hơn bình thường.`,
  },
  'dong-tuoi': {
    label: 'Năm tuổi (Bản Mệnh Thái Tuế)',
    line: (t) =>
      `2027 là năm tuổi của người tuổi ${t} (Bản Mệnh Thái Tuế). Theo phong tục, năm tuổi nên giữ ổn định và làm việc chắc tay — đây là một lưu ý nhẹ để cẩn trọng, không phải hạn nặng.`,
  },
  'binh-hoa': {
    label: 'Bình hoà với năm',
    line: (t) =>
      `Tuổi ${t} ở thế bình hoà với năm Mùi 2027 — không hợp cũng không xung nổi bật. Năm nay ra sao phần lớn nằm ở lựa chọn và nỗ lực của bạn, hơn là ở con giáp.`,
  },
};

// ── Tương tác ngũ hành với năm (Thổ) ────────────────────────────────
// Năm Mùi = hành Thổ. Vòng sinh: Mộc→Hỏa→Thổ→Kim→Thủy→Mộc (Hỏa sinh Thổ, Thổ
// sinh Kim). Vòng khắc: Mộc→Thổ→Thủy (Mộc khắc Thổ, Thổ khắc Thủy). Diễn đạt
// năm-framed, không hù doạ.

function nguHanhVsYear(e: NguHanh): string {
  switch (e) {
    case 'Thổ':
      return 'Con giáp của bạn cùng hành Thổ với năm, nên dễ đồng điệu về nhịp sống — vững vàng, chắc tay. Mặt cần để ý là cùng mạnh một phía thì nên chủ động bổ sung cho mình ở chỗ còn thiếu.';
    case 'Hỏa':
      return 'Hành Hỏa của bạn sinh cho Thổ của năm, nên bạn dễ dồn sức cho việc chung và được ghi nhận. Nhớ giữ lại năng lượng cho bản thân để không kiệt sức.';
    case 'Kim':
      return 'Thổ của năm sinh cho Kim của bạn — một thế được nâng đỡ tự nhiên. Năm tương đối thuận để tích luỹ, học hỏi và xây nền dài hạn.';
    case 'Mộc':
      return 'Mộc của bạn khắc Thổ của năm, nên bạn có thể chủ động điều tiết nhịp năm nhưng cũng dễ cọ xát. Chọn trận mà đánh, đừng ôm mọi việc cùng lúc.';
    case 'Thủy':
    default:
      return 'Thổ của năm khắc Thủy của bạn, nên dễ cảm thấy áp lực và bị thử thách. Xem đó là lực rèn: đi chậm mà chắc, giữ giao tiếp rõ ràng, tránh phô trương.';
  }
}

// ── Sao hạn theo từng năm sinh (cohort) ─────────────────────────────

export interface CohortRow {
  birthYear: number;
  tuoiMu: number;
  saoNam: SaoInfo;
  saoNu: SaoInfo;
}

/** Các năm sinh dương của một con giáp trong khoảng cho người còn sống, kèm sao hạn 2027. */
function cohortsFor(chi: Chi): CohortRow[] {
  const rows: CohortRow[] = [];
  for (let y = 1936; y <= 2021; y++) {
    if (canChiOfYear(y).chi !== chi) continue;
    const nam = computeSaoHan(y, 'nam', YEAR);
    const nu = computeSaoHan(y, 'nu', YEAR);
    if (!nam || !nu) continue;
    rows.push({ birthYear: y, tuoiMu: nam.tuoiMu, saoNam: nam.sao, saoNu: nu.sao });
  }
  return rows.sort((a, b) => b.birthYear - a.birthYear); // trẻ → già
}

// ── Tổng hợp 1 con giáp cho năm 2027 ────────────────────────────────

export interface ConGiap2027 {
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

export function buildConGiap2027(slug: string): ConGiap2027 | null {
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
      ? `Tuổi ${z.ten} năm 2027: ${verdictParts.join(', ')}. Đây là tham khảo theo phong tục, không phải lời phán số mệnh.`
      : `Tuổi ${z.ten} năm 2027 ở thế bình hoà, không hạn nổi bật theo Can Chi. Năm nay phần lớn do bạn quyết định.`;

  const seoTitle = `Tử Vi 2027 tuổi ${z.ten} (con ${animalName}): hợp xung, sao hạn, Tam Tai`;
  const seoDescription = `Tử Vi năm Đinh Mùi 2027 cho tuổi ${z.ten}: ${relCopy.label.toLowerCase()}, ${
    isTamTai ? 'có phạm Tam Tai' : 'không phạm Tam Tai'
  }, kèm vận trình sự nghiệp – tài lộc – tình cảm – sức khoẻ và bảng sao hạn theo từng năm sinh. Tính minh bạch theo Can Chi, tham khảo, không phán số mệnh.`;

  const firstCohort = cohorts.find((c) => c.birthYear >= 1980) ?? cohorts[0];
  const faqs: { q: string; a: string }[] = [
    {
      q: `Tuổi ${z.ten} năm 2027 hợp hay xung?`,
      a: relCopy.line(z.ten),
    },
    {
      q: `Tuổi ${z.ten} có phạm Tam Tai năm 2027 không?`,
      a: isTamTai
        ? `Có. Nhóm tuổi ${z.ten} gặp Tam Tai vào 3 năm ${tamTaiChis.join(
            ', ',
          )}, và 2027 (năm Mùi) là một trong ba năm đó. Theo phong tục, Tam Tai là giai đoạn nên làm việc thận trọng, tránh khởi sự quá lớn — nhưng đây là lưu ý tham khảo, không phải định mệnh.`
        : `Không. Nhóm tuổi ${z.ten} gặp Tam Tai vào 3 năm ${tamTaiChis.join(
            ', ',
          )}, còn 2027 là năm Mùi nên không rơi vào Tam Tai.`,
    },
    firstCohort
      ? {
          q: `Tuổi ${z.ten} sinh năm ${firstCohort.birthYear} gặp sao gì năm 2027?`,
          a: `Sinh năm ${firstCohort.birthYear} thì năm 2027 là tuổi mụ ${firstCohort.tuoiMu}. Theo cách tính sao hạn (Cửu Diệu) theo tuổi và giới: nam gặp sao ${firstCohort.saoNam.name} (${firstCohort.saoNam.type === 'tot' ? 'cát tinh' : firstCohort.saoNam.type === 'xau' ? 'hung tinh' : 'trung tính'}), nữ gặp sao ${firstCohort.saoNu.name} (${firstCohort.saoNu.type === 'tot' ? 'cát tinh' : firstCohort.saoNu.type === 'xau' ? 'hung tinh' : 'trung tính'}). Xem bảng đầy đủ các năm sinh ở trên.`,
        }
      : {
          q: `Sao hạn tuổi ${z.ten} năm 2027 tính thế nào?`,
          a: `Sao hạn (Cửu Diệu) tính theo tuổi mụ và giới tính, mỗi năm đổi một sao. Xem bảng theo từng năm sinh ở trên.`,
        },
    {
      q: `Năm 2027 tuổi ${z.ten} nên chú ý gì?`,
      a: `${nguHanhVsYear(z.nguHanh)} Dù lá số chung con giáp chỉ là một lát cắt, bạn có thể dùng nó như một lời nhắc: chọn đúng việc để dồn sức, và đừng để phong tục biến thành nỗi sợ. Muốn chính xác hơn thì cần lá số riêng theo ngày giờ sinh.`,
    },
  ];

  return {
    z,
    animal: animalName,
    relation,
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
