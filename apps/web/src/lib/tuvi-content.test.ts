/**
 * Khoá độ chính xác "tam phương tứ chính" (trigon) của 12 cung Tử Vi.
 *
 * Phát hiện 2026-06-22 (soát kien-thuc-nguon): 11/12 mảng `trigon` trong
 * tuvi-content.ts SAI so với luật. Tam phương tứ chính của một cung =
 * NHÓM TAM HỢP của nó (3 cung cách nhau 4) + CUNG ĐỐI (xung chiếu, cách 6).
 * Test này suy giá trị đúng từ luật canon và khoá lại để không tái phạm.
 */
import { describe, it, expect } from 'vitest';
import { PALACES_CONTENT } from './tuvi-content';

// 4 nhóm tam hợp cố định của 12 cung (theo vị trí tương đối quanh lá số).
const TRINE_GROUPS: string[][] = [
  ['Mệnh', 'Tài Bạch', 'Quan Lộc'],
  ['Huynh Đệ', 'Tật Ách', 'Điền Trạch'],
  ['Phu Thê', 'Thiên Di', 'Phúc Đức'],
  ['Tử Tức', 'Nô Bộc', 'Phụ Mẫu'],
];
// 6 cặp cung đối (xung chiếu).
const OPPOSITES: Record<string, string> = {
  Mệnh: 'Thiên Di',
  'Thiên Di': 'Mệnh',
  'Huynh Đệ': 'Nô Bộc',
  'Nô Bộc': 'Huynh Đệ',
  'Phu Thê': 'Quan Lộc',
  'Quan Lộc': 'Phu Thê',
  'Tử Tức': 'Điền Trạch',
  'Điền Trạch': 'Tử Tức',
  'Tài Bạch': 'Phúc Đức',
  'Phúc Đức': 'Tài Bạch',
  'Tật Ách': 'Phụ Mẫu',
  'Phụ Mẫu': 'Tật Ách',
};

function trineGroupOf(name: string): string[] {
  const g = TRINE_GROUPS.find((grp) => grp.includes(name));
  if (!g) throw new Error(`Không có nhóm tam hợp cho cung: ${name}`);
  return g;
}

describe('Tử Vi — tam phương tứ chính (trigon) của 12 cung', () => {
  it('đủ 12 cung', () => {
    expect(PALACES_CONTENT).toHaveLength(12);
  });

  it('mỗi cung: trigon = nhóm tam hợp + cung đối (đúng canon)', () => {
    for (const p of PALACES_CONTENT) {
      const expected = new Set([...trineGroupOf(p.name), OPPOSITES[p.name]!]);
      expect(new Set(p.trigon), `Cung ${p.name}`).toEqual(expected);
      expect(p.trigon, `Cung ${p.name} phải có đúng 4 cung`).toHaveLength(4);
      expect(p.trigon[0], `Cung ${p.name} phải đứng đầu trigon`).toBe(p.name);
    }
  });
});
