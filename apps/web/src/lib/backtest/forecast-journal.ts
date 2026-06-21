/**
 * Forecast → outcome journal ("vòng dự-báo → kết-quả").
 *
 * The trust-loop of "Bằng Chứng": a forecast PRE-REGISTERS which life-domains the
 * chart emphasises in the coming years; later the user comes back and records
 * what actually happened. Tracking both — and showing the MISSES — is what makes
 * the accuracy claim honest and falsifiable instead of Barnum self-confirmation.
 *
 * Privacy by design (Tier-B, client-held): the entire journal lives in the user's
 * own browser (localStorage). Nothing — not the prediction, not the outcome, not
 * the birth data — leaves the device. Aggregating anonymous outcome tuples into
 * the public accuracy ledger is a SEPARATE, later layer; this file never sends.
 *
 * Only STRONG predictions are journalled: PARTIAL emphasis is "chớm nhẹ / mức
 * ngẫu nhiên" by design (see ForecastSection copy) — not a falsifiable claim, so
 * tracking it would inflate the hit-rate. Timestamps are injected (pure, testable);
 * the storage layer is the only impure part.
 */

import type { LifeCategory } from './backtest-core';
import type { ForecastYear } from './forecast';

export type ForecastOutcome = 'pending' | 'occurred' | 'absent';

export interface SavedPrediction {
  /** Stable key `${targetYear}:${category}` — re-saving a forecast never dupes. */
  id: string;
  /** ISO timestamp the prediction was first saved = the PRE-REGISTRATION mark. */
  createdAt: string;
  targetYear: number;
  category: LifeCategory;
  palace: string;
  /** Always STRONG — the only falsifiable claim level we journal. */
  grade: 'STRONG';
  outcome: ForecastOutcome;
  resolvedAt: string | null;
}

export interface TrackRecord {
  total: number;
  occurred: number;
  absent: number;
  pending: number;
  /** occurred + absent — predictions the user has actually judged. */
  resolved: number;
}

const KEY = 'hieu.bc.forecast_journal.v1';
/** Fired on every mutation so an open journal panel re-reads without prop-drilling. */
export const JOURNAL_EVENT = 'hieu:bc-journal-changed';

/** Pure: STRONG domains across a forecast → pre-registered predictions. */
export function predictionsFromForecast(
  years: ForecastYear[],
  createdAt: string,
): SavedPrediction[] {
  const out: SavedPrediction[] = [];
  for (const y of years) {
    for (const d of y.domains) {
      if (d.grade !== 'STRONG') continue;
      out.push({
        id: `${y.year}:${d.category}`,
        createdAt,
        targetYear: y.year,
        category: d.category,
        palace: d.palace,
        grade: 'STRONG',
        outcome: 'pending',
        resolvedAt: null,
      });
    }
  }
  return out;
}

function isValid(p: unknown): p is SavedPrediction {
  if (typeof p !== 'object' || p === null) return false;
  const r = p as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    typeof r.createdAt === 'string' &&
    typeof r.targetYear === 'number' &&
    typeof r.category === 'string' &&
    typeof r.palace === 'string' &&
    (r.outcome === 'pending' || r.outcome === 'occurred' || r.outcome === 'absent')
  );
}

function read(): SavedPrediction[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isValid) : [];
  } catch {
    return [];
  }
}

function write(list: SavedPrediction[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(JOURNAL_EVENT));
  } catch {
    /* quota exceeded / storage disabled — journal is best-effort, never blocks UI */
  }
}

/** Sorted by year then category — deterministic display order. */
export function loadJournal(): SavedPrediction[] {
  return read().sort(
    (a, b) => a.targetYear - b.targetYear || a.category.localeCompare(b.category),
  );
}

/**
 * Merge predictions, NEVER overwriting an existing one — preserves its original
 * `createdAt` (pre-registration integrity) and any outcome already recorded.
 */
export function addPredictions(preds: SavedPrediction[]): { added: number; total: number } {
  const cur = read();
  const seen = new Set(cur.map((p) => p.id));
  let added = 0;
  for (const p of preds) {
    if (!seen.has(p.id)) {
      cur.push(p);
      seen.add(p.id);
      added++;
    }
  }
  if (added > 0) write(cur);
  return { added, total: cur.length };
}

export function resolvePrediction(
  id: string,
  outcome: ForecastOutcome,
  resolvedAt: string,
): SavedPrediction[] {
  write(
    read().map((p) =>
      p.id === id
        ? { ...p, outcome, resolvedAt: outcome === 'pending' ? null : resolvedAt }
        : p,
    ),
  );
  return loadJournal();
}

export function removePrediction(id: string): SavedPrediction[] {
  write(read().filter((p) => p.id !== id));
  return loadJournal();
}

export function clearJournal(): void {
  write([]);
}

export function trackRecord(list: SavedPrediction[]): TrackRecord {
  const occurred = list.filter((p) => p.outcome === 'occurred').length;
  const absent = list.filter((p) => p.outcome === 'absent').length;
  const pending = list.filter((p) => p.outcome === 'pending').length;
  return { total: list.length, occurred, absent, pending, resolved: occurred + absent };
}
