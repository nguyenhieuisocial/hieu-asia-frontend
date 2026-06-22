/**
 * Kiểm thử lớp chống "đụng hàng" cho teaser tử vi hôm nay (audit-v2 N5).
 *
 * resolveDailySummaries phải:
 *  - thay câu generic chính xác bằng blurb riêng từng tuổi (hành vi cũ),
 *  - thay câu GẦN-trùng giữa các tuổi (Jaccard > ngưỡng) — case audit Tý/Sửu,
 *  - GIỮ NGUYÊN khi upstream vốn đã đa dạng,
 *  - tất định theo (tuổi, ngày, điểm).
 * Bất biến chính: trong cùng một ngày, không cặp teaser nào chia sẻ > 60% token.
 */
import { describe, it, expect } from 'vitest';
import {
  isGenericSummary,
  resolveDailySummaries,
  NEAR_DUP_THRESHOLD,
  type DailyCardInput,
} from './zodiac-blurb';

const DATE = '2026-06-22';
const KEYS = [
  'ty', 'suu', 'dan', 'mao', 'thin', 'ti',
  'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi',
] as const;

// Mirror of the (private) Jaccard logic so the test asserts the audit spec
// directly rather than trusting the implementation's own helper.
function tok(s: string): Set<string> {
  return new Set(
    s.toLowerCase().normalize('NFC').split(/[^\p{L}\p{N}]+/u).filter((t) => t.length >= 2),
  );
}
function jac(a: string, b: string): number {
  const A = tok(a);
  const B = tok(b);
  let inter = 0;
  for (const t of A) if (B.has(t)) inter += 1;
  const u = A.size + B.size - inter;
  return u === 0 ? 0 : inter / u;
}
function maxPairwise(xs: string[]): number {
  let m = 0;
  for (let i = 0; i < xs.length; i += 1) {
    for (let j = i + 1; j < xs.length; j += 1) {
      m = Math.max(m, jac(xs[i]!, xs[j]!));
    }
  }
  return m;
}

// Ten clearly-distinct human sentences (pairwise Jaccard well below the threshold).
const DISTINCT = [
  'Một ngày thích hợp để dọn dẹp giấy tờ tồn đọng.',
  'Tin vui tài chính có thể đến từ người quen cũ.',
  'Dành tối nay cho gia đình sẽ khiến bạn dễ chịu.',
  'Cẩn trọng lời ăn tiếng nói trong cuộc họp chiều.',
  'Sức khỏe ổn, hợp để khởi động thói quen mới.',
  'Một cánh cửa học hỏi mở ra, đừng vội bỏ lỡ.',
  'Hãy lắng nghe kỹ hơn trước khi đưa phản hồi.',
  'Tiêu pha hôm nay nên ưu tiên thứ thật cần.',
  'Đi bộ buổi sáng giúp tinh thần phấn chấn cả ngày.',
  'Giữ trọn lời hứa nhỏ sẽ củng cố niềm tin đồng nghiệp.',
];

describe('resolveDailySummaries — chống đụng hàng teaser (N5)', () => {
  it('thay câu generic chính xác bằng blurb riêng từng tuổi, đủ 12 câu khác nhau', () => {
    const generic = 'Ngày khá thuận, giữ năng lượng cho việc quan trọng.';
    const items: DailyCardInput[] = KEYS.map((k) => ({ key: k, summary: generic, score: 7 }));
    const out = resolveDailySummaries(items, DATE);

    expect(out).toHaveLength(12);
    expect(out.some((s) => isGenericSummary(s))).toBe(false);
    expect(new Set(out).size).toBe(12); // tất cả phân biệt
    expect(maxPairwise(out)).toBeLessThanOrEqual(NEAR_DUP_THRESHOLD);
  });

  it('thay câu GẦN-trùng (không khớp chính xác) — đúng case audit Tý vs Sửu', () => {
    const ty =
      'Tuổi Tý hôm nay nên giữ kiên nhẫn và linh hoạt để chuyển hóa thử thách thành cơ hội.';
    const suu =
      'Tuổi Sửu hôm nay nên giữ kiên nhẫn và khéo léo trong giao tiếp để chuyển hóa thử thách thành cơ hội.';
    expect(jac(ty, suu)).toBeGreaterThan(NEAR_DUP_THRESHOLD); // sanity: 2 câu này gần trùng

    const items: DailyCardInput[] = [
      { key: 'ty', summary: ty, score: 7 },
      { key: 'suu', summary: suu, score: 7 },
      ...DISTINCT.map((s, idx) => ({ key: KEYS[idx + 2]!, summary: s, score: 6 })),
    ];
    const out = resolveDailySummaries(items, DATE);

    expect(out[0]).not.toBe(ty); // Tý bị thay
    expect(out[1]).not.toBe(suu); // Sửu bị thay
    DISTINCT.forEach((s, idx) => expect(out[idx + 2]).toBe(s)); // 10 câu đa dạng giữ nguyên
    expect(new Set(out).size).toBe(12);
    expect(maxPairwise(out)).toBeLessThanOrEqual(NEAR_DUP_THRESHOLD);
  });

  it('GIỮ NGUYÊN khi upstream vốn đã đa dạng', () => {
    const diverse = [
      ...DISTINCT,
      'Chiều nay thuận cho việc kết nối đối tác mới.',
      'Khuya hợp để đọc sách rồi nghỉ ngơi sớm.',
    ];
    const items: DailyCardInput[] = KEYS.map((k, idx) => ({ key: k, summary: diverse[idx]!, score: 6 }));
    const out = resolveDailySummaries(items, DATE);
    expect(out).toEqual(diverse);
  });

  it('tất định cho cùng (input, ngày)', () => {
    const generic = 'Ngày khá thuận, giữ năng lượng cho việc quan trọng.';
    const items: DailyCardInput[] = KEYS.map((k) => ({ key: k, summary: generic, score: 5 }));
    expect(resolveDailySummaries(items, DATE)).toEqual(resolveDailySummaries(items, DATE));
  });
});
