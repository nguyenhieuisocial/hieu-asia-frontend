/**
 * Kiểm thử ranh giới năm âm cho OracleBrain teaser (lăng kính Cổ học Á Đông).
 *
 * Bug gốc: buildBanMenh(năm DƯƠNG trần) → người sinh tháng 1–đầu tháng 2 (trước
 * Lập Xuân) bị gán nhầm con giáp/can chi/mệnh. Fix: teaser lấy năm âm chuẩn từ
 * calculateBazi().meta.solarYearForPillar (ranh giới Lập Xuân — chuẩn mệnh học).
 *
 * Bất biến then chốt: canChi của lăng kính Cổ học PHẢI trùng trụ năm Bát Tự
 * (2 lăng kính hiển thị cạnh nhau, lệch nhau = mất uy tín).
 */
import { describe, it, expect } from 'vitest';
import { calculateBazi } from './bazi';
import { buildBanMenh } from './ban-menh-data';
import { conVatOf } from './con-giap-animal';

const lunarYearOf = (solarDate: string): number =>
  calculateBazi({ birthSolarDate: solarDate, birthHour: 12 }).meta.solarYearForPillar;

describe('OracleBrain — quy đổi năm âm theo Lập Xuân', () => {
  it('sinh 15/01/1990 (TRƯỚC Lập Xuân) → năm âm 1989, tuổi Kỷ Tỵ, con Rắn', () => {
    const lunarYear = lunarYearOf('1990-01-15');
    expect(lunarYear).toBe(1989);
    const dong = buildBanMenh(lunarYear);
    expect(dong).not.toBeNull();
    expect(dong!.canChi).toBe('Kỷ Tỵ');
    expect(conVatOf(dong!.zodiac.ten)).toBe('Rắn');
  });

  it('sinh 01/03/1990 (SAU Lập Xuân) → năm âm 1990, tuổi Canh Ngọ, con Ngựa', () => {
    const lunarYear = lunarYearOf('1990-03-01');
    expect(lunarYear).toBe(1990);
    const dong = buildBanMenh(lunarYear);
    expect(dong!.canChi).toBe('Canh Ngọ');
    expect(conVatOf(dong!.zodiac.ten)).toBe('Ngựa');
  });

  it('sát ranh giới: 01/02 thuộc năm trước, 10/02 thuộc năm hiện tại (Lập Xuân ~4/2)', () => {
    expect(lunarYearOf('1990-02-01')).toBe(1989);
    expect(lunarYearOf('1990-02-10')).toBe(1990);
  });

  it('BẤT BIẾN: canChi Cổ học === trụ năm Bát Tự cho mọi năm 1970–2000 (sinh 01/06)', () => {
    for (let y = 1970; y <= 2000; y++) {
      const chart = calculateBazi({ birthSolarDate: `${y}-06-01`, birthHour: 12 });
      expect(chart.meta.solarYearForPillar).toBe(y);
      const dong = buildBanMenh(chart.meta.solarYearForPillar);
      expect(dong).not.toBeNull();
      expect(dong!.canChi).toBe(`${chart.year.can} ${chart.year.chi}`);
    }
  });
});
