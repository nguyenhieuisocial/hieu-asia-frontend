/**
 * Kiểm thử cụm "Ngũ hành bản mệnh theo năm sinh".
 *
 * - Bất biến nền: TÊN nạp âm luôn kết thúc bằng tên hành của nó ("Lộ Bàng Thổ"
 *   → Thổ). Kiểm cho cả dải năm → bắt lệch engine/ánh xạ ngay.
 * - Vài năm chuẩn (rock-solid) kiểm đúng hành.
 * - Màu hợp / kỵ phải suy ĐÚNG LUẬT tương sinh / tương khắc từ bảng ELEMENTS.
 */
import { describe, it, expect } from 'vitest';
import {
  buildBanMenh,
  listElementGuide,
  recentYears,
  BIRTH_YEARS,
  ELEMENT_COLORS,
  COLOR_HEX,
  FROM_YEAR,
  TO_YEAR,
} from './ban-menh-data';

describe('buildBanMenh — năm ngoài dải', () => {
  it('trả null khi ngoài 1950–2025', () => {
    expect(buildBanMenh(FROM_YEAR - 1)).toBeNull();
    expect(buildBanMenh(TO_YEAR + 1)).toBeNull();
    expect(buildBanMenh(NaN)).toBeNull();
  });
});

describe('buildBanMenh — năm chuẩn (canonical)', () => {
  it('1990 = Canh Ngọ, mệnh Thổ (Lộ Bàng Thổ)', () => {
    const d = buildBanMenh(1990)!;
    expect(d).not.toBeNull();
    expect(d.canChi).toBe('Canh Ngọ');
    expect(d.element).toBe('tho');
    expect(d.elementName).toBe('Thổ');
    expect(d.napAmName).toBe('Lộ Bàng Thổ');
    // Thổ: tương sinh = Hỏa (sinh Thổ); khắc mệnh = Mộc.
    expect(d.banMenhColors).toEqual(ELEMENT_COLORS.tho);
    expect(d.hopColors).toEqual(ELEMENT_COLORS.hoa);
    expect(d.avoidColors).toEqual(ELEMENT_COLORS.moc);
    expect(d.sinhElementName).toBe('Hỏa');
    expect(d.khacElementName).toBe('Mộc');
  });

  it('1984 = Giáp Tý, mệnh Kim (Hải Trung Kim)', () => {
    const d = buildBanMenh(1984)!;
    expect(d.canChi).toBe('Giáp Tý');
    expect(d.element).toBe('kim');
    expect(d.napAmName).toBe('Hải Trung Kim');
  });
});

describe('bất biến cho toàn dải năm', () => {
  it('tên nạp âm luôn kết thúc bằng tên hành; màu suy đúng luật', () => {
    for (const y of BIRTH_YEARS) {
      const d = buildBanMenh(y);
      expect(d, `năm ${y}`).not.toBeNull();
      if (!d) continue;
      // Nạp âm "... Kim/Mộc/Thủy/Hỏa/Thổ" → ký tự cuối khớp hành.
      expect(d.napAmName.endsWith(d.elementName), `${y}: ${d.napAmName} vs ${d.elementName}`).toBe(
        true,
      );
      // Màu bản mệnh = màu của hành mệnh.
      expect(d.banMenhColors).toEqual(ELEMENT_COLORS[d.element]);
      // Mọi tên màu đều có mã hex để vẽ ô.
      for (const c of [...d.banMenhColors, ...d.hopColors, ...d.avoidColors]) {
        expect(COLOR_HEX[c], `thiếu hex cho màu "${c}"`).toBeTruthy();
      }
      // SEO/FAQ đủ.
      expect(d.faqs.length).toBeGreaterThanOrEqual(4);
      // Nghề hợp mệnh phải có (mọi hành đều có nhóm nghề trong ngu-hanh-remedy).
      expect(d.careers.length, `năm ${y} thiếu nghề`).toBeGreaterThan(0);
      expect(d.seoTitle).toContain(String(y));
    }
  });
});

describe('helpers hub', () => {
  it('listElementGuide có 5 hành', () => {
    expect(listElementGuide()).toHaveLength(5);
  });
  it('recentYears nằm trong dải, mới nhất trước', () => {
    const r = recentYears(10);
    expect(r).toHaveLength(10);
    expect(r[0]).toBe(TO_YEAR);
    expect(r.every((y) => y >= FROM_YEAR && y <= TO_YEAR)).toBe(true);
  });
});
