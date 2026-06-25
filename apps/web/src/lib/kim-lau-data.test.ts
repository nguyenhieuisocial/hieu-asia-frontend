/**
 * Kiểm thử landing "Kim Lâu".
 * - KIM_LAU_TYPES suy đúng từ engine (4 loại, dư 1/3/6/8, có ghi chú).
 * - phamAges đúng luật %9 ∈ {1,3,6,8}.
 * - kimLauYearsAhead KHỚP checkKimLau (không lệch engine).
 */
import { describe, it, expect } from 'vitest';
import { KIM_LAU_TYPES, phamAges, kimLauYearsAhead, KIM_LAU_FAQS } from './kim-lau-data';
import { checkKimLau } from './xem-tuoi-cuoi';

describe('kim-lau-data — 4 loại Kim Lâu (grounded engine)', () => {
  it('có 4 loại theo dư 1/3/6/8, tên + ghi chú lấy từ engine', () => {
    expect(KIM_LAU_TYPES).toHaveLength(4);
    expect(KIM_LAU_TYPES.map((t) => t.remainder)).toEqual([1, 3, 6, 8]);
    expect(KIM_LAU_TYPES.map((t) => t.type)).toEqual([
      'Kim Lâu Thân',
      'Kim Lâu Thê',
      'Kim Lâu Tử',
      'Kim Lâu Lục Súc',
    ]);
    for (const t of KIM_LAU_TYPES) expect(t.note.length).toBeGreaterThan(0);
  });
});

describe('kim-lau-data — phamAges đúng luật', () => {
  it('chỉ gồm tuổi mụ có %9 ∈ {1,3,6,8}', () => {
    const ages = phamAges(30);
    expect(ages).toContain(1);
    expect(ages).toContain(10); // 10%9=1
    expect(ages).toContain(12); // 12%9=3
    expect(ages).toContain(15); // 15%9=6
    expect(ages).toContain(17); // 17%9=8
    expect(ages).not.toContain(9); // 9%9=0
    expect(ages).not.toContain(18); // 18%9=0
    expect(ages).not.toContain(5);
    for (const a of ages) expect([1, 3, 6, 8]).toContain(a % 9);
  });
});

describe('kim-lau-data — kimLauYearsAhead khớp engine', () => {
  it('mỗi hàng khớp checkKimLau(birthYear, year)', () => {
    const birthYear = 1998;
    const rows = kimLauYearsAhead(birthYear, 2026, 8);
    expect(rows).toHaveLength(8);
    for (const r of rows) {
      const k = checkKimLau(birthYear, r.year);
      expect(r.ageMu).toBe(k.ageMu);
      expect(r.isKimLau).toBe(Boolean(k.type));
      expect(r.type).toBe(k.type);
    }
  });

  it('ca chuẩn: sinh 2000, năm 2027 = tuổi mụ 28 → phạm Kim Lâu Thân (dư 1)', () => {
    const rows = kimLauYearsAhead(2000, 2026, 3); // 2026,2027,2028
    const y2027 = rows.find((r) => r.year === 2027)!;
    expect(y2027.ageMu).toBe(28);
    expect(y2027.isKimLau).toBe(true);
    expect(y2027.type).toBe('Kim Lâu Thân');
    const y2026 = rows.find((r) => r.year === 2026)!;
    expect(y2026.ageMu).toBe(27); // 27%9=0 → không phạm
    expect(y2026.isKimLau).toBe(false);
  });
});

describe('kim-lau-data — nội dung', () => {
  it('có FAQ (≥5) và mọi câu có q + a', () => {
    expect(KIM_LAU_FAQS.length).toBeGreaterThanOrEqual(5);
    for (const f of KIM_LAU_FAQS) {
      expect(f.q.length).toBeGreaterThan(0);
      expect(f.a.length).toBeGreaterThan(0);
    }
  });
});
