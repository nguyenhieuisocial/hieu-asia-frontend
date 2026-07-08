// Test tính toán quan hệ cho trang /tuong-hop-12-con-giap.
// Deterministic — chỉ khẳng định đúng những gì dữ liệu trong hop-tuoi-pairs.ts
// thực sự trả về (đã đối chiếu TAM_HOP_GROUPS / LUC_XUNG_PAIRS trước khi assert).
import { describe, it, expect } from 'vitest';
import { relationOf, RELATION_COPY } from '../../lib/hop-tuoi-pairs';

describe('tuong-hop-12-con-giap — quan hệ Can Chi', () => {
  it('Tý xung Ngọ (Lục Xung)', () => {
    expect(relationOf('ty', 'ngo')).toBe('luc-xung');
  });

  it('Tý tam hợp Thân (nhóm Thân – Tý – Thìn)', () => {
    expect(relationOf('ty', 'than')).toBe('tam-hop');
  });

  it('Cùng con giáp (Tý – Tý) là "dong-tuoi"', () => {
    expect(relationOf('ty', 'ty')).toBe('dong-tuoi');
  });

  it('nhãn RELATION_COPY của quan hệ Tý – Ngọ là chuỗi không rỗng', () => {
    const label = RELATION_COPY[relationOf('ty', 'ngo')].label;
    expect(typeof label).toBe('string');
    expect(label.length).toBeGreaterThan(0);
  });
});
