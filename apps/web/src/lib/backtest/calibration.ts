/**
 * "Bằng Chứng" — the bridge from a scored event to the ANONYMOUS calibration row
 * that gets persisted. This is the privacy firewall: `CalibrationTuple` is the
 * complete set of fields that may ever leave the browser, and it contains NO
 * birth date, NO birth hour, NO gender, NO raw event year, NO raw age, NO chart
 * geometry, NO free-text note. Only coarse, many-to-one buckets + a verdict.
 *
 * Why this exists from day one (un-backfillable): the negative-control verdict
 * and the closed-vocabulary signal codes are computed from the in-memory chart at
 * capture time. We deliberately never persist the chart, so a row not captured
 * now can never be reconstructed later. The honest public accuracy ledger is
 * impossible unless these rows accrue from the first user. See AGENT-LOCKS
 * "bang-chung-persistence" + memory [[bang-chung-backtest-lane]].
 */

import type { LifeCategory, LossTarget } from './backtest-core';
import type { EventScore, MatchGrade, SignalCode } from './scoring';
import { RULESET_VERSION } from './palace-map';

/** Stable bit per signal code. Order is frozen — appending only, never reusing a bit. */
export const SIGNAL_BITS: Record<SignalCode, number> = {
  PRIMARY_TOA_THU: 1 << 0,
  DAIVAN_GOVERNS: 1 << 1,
  TRINE_OPP_BRUSH: 1 << 2,
  SECONDARY_TOA_THU: 1 << 3,
  POLARITY_DOWNGRADE: 1 << 4,
};

export function signalBitmask(codes: readonly SignalCode[]): number {
  return codes.reduce((mask, c) => mask | SIGNAL_BITS[c], 0);
}

export type AgeBucket = '<20' | '20-29' | '30-39' | '40-49' | '50-59' | '60+';

/**
 * Coarse age band at the event (~decade). Combined with `eventRecency` this is
 * deliberately NOT enough to recover a birth year: age and recency are anchored
 * to different reference points and each spans many years.
 */
export function ageBucket(birthYear: number, eventYear: number): AgeBucket {
  const age = eventYear - birthYear;
  if (age < 20) return '<20';
  if (age < 30) return '20-29';
  if (age < 40) return '30-39';
  if (age < 50) return '40-49';
  if (age < 60) return '50-59';
  return '60+';
}

export type EventRecency = 'within_5y' | '5_15y' | 'over_15y';

/** How long before capture the event happened — coarse, REPLACES the raw year. */
export function eventRecency(eventYear: number, captureYear: number): EventRecency {
  const ago = captureYear - eventYear;
  if (ago <= 5) return 'within_5y';
  if (ago <= 15) return '5_15y';
  return 'over_15y';
}

/** base_rate_bucket 0..10 = how many of the 10 year-stems land a Tứ Hóa in the
 *  governing palace (the per-chart analytic control). Already 0..10; clamped. */
export function baseRateBucket(hits: number): number {
  return Math.max(0, Math.min(10, Math.round(hits)));
}

/**
 * The COMPLETE persisted shape. If a field is not here, it is never sent. (A
 * unit test asserts the serialized object has no PII-shaped keys.)
 */
export interface CalibrationTuple {
  rulesetVersion: string;
  kind: 'backtest' | 'forecast_verify';
  /** The user's PRE-REGISTERED claim — the grouping key (always the REAL category,
   *  even on control rows, so a control can be matched to the real rows it tests). */
  category: LifeCategory;
  lossTarget: LossTarget | null;
  /** The palace actually scored for THIS row (real palace, or the control palace). */
  governingPalace: string;
  grade: MatchGrade;
  valence: EventScore['valence'];
  polarityMismatch: boolean;
  signalBitmask: number;
  baseRateBucket: number;
  ageBucket: AgeBucket;
  eventRecency: EventRecency;
  /** true = negative-control row (same chart/era vs a deliberately-wrong category). */
  isControl: boolean;
}

export interface BuildTupleArgs {
  /** The scored verdict (real OR control). Its governingPalace/grade/codes are stored. */
  score: EventScore;
  /** The user's declared category (grouping key). On control rows this is the REAL
   *  category, while `score` was computed against the control category. */
  realCategory: LifeCategory;
  lossTarget?: LossTarget;
  isControl: boolean;
  kind?: 'backtest' | 'forecast_verify';
  birthYear: number;
  eventYear: number;
  captureYear: number;
  /** palaceBaseRate(chart, score.governingPalace).hits for this row's palace. */
  baseRateHits: number;
}

/**
 * Assemble a persist-ready tuple, or null if the verdict is unscorable (no palace)
 * — we never persist noise. The returned object is EXACTLY what is sent; the
 * caller must not add fields to it.
 */
export function buildCalibrationTuple(args: BuildTupleArgs): CalibrationTuple | null {
  const { score, realCategory, lossTarget, isControl, birthYear, eventYear, captureYear, baseRateHits } = args;
  if (score.grade === 'UNSCORABLE' || score.governingPalace == null) return null;
  return {
    rulesetVersion: RULESET_VERSION,
    kind: args.kind ?? 'backtest',
    category: realCategory,
    lossTarget: lossTarget ?? null,
    governingPalace: score.governingPalace,
    grade: score.grade,
    valence: score.valence,
    polarityMismatch: score.polarityMismatch,
    signalBitmask: signalBitmask(score.signalCodes),
    baseRateBucket: baseRateBucket(baseRateHits),
    ageBucket: ageBucket(birthYear, eventYear),
    eventRecency: eventRecency(eventYear, captureYear),
    isControl,
  };
}
