import { describe, it, expect } from 'vitest';
import { KARMIC_DEBT, KARMIC_LESSONS } from './than-so-hoc-karmic';

/**
 * Kiểm thử thư viện diễn giải Nợ Nghiệp & Bài Học Nghiệp.
 *
 * Tập khóa kỳ vọng SUY RA ĐỘC LẬP từ chuẩn Decoz/Pythagorean (không copy engine):
 *  - Karmic Debt CHỈ gồm đúng 4 số: 13 / 14 / 16 / 19 (Hans Decoz).
 *  - Karmic Lessons gồm đúng các chữ số thiếu khả dĩ: 1..9.
 *  - Mọi mục phải có đủ trường diễn giải, không rỗng (engine chỉ trả con số trần).
 */

describe('than-so-hoc-karmic › KARMIC_DEBT', () => {
  it('có đúng 4 khóa 13/14/16/19, không thừa không thiếu', () => {
    const keys = Object.keys(KARMIC_DEBT)
      .map(Number)
      .sort((a, b) => a - b);
    expect(keys).toEqual([13, 14, 16, 19]);
  });

  it('mỗi mục: number khớp khóa + title/theme/growth không rỗng', () => {
    for (const [key, entry] of Object.entries(KARMIC_DEBT)) {
      expect(entry.number).toBe(Number(key));
      expect(entry.title.trim().length).toBeGreaterThan(0);
      expect(entry.theme.trim().length).toBeGreaterThan(0);
      expect(entry.growth.trim().length).toBeGreaterThan(0);
    }
  });
});

describe('than-so-hoc-karmic › KARMIC_LESSONS', () => {
  it('có đúng các khóa 1..9', () => {
    const keys = Object.keys(KARMIC_LESSONS)
      .map(Number)
      .sort((a, b) => a - b);
    expect(keys).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('mỗi mục: number khớp khóa + lesson/how không rỗng', () => {
    for (const [key, entry] of Object.entries(KARMIC_LESSONS)) {
      expect(entry.number).toBe(Number(key));
      expect(entry.lesson.trim().length).toBeGreaterThan(0);
      expect(entry.how.trim().length).toBeGreaterThan(0);
    }
  });
});
