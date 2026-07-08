/**
 * Kiểm thử nền cho trang tra cứu tuổi trọn đời — chốt vài sự thật lõi mà toàn
 * bộ kết quả dựa vào. Deterministic: truyền năm xem tường minh, không phụ thuộc
 * ngày hôm nay.
 */
import { describe, it, expect } from 'vitest';
import { yearProfile } from '../../lib/sinh-con';
import { canChiOfYear, checkKimLau } from '../../lib/xem-tuoi-cuoi';

describe('tra-cuu-tuoi — sự thật lõi năm 1990', () => {
  it('yearProfile(1990) → Canh Ngọ, con giáp Ngọ', () => {
    const p = yearProfile(1990);
    expect(p).not.toBeNull();
    expect(p?.canChi).toBe('Canh Ngọ');
    expect(p?.zodiac.slug).toBe('ngo');
    expect(p?.zodiac.ten).toBe('Ngọ');
  });

  it('canChiOfYear(1990).name === "Canh Ngọ"', () => {
    expect(canChiOfYear(1990).name).toBe('Canh Ngọ');
  });

  it('checkKimLau(1990, 2026) trả tuổi mụ xác định', () => {
    const k = checkKimLau(1990, 2026);
    expect(k.ageMu).toBe(37); // 2026 − 1990 + 1
    expect(k.remainder).toBe(37 % 9);
    expect(typeof k.remainder).toBe('number');
  });

  it('yearProfile trả null khi ngoài dải 1900–2100', () => {
    expect(yearProfile(1899)).toBeNull();
    expect(yearProfile(2101)).toBeNull();
  });
});
