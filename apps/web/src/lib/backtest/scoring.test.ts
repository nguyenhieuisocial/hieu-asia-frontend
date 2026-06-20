import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { extractYearSignals, type YearSignals } from './backtest-core';
import { scoreEvent, palaceBaseRate } from './scoring';
import type { TuViChart, TuViHoroscope } from '../tuvi-client';

const fixture = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('./__fixtures__/chart-1990-05-15-y2015.json', import.meta.url)),
    'utf8',
  ),
) as { chart: TuViChart; horoscope: TuViHoroscope };

// Real 2015 signature for this chart (verified): Thiên Cơ Lộc@Phụ Mẫu,
// Thiên Lương Quyền@Tật Ách, Tử Vi Khoa@Phúc Đức, Thái Âm Kỵ@Điền Trạch;
// đại vận (age 25) = Phụ Mẫu.
const signals2015 = extractYearSignals(fixture.chart, fixture.horoscope, 2015, 25);

describe('scoreEvent — deterministic, honest grading against real chart year', () => {
  it('health 2015 → PARTIAL: a Tứ Hóa sits in Tật Ách (toạ thủ), but đại vận does not govern it', () => {
    const s = scoreEvent(signals2015, 'health');
    expect(s.governingPalace).toBe('Tật Ách');
    expect(s.grade).toBe('PARTIAL');
    expect(s.landingsOnGoverning.map((m) => m.star)).toContain('Thiên Lương');
    expect(s.valence).toBe('positive'); // Thiên Lương hóa Quyền
    expect(s.firedSignals.join(' ')).toMatch(/toạ thủ cung Tật Ách/);
  });

  it('career 2015 → NONE: nothing activates Quan Lộc — reported honestly as a miss', () => {
    const s = scoreEvent(signals2015, 'career');
    expect(s.governingPalace).toBe('Quan Lộc');
    expect(s.grade).toBe('NONE');
    expect(s.firedSignals).toEqual([]);
    expect(s.reason).toMatch(/trượt/);
  });

  it('loss(parent) 2015 → downgraded to PARTIAL with polarity mismatch (Lộc, not Kỵ, in Phụ Mẫu)', () => {
    // Toạ thủ Thiên Cơ Lộc @ Phụ Mẫu + đại vận Phụ Mẫu would be STRONG, BUT a loss
    // should carry afflictive (Kỵ/sát) energy — pure Hóa Lộc contradicts it.
    const s = scoreEvent(signals2015, 'loss', 'parent');
    expect(s.governingPalace).toBe('Phụ Mẫu');
    expect(s.polarityMismatch).toBe(true);
    expect(s.grade).toBe('PARTIAL'); // downgraded from STRONG
    expect(s.valence).toBe('positive');
  });

  it('loss without specifying what was lost → UNSCORABLE (must not back-fit a palace)', () => {
    const s = scoreEvent(signals2015, 'loss');
    expect(s.grade).toBe('UNSCORABLE');
    expect(s.governingPalace).toBeNull();
    expect(s.reason).toMatch(/MẤT GÌ/);
  });
});

describe('scoreEvent — STRONG path + valence match (synthetic signals)', () => {
  const strongHealth: YearSignals = {
    year: 2010,
    age: 40,
    luuNien: { heavenlyStem: 'Canh', earthlyBranch: 'Dần' },
    luuNienMutagen: [{ star: 'Thiên Đồng', hoa: 'Kỵ', palace: 'Tật Ách' }],
    daiVanPalace: 'Tật Ách',
    daiVan: null,
  };

  it('health → STRONG when a Tứ Hóa sits in Tật Ách AND đại vận governs it', () => {
    const s = scoreEvent(strongHealth, 'health');
    expect(s.grade).toBe('STRONG');
    expect(s.valence).toBe('negative');
    expect(s.polarityMismatch).toBe(false); // health has no inherent valence
  });

  it('loss(self) → STRONG kept when the energy is afflictive (Kỵ) — valence matches', () => {
    const s = scoreEvent(strongHealth, 'loss', 'self'); // self-loss → Tật Ách
    expect(s.governingPalace).toBe('Tật Ách');
    expect(s.grade).toBe('STRONG');
    expect(s.polarityMismatch).toBe(false); // negative valence matches loss
  });
});

describe('palaceBaseRate — analytic honesty keystone (per-chart, zero engine calls)', () => {
  it('computes how often a palace gets a year Tứ Hóa landing across all 10 stems', () => {
    const br = palaceBaseRate(fixture.chart, 'Tật Ách');
    expect(br.total).toBe(10);
    expect(br.hits).toBeGreaterThanOrEqual(0);
    expect(br.hits).toBeLessThanOrEqual(10);
    expect(br.rate).toBeCloseTo(br.hits / 10, 5);
  });

  it('counts Thiên Lương-bearing stems for Tật Ách (Thiên Lương sits there natally)', () => {
    // Thiên Lương is hóa in Ất (Quyền), Kỷ (Khoa), Nhâm (Lộc) → ≥3 of 10 stems light Tật Ách.
    const br = palaceBaseRate(fixture.chart, 'Tật Ách');
    expect(br.hits).toBeGreaterThanOrEqual(3);
  });

  it('is deterministic', () => {
    expect(palaceBaseRate(fixture.chart, 'Mệnh')).toEqual(palaceBaseRate(fixture.chart, 'Mệnh'));
  });
});
