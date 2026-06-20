/**
 * "Bằng Chứng" — forward view. AFTER a user has seen the chart match their real
 * past, show which life-DOMAINS the chart emphasizes in the next few years. Same
 * deterministic engine as the backtest, same anti-Barnum discipline: this reports
 * a domain being ENERGETICALLY EMPHASIZED in a year (computed Tứ Hóa / đại vận
 * activation), framed as a THEME to be conscious of — never a prediction of a
 * specific event. Consistent with the existing đại-vận-hiện-tại forward view.
 *
 * Pure forecast extraction (emphasizedDomains) is unit-tested; the network
 * orchestration (forecastTimeline) just sequences per-year casts under the rate cap.
 */

import {
  extractYearSignals,
  type YearSignals,
  type LifeCategory,
} from './backtest-core';
import { castTuViHoroscope, type TuViChart } from '../tuvi-client';
import { scoreEvent, type EventScore } from './scoring';
import { awaitCastSlot } from './cast-gate';

/**
 * Domains we forecast. Excludes "loss" (needs a specific lost-target, can't be
 * forecast) and "study" (no dedicated palace, overlaps career → avoid noise).
 */
export const FORECAST_CATEGORIES: LifeCategory[] = [
  'career',
  'wealth',
  'relationship',
  'health',
  'relocation',
  'childbirth',
];

export interface EmphasizedDomain {
  category: LifeCategory;
  palace: string;
  grade: 'STRONG' | 'PARTIAL';
  valence: EventScore['valence'];
  signals: string[];
}

export interface ForecastYear {
  year: number;
  age: number | null;
  domains: EmphasizedDomain[];
}

/**
 * Pure: from one year's chart signature, which forecastable domains are emphasized
 * (STRONG/PARTIAL activation of their governing palace). Reuses the tested
 * scoreEvent so forward and backward use the IDENTICAL, pre-registered rules.
 */
export function emphasizedDomains(signals: YearSignals): EmphasizedDomain[] {
  const out: EmphasizedDomain[] = [];
  for (const category of FORECAST_CATEGORIES) {
    const s = scoreEvent(signals, category);
    if ((s.grade === 'STRONG' || s.grade === 'PARTIAL') && s.governingPalace) {
      out.push({
        category,
        palace: s.governingPalace,
        grade: s.grade,
        valence: s.valence,
        signals: s.firedSignals,
      });
    }
  }
  // Strongest first so the UI can lead with the clearest themes.
  return out.sort((a, b) => (a.grade === b.grade ? 0 : a.grade === 'STRONG' ? -1 : 1));
}

export interface ForecastInput {
  birthSolarDate: string;
  birthHour: number;
  gender: 'male' | 'female';
}

/**
 * Cast the next `nYears` years (starting at `fromYear`) and extract each year's
 * emphasized domains. Sequential + paced via the SHARED cast gate so a forecast
 * fired right after a backtest stays under the tuvi-v2 rate rule (≤5/10s → CF 1015)
 * instead of bursting past it (the old per-function 2.1s gap left no headroom).
 */
export async function forecastTimeline(
  input: ForecastInput,
  fromYear: number,
  nYears: number,
  onProgress?: (done: number, total: number) => void,
): Promise<{ chart: TuViChart | null; years: ForecastYear[] }> {
  const birthYear = Number(input.birthSolarDate.slice(0, 4));
  const years: ForecastYear[] = [];
  let natalChart: TuViChart | null = null;
  for (let i = 0; i < nYears; i++) {
    const year = fromYear + i;
    await awaitCastSlot(); // shared ≤4/10s gate (across backtest + forecast)
    onProgress?.(i, nYears);
    const { chart, horoscope } = await castTuViHoroscope({
      birthSolarDate: input.birthSolarDate,
      birthHour: input.birthHour,
      gender: input.gender,
      targetDate: `${year}-06-30`,
    });
    natalChart = chart;
    const age = Number.isFinite(birthYear) ? year - birthYear : null;
    const sig = extractYearSignals(chart, horoscope, year, age);
    years.push({ year, age, domains: emphasizedDomains(sig) });
  }
  return { chart: natalChart, years };
}
