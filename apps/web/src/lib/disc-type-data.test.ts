/**
 * Kiểm thử dữ liệu 4 nhóm DISC (/learn/disc/[type] + tool /disc).
 *
 * - DISC_SLUGS đúng 4 (d/i/s/c), khớp nhãn engine lib/scoring/disc.ts.
 * - buildStyle dựng được cho mọi slug + null với slug rác.
 * - Field mới (collaboration, misreads) không rỗng cho MỌI entry.
 * - collaboration phải nhắc tới cả 3 nhóm còn lại (phối hợp 1 câu/nhóm).
 * - Mỗi entry đủ "dày" (>= 300 tiếng) theo chuẩn bách khoa.
 */
import { describe, it, expect } from 'vitest';
import { buildStyle, listStyles, DISC_SLUGS } from './disc-type-data';

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

describe('DISC_SLUGS', () => {
  it('đúng 4 nhóm d/i/s/c', () => {
    expect([...DISC_SLUGS]).toEqual(['d', 'i', 's', 'c']);
  });
});

describe('buildStyle', () => {
  it('trả null với slug không hợp lệ', () => {
    expect(buildStyle('khong-ton-tai')).toBeNull();
    expect(buildStyle('x')).toBeNull();
  });

  it('mọi slug đều dựng được + cấu trúc nhất quán', () => {
    for (const slug of DISC_SLUGS) {
      const d = buildStyle(slug);
      expect(d).not.toBeNull();
      if (!d) continue;

      expect(d.slug).toBe(slug);
      expect(d.letter).toBe(slug.toUpperCase());

      // 3 nhóm còn lại + FAQ + SEO đủ.
      expect(d.others).toHaveLength(3);
      expect(d.others.every((o) => o.slug !== slug)).toBe(true);
      expect(d.faqs.length).toBeGreaterThanOrEqual(6);
      expect(d.seoTitle).toContain(d.letter);
      expect(d.seoDescription.length).toBeGreaterThan(50);
    }
  });

  it('field mới collaboration + misreads không rỗng cho mọi entry', () => {
    for (const slug of DISC_SLUGS) {
      const d = buildStyle(slug)!;
      expect(d.collaboration.trim().length).toBeGreaterThan(0);
      expect(d.misreads.trim().length).toBeGreaterThan(0);
      // Đủ dày theo yêu cầu (collaboration ~60-90 tiếng, misreads ~40-60 tiếng).
      expect(wordCount(d.collaboration)).toBeGreaterThanOrEqual(45);
      expect(wordCount(d.misreads)).toBeGreaterThanOrEqual(30);
    }
  });

  it('collaboration nhắc tới cả 3 nhóm còn lại (phối hợp 1 câu/nhóm)', () => {
    for (const slug of DISC_SLUGS) {
      const d = buildStyle(slug)!;
      for (const other of d.others) {
        expect(d.collaboration).toContain(`nhóm ${other.letter}`);
      }
    }
  });

  it('mỗi entry đủ dày (>= 300 tiếng) theo chuẩn bách khoa', () => {
    for (const slug of DISC_SLUGS) {
      const d = buildStyle(slug)!;
      const prose = [
        d.tagline,
        d.overview,
        d.strengths.join(' '),
        d.growth.join(' '),
        d.workStyle,
        d.communication,
        d.underPressure,
        d.collaboration,
        d.misreads,
      ].join(' ');
      expect(wordCount(prose)).toBeGreaterThanOrEqual(300);
    }
  });
});

describe('listStyles', () => {
  it('đủ 4 nhóm, slug khớp DISC_SLUGS', () => {
    const list = listStyles();
    expect(list).toHaveLength(4);
    expect(list.map((s) => s.slug)).toEqual([...DISC_SLUGS]);
  });
});
