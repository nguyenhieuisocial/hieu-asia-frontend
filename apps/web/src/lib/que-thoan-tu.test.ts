import { describe, it, expect } from 'vitest';
import { THOAN_TU, getThoanTu, THOAN_TU_SOURCE } from './que-thoan-tu';
import { QUE_PAGES } from './que-kinh-dich';

/**
 * Kiểm thử hồi quy — tầng GROUNDING Thoán từ (卦辞) nguyên văn 64 quẻ Chu Dịch.
 * Nguyên văn chữ Hán lấy nguyên byte từ nguồn phạm vi công cộng (Wikisource);
 * test khoá để không lệch dữ liệu khi sửa về sau.
 */
describe('que-thoan-tu › tầng Thoán từ nguyên văn 64 quẻ', () => {
  it('đủ 64 quẻ, id 1..64 liên tục', () => {
    const ids = Object.keys(THOAN_TU).map(Number).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 64 }, (_, i) => i + 1));
  });

  it('mỗi quẻ có đủ han / hanViet / nghia không rỗng', () => {
    for (let id = 1; id <= 64; id++) {
      const t = THOAN_TU[id];
      expect(t, `quẻ ${id}`).toBeDefined();
      expect(t!.han.trim().length, `han quẻ ${id}`).toBeGreaterThan(0);
      expect(t!.hanViet.trim().length, `hanViet quẻ ${id}`).toBeGreaterThan(0);
      expect(t!.nghia.trim().length, `nghia quẻ ${id}`).toBeGreaterThan(0);
    }
  });

  it('han chứa chữ Hán (CJK), hanViet KHÔNG chứa chữ Hán', () => {
    const cjk = /[一-鿿]/;
    for (let id = 1; id <= 64; id++) {
      expect(cjk.test(THOAN_TU[id]!.han), `han quẻ ${id} phải có CJK`).toBe(true);
      expect(cjk.test(THOAN_TU[id]!.hanViet), `hanViet quẻ ${id} không được còn CJK`).toBe(false);
    }
  });

  it('khớp 1-1 với danh sách 64 quẻ King Wen (que-kinh-dich)', () => {
    for (const q of QUE_PAGES) {
      expect(getThoanTu(q.id), `thiếu thoán từ cho quẻ ${q.id} (${q.nameVi})`).toBeDefined();
    }
  });

  it('vài mốc nguyên văn đúng (chống lệch dữ liệu)', () => {
    expect(THOAN_TU[1]!.han).toBe('元亨。利貞。'); // Càn
    expect(THOAN_TU[1]!.hanViet.toLowerCase()).toContain('nguyên hanh');
    expect(THOAN_TU[2]!.han).toContain('牝馬'); // Khôn — lợi tẫn mã chi trinh
    expect(THOAN_TU[63]!.han).toContain('初吉終亂'); // Ký Tế
  });

  it('có dòng ghi nguồn phạm vi công cộng', () => {
    expect(THOAN_TU_SOURCE).toContain('công cộng');
  });
});
