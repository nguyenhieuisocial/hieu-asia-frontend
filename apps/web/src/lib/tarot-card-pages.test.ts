/**
 * Kiểm thử thư viện trang ý nghĩa Tarot (78 lá).
 *
 * - ALL_PAGES đúng 78 = 22 Ẩn chính (MAJOR_PAGES) + 56 Ẩn phụ (MINOR_PAGES).
 * - Slug duy nhất trên cả 78 lá.
 * - Bất biến kebab(name) === slug — port đúng logic cardDetailSlug trong
 *   lib/tools/tarot.ts (engine suy slug từ tên để khỏi nạp 78 lá vào bundle client;
 *   nếu bất biến này gãy, link từ lượt rút sang trang ý nghĩa sẽ 404).
 * - Mọi entry có symbols + storyArc không rỗng (field bách khoa mới).
 * - Ẩn chính: number 0–21, không trùng.
 */
import { describe, it, expect } from 'vitest';
import { ALL_PAGES, MAJOR_PAGES } from './tarot-card-pages';
import { MINOR_PAGES } from './tarot-card-pages-minor';

/** Port đúng cardDetailSlug của lib/tools/tarot.ts — KHÔNG đổi nếu engine chưa đổi. */
const kebab = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

describe('cấu trúc bộ 78 lá', () => {
  it('đủ 78 lá = 22 Ẩn chính + 56 Ẩn phụ', () => {
    expect(MAJOR_PAGES).toHaveLength(22);
    expect(MINOR_PAGES).toHaveLength(56);
    expect(ALL_PAGES).toHaveLength(78);
  });

  it('slug duy nhất trên cả 78 lá', () => {
    const slugs = ALL_PAGES.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(78);
  });

  it('bất biến kebab(name) === slug cho đủ 78 lá (khớp cardDetailSlug của engine)', () => {
    for (const c of ALL_PAGES) {
      expect(kebab(c.name), `lá ${c.name}`).toBe(c.slug);
    }
  });
});

describe('nội dung bách khoa từng lá', () => {
  it('mọi lá có symbols và storyArc không rỗng', () => {
    for (const c of ALL_PAGES) {
      expect((c.symbols ?? '').trim().length, `symbols của ${c.slug}`).toBeGreaterThan(0);
      expect((c.storyArc ?? '').trim().length, `storyArc của ${c.slug}`).toBeGreaterThan(0);
    }
  });

  it('mọi lá có đủ nghĩa xuôi/ngược, tình cảm, công việc và câu hỏi tự soi', () => {
    for (const c of ALL_PAGES) {
      expect(c.up.trim().length, `up của ${c.slug}`).toBeGreaterThan(0);
      expect(c.rev.trim().length, `rev của ${c.slug}`).toBeGreaterThan(0);
      expect(c.love.trim().length, `love của ${c.slug}`).toBeGreaterThan(0);
      expect(c.work.trim().length, `work của ${c.slug}`).toBeGreaterThan(0);
      expect(c.reflect.length, `reflect của ${c.slug}`).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('22 Ẩn chính', () => {
  it('number 0–21, không trùng', () => {
    const numbers = MAJOR_PAGES.map((c) => c.number);
    expect(new Set(numbers).size).toBe(22);
    for (const n of numbers) {
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(21);
    }
  });

  it('4 lá hay bị hù dọa có lời trấn an ease', () => {
    for (const slug of ['death', 'the-tower', 'the-devil', 'the-moon']) {
      const c = MAJOR_PAGES.find((x) => x.slug === slug);
      expect(c?.ease?.trim().length, `ease của ${slug}`).toBeGreaterThan(0);
    }
  });
});
