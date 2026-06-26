/**
 * Kiểm thử cụm "Màu xe hợp mệnh" (/mau-xe-hop-menh).
 *
 * Grounding (chống bịa): buildMauXe phải suy ĐÚNG từ engine buildBanMenh —
 *  - hợp = màu xe thuộc hành bản mệnh + hành tương sinh,
 *  - kỵ = màu xe thuộc hành khắc mệnh,
 *  - 3 nhóm (hợp / trung tính / kỵ) phải PHÂN HOẠCH trọn vẹn CAR_COLORS, không trùng.
 */
import { describe, it, expect } from 'vitest';
import { buildMauXe, listElementCarGuide, CAR_COLORS, FROM_YEAR, TO_YEAR } from './mau-xe-data';
import { ELEMENTS, type Element } from './dat-ten-ngu-hanh';

const ELEMENT_KEYS: Element[] = ['kim', 'moc', 'thuy', 'hoa', 'tho'];

describe('buildMauXe — biên', () => {
  it('trả null khi ngoài dải 1950–2025', () => {
    expect(buildMauXe(FROM_YEAR - 1)).toBeNull();
    expect(buildMauXe(TO_YEAR + 1)).toBeNull();
    expect(buildMauXe(Number.NaN)).toBeNull();
  });
});

describe('buildMauXe — năm chuẩn 1990 (Canh Ngọ, mệnh Thổ)', () => {
  const d = buildMauXe(1990)!;

  it('mệnh + can chi đúng engine', () => {
    expect(d).not.toBeNull();
    expect(d.canChi).toBe('Canh Ngọ');
    expect(d.element).toBe('tho');
    expect(d.elementName).toBe('Thổ');
    // Thổ: tương sinh = Hỏa; khắc mệnh = Mộc.
    expect(d.sinhElementName).toBe('Hỏa');
    expect(d.khacElementName).toBe('Mộc');
  });

  it('màu xe hợp thuộc hành Thổ + Hỏa; kỵ thuộc hành Mộc', () => {
    const hopEls = new Set(d.hopCarColors.map((c) => c.element));
    expect([...hopEls].sort()).toEqual(['hoa', 'tho']);
    expect(d.avoidCarColors.every((c) => c.element === 'moc')).toBe(true);
    // Vài màu cụ thể để bắt lệch ánh xạ.
    const hopNames = d.hopCarColors.map((c) => c.name);
    expect(hopNames).toContain('Đỏ'); // Hỏa
    expect(hopNames).toContain('Vàng / Vàng cát'); // Thổ
    expect(d.avoidCarColors.map((c) => c.name)).toContain('Xanh lá / Xanh rêu'); // Mộc
  });
});

describe('bất biến toàn dải năm 1950–2025', () => {
  it('3 nhóm màu phân hoạch trọn vẹn CAR_COLORS, không trùng', () => {
    for (let y = FROM_YEAR; y <= TO_YEAR; y++) {
      const d = buildMauXe(y);
      expect(d, `năm ${y}`).not.toBeNull();
      if (!d) continue;
      const all = [...d.hopCarColors, ...d.neutralCarColors, ...d.avoidCarColors];
      // Phủ đúng toàn bộ bảng, không thiếu không thừa.
      expect(all.length, `năm ${y}`).toBe(CAR_COLORS.length);
      const names = new Set(all.map((c) => c.name));
      expect(names.size, `năm ${y} không trùng`).toBe(CAR_COLORS.length);
      // Màu kỵ luôn chỉ thuộc đúng 1 hành = hành khắc mệnh.
      const khacBy = ELEMENTS[d.element].khacBy;
      expect(d.avoidCarColors.every((c) => c.element === khacBy), `năm ${y}`).toBe(true);
      // Màu hợp không bao giờ trùng màu kỵ.
      const hopNames = new Set(d.hopCarColors.map((c) => c.name));
      expect(d.avoidCarColors.some((c) => hopNames.has(c.name)), `năm ${y}`).toBe(false);
    }
  });
});

describe('CAR_COLORS + listElementCarGuide nhất quán', () => {
  it('mọi màu xe gắn đúng một hành hợp lệ', () => {
    for (const c of CAR_COLORS) {
      expect(ELEMENT_KEYS, `${c.name}`).toContain(c.element);
      expect(c.hex).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('guide phủ đủ 5 hành và gộp đúng số màu', () => {
    const guide = listElementCarGuide();
    expect(guide.map((g) => g.key).sort()).toEqual([...ELEMENT_KEYS].sort());
    const total = guide.reduce((n, g) => n + g.carColors.length, 0);
    expect(total).toBe(CAR_COLORS.length);
  });
});
