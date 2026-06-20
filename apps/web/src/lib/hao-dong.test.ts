import { describe, it, expect } from 'vitest';
import { readingFocus, type ReadingFocus } from './hao-dong';

/**
 * Kiểm thử luật "trọng tâm nên đọc" theo Chu Hy 朱熹《易學啟蒙》 — phép xét theo SỐ hào động.
 *
 * Giá trị kỳ vọng được SUY RA ĐỘC LẬP từ luật cổ điển (không copy output của hàm),
 * rồi đối chiếu hàm `readingFocus` khớp với luật:
 *
 *  số hào động → đọc gì                                            → hào chủ đạo
 *  ─────────────────────────────────────────────────────────────────────────────
 *  0           → lời quẻ (thoán) quẻ CHÍNH                          → —
 *  1           → hào-từ của ĐÚNG hào động                           → chính hào đó
 *  2           → hào-từ CẢ HAI hào động                             → hào TRÊN (số lớn)
 *  3           → lời quẻ CẢ quẻ chính & quẻ biến                    → quẻ CHÍNH
 *  4           → hào-từ 2 hào TĨNH trên QUẺ BIẾN                    → hào DƯỚI (số nhỏ)
 *  5           → hào-từ 1 hào TĨNH trên QUẺ BIẾN                    → hào tĩnh đó
 *  6 (thường)  → lời quẻ QUẺ BIẾN                                   → —
 *  6 (Càn/Khôn)→ dụng cửu / dụng lục                                → —
 *
 * Quy ước số hào: 1 = sơ hào (đáy), 6 = thượng hào (đỉnh).
 */

describe('readingFocus › luật Chu Hy theo số hào động', () => {
  it('0 hào động → đọc lời quẻ chính', () => {
    const f = readingFocus([]);
    expect(f.rule).toBe('0 hào động');
    expect(f.primary).toBe('gua-primary');
    expect(f.lines).toEqual([]);
    expect(f.chuDao).toBeNull();
    expect(f.note).toBeTruthy();
  });

  it('1 hào động → đọc đúng hào đó, chính nó là chủ đạo', () => {
    const f = readingFocus([3]);
    expect(f.rule).toBe('1 hào động');
    expect(f.primary).toBe('line');
    expect(f.lines).toEqual([3]);
    expect(f.chuDao).toBe(3);
  });

  it('2 hào động → đọc cả hai, hào TRÊN (số lớn hơn) là chủ đạo', () => {
    const f = readingFocus([2, 5]);
    expect(f.rule).toBe('2 hào động');
    expect(f.primary).toBe('line');
    expect(f.lines).toEqual([2, 5]);
    expect(f.chuDao).toBe(5); // hào trên
  });

  it('2 hào động — thứ tự đầu vào đảo vẫn cho hào trên đúng (tất định)', () => {
    const f = readingFocus([5, 2]); // đảo thứ tự
    expect(f.lines).toEqual([2, 5]); // luôn sắp tăng dần
    expect(f.chuDao).toBe(5);
  });

  it('3 hào động → đọc lời quẻ cả chính & biến, quẻ CHÍNH chủ đạo', () => {
    const f = readingFocus([1, 3, 6]);
    expect(f.rule).toBe('3 hào động');
    expect(f.primary).toBe('gua-primary');
    expect(f.lines).toEqual([]);
    expect(f.chuDao).toBeNull();
  });

  it('4 hào động → đọc 2 hào TĨNH trên quẻ biến, hào DƯỚI là chủ đạo', () => {
    // động = {1,2,4,5} → tĩnh = {3,6}; hào dưới = 3
    const f = readingFocus([1, 2, 4, 5]);
    expect(f.rule).toBe('4 hào động');
    expect(f.primary).toBe('line');
    expect(f.lines).toEqual([3, 6]); // 2 hào TĨNH (phần bù)
    expect(f.chuDao).toBe(3); // hào tĩnh dưới
  });

  it('5 hào động → đọc 1 hào TĨNH còn lại trên quẻ biến', () => {
    // động = {1,2,3,4,6} → tĩnh = {5}
    const f = readingFocus([1, 2, 3, 4, 6]);
    expect(f.rule).toBe('5 hào động');
    expect(f.primary).toBe('line');
    expect(f.lines).toEqual([5]); // hào TĨNH duy nhất
    expect(f.chuDao).toBe(5);
  });

  it('6 hào động (quẻ thường) → đọc lời quẻ BIẾN', () => {
    const f = readingFocus([1, 2, 3, 4, 5, 6], false);
    expect(f.rule).toBe('6 hào động');
    expect(f.primary).toBe('gua-changed');
    expect(f.lines).toEqual([]);
    expect(f.chuDao).toBeNull();
  });

  it('6 hào động ở Thuần Càn/Khôn → dụng cửu/dụng lục (đặc biệt)', () => {
    const f = readingFocus([1, 2, 3, 4, 5, 6], true);
    expect(f.rule).toBe('6 hào động · Thuần Càn/Khôn');
    expect(f.primary).toBe('dung');
    expect(f.lines).toEqual([]);
    expect(f.chuDao).toBeNull();
  });
});

describe('readingFocus › tính tất định & bất biến chung', () => {
  // Liệt kê đủ 7 trường hợp số-lượng (0..6) + biến thể Càn/Khôn ở case 6.
  const cases: { moving: number[]; qiankun: boolean; expectKind: ReadingFocus['primary'] }[] = [
    { moving: [], qiankun: false, expectKind: 'gua-primary' },
    { moving: [4], qiankun: false, expectKind: 'line' },
    { moving: [2, 6], qiankun: false, expectKind: 'line' },
    { moving: [1, 2, 3], qiankun: false, expectKind: 'gua-primary' },
    { moving: [1, 3, 4, 6], qiankun: false, expectKind: 'line' },
    { moving: [2, 3, 4, 5, 6], qiankun: false, expectKind: 'line' },
    { moving: [1, 2, 3, 4, 5, 6], qiankun: false, expectKind: 'gua-changed' },
    { moving: [1, 2, 3, 4, 5, 6], qiankun: true, expectKind: 'dung' },
  ];

  it('mỗi trường hợp luôn có note tiếng Việt không rỗng + đúng loại trọng tâm', () => {
    for (const c of cases) {
      const f = readingFocus(c.moving, c.qiankun);
      expect(f.primary).toBe(c.expectKind);
      expect(f.note.length).toBeGreaterThan(10);
      expect(f.rule).toBeTruthy();
    }
  });

  it('lines luôn sắp tăng dần và không trùng', () => {
    for (const c of cases) {
      const f = readingFocus(c.moving, c.qiankun);
      const sorted = [...f.lines].sort((a, b) => a - b);
      expect(f.lines).toEqual(sorted);
      expect(new Set(f.lines).size).toBe(f.lines.length);
    }
  });

  it('với case đọc hào (1/2/4/5), chủ đạo luôn nằm trong lines', () => {
    for (const c of cases) {
      const f = readingFocus(c.moving, c.qiankun);
      if (f.primary === 'line' && f.chuDao !== null) {
        expect(f.lines).toContain(f.chuDao);
      }
    }
  });

  it('hào động + hào tĩnh trong lines (case 4/5) là phần bù đúng của nhau', () => {
    // 4 hào động {1,3,4,6} → tĩnh {2,5}
    expect(readingFocus([1, 3, 4, 6]).lines).toEqual([2, 5]);
    // 5 hào động {1,2,4,5,6} → tĩnh {3}
    expect(readingFocus([1, 2, 4, 5, 6]).lines).toEqual([3]);
  });

  it('lọc giá trị ngoài 1–6 và loại trùng trước khi áp luật', () => {
    // {0,3,3,7} → hợp lệ chỉ còn {3} → coi như 1 hào động
    const f = readingFocus([0, 3, 3, 7]);
    expect(f.rule).toBe('1 hào động');
    expect(f.lines).toEqual([3]);
    expect(f.chuDao).toBe(3);
  });
});
