/**
 * Kiểm thử cụm "Độ hợp cung hoàng đạo".
 * Phân loại quan hệ tái dùng buildCung (đã sửa #564) — kiểm các nhánh tiêu biểu
 * + bất biến cho toàn bộ 78 cặp.
 */
import { describe, it, expect } from 'vitest';
import {
  ALL_PAIRS,
  pairSlug,
  parsePairSlug,
  buildPair,
  matrixRow,
  RELATION_SHORT,
  type PairRelation,
} from './cung-hoang-dao-hop-data';

describe('pairSlug + parse', () => {
  it('có 78 cặp chuẩn (gồm 12 cặp cùng cung)', () => {
    expect(ALL_PAIRS).toHaveLength(78);
    expect(new Set(ALL_PAIRS).size).toBe(78); // không trùng
  });
  it('đối xứng: pairSlug(a,b) === pairSlug(b,a)', () => {
    expect(pairSlug(0, 6)).toBe(pairSlug(6, 0));
    expect(pairSlug(3, 9)).toBe(pairSlug(9, 3));
  });
  it('parse round-trip + từ chối dạng đảo/không hợp lệ', () => {
    expect(parsePairSlug(pairSlug(2, 7))).toEqual({ idxA: 2, idxB: 7 });
    // Dạng đảo (hi-lo) không phải canonical → null.
    expect(parsePairSlug('thien-binh-va-bach-duong')).toBeNull();
    expect(parsePairSlug('khong-co-va-song-tu')).toBeNull();
    expect(parsePairSlug('bach-duong')).toBeNull();
  });
});

describe('buildPair — phân loại quan hệ (Bạch Dương = idx0, Lửa)', () => {
  const rel = (i: number, j: number): PairRelation | null => buildPair(pairSlug(i, j))?.relation ?? null;

  it('cùng cung', () => expect(rel(0, 0)).toBe('same-sign'));
  it('cùng nguyên tố (Bạch Dương + Sư Tử)', () => expect(rel(0, 4)).toBe('same-element'));
  it('bổ trợ (Bạch Dương + Song Tử, Khí, không phải cung đối)', () =>
    expect(rel(0, 2)).toBe('support'));
  it('cung đối (Bạch Dương + Thiên Bình)', () => expect(rel(0, 6)).toBe('opposite'));
  it('khác biệt (Bạch Dương + Kim Ngưu, Đất)', () => expect(rel(0, 1)).toBe('different'));

  it('cung đối KHÔNG bị phân loại thành bổ trợ (hệ quả fix #564)', () => {
    // Thiên Bình (6) là cung đối của Bạch Dương dù cùng nhóm Khí bổ trợ.
    expect(rel(0, 6)).toBe('opposite');
    expect(rel(0, 2)).toBe('support');
    expect(rel(0, 10)).toBe('support'); // Bảo Bình (Khí) — bổ trợ thật
  });
});

describe('bất biến toàn bộ 78 cặp', () => {
  it('mọi cặp build được, quan hệ hợp lệ, FAQ + SEO đủ, đối xứng', () => {
    for (const slug of ALL_PAIRS) {
      const d = buildPair(slug);
      expect(d, slug).not.toBeNull();
      if (!d) continue;
      expect(Object.keys(RELATION_SHORT)).toContain(d.relation);
      expect(d.faqs.length).toBeGreaterThanOrEqual(3);
      expect(d.seoTitle).toContain(d.a.z.name);
      expect(d.seoTitle).toContain(d.b.z.name);
      // Đối xứng: relation tính từ B-với-A phải bằng A-với-B.
      const reversed = buildPair(pairSlug(d.b.z.idx, d.a.z.idx));
      expect(reversed?.relation).toBe(d.relation);
    }
  });
});

describe('matrixRow', () => {
  it('mỗi hàng 12 ô, ô chéo (cùng idx) là cùng cung', () => {
    const row = matrixRow(0);
    expect(row).toHaveLength(12);
    expect(row[0]!.relation).toBe('same-sign');
    expect(row[6]!.relation).toBe('opposite');
  });
});
