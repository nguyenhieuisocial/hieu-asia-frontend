/**
 * "Bằng Chứng" — retrospective chart-verification core (Phase 1: signal extraction).
 *
 * The trust mechanic of hieu.asia ("không bói mù") made falsifiable: a user enters
 * REAL dated past life events, and we re-cast their Tử Vi time-flow (đại vận / lưu
 * niên / Tứ Hóa) AS IT STOOD for each of those past years, then show that the chart
 * already "recorded" the structural signature of that year — with the EXACT stars
 * cited, and honestly surfacing where it did NOT match.
 *
 * This module is the DETERMINISTIC signal-extraction layer ONLY. It does NOT score
 * or interpret (that is Phase 2, which needs classically-grounded, founder-reviewed
 * event→signal rules — kept separate precisely so the proof can never collapse into
 * Barnum cold-reading). Here we just surface, per past year, what the engine says:
 * where the year's Tứ Hóa stars land natally + which đại vận palace governs that age.
 *
 * The enabling primitive already exists: castTuViHoroscope({ targetDate }) returns
 * the natal chart + the time-flow overlay for ANY date (tuvi-client.ts). We depend
 * on it READ-ONLY — no reading-orchestrate / master-report / pdf files are touched.
 */

import {
  castTuViHoroscope,
  type TuViChart,
  type TuViHoroscope,
} from '../tuvi-client';

/** Life-event categories a user can verify against their chart. */
export type LifeCategory =
  | 'career' // sự nghiệp / công việc
  | 'relationship' // tình cảm / hôn nhân
  | 'wealth' // tài chính
  | 'health' // sức khỏe
  | 'relocation' // chuyển nhà / đi xa
  | 'loss' // mất mát / tang sự
  | 'study' // học hành / thi cử
  | 'childbirth'; // sinh con

/** A real, dated past life event the user reports for verification. */
export interface LifeEvent {
  /** Solar (dương lịch) year the event happened. */
  year: number;
  category: LifeCategory;
  /** Optional free-text note (never sent anywhere public). */
  note?: string;
}

/** The four Tứ Hóa transformations, in iztro's fixed mutagen order. */
export type HoaKind = 'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ';
const HOA_ORDER: readonly HoaKind[] = ['Lộc', 'Quyền', 'Khoa', 'Kỵ'] as const;

/** Where a year's Tứ Hóa star sits in the NATAL chart (its activated palace). */
export interface MutagenLanding {
  star: string;
  hoa: HoaKind;
  /** Canonical natal palace name the star sits in, or null if not located. */
  palace: string | null;
}

/** The deterministic chart signature for one past year. */
export interface YearSignals {
  year: number;
  /** Western age that year (year − birthYear); null if birth year unknown. */
  age: number | null;
  /** Lưu niên (year) heavenly stem + earthly branch, or null. */
  luuNien: { heavenlyStem: string; earthlyBranch: string } | null;
  /** The year's four Tứ Hóa stars and the natal palace each activates. */
  luuNienMutagen: MutagenLanding[];
  /** The đại vận (10-year) palace that governs this age, or null. */
  daiVanPalace: string | null;
  /** Đại vận heavenly stem + earthly branch, or null. */
  daiVan: { heavenlyStem: string; earthlyBranch: string } | null;
}

// iztro emits alias cung names (e.g. "Tử Nữ" for Tử Tức). Normalize to canonical so
// landings/palaces label consistently — mirrors tuvi-facts.ts / LaSoChecker.
const PALACE_ALIASES: Record<string, string> = {
  'Tử Nữ': 'Tử Tức',
  'Giao Hữu': 'Nô Bộc',
  'Sự Nghiệp': 'Quan Lộc',
};
function normPalace(name: string): string {
  const t = (name ?? '').trim();
  return PALACE_ALIASES[t] ?? t;
}

/** Build a star-name → canonical-natal-palace map over the full star pool. */
export function starPalaceIndex(chart: TuViChart): Map<string, string> {
  const idx = new Map<string, string>();
  for (const p of chart.palaces) {
    const pal = normPalace(p.name);
    for (const star of [...p.majorStars, ...p.minorStars, ...p.adjectiveStars]) {
      const n = (star?.name ?? '').trim();
      if (n && !idx.has(n)) idx.set(n, pal);
    }
  }
  return idx;
}

/**
 * Pure: extract the deterministic chart signature for one past year from the
 * already-fetched natal chart + that year's horoscope overlay. No network, no LLM,
 * no interpretation — unit-testable against a captured golden fixture.
 */
export function extractYearSignals(
  chart: TuViChart,
  horoscope: TuViHoroscope | null,
  year: number,
  age: number | null,
): YearSignals {
  const idx = starPalaceIndex(chart);

  const yearly = horoscope?.yearly ?? null;
  const luuNienMutagen: MutagenLanding[] = (yearly?.mutagen ?? [])
    .slice(0, 4)
    .map((star, i): MutagenLanding | null => {
      const name = (star ?? '').trim();
      if (!name) return null;
      return { star: name, hoa: HOA_ORDER[i]!, palace: idx.get(name) ?? null };
    })
    .filter((m): m is MutagenLanding => m !== null);

  let daiVanPalace: string | null = null;
  if (age != null) {
    for (const p of chart.palaces) {
      const r = p.decadal?.range;
      if (r && r.length >= 2 && age >= r[0]! && age <= r[1]!) {
        daiVanPalace = normPalace(p.name);
        break;
      }
    }
  }

  const decadal = horoscope?.decadal ?? null;
  return {
    year,
    age,
    luuNien: yearly
      ? { heavenlyStem: yearly.heavenlyStem, earthlyBranch: yearly.earthlyBranch }
      : null,
    luuNienMutagen,
    daiVanPalace,
    daiVan: decadal
      ? { heavenlyStem: decadal.heavenlyStem, earthlyBranch: decadal.earthlyBranch }
      : null,
  };
}

export interface BacktestInput {
  /** YYYY-MM-DD solar birth date. */
  birthSolarDate: string;
  /** 0–23 wall-clock birth hour. */
  birthHour: number;
  gender: 'male' | 'female';
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Network orchestration (thin): for each reported event, fetch that year's chart
 * overlay and extract its signal envelope. Calls are spaced to respect the worker's
 * Tử Vi rate rule (≤5 req / 10s → CF error 1015), so a multi-event backtest stays
 * under the limit instead of failing mid-run. The pure work lives in
 * extractYearSignals; this layer only sequences the per-year casts.
 */
export async function backtestChart(
  input: BacktestInput,
  events: LifeEvent[],
): Promise<YearSignals[]> {
  const birthYear = Number(input.birthSolarDate.slice(0, 4));
  const out: YearSignals[] = [];
  for (let i = 0; i < events.length; i++) {
    const ev = events[i]!;
    if (i > 0) await sleep(2100); // ≤5/10s headroom
    const { chart, horoscope } = await castTuViHoroscope({
      birthSolarDate: input.birthSolarDate,
      birthHour: input.birthHour,
      gender: input.gender,
      targetDate: `${ev.year}-06-30`,
    });
    const age = Number.isFinite(birthYear) ? ev.year - birthYear : null;
    out.push(extractYearSignals(chart, horoscope, ev.year, age));
  }
  return out;
}
