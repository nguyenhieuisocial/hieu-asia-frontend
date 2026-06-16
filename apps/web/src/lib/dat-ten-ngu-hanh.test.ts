import { describe, it, expect } from 'vitest';
import { computeBanMenh, ELEMENTS, type Element } from './dat-ten-ngu-hanh';

/**
 * Kiểm thử hồi quy — engine ĐẶT TÊN NGŨ HÀNH, phần LÕI = bảng NẠP ÂM (vòng 60
 * Giáp Tý). Mỗi cặp 2 năm can-chi liên tiếp chia sẻ 1 mệnh nạp âm (30 tên, mỗi
 * tên phủ 2 năm).
 *
 * Công thức cổ điển (tự suy độc lập, KHÔNG echo output engine):
 *   cycle      = ((lunarYear - 4) % 60 + 60) % 60
 *   napAmIndex = floor(cycle / 2)
 * Bảng nạp âm chuẩn bắt đầu Giáp Tý (cycle 0) = Hải Trung Kim, và đúng 6 mệnh
 * cho mỗi hành (Kim/Mộc/Thủy/Hỏa/Thổ) → 30 mệnh tổng.
 *
 * computeBanMenh nhận NGÀY DƯƠNG → đổi sang năm âm. Mọi mốc dưới đây dùng
 * 15/06/<năm> — giữa năm, an toàn xa Tết → lunarYear == năm dương (đã verify).
 *
 * Bảng chuẩn 30 mệnh dùng để đối chiếu được suy ĐỘC LẬP từ bảng nạp âm cổ điển
 * (爐中火 = "Lô Trung Hỏa"; lưu ý đề bài viết "Lư Trung Hỏa" là lỗi chính tả —
 * tên cổ đúng và engine đúng là "Lô Trung Hỏa").
 */

// Bảng nạp âm chuẩn — tự suy từ vòng 60 Giáp Tý (Hải Trung Kim @ Giáp Tý).
const CANON: ReadonlyArray<{ name: string; element: Element }> = [
  { name: 'Hải Trung Kim', element: 'kim' },
  { name: 'Lô Trung Hỏa', element: 'hoa' },
  { name: 'Đại Lâm Mộc', element: 'moc' },
  { name: 'Lộ Bàng Thổ', element: 'tho' },
  { name: 'Kiếm Phong Kim', element: 'kim' },
  { name: 'Sơn Đầu Hỏa', element: 'hoa' },
  { name: 'Giản Hạ Thủy', element: 'thuy' },
  { name: 'Thành Đầu Thổ', element: 'tho' },
  { name: 'Bạch Lạp Kim', element: 'kim' },
  { name: 'Dương Liễu Mộc', element: 'moc' },
  { name: 'Tuyền Trung Thủy', element: 'thuy' },
  { name: 'Ốc Thượng Thổ', element: 'tho' },
  { name: 'Tích Lịch Hỏa', element: 'hoa' },
  { name: 'Tùng Bách Mộc', element: 'moc' },
  { name: 'Trường Lưu Thủy', element: 'thuy' },
  { name: 'Sa Trung Kim', element: 'kim' },
  { name: 'Sơn Hạ Hỏa', element: 'hoa' },
  { name: 'Bình Địa Mộc', element: 'moc' },
  { name: 'Bích Thượng Thổ', element: 'tho' },
  { name: 'Kim Bạch Kim', element: 'kim' },
  { name: 'Phú Đăng Hỏa', element: 'hoa' },
  { name: 'Thiên Hà Thủy', element: 'thuy' },
  { name: 'Đại Trạch Thổ', element: 'tho' },
  { name: 'Thoa Xuyến Kim', element: 'kim' },
  { name: 'Tang Đố Mộc', element: 'moc' },
  { name: 'Đại Khê Thủy', element: 'thuy' },
  { name: 'Sa Trung Thổ', element: 'tho' },
  { name: 'Thiên Thượng Hỏa', element: 'hoa' },
  { name: 'Thạch Lựu Mộc', element: 'moc' },
  { name: 'Đại Hải Thủy', element: 'thuy' },
];

/** Mệnh nạp âm chuẩn cho một năm âm — suy độc lập từ công thức cổ điển. */
function expectedNapAm(lunarYear: number): { name: string; element: Element } {
  const cycle = ((lunarYear - 4) % 60 + 60) % 60;
  return CANON[Math.floor(cycle / 2)]!;
}

describe('nạp âm › bảng chuẩn 30 mệnh (tự suy độc lập)', () => {
  it('đúng 30 mệnh tổng cộng', () => {
    expect(CANON).toHaveLength(30);
  });

  it('đúng 6 mệnh cho mỗi hành Kim/Mộc/Thủy/Hỏa/Thổ', () => {
    const counts: Record<Element, number> = { kim: 0, moc: 0, thuy: 0, hoa: 0, tho: 0 };
    for (const { element } of CANON) counts[element] += 1;
    expect(counts).toEqual({ kim: 6, moc: 6, thuy: 6, hoa: 6, tho: 6 });
  });

  it('ELEMENTS phủ đủ 5 hành ngũ hành', () => {
    expect(Object.keys(ELEMENTS).sort()).toEqual(['hoa', 'kim', 'moc', 'tho', 'thuy']);
  });
});

describe('nạp âm › engine khớp bảng nạp âm chuẩn suốt 1 vòng 60 năm', () => {
  // Quét trọn vòng 60 năm (1984..2043) — chạm MỌI chỉ số nạp âm 0..29.
  // Engine deterministic; nếu một mệnh bị đổi tên/đổi hành thì sweep này đỏ ngay.
  const START = 1984; // Giáp Tý — đầu vòng
  const span = Array.from({ length: 60 }, (_, i) => START + i);

  it('mỗi năm: napAmName + element khớp giá trị cổ điển suy độc lập', () => {
    for (const y of span) {
      const r = computeBanMenh(15, 6, y);
      expect(r, `computeBanMenh cho năm ${y} trả null`).not.toBeNull();
      const exp = expectedNapAm(r!.lunarYear);
      expect(r!.napAmName, `napAmName năm ${y} (âm ${r!.lunarYear})`).toBe(exp.name);
      expect(r!.element, `element năm ${y} (âm ${r!.lunarYear})`).toBe(exp.element);
    }
  });

  it('engine sản sinh đúng 30 tên mệnh phân biệt trong 1 vòng', () => {
    const names = new Set<string>();
    for (const y of span) names.add(computeBanMenh(15, 6, y)!.napAmName);
    expect(names.size).toBe(30);
  });

  it('engine sản sinh đúng 6 mệnh mỗi hành trong 1 vòng (theo TÊN phân biệt)', () => {
    const byElement: Record<Element, Set<string>> = {
      kim: new Set(), moc: new Set(), thuy: new Set(), hoa: new Set(), tho: new Set(),
    };
    for (const y of span) {
      const r = computeBanMenh(15, 6, y)!;
      byElement[r.element].add(r.napAmName);
    }
    expect(byElement.kim.size).toBe(6);
    expect(byElement.moc.size).toBe(6);
    expect(byElement.thuy.size).toBe(6);
    expect(byElement.hoa.size).toBe(6);
    expect(byElement.tho.size).toBe(6);
  });

  it('mỗi mệnh phủ ĐÚNG 2 năm liên tiếp (cặp can-chi chia sẻ 1 nạp âm)', () => {
    // Trong 1 vòng 60 năm, mỗi mệnh xuất hiện đúng 2 lần.
    const tally = new Map<string, number>();
    for (const y of span) {
      const n = computeBanMenh(15, 6, y)!.napAmName;
      tally.set(n, (tally.get(n) ?? 0) + 1);
    }
    for (const [name, count] of tally) {
      expect(count, `mệnh "${name}" phải phủ đúng 2 năm`).toBe(2);
    }
  });
});

describe('nạp âm › công thức chu kỳ (cycle index)', () => {
  it('vòng lặp 60 năm: cùng can-chi cách 60 năm → cùng mệnh', () => {
    for (const y of [1984, 1990, 2000, 1986, 2024]) {
      const a = computeBanMenh(15, 6, y)!;
      const b = computeBanMenh(15, 6, y + 60)!;
      expect(b.napAmName).toBe(a.napAmName);
      expect(b.element).toBe(a.element);
      expect(b.canChi).toBe(a.canChi);
    }
  });

  it('năm chẵn/lẻ trong cặp (cycle 2k và 2k+1) chia sẻ cùng mệnh', () => {
    // 1984 (Giáp Tý, cycle 0) và 1985 (Ất Sửu, cycle 1) → cùng Hải Trung Kim.
    const a = computeBanMenh(15, 6, 1984)!;
    const b = computeBanMenh(15, 6, 1985)!;
    expect(a.napAmName).toBe(b.napAmName);
    expect(a.napAmName).toBe('Hải Trung Kim');
  });
});

describe('nạp âm › đối chiếu năm cụ thể (bảng cổ điển)', () => {
  const cases: ReadonlyArray<{ year: number; canChi: string; napAm: string; element: Element }> = [
    { year: 1984, canChi: 'Giáp Tý', napAm: 'Hải Trung Kim', element: 'kim' },
    { year: 1985, canChi: 'Ất Sửu', napAm: 'Hải Trung Kim', element: 'kim' },
    { year: 1990, canChi: 'Canh Ngọ', napAm: 'Lộ Bàng Thổ', element: 'tho' },
    { year: 1991, canChi: 'Tân Mùi', napAm: 'Lộ Bàng Thổ', element: 'tho' },
    { year: 2000, canChi: 'Canh Thìn', napAm: 'Bạch Lạp Kim', element: 'kim' },
    { year: 2001, canChi: 'Tân Tỵ', napAm: 'Bạch Lạp Kim', element: 'kim' },
    // Đề bài viết "Lư Trung Hỏa" — chính tả cổ điển đúng là "Lô Trung Hỏa" (爐中火).
    { year: 1986, canChi: 'Bính Dần', napAm: 'Lô Trung Hỏa', element: 'hoa' },
    { year: 1987, canChi: 'Đinh Mão', napAm: 'Lô Trung Hỏa', element: 'hoa' },
    { year: 2024, canChi: 'Giáp Thìn', napAm: 'Phú Đăng Hỏa', element: 'hoa' },
    { year: 2025, canChi: 'Ất Tỵ', napAm: 'Phú Đăng Hỏa', element: 'hoa' },
  ];

  for (const c of cases) {
    it(`${c.year} = ${c.canChi} → ${c.napAm} (${c.element})`, () => {
      const r = computeBanMenh(15, 6, c.year);
      expect(r).not.toBeNull();
      expect(r!.lunarYear).toBe(c.year);
      expect(r!.canChi).toBe(c.canChi);
      expect(r!.napAmName).toBe(c.napAm);
      expect(r!.element).toBe(c.element);
    });
  }
});

describe('nạp âm › quan hệ hành hợp/tránh phái sinh đúng ngũ hành', () => {
  it('hopElements = [sinhBy, key] và avoidElements = [khac, khacBy] theo ELEMENTS', () => {
    // 1984 Hải Trung Kim (hành Kim): sinhBy=Thổ, sinhTo=Thủy, khac=Mộc, khacBy=Hỏa.
    const r = computeBanMenh(15, 6, 1984)!;
    const info = ELEMENTS[r.element];
    expect(r.hopElements).toEqual([info.sinhBy, info.key]);
    expect(r.avoidElements).toEqual([info.khac, info.khacBy]);
    // Kiểm tra giá trị cụ thể cho hành Kim (đối chiếu ngũ hành tương sinh/khắc).
    expect(r.element).toBe('kim');
    expect(r.hopElements).toEqual(['tho', 'kim']);
    expect(r.avoidElements).toEqual(['moc', 'hoa']);
  });
});
