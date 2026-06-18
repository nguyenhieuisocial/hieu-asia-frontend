import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { extractYearSignals } from './backtest-core';
import type { TuViChart, TuViHoroscope } from '../tuvi-client';

// Golden fixture = a REAL /tools/tuvi-v2 response (birth 1990-05-15 10:00 male,
// targetDate 2015-06-30 → lưu niên Ất Mùi). Captured from the live engine so the
// extraction is tested against actual iztro output, not a hand-built mock.
const fixture = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('./__fixtures__/chart-1990-05-15-y2015.json', import.meta.url)),
    'utf8',
  ),
) as { chart: TuViChart; horoscope: TuViHoroscope };

describe('extractYearSignals — deterministic chart signature for a past year', () => {
  // 1990 birth → 2015 = age 25.
  const signals = extractYearSignals(fixture.chart, fixture.horoscope, 2015, 25);

  it("locates each of the year's four Tứ Hóa stars in its natal palace (Ất year)", () => {
    // Ất stem Tứ Hóa = Thiên Cơ Lộc · Thiên Lương Quyền · Tử Vi Khoa · Thái Âm Kỵ.
    // Landings verified against the live engine for this exact chart.
    expect(signals.luuNienMutagen).toEqual([
      { star: 'Thiên Cơ', hoa: 'Lộc', palace: 'Phụ Mẫu' },
      { star: 'Thiên Lương', hoa: 'Quyền', palace: 'Tật Ách' },
      { star: 'Tử Vi', hoa: 'Khoa', palace: 'Phúc Đức' },
      { star: 'Thái Âm', hoa: 'Kỵ', palace: 'Điền Trạch' },
    ]);
  });

  it('resolves the đại vận palace governing that age (25 → Phụ Mẫu, range 16–25)', () => {
    expect(signals.daiVanPalace).toBe('Phụ Mẫu');
  });

  it('carries the lưu niên + đại vận stem/branch', () => {
    expect(signals.luuNien).toEqual({ heavenlyStem: 'Ất', earthlyBranch: 'Mùi' });
    expect(signals.daiVan).toEqual({ heavenlyStem: 'Mậu', earthlyBranch: 'Dần' });
    expect(signals.year).toBe(2015);
    expect(signals.age).toBe(25);
  });

  it('is deterministic — identical output on repeat extraction', () => {
    const again = extractYearSignals(fixture.chart, fixture.horoscope, 2015, 25);
    expect(again).toEqual(signals);
  });

  it('returns no đại vận palace when age is unknown', () => {
    const s = extractYearSignals(fixture.chart, fixture.horoscope, 2015, null);
    expect(s.daiVanPalace).toBeNull();
    // Tứ Hóa landings do not depend on age — still resolved.
    expect(s.luuNienMutagen).toHaveLength(4);
  });

  it('degrades cleanly with no horoscope overlay', () => {
    const s = extractYearSignals(fixture.chart, null, 2015, 25);
    expect(s.luuNienMutagen).toEqual([]);
    expect(s.luuNien).toBeNull();
    expect(s.daiVan).toBeNull();
    // đại vận palace comes from the natal chart's decadal ranges, not the overlay.
    expect(s.daiVanPalace).toBe('Phụ Mẫu');
  });
});
