/**
 * Data + rules cho các trang SEO "hợp tuổi từng cặp" (/hop-tuoi/tuoi/[cap]).
 *
 * Một nguồn sự thật cho 12 con giáp và cách phân loại quan hệ giữa 2 con giáp
 * theo Can Chi dân gian (Tam Hợp / Lục Hợp / Lục Xung / Lục Hại / cùng tuổi /
 * bình hoà). Pure data — không React, không side effect.
 *
 * GIỌNG ON-BRAND: đây là tham khảo tổng quan THEO CON GIÁP, không quyết định số
 * phận. Lá số chi tiết theo năm/giờ sinh + yếu tố con người quan trọng hơn. Cặp
 * "xung"/"hại" được diễn đạt theo hướng dung hoà, KHÔNG hù doạ.
 *
 * Slug PHẢI khớp `ZODIAC_LIST` trong sitemap.ts:
 *   ty, suu, dan, mao, thin, ti, ngo, mui, than, dau, tuat, hoi
 * (Lưu ý: Tỵ = "ti".)
 */

export type NguHanh = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';

export type RelationKind =
  | 'tam-hop'
  | 'luc-hop'
  | 'luc-xung'
  | 'luc-hai'
  | 'dong-tuoi'
  | 'binh-hoa';

export interface Zodiac {
  /** Slug khớp sitemap ZODIAC_LIST. */
  slug: string;
  /** Tên con giáp tiếng Việt (Tý, Sửu, …). */
  ten: string;
  /** Ngũ hành của địa chi. */
  nguHanh: NguHanh;
  /** Emoji minh hoạ (trang trí, aria-hidden khi render). */
  emoji: string;
  /** 1-2 câu tính cách riêng, on-brand. */
  blurb: string;
}

/**
 * 12 con giáp theo đúng thứ tự địa chi.
 * Ngũ hành cố định theo đề bài.
 */
export const ZODIAC: readonly Zodiac[] = [
  {
    slug: 'ty',
    ten: 'Tý',
    nguHanh: 'Thủy',
    emoji: '🐭',
    blurb:
      'Người tuổi Tý thường nhanh nhạy, quan sát tốt và xoay xở khéo trong tình huống mới. Điểm cần lưu ý là dễ ôm nhiều việc cùng lúc nên cần biết chọn ưu tiên.',
  },
  {
    slug: 'suu',
    ten: 'Sửu',
    nguHanh: 'Thổ',
    emoji: '🐮',
    blurb:
      'Người tuổi Sửu bền bỉ, kiên định và đáng tin trong những cam kết dài hạn. Mặt khác đôi khi hơi cứng nhắc, cần cởi mở hơn với cách làm mới.',
  },
  {
    slug: 'dan',
    ten: 'Dần',
    nguHanh: 'Mộc',
    emoji: '🐯',
    blurb:
      'Người tuổi Dần mạnh mẽ, dám mở đường và truyền cảm hứng cho người quanh mình. Năng lượng lớn nên cũng cần học cách giữ nhịp để không đốt sức quá nhanh.',
  },
  {
    slug: 'mao',
    ten: 'Mão',
    nguHanh: 'Mộc',
    emoji: '🐰',
    blurb:
      'Người tuổi Mão tinh tế, ôn hoà và giỏi giữ hoà khí trong các mối quan hệ. Điểm cần chú ý là đôi khi ngại va chạm nên hay trì hoãn quyết định khó.',
  },
  {
    slug: 'thin',
    ten: 'Thìn',
    nguHanh: 'Thổ',
    emoji: '🐲',
    blurb:
      'Người tuổi Thìn có tầm nhìn, tự tin và hợp với vai trò dẫn dắt. Cá tính mạnh nên cũng cần lắng nghe nhiều hơn để giữ sự đồng thuận.',
  },
  {
    slug: 'ti',
    ten: 'Tỵ',
    nguHanh: 'Hỏa',
    emoji: '🐍',
    blurb:
      'Người tuổi Tỵ sâu sắc, điềm tĩnh và có trực giác tốt khi đọc tình huống. Vì kín đáo nên đôi khi cần chủ động chia sẻ để người khác hiểu mình hơn.',
  },
  {
    slug: 'ngo',
    ten: 'Ngọ',
    nguHanh: 'Hỏa',
    emoji: '🐴',
    blurb:
      'Người tuổi Ngọ nhiệt tình, phóng khoáng và thích sự tự do trong hành động. Nhịp sống nhanh nên cần dành chỗ để nghỉ và tránh ôm việc vượt sức.',
  },
  {
    slug: 'mui',
    ten: 'Mùi',
    nguHanh: 'Thổ',
    emoji: '🐐',
    blurb:
      'Người tuổi Mùi hiền hoà, biết quan tâm và tạo cảm giác an toàn cho người thân. Đôi khi cả nể nên cần học cách giữ ranh giới cho riêng mình.',
  },
  {
    slug: 'than',
    ten: 'Thân',
    nguHanh: 'Kim',
    emoji: '🐵',
    blurb:
      'Người tuổi Thân linh hoạt, thông minh và giỏi tìm giải pháp sáng tạo. Vì hiếu động nên cần tập trung để không phân tán vào quá nhiều hướng.',
  },
  {
    slug: 'dau',
    ten: 'Dậu',
    nguHanh: 'Kim',
    emoji: '🐔',
    blurb:
      'Người tuổi Dậu cẩn thận, kỷ luật và chú trọng chi tiết trong công việc. Tiêu chuẩn cao nên đôi lúc cần bớt khắt khe với mình và người khác.',
  },
  {
    slug: 'tuat',
    ten: 'Tuất',
    nguHanh: 'Thổ',
    emoji: '🐶',
    blurb:
      'Người tuổi Tuất trung thực, trách nhiệm và sẵn lòng bảo vệ người mình tin tưởng. Vì giàu nguyên tắc nên cần thư giãn hơn để tránh căng thẳng không cần thiết.',
  },
  {
    slug: 'hoi',
    ten: 'Hợi',
    nguHanh: 'Thủy',
    emoji: '🐷',
    blurb:
      'Người tuổi Hợi chân thành, rộng lượng và dễ chịu trong giao tiếp. Tính lạc quan là điểm mạnh, đi kèm với việc cần cân nhắc kỹ hơn khi chi tiêu hay cam kết.',
  },
] as const;

/** Tra cứu nhanh con giáp theo slug. */
const BY_SLUG: ReadonlyMap<string, Zodiac> = new Map(ZODIAC.map((z) => [z.slug, z]));

export function findZodiac(slug: string): Zodiac | undefined {
  return BY_SLUG.get(slug);
}

/** Vị trí (0-11) theo thứ tự địa chi — dùng để chuẩn hoá thứ tự cặp. */
const ORDER: ReadonlyMap<string, number> = new Map(ZODIAC.map((z, i) => [z.slug, i]));

// --- Quy tắc quan hệ (cố định theo đề bài, dùng slug) -----------------------

/** Tam Hợp: 4 nhóm tam giác. */
const TAM_HOP_GROUPS: readonly (readonly [string, string, string])[] = [
  ['than', 'ty', 'thin'], // Thân – Tý – Thìn
  ['dan', 'ngo', 'tuat'], // Dần – Ngọ – Tuất
  ['ti', 'dau', 'suu'], // Tỵ – Dậu – Sửu
  ['hoi', 'mao', 'mui'], // Hợi – Mão – Mùi
];

/** Lục Hợp: 6 cặp. */
const LUC_HOP_PAIRS: readonly (readonly [string, string])[] = [
  ['ty', 'suu'], // Tý – Sửu
  ['dan', 'hoi'], // Dần – Hợi
  ['mao', 'tuat'], // Mão – Tuất
  ['thin', 'dau'], // Thìn – Dậu
  ['ti', 'than'], // Tỵ – Thân
  ['ngo', 'mui'], // Ngọ – Mùi
];

/** Lục Xung: 6 cặp đối xung. */
const LUC_XUNG_PAIRS: readonly (readonly [string, string])[] = [
  ['ty', 'ngo'], // Tý – Ngọ
  ['suu', 'mui'], // Sửu – Mùi
  ['dan', 'than'], // Dần – Thân
  ['mao', 'dau'], // Mão – Dậu
  ['thin', 'tuat'], // Thìn – Tuất
  ['ti', 'hoi'], // Tỵ – Hợi
];

/** Lục Hại: 6 cặp tương hại. */
const LUC_HAI_PAIRS: readonly (readonly [string, string])[] = [
  ['ty', 'mui'], // Tý – Mùi
  ['suu', 'ngo'], // Sửu – Ngọ
  ['dan', 'ti'], // Dần – Tỵ
  ['mao', 'thin'], // Mão – Thìn
  ['than', 'hoi'], // Thân – Hợi
  ['dau', 'tuat'], // Dậu – Tuất
];

/** Khoá không phụ thuộc thứ tự cho 1 cặp (vd "suu|ty"). */
function pairKey(a: string, b: string): string {
  return [a, b].sort().join('|');
}

function buildPairSet(pairs: readonly (readonly [string, string])[]): ReadonlySet<string> {
  return new Set(pairs.map(([a, b]) => pairKey(a, b)));
}

function buildTamHopSet(
  groups: readonly (readonly [string, string, string])[],
): ReadonlySet<string> {
  const set = new Set<string>();
  for (const [a, b, c] of groups) {
    set.add(pairKey(a, b));
    set.add(pairKey(b, c));
    set.add(pairKey(a, c));
  }
  return set;
}

const TAM_HOP_SET = buildTamHopSet(TAM_HOP_GROUPS);
const LUC_HOP_SET = buildPairSet(LUC_HOP_PAIRS);
const LUC_XUNG_SET = buildPairSet(LUC_XUNG_PAIRS);
const LUC_HAI_SET = buildPairSet(LUC_HAI_PAIRS);

/**
 * Phân loại quan hệ giữa 2 con giáp (theo slug) thành 1 trong 6 loại.
 * Thứ tự ưu tiên: cùng tuổi → tam hợp → lục hợp → lục xung → lục hại → bình hoà.
 * (Các tập tam/lục không giao nhau nên thứ tự chỉ để rõ ràng.)
 */
export function relationOf(aSlug: string, bSlug: string): RelationKind {
  if (aSlug === bSlug) return 'dong-tuoi';
  const key = pairKey(aSlug, bSlug);
  if (TAM_HOP_SET.has(key)) return 'tam-hop';
  if (LUC_HOP_SET.has(key)) return 'luc-hop';
  if (LUC_XUNG_SET.has(key)) return 'luc-xung';
  if (LUC_HAI_SET.has(key)) return 'luc-hai';
  return 'binh-hoa';
}

// --- Slug cặp & chuẩn hoá ---------------------------------------------------

/**
 * Chuẩn hoá thứ tự 1 cặp theo thứ tự địa chi để dùng làm canonical.
 * vd sortPair("suu","ty") → ["ty","suu"].
 */
export function sortPair(aSlug: string, bSlug: string): [string, string] {
  const ia = ORDER.get(aSlug) ?? 0;
  const ib = ORDER.get(bSlug) ?? 0;
  return ia <= ib ? [aSlug, bSlug] : [bSlug, aSlug];
}

/** Slug cặp dạng "<a>-<b>" (vd "ty-suu"). */
export function pairToSlug(aSlug: string, bSlug: string): string {
  return `${aSlug}-${bSlug}`;
}

/** Slug cặp đã chuẩn hoá (canonical) — vd parse("suu-ty") cũng → "ty-suu". */
export function canonicalPairSlug(aSlug: string, bSlug: string): string {
  const [a, b] = sortPair(aSlug, bSlug);
  return pairToSlug(a, b);
}

export interface PairParse {
  a: Zodiac;
  b: Zodiac;
}

/**
 * Parse slug cặp "<a>-<b>" thành 2 con giáp. Trả về undefined nếu sai định dạng
 * hoặc slug con giáp không hợp lệ (để route gọi notFound()).
 */
export function parsePairSlug(cap: string): PairParse | undefined {
  const parts = cap.split('-');
  if (parts.length !== 2) return undefined;
  const a = findZodiac(parts[0]!);
  const b = findZodiac(parts[1]!);
  if (!a || !b) return undefined;
  return { a, b };
}

/**
 * TẤT CẢ 144 cặp có thứ tự (gồm cả cùng tuổi như "ty-ty").
 * Dùng cho generateStaticParams — cả cặp đảo đều render, canonical trỏ về bản
 * đã sort để Google gộp.
 */
export function allPairSlugs(): string[] {
  const out: string[] = [];
  for (const a of ZODIAC) {
    for (const b of ZODIAC) {
      out.push(pairToSlug(a.slug, b.slug));
    }
  }
  return out;
}

// --- Mô tả quan hệ & ngũ hành (cho nội dung trang) --------------------------

export interface RelationCopy {
  /** Nhãn ngắn (vd "Tam Hợp"). */
  label: string;
  /** Tóm tắt 1 câu, on-brand, không hù doạ. */
  summary: (aTen: string, bTen: string) => string;
  /** Diễn giải dài cho phần thân (xây dựng, tham khảo). */
  detail: (aTen: string, bTen: string) => string;
}

export const RELATION_COPY: Record<RelationKind, RelationCopy> = {
  'tam-hop': {
    label: 'Tam Hợp',
    summary: (a, b) =>
      `Theo Can Chi, ${a} và ${b} thuộc nhóm Tam Hợp — nhóm con giáp thường dễ tìm tiếng nói chung.`,
    detail: (a, b) =>
      `Tuổi ${a} và tuổi ${b} nằm trong cùng một nhóm Tam Hợp. Trong quan niệm Can Chi, đây là những con giáp có nhịp hợp nhau, nên hai bên thường dễ thấu hiểu, hỗ trợ và phối hợp ăn ý. Đây là một tín hiệu tham khảo tích cực — nhưng một mối quan hệ bền vẫn dựa trên cách hai người lắng nghe và tôn trọng nhau hằng ngày, hơn là chỉ ở con giáp.`,
  },
  'luc-hop': {
    label: 'Lục Hợp',
    summary: (a, b) =>
      `Theo Can Chi, ${a} và ${b} là một cặp Lục Hợp — cặp con giáp thường bổ trợ cho nhau.`,
    detail: (a, b) =>
      `Tuổi ${a} và tuổi ${b} tạo thành một cặp Lục Hợp. Trong văn hoá Can Chi, Lục Hợp gợi ý sự gắn kết và bổ trợ: điểm mạnh của người này có thể cân bằng điểm yếu của người kia. Hãy xem đây là một gợi ý tham khảo dễ chịu, còn sự hoà hợp thật sự đến từ chia sẻ mục tiêu và đồng hành cùng nhau.`,
  },
  'luc-xung': {
    label: 'Lục Xung',
    summary: (a, b) =>
      `Theo Can Chi, ${a} và ${b} thuộc nhóm Lục Xung — hai cá tính khác nhịp, cần dung hoà nhiều hơn.`,
    detail: (a, b) =>
      `Tuổi ${a} và tuổi ${b} được xếp vào nhóm Lục Xung. Điều này KHÔNG có nghĩa là không thể đi cùng nhau — nó chỉ gợi ý hai người có nhịp sống và cách phản ứng khác nhau, nên đôi khi dễ va chạm quan điểm. Nhiều cặp "xung" vẫn rất bền khi cả hai chủ động hiểu nhau, nhường nhịn đúng lúc và biến khác biệt thành sự bổ sung. Con giáp chỉ là một lát cắt nhỏ; điều quyết định vẫn là thiện chí của hai người.`,
  },
  'luc-hai': {
    label: 'Lục Hại',
    summary: (a, b) =>
      `Theo Can Chi, ${a} và ${b} thuộc nhóm Lục Hại — cần thêm sự thấu hiểu để tránh hiểu lầm.`,
    detail: (a, b) =>
      `Tuổi ${a} và tuổi ${b} thuộc nhóm Lục Hại trong Can Chi. Cách hiểu lành mạnh: hai người có thể dễ hiểu lầm nhau ở một vài điểm, nên cần giao tiếp rõ ràng và kiên nhẫn hơn. Đây không phải lời cảnh báo "tránh nhau" — rất nhiều mối quan hệ thuộc nhóm này vẫn hoà thuận khi cả hai đặt sự chân thành lên trước và cùng nhau xử lý khác biệt một cách xây dựng.`,
  },
  'dong-tuoi': {
    label: 'Cùng tuổi',
    summary: (a) =>
      `Hai người cùng tuổi ${a} thường hiểu nhau nhanh, đồng thời cần ý thức về những điểm giống nhau quá mức.`,
    detail: (a) =>
      `Khi cả hai cùng tuổi ${a}, hai người thường chia sẻ nhiều điểm tính cách giống nhau nên dễ đồng cảm và bắt nhịp. Mặt cần lưu ý là những điểm mạnh — và cả điểm yếu — có thể được nhân đôi, nên hai bên nên có ý thức bổ sung cho nhau ở chỗ cùng thiếu. Sự tương đồng là khởi đầu thuận lợi, phần còn lại nằm ở cách hai người phối hợp.`,
  },
  'binh-hoa': {
    label: 'Bình hoà',
    summary: (a, b) =>
      `Theo Can Chi, ${a} và ${b} ở mức bình hoà — không xung khắc rõ rệt, mọi thứ phụ thuộc vào cách hai người vun đắp.`,
    detail: (a, b) =>
      `Tuổi ${a} và tuổi ${b} không thuộc các nhóm hợp đặc biệt (Tam Hợp, Lục Hợp) cũng không thuộc nhóm cần lưu ý (Lục Xung, Lục Hại). Theo Can Chi, đây là mối quan hệ "bình hoà": không có lực hút hay lực đẩy nổi bật từ con giáp. Nói cách khác, kết quả gần như hoàn toàn nằm trong tay hai người — sự hợp nhau đến từ giá trị chung, giao tiếp và đồng hành, chứ không phải từ tuổi.`,
  },
};

/**
 * Diễn giải tương tác Ngũ Hành giữa hai con giáp (tương sinh / tương khắc /
 * cùng hành / trung tính). Mang tính tham khảo, không phán định.
 */
export interface NguHanhInteraction {
  kind: 'tuong-sinh' | 'tuong-khac' | 'dong-hanh' | 'trung-tinh';
  text: string;
}

// Vòng tương sinh: Mộc→Hỏa→Thổ→Kim→Thủy→Mộc.
const SINH_NEXT: Record<NguHanh, NguHanh> = {
  Mộc: 'Hỏa',
  Hỏa: 'Thổ',
  Thổ: 'Kim',
  Kim: 'Thủy',
  Thủy: 'Mộc',
};
// Vòng tương khắc: Mộc→Thổ→Thủy→Hỏa→Kim→Mộc.
const KHAC_NEXT: Record<NguHanh, NguHanh> = {
  Mộc: 'Thổ',
  Thổ: 'Thủy',
  Thủy: 'Hỏa',
  Hỏa: 'Kim',
  Kim: 'Mộc',
};

export function nguHanhInteraction(a: Zodiac, b: Zodiac): NguHanhInteraction {
  const ha = a.nguHanh;
  const hb = b.nguHanh;
  if (ha === hb) {
    return {
      kind: 'dong-hanh',
      text: `Cả hai cùng hành ${ha}, nên dễ đồng điệu về cách nhìn và nhịp sống; điểm cần để ý là cùng mạnh ở một phía thì nên bổ sung cho nhau ở phía còn thiếu.`,
    };
  }
  if (SINH_NEXT[ha] === hb || SINH_NEXT[hb] === ha) {
    const giver = SINH_NEXT[ha] === hb ? a : b;
    const receiver = SINH_NEXT[ha] === hb ? b : a;
    return {
      kind: 'tuong-sinh',
      text: `Về Ngũ Hành, hành ${giver.nguHanh} (tuổi ${giver.ten}) tương sinh cho hành ${receiver.nguHanh} (tuổi ${receiver.ten}) — gợi ý một sự nâng đỡ tự nhiên, người này dễ tiếp thêm năng lượng cho người kia.`,
    };
  }
  if (KHAC_NEXT[ha] === hb || KHAC_NEXT[hb] === ha) {
    return {
      kind: 'tuong-khac',
      text: `Về Ngũ Hành, hành ${ha} (tuổi ${a.ten}) và hành ${hb} (tuổi ${b.ten}) ở thế tương khắc — không phải điều xấu, mà là lời nhắc hai người nên dung hoà để khác biệt trở thành sự cân bằng thay vì cọ xát.`,
    };
  }
  return {
    kind: 'trung-tinh',
    text: `Về Ngũ Hành, hành ${ha} (tuổi ${a.ten}) và hành ${hb} (tuổi ${b.ten}) ở thế trung tính — không sinh không khắc rõ rệt, nên sự hoà hợp phụ thuộc nhiều vào cách hai người phối hợp.`,
  };
}
