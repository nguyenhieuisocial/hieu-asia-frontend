/**
 * Deterministic per-zodiac daily blurb generator.
 *
 * Background: upstream `/daily/horoscope/all` sometimes returns the same
 * fallback summary ("Ngày khá thuận, giữ năng lượng cho việc quan trọng.")
 * for all 12 signs, breaking the brand promise of personalised guidance.
 *
 * Strategy: rule-based template = (score bucket) × (zodiac trait suffix) ×
 * (day-of-year rotation). Output is deterministic by (zodiac, date), so SSR
 * and CSR produce the same string and cache layers stay stable.
 *
 * Why not pure hand-crafted: 12 sentences would rotate too obviously. Score
 * buckets give the line variance grounded in upstream data; the per-zodiac
 * suffix keeps the brand voice ("Tuổi X..."). ~60 unique combinations.
 */

const ZODIAC_TRAITS: Record<string, string[]> = {
  ty: [
    'tận dụng sự nhanh nhạy',
    'quan sát kỹ trước khi hành động',
    'giữ linh hoạt cho thay đổi nhỏ',
  ],
  suu: [
    'kiên trì với mục tiêu dài hạn',
    'giữ bước chậm mà chắc',
    'tránh ép tiến độ',
  ],
  dan: [
    'dứt khoát với việc đã chọn',
    'mạnh dạn mở đầu cuộc nói chuyện khó',
    'giữ năng lượng bùng nổ cho khâu chính',
  ],
  mao: [
    'ưu tiên hòa khí trong tương tác',
    'lùi lại để giữ tỉnh táo',
    'chọn cách dịu dàng cho việc tế nhị',
  ],
  thin: [
    'dồn lực vào dự án quan trọng nhất',
    'tận dụng vai trò dẫn dắt',
    'giữ tầm nhìn dài hạn',
  ],
  ti: [
    'phân tích kỹ trước khi cam kết',
    'tin vào trực giác đã được thẩm định',
    'giữ khoảng cách cảm xúc với người gây nhiễu',
  ],
  ngo: [
    'duy trì nhịp cao đều đặn',
    'dành chỗ để xả năng lượng',
    'tránh ôm việc vượt sức',
  ],
  mui: [
    'chăm sóc người thân thiết',
    'giữ không gian yên tĩnh để hồi sức',
    'tránh gánh trách nhiệm hộ người khác',
  ],
  than: [
    'thử cách tiếp cận mới với việc cũ',
    'giữ sự khéo léo trong đàm phán',
    'tránh phân tán quá nhiều việc',
  ],
  dau: [
    'rà soát chi tiết trước khi gửi đi',
    'lên kế hoạch rõ ràng cho cả tuần',
    'tránh phát biểu khi đang khó chịu',
  ],
  tuat: [
    'giữ chữ tín với cam kết đã hứa',
    'bảo vệ người yếu thế quanh mình',
    'tránh bị cuốn vào tranh cãi vô ích',
  ],
  hoi: [
    'tận hưởng khoảnh khắc nhỏ',
    'mở lòng với cơ hội bất ngờ',
    'tránh tiêu xài bốc đồng',
  ],
};

function dayOfYear(iso: string): number {
  // Accept "YYYY-MM-DD" — robust without timezone math.
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return 0;
  const date = new Date(Date.UTC(y, m - 1, d));
  const start = Date.UTC(y, 0, 0);
  return Math.floor((date.getTime() - start) / 86_400_000);
}

// Hard-coded fallback so types stay non-undefined even if a lookup misses.
const DEFAULT_TRAITS: readonly string[] = [
  'giữ kế hoạch đã lên',
  'tránh quyết định lớn lúc mệt',
  'để ngày mở dần — không ép tiến độ',
];

function pickTrait(zodiacKey: string, dateIso: string): string {
  const traits = ZODIAC_TRAITS[zodiacKey] ?? DEFAULT_TRAITS;
  const idx = dayOfYear(dateIso) % traits.length;
  return traits[idx] ?? traits[0] ?? DEFAULT_TRAITS[0]!;
}

/**
 * Generate per-zodiac blurb. Caller passes:
 * - zodiacKey: canonical slug ("ty", "ti", ..., "hoi")
 * - score: 1-10 from upstream (overall.score). Undefined → bucket = neutral.
 * - dateIso: YYYY-MM-DD (Asia/Ho_Chi_Minh) for deterministic rotation.
 *
 * Returns a complete one-sentence summary in VN, ending with full stop.
 */
export function generateZodiacBlurb(
  zodiacKey: string,
  score: number | undefined,
  dateIso: string,
): string {
  const trait = pickTrait(zodiacKey, dateIso);
  if (score === undefined) {
    return `Ngày bình ổn — ${trait}.`;
  }
  if (score >= 8) {
    return `Năng lượng thuận lợi — ${trait}.`;
  }
  if (score >= 6) {
    return `Nhịp cân bằng — ${trait}.`;
  }
  if (score >= 4) {
    return `Cần giữ sự tỉnh táo — ${trait}.`;
  }
  return `Thận trọng với quyết định lớn — ${trait}.`;
}

/**
 * Detect upstream fallback "đại trà" summary so we know when to override.
 * Returns true if summary is empty/null OR matches one of the known
 * generic fallbacks served identically for all 12 signs.
 */
export function isGenericSummary(summary: string | null | undefined): boolean {
  if (!summary) return true;
  const s = summary.trim().toLowerCase();
  if (s.length === 0) return true;
  // Known upstream fallbacks shipping the same line for all zodiacs.
  const GENERIC = [
    'ngày khá thuận, giữ năng lượng cho việc quan trọng.',
    'ngày bình thường, giữ năng lượng cho việc quan trọng.',
  ];
  return GENERIC.includes(s);
}
