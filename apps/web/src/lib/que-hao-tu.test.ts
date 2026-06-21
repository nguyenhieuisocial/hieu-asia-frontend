import { describe, it, expect } from 'vitest';
import { HAO_TU, HAO_TU_EXTRA, getHaoTu, getHaoTuExtra, HAO_TU_SOURCE } from './que-hao-tu';
import { QUE_PAGES } from './que-kinh-dich';

/**
 * Kiểm thử hồi quy — tầng Hào từ (爻辞) nguyên văn 384 hào Chu Dịch.
 * Nguyên văn chữ Hán lấy nguyên byte từ nguồn phạm vi công cộng (Wikisource);
 * test khoá để không lệch dữ liệu khi sửa về sau.
 */
describe('que-hao-tu › 384 hào từ (爻辞) nguyên văn', () => {
  it('đủ 64 quẻ, id 1..64 liên tục', () => {
    const ids = Object.keys(HAO_TU).map(Number).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 64 }, (_, i) => i + 1));
  });

  it('mỗi quẻ đúng 6 hào, line 1..6 đúng thứ tự', () => {
    for (let id = 1; id <= 64; id++) {
      const arr = HAO_TU[id]!;
      expect(arr.length, `quẻ ${id}`).toBe(6);
      expect(arr.map((l) => l.line)).toEqual([1, 2, 3, 4, 5, 6]);
    }
  });

  it('tổng 384 hào; mỗi hào có đủ label/han/hanViet/nghia không rỗng', () => {
    let total = 0;
    for (let id = 1; id <= 64; id++) {
      for (const l of HAO_TU[id]!) {
        total++;
        expect(l.label.trim().length, `label ${id}/${l.line}`).toBeGreaterThan(0);
        expect(l.han.trim().length, `han ${id}/${l.line}`).toBeGreaterThan(0);
        expect(l.hanViet.trim().length, `hanViet ${id}/${l.line}`).toBeGreaterThan(0);
        expect(l.nghia.trim().length, `nghia ${id}/${l.line}`).toBeGreaterThan(0);
      }
    }
    expect(total).toBe(384);
  });

  it('han chứa chữ Hán; hanViet KHÔNG còn chữ Hán', () => {
    const cjk = /[一-鿿]/;
    for (let id = 1; id <= 64; id++) {
      for (const l of HAO_TU[id]!) {
        expect(cjk.test(l.han), `han ${id}/${l.line} phải có CJK`).toBe(true);
        expect(cjk.test(l.hanViet), `hanViet ${id}/${l.line} không được còn CJK`).toBe(false);
      }
    }
  });

  it('用九/用六 (Càn 1 & Khôn 2) có đủ trường', () => {
    expect(Object.keys(HAO_TU_EXTRA).map(Number).sort()).toEqual([1, 2]);
    for (const id of [1, 2]) {
      const e = getHaoTuExtra(id)!;
      expect(e.label).toMatch(/用[九六]/);
      expect(e.han.trim().length).toBeGreaterThan(0);
      expect(e.hanViet.trim().length).toBeGreaterThan(0);
    }
  });

  it('khớp 1-1 với 64 quẻ King Wen (que-kinh-dich)', () => {
    for (const q of QUE_PAGES) {
      expect(HAO_TU[q.id], `thiếu hào từ quẻ ${q.id} (${q.nameVi})`).toBeDefined();
    }
  });

  it('getHaoTu + vài mốc nguyên văn đúng (chống lệch)', () => {
    expect(getHaoTu(1, 1)!.han).toBe('潛龍勿用。'); // Càn hào 1
    expect(getHaoTu(1, 1)!.hanViet.toLowerCase()).toContain('tiềm long');
    expect(getHaoTu(1, 5)!.han).toContain('飛龍在天'); // Càn cửu ngũ
    expect(getHaoTu(2, 1)!.han).toContain('履霜'); // Khôn sơ lục
    expect(HAO_TU_SOURCE).toContain('công cộng');
  });
});
