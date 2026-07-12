/**
 * Kiểm thử dữ liệu 5 chiều Big Five / OCEAN (/learn/big-five/[trait]).
 *
 * - BIG_FIVE_SLUGS đúng 5, khớp nhãn engine lib/scoring/big-five.ts.
 * - buildTrait dựng được cho mọi slug + null với slug rác.
 * - Mỗi chiều đúng 6 facet (5 × 6 = 30 khía cạnh), facet có label + gloss.
 * - Field mới everydaySigns không rỗng cho MỌI entry.
 * - Mỗi entry đủ "dày" (>= 300 tiếng) theo chuẩn bách khoa.
 */
import { describe, it, expect } from 'vitest';
import { buildTrait, listTraits, BIG_FIVE_SLUGS } from './big-five-trait-data';

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

describe('BIG_FIVE_SLUGS', () => {
  it('đúng 5 chiều O·C·E·A·N', () => {
    expect([...BIG_FIVE_SLUGS]).toEqual([
      'openness',
      'conscientiousness',
      'extraversion',
      'agreeableness',
      'neuroticism',
    ]);
  });
});

describe('buildTrait', () => {
  it('trả null với slug không hợp lệ', () => {
    expect(buildTrait('khong-ton-tai')).toBeNull();
  });

  it('mọi slug đều dựng được + cấu trúc nhất quán', () => {
    for (const slug of BIG_FIVE_SLUGS) {
      const t = buildTrait(slug);
      expect(t).not.toBeNull();
      if (!t) continue;

      expect(t.slug).toBe(slug);
      expect(t.others).toHaveLength(4);
      expect(t.others.every((o) => o.slug !== slug)).toBe(true);
      expect(t.faqs.length).toBeGreaterThanOrEqual(5);
      expect(t.seoTitle).toContain(t.vi);
      expect(t.seoDescription.length).toBeGreaterThan(50);
    }
  });

  it('mỗi chiều đúng 6 facet, mỗi facet có label + gloss không rỗng', () => {
    for (const slug of BIG_FIVE_SLUGS) {
      const t = buildTrait(slug)!;
      expect(t.facets).toHaveLength(6);
      for (const f of t.facets) {
        expect(f.label.trim().length).toBeGreaterThan(0);
        expect(f.gloss.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('field mới everydaySigns không rỗng + đủ dày cho mọi entry', () => {
    for (const slug of BIG_FIVE_SLUGS) {
      const t = buildTrait(slug)!;
      expect(t.everydaySigns.trim().length).toBeGreaterThan(0);
      // Yêu cầu ~50-80 tiếng, 2-3 cặp ví dụ cụ thể → ngưỡng an toàn.
      expect(wordCount(t.everydaySigns)).toBeGreaterThanOrEqual(40);
    }
  });

  it('mỗi entry đủ dày (>= 300 tiếng) theo chuẩn bách khoa', () => {
    for (const slug of BIG_FIVE_SLUGS) {
      const t = buildTrait(slug)!;
      const prose = [
        t.tagline,
        t.overview,
        t.highProfile.join(' '),
        t.lowProfile.join(' '),
        t.facets.map((f) => `${f.label} ${f.gloss}`).join(' '),
        t.highContext,
        t.lowContext,
        t.balanceNote,
        t.everydaySigns,
      ].join(' ');
      expect(wordCount(prose)).toBeGreaterThanOrEqual(300);
    }
  });
});

describe('listTraits', () => {
  it('đủ 5 chiều, slug khớp BIG_FIVE_SLUGS', () => {
    const list = listTraits();
    expect(list).toHaveLength(5);
    expect(list.map((t) => t.slug)).toEqual([...BIG_FIVE_SLUGS]);
  });
});
