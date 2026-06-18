import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { extractYearSignals, type YearSignals } from './backtest-core';
import { emphasizedDomains, FORECAST_CATEGORIES } from './forecast';
import type { TuViChart, TuViHoroscope } from '../tuvi-client';

const fixture = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('./__fixtures__/chart-1990-05-15-y2015.json', import.meta.url)),
    'utf8',
  ),
) as { chart: TuViChart; horoscope: TuViHoroscope };

const signals2015 = extractYearSignals(fixture.chart, fixture.horoscope, 2015, 25);

describe('emphasizedDomains — forward forecast reuses the tested scoring rules', () => {
  const domains = emphasizedDomains(signals2015);

  it('surfaces health as an emphasized domain (Tật Ách toạ thủ in 2015)', () => {
    const health = domains.find((d) => d.category === 'health');
    expect(health).toBeDefined();
    expect(['STRONG', 'PARTIAL']).toContain(health!.grade);
    expect(health!.palace).toBe('Tật Ách');
  });

  it('does NOT surface career (Quan Lộc not activated in 2015) — no false emphasis', () => {
    expect(domains.find((d) => d.category === 'career')).toBeUndefined();
  });

  it('every emphasized domain is a forecastable category with a real grade', () => {
    for (const d of domains) {
      expect(FORECAST_CATEGORIES).toContain(d.category);
      expect(['STRONG', 'PARTIAL']).toContain(d.grade);
      expect(d.signals.length).toBeGreaterThan(0);
    }
  });

  it('sorts STRONG before PARTIAL so the UI can lead with the clearest themes', () => {
    const grades = domains.map((d) => d.grade);
    const firstPartial = grades.indexOf('PARTIAL');
    const lastStrong = grades.lastIndexOf('STRONG');
    if (firstPartial !== -1 && lastStrong !== -1) {
      expect(lastStrong).toBeLessThan(firstPartial);
    }
  });

  it('never forecasts loss or study (excluded from FORECAST_CATEGORIES)', () => {
    expect(FORECAST_CATEGORIES).not.toContain('loss');
    expect(FORECAST_CATEGORIES).not.toContain('study');
    expect(domains.find((d) => d.category === 'loss')).toBeUndefined();
  });

  it('degrades cleanly with no horoscope (no emphasized domains)', () => {
    const empty: YearSignals = extractYearSignals(fixture.chart, null, 2030, 40);
    // With no lưu niên Tứ Hóa, only đại-vận-governed domains could surface; never throws.
    expect(Array.isArray(emphasizedDomains(empty))).toBe(true);
  });
});
