/**
 * Dữ liệu cụm "Độ hợp cung hoàng đạo" (/cung-hoang-dao/hop).
 *
 * GROUNDING (chống bịa):
 *  - Quan hệ giữa 2 cung được PHÂN LOẠI bằng cách TÁI DÙNG `buildCung`
 *    (lib/cung-hoang-dao-data, đã sửa #564) — dùng chính các danh sách
 *    sameElement / support / opposite của cung A để xác định B đứng ở đâu.
 *    → cùng một khung nguyên tố (triplicity + cung đối), nhất quán, không chế.
 *  - Nội dung mỗi cặp ghép từ trait THẬT của 2 cung (EXTRA trong buildCung).
 *  - Quan hệ ĐỐI XỨNG (A↔B) → mỗi cặp 1 trang chuẩn (canonical), tránh trùng.
 *  - Giọng tham khảo, KHÔNG "khắc"/định mệnh: khác biệt = cần thấu hiểu, không phải
 *    không hợp. Độ hợp thật của 2 người cần cả bản đồ sao, không chỉ cung Mặt Trời.
 */
import { buildCung, CUNG_SLUGS, type CungData } from './cung-hoang-dao-data';
import type { FaqItem } from './seo/jsonld';

export type PairRelation = 'same-sign' | 'same-element' | 'support' | 'opposite' | 'different';

/** Tách 2 slug bằng "-va-" (không slug nào chứa chuỗi này → parse an toàn). */
const SEP = '-va-';

/** Slug chuẩn cho một cặp: 2 slug xếp theo idx tăng dần (A↔B cùng 1 trang). */
export function pairSlug(idxA: number, idxB: number): string {
  const [lo, hi] = idxA <= idxB ? [idxA, idxB] : [idxB, idxA];
  return `${CUNG_SLUGS[lo]}${SEP}${CUNG_SLUGS[hi]}`;
}

export function parsePairSlug(slug: string): { idxA: number; idxB: number } | null {
  const parts = slug.split(SEP);
  if (parts.length !== 2) return null;
  const idxA = (CUNG_SLUGS as readonly string[]).indexOf(parts[0]!);
  const idxB = (CUNG_SLUGS as readonly string[]).indexOf(parts[1]!);
  if (idxA < 0 || idxB < 0) return null;
  // Chỉ chấp nhận dạng chuẩn (idxA <= idxB) để 1 cặp = 1 URL.
  if (idxA > idxB) return null;
  return { idxA, idxB };
}

/** 78 cặp chuẩn (gồm 12 cặp cùng cung). */
export const ALL_PAIRS: string[] = (() => {
  const out: string[] = [];
  for (let i = 0; i < 12; i++) for (let j = i; j < 12; j++) out.push(pairSlug(i, j));
  return out;
})();

interface RelationCopy {
  label: (a: string, b: string, elA: string, elB: string) => string;
  blurb: (a: string, b: string, elA: string, elB: string) => string;
}

const RELATION: Record<PairRelation, RelationCopy> = {
  'same-sign': {
    label: (a) => `Cùng cung ${a}`,
    blurb: (a, _b, elA) =>
      `Hai người cùng cung ${a} dễ đồng điệu vì chung khí chất ${elA} — hiểu ý nhau nhanh, ít phải giải thích. Điều nên lưu ý: cùng điểm mạnh thì cũng cùng điểm yếu, dễ khuếch đại nếu không ai bù lại cho ai.`,
  },
  'same-element': {
    label: (_a, _b, elA) => `Cùng nguyên tố ${elA}`,
    blurb: (a, b, elA) =>
      `${a} và ${b} cùng thuộc nguyên tố ${elA} nên chung nhịp sống và giá trị, hòa hợp tự nhiên. Điều nên lưu ý: quá giống nhau đôi khi thiếu sự khác biệt để kích thích, cần chủ động làm mới.`,
  },
  support: {
    label: (_a, _b, elA, elB) => `Bổ trợ (${elA} – ${elB})`,
    blurb: (a, b, elA, elB) =>
      `${a} (${elA}) và ${b} (${elB}) thuộc hai nguyên tố nâng đỡ nhau — khác mà hợp: một bên mang năng lượng và ý tưởng, một bên mang chiều sâu hoặc sự ổn định. Đây thường là cặp dễ chịu, bổ khuyết cho nhau.`,
  },
  opposite: {
    label: () => `Cung đối nhau`,
    blurb: (a, b) =>
      `${a} và ${b} nằm đối nhau trên vòng hoàng đạo — hút nhau mạnh vì mỗi người có đúng thứ người kia còn thiếu. Vừa cuốn hút vừa thử thách: nếu biết tôn trọng khác biệt, hai người học được rất nhiều từ nhau.`,
  },
  different: {
    label: () => `Khác biệt — cần thấu hiểu`,
    blurb: (a, b, elA, elB) =>
      `${a} (${elA}) và ${b} (${elB}) vận hành theo nhịp khác nhau, nên cần thêm lắng nghe và nhường nhịn. Khác biệt KHÔNG có nghĩa là không hợp — nhiều cặp bền chính nhờ học cách bù trừ. Không có chuyện hai cung "khắc" nhau theo kiểu định mệnh.`,
  },
};

export interface PairData {
  slug: string;
  a: CungData;
  b: CungData;
  relation: PairRelation;
  relLabel: string;
  relBlurb: string;
  faqs: FaqItem[];
  seoTitle: string;
  seoDescription: string;
}

/** Phân loại quan hệ của B so với A bằng chính các danh sách của buildCung(A). */
function relationOf(dA: CungData, idxB: number): PairRelation {
  if (dA.idx === idxB) return 'same-sign';
  const bSlug = CUNG_SLUGS[idxB]!;
  if (dA.opposite.slug === bSlug) return 'opposite';
  if (dA.sameElement.some((s) => s.slug === bSlug)) return 'same-element';
  if (dA.support.some((s) => s.slug === bSlug)) return 'support';
  return 'different';
}

export function buildPair(slug: string): PairData | null {
  const parsed = parsePairSlug(slug);
  if (!parsed) return null;
  const a = buildCung(CUNG_SLUGS[parsed.idxA]!);
  const b = buildCung(CUNG_SLUGS[parsed.idxB]!);
  if (!a || !b) return null;

  const relation = relationOf(a, parsed.idxB);
  const copy = RELATION[relation];
  const elA = a.z.element;
  const elB = b.z.element;
  const relLabel = copy.label(a.z.name, b.z.name, elA, elB);
  const relBlurb = copy.blurb(a.z.name, b.z.name, elA, elB);

  const faqs: FaqItem[] = [
    {
      q: `Cung ${a.z.name} và ${b.z.name} có hợp nhau không?`,
      a: `${relLabel}. ${relBlurb}`,
    },
    {
      q: `Vì sao ${a.z.name} và ${b.z.name} ${relation === 'different' ? 'cần thấu hiểu nhau hơn' : 'hợp nhau'}?`,
      a: `Theo khung nguyên tố của chiêm tinh: ${a.z.name} thuộc ${elA}, ${b.z.name} thuộc ${elB}. ${
        relation === 'same-sign'
          ? 'Cùng một cung nên chung khí chất.'
          : relation === 'same-element'
            ? 'Cùng nguyên tố nên cùng nhịp.'
            : relation === 'support'
              ? 'Hai nguyên tố nâng đỡ nhau.'
              : relation === 'opposite'
                ? 'Hai cung đối nhau, bổ khuyết cho nhau.'
                : 'Hai nguyên tố khác nhịp, cần bù trừ.'
      } Đây là xu hướng chung; độ hợp thật còn tùy bản đồ sao đầy đủ của cả hai, không chỉ cung Mặt Trời.`,
    },
    {
      q: `Độ hợp theo cung hoàng đạo có chính xác tuyệt đối không?`,
      a: `Không. Cung Mặt Trời chỉ là một phần. Cung Mọc, Mặt Trăng và các hành tinh (phụ thuộc giờ và nơi sinh) mới vẽ nên bức tranh đầy đủ. Hãy xem đây là gợi ý để hiểu nhau hơn, không phải phán quyết về một mối quan hệ.`,
    },
  ];

  const seoTitle = `Cung ${a.z.name} và ${b.z.name} có hợp nhau không? Độ hợp tình yêu & tính cách`;
  const seoDescription = `${a.z.name} và ${b.z.name}: ${relLabel.toLowerCase()}. ${relBlurb} Xu hướng hòa hợp theo nguyên tố, tham khảo, không phán số mệnh.`;

  return {
    slug,
    a,
    b,
    relation,
    relLabel,
    relBlurb,
    faqs,
    seoTitle,
    seoDescription,
  };
}

/** Ô ma trận hub: nhãn quan hệ ngắn để tô màu (không cần buildPair đầy đủ). */
export interface MatrixCell {
  slug: string;
  relation: PairRelation;
}

export function matrixRow(idxA: number): MatrixCell[] {
  const dA = buildCung(CUNG_SLUGS[idxA]!)!;
  const row: MatrixCell[] = [];
  for (let j = 0; j < 12; j++) {
    row.push({ slug: pairSlug(idxA, j), relation: relationOf(dA, j) });
  }
  return row;
}

export const RELATION_SHORT: Record<PairRelation, string> = {
  'same-sign': 'Cùng cung',
  'same-element': 'Cùng nguyên tố',
  support: 'Bổ trợ',
  opposite: 'Cung đối',
  different: 'Cần thấu hiểu',
};
