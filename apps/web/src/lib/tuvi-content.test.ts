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
import { MAJOR_STARS_CONTENT, AUX_STARS_CONTENT, ALL_STARS_CONTENT } from './tuvi-content';

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

// ============================================================================
// Nội dung bách khoa (2026-07-12): khoá số lượng sao, độ đầy đủ nội dung,
// byPalace của chính tinh, và tính duy nhất của slug.
// ============================================================================

describe('Tử Vi — nội dung bách khoa sao & cung', () => {
  it('đủ 14 chính tinh và 33 phụ tinh', () => {
    expect(MAJOR_STARS_CONTENT).toHaveLength(14);
    expect(AUX_STARS_CONTENT).toHaveLength(33);
  });

  it('mọi sao có archetype không rỗng; mọi cung có overview không rỗng', () => {
    for (const s of ALL_STARS_CONTENT) {
      expect(s.archetype.trim().length, `Sao ${s.name} thiếu archetype`).toBeGreaterThan(0);
    }
    for (const p of PALACES_CONTENT) {
      expect(p.overview.trim().length, `Cung ${p.name} thiếu overview`).toBeGreaterThan(0);
    }
  });

  it('mỗi chính tinh có byPalace >= 4 mục', () => {
    for (const s of MAJOR_STARS_CONTENT) {
      expect(s.byPalace.length, `Sao ${s.name} cần >= 4 mục byPalace`).toBeGreaterThanOrEqual(4);
    }
  });

  // Trước 2026-07-26 phụ tinh chỉ có 2–3 mục byPalace (chính tinh 4–5), nên 33
  // trang /tu-vi/sao/* phụ tinh mỏng hơn hẳn: 1.308–1.769 ký tự so với
  // 2.100–3.460 của chính tinh. Đã bổ sung để mọi sao đạt >= 4 mục. Khoá lại ở
  // đây để không tụt lại — thêm sao mới mà quên viết đủ là test đỏ ngay.
  it('mỗi PHỤ TINH cũng có byPalace >= 4 mục', () => {
    for (const s of AUX_STARS_CONTENT) {
      expect(s.byPalace.length, `Phụ tinh ${s.name} cần >= 4 mục byPalace`).toBeGreaterThanOrEqual(4);
    }
  });

  // Mỗi đoạn luận phải là một đoạn thật, không phải câu cụt lấp chỗ. Ngưỡng 120
  // đặt dưới đoạn ngắn nhất đang có (133) để bắt câu lấp chỗ mà không bắt nhầm
  // các đoạn súc tích sẵn có.
  it('mọi đoạn byPalace đủ dài để có nội dung thật', () => {
    for (const s of ALL_STARS_CONTENT) {
      for (const bp of s.byPalace) {
        expect(
          bp.reading.length,
          `${s.name} / cung ${bp.palace}: đoạn luận quá ngắn, nghi câu lấp chỗ`,
        ).toBeGreaterThanOrEqual(120);
      }
    }
  });

  // Cùng một sao không được lặp cung: dấu hiệu copy-paste lúc bổ sung hàng loạt.
  it('không sao nào lặp cùng một cung trong byPalace', () => {
    for (const s of ALL_STARS_CONTENT) {
      const pals = s.byPalace.map((b) => b.palace);
      expect(new Set(pals).size, `Sao ${s.name} có cung bị lặp trong byPalace`).toBe(pals.length);
    }
  });

  it('slug duy nhất trên toàn ALL_STARS_CONTENT', () => {
    const slugs = ALL_STARS_CONTENT.map((s) => s.slug);
    expect(new Set(slugs).size, 'Có slug sao bị trùng').toBe(slugs.length);
  });
});
