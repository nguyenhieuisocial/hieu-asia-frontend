import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  addPredictions,
  clearJournal,
  loadJournal,
  partitionByYear,
  predictionsFromForecast,
  removePrediction,
  resolvePrediction,
  trackRecord,
  type SavedPrediction,
} from './forecast-journal';
import type { ForecastYear } from './forecast';

// Project vitest runs in Node (no jsdom/happy-dom) — stub the bits the journal
// touches: localStorage + the event-dispatch no-ops.
class MemStorage {
  private m = new Map<string, string>();
  getItem(k: string): string | null {
    return this.m.has(k) ? this.m.get(k)! : null;
  }
  setItem(k: string, v: string): void {
    this.m.set(k, v);
  }
  removeItem(k: string): void {
    this.m.delete(k);
  }
  clear(): void {
    this.m.clear();
  }
}

beforeEach(() => {
  (globalThis as unknown as { window: unknown }).window = {
    localStorage: new MemStorage(),
    dispatchEvent: () => true,
    addEventListener: () => {},
    removeEventListener: () => {},
  };
});
afterEach(() => {
  delete (globalThis as unknown as { window?: unknown }).window;
});

const FORECAST: ForecastYear[] = [
  {
    year: 2027,
    age: 37,
    domains: [
      { category: 'career', palace: 'Quan Lộc', grade: 'STRONG', valence: 'positive', signals: ['hoa_quyen'] },
      { category: 'wealth', palace: 'Tài Bạch', grade: 'PARTIAL', valence: 'positive', signals: ['hoa_loc'] },
    ],
  },
  {
    year: 2028,
    age: 38,
    domains: [
      { category: 'relationship', palace: 'Phu Thê', grade: 'STRONG', valence: 'positive', signals: ['hoa_khoa'] },
    ],
  },
];

describe('predictionsFromForecast (pure)', () => {
  it('journals STRONG only, never PARTIAL', () => {
    const preds = predictionsFromForecast(FORECAST, '2026-06-21T00:00:00.000Z');
    expect(preds.map((p) => p.id)).toEqual(['2027:career', '2028:relationship']);
    expect(preds.every((p) => p.grade === 'STRONG')).toBe(true);
    expect(preds.every((p) => p.outcome === 'pending')).toBe(true);
    expect(preds[0]!.createdAt).toBe('2026-06-21T00:00:00.000Z');
  });
  it('empty forecast → no predictions', () => {
    expect(predictionsFromForecast([], 'x')).toEqual([]);
  });
});

describe('journal storage', () => {
  beforeEach(() => clearJournal());

  it('add dedupes by id and preserves the original createdAt (pre-registration)', () => {
    const first = predictionsFromForecast(FORECAST, '2026-01-01T00:00:00.000Z');
    expect(addPredictions(first)).toEqual({ added: 2, total: 2 });
    const again = predictionsFromForecast(FORECAST, '2026-09-09T00:00:00.000Z');
    expect(addPredictions(again)).toEqual({ added: 0, total: 2 });
    expect(loadJournal().find((p) => p.id === '2027:career')!.createdAt).toBe(
      '2026-01-01T00:00:00.000Z',
    );
  });

  it('resolve sets outcome + resolvedAt; reverting to pending clears resolvedAt', () => {
    addPredictions(predictionsFromForecast(FORECAST, 'c'));
    let list = resolvePrediction('2027:career', 'occurred', '2027-12-31T00:00:00.000Z');
    const hit = list.find((p) => p.id === '2027:career')!;
    expect(hit.outcome).toBe('occurred');
    expect(hit.resolvedAt).toBe('2027-12-31T00:00:00.000Z');
    list = resolvePrediction('2027:career', 'pending', 'whatever');
    expect(list.find((p) => p.id === '2027:career')!.resolvedAt).toBeNull();
  });

  it('trackRecord counts occurred / absent / pending honestly (misses kept)', () => {
    addPredictions(predictionsFromForecast(FORECAST, 'c'));
    resolvePrediction('2027:career', 'occurred', 't');
    resolvePrediction('2028:relationship', 'absent', 't'); // a MISS — must be counted, not hidden
    expect(trackRecord(loadJournal())).toEqual({
      total: 2,
      occurred: 1,
      absent: 1,
      pending: 0,
      resolved: 2,
    });
  });

  it('remove drops one prediction', () => {
    addPredictions(predictionsFromForecast(FORECAST, 'c'));
    expect(removePrediction('2027:career').map((p) => p.id)).toEqual(['2028:relationship']);
  });

  it('ignores corrupt localStorage rows', () => {
    window.localStorage.setItem(
      'hieu.bc.forecast_journal.v1',
      JSON.stringify([{ junk: true }, null, 42]),
    );
    expect(loadJournal()).toEqual([]);
  });
});

describe('trackRecord (pure)', () => {
  it('handles empty', () => {
    expect(trackRecord([] as SavedPrediction[])).toEqual({
      total: 0,
      occurred: 0,
      absent: 0,
      pending: 0,
      resolved: 0,
    });
  });
});

describe('partitionByYear (pure)', () => {
  const mk = (targetYear: number): SavedPrediction => ({
    id: `${targetYear}:career`,
    createdAt: 'c',
    targetYear,
    category: 'career',
    palace: 'Quan Lộc',
    grade: 'STRONG',
    outcome: 'pending',
    resolvedAt: null,
  });

  it('the current year IS judgeable (year already started)', () => {
    const { ready, upcoming } = partitionByYear([mk(2026), mk(2027), mk(2030)], 2027);
    expect(ready.map((p) => p.targetYear)).toEqual([2026, 2027]);
    expect(upcoming.map((p) => p.targetYear)).toEqual([2030]);
  });

  it('all future → nothing judgeable yet', () => {
    const { ready, upcoming } = partitionByYear([mk(2028), mk(2029)], 2026);
    expect(ready).toEqual([]);
    expect(upcoming).toHaveLength(2);
  });
});
