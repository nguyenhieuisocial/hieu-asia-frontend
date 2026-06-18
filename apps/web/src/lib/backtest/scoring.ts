/**
 * "Bằng Chứng" Phase 2 — deterministic, honest scoring of one past event against
 * the chart's signature for that year. NO LLM, NO interpretation: a year either
 * does or does not activate the (pre-registered) governing palace of the claimed
 * life-domain, by computable rules. Grounded + Barnum-guarded per the grounding
 * workflow: domain is locked BEFORE scoring, misses are first-class, valence is
 * checked, and a per-chart base rate is computed so a single hit is never oversold.
 */

import {
  starPalaceIndex,
  type YearSignals,
  type MutagenLanding,
  type LifeCategory,
  type LossTarget,
} from './backtest-core';
import type { TuViChart } from '../tuvi-client';
import {
  governingPalaces,
  oppositePalace,
  trinePalaces,
  hoaValence,
  CATEGORY_VALENCE,
  TU_HOA_BY_STEM,
  ALL_STEMS,
} from './palace-map';

export type MatchGrade = 'STRONG' | 'PARTIAL' | 'NONE' | 'UNSCORABLE';

export interface EventScore {
  year: number;
  category: LifeCategory;
  /** Primary governing palace (locked from the map), or null if unscorable. */
  governingPalace: string | null;
  grade: MatchGrade;
  /** The year's Tứ Hóa that land directly IN the governing palace (toạ thủ). */
  landingsOnGoverning: MutagenLanding[];
  /** Auditable list of exactly which signals fired (shown to the user). */
  firedSignals: string[];
  /** Dominant polarity of the activation on the governing palace. */
  valence: 'positive' | 'negative' | 'mixed' | 'none';
  /** True when an inherently-valenced category (loss/childbirth) is contradicted. */
  polarityMismatch: boolean;
  /** Plain-language, domain-emphasis-only explanation (never event-prediction). */
  reason: string;
}

const hoaLabel = (m: MutagenLanding) => `${m.star} hóa ${m.hoa}`;

/**
 * Score one event deterministically. The category (and, for loss, lossTarget) is
 * the user's PRE-REGISTERED claim — it must be chosen before this runs, never
 * back-fit to whichever palace happened to light up.
 */
export function scoreEvent(
  signals: YearSignals,
  category: LifeCategory,
  lossTarget?: LossTarget,
): EventScore {
  const gp = governingPalaces(category, lossTarget);
  if (!gp || gp.length === 0) {
    return {
      year: signals.year,
      category,
      governingPalace: null,
      grade: 'UNSCORABLE',
      landingsOnGoverning: [],
      firedSignals: [],
      valence: 'none',
      polarityMismatch: false,
      reason:
        category === 'loss'
          ? 'Cần cho biết MẤT GÌ (cha mẹ / vợ chồng / anh chị em / con / sức khỏe bản thân / tiền của) để chọn đúng cung — không xem lá số rồi mới gán.'
          : 'Chưa xác định được cung chủ quản cho loại sự kiện này.',
    };
  }

  const primary = gp[0]!;
  const secondaries = gp.slice(1);
  const opp = oppositePalace(primary);
  const trine = trinePalaces(primary);

  const landingsOnGoverning = signals.luuNienMutagen.filter((m) => m.palace === primary);
  const landingsOnTrineOpp = signals.luuNienMutagen.filter(
    (m) => m.palace != null && (m.palace === opp || trine.includes(m.palace as never)),
  );
  const landingsOnSecondary = signals.luuNienMutagen.filter(
    (m) => m.palace != null && secondaries.includes(m.palace as never),
  );

  const daiVanOnPrimary =
    signals.daiVanPalace === primary ||
    (signals.daiVanPalace != null && trine.includes(signals.daiVanPalace as never));

  const fired: string[] = [];
  for (const m of landingsOnGoverning) fired.push(`${hoaLabel(m)} toạ thủ cung ${primary}`);
  for (const m of landingsOnTrineOpp) fired.push(`${hoaLabel(m)} hội/xung chiếu cung ${primary} (từ ${m.palace})`);
  for (const m of landingsOnSecondary) fired.push(`${hoaLabel(m)} toạ thủ cung phụ ${m.palace}`);
  if (daiVanOnPrimary) {
    fired.push(
      signals.daiVanPalace === primary
        ? `Đại vận hiện quản cung ${primary}`
        : `Đại vận (cung ${signals.daiVanPalace}) hội chiếu cung ${primary}`,
    );
  }

  // Valence over the DIRECT activations on the governing palace (toạ thủ first).
  const valenceSet = new Set(landingsOnGoverning.map((m) => hoaValence(m.hoa)));
  const valence: EventScore['valence'] =
    valenceSet.size === 0
      ? 'none'
      : valenceSet.size === 2
        ? 'mixed'
        : valenceSet.has('positive')
          ? 'positive'
          : 'negative';

  // Grade — purely mechanical (grounding rubric):
  //  STRONG  = Tứ Hóa toạ thủ in the PRIMARY palace AND đại vận also governs it.
  //  PARTIAL = exactly one signal on primary, OR a trine/opposition brush,
  //            OR only a secondary-palace toạ thủ.
  //  NONE    = nothing touches the primary palace (or its trine/secondary).
  let grade: MatchGrade;
  if (landingsOnGoverning.length > 0 && daiVanOnPrimary) {
    grade = 'STRONG';
  } else if (
    landingsOnGoverning.length > 0 ||
    daiVanOnPrimary ||
    landingsOnTrineOpp.length > 0 ||
    landingsOnSecondary.length > 0
  ) {
    grade = 'PARTIAL';
  } else {
    grade = 'NONE';
  }

  // Valence guard for inherently-valenced categories only (loss=neg, childbirth=pos).
  // A clear polarity contradiction downgrades one level and is flagged honestly.
  let polarityMismatch = false;
  const expected = CATEGORY_VALENCE[category];
  if (expected && (grade === 'STRONG' || grade === 'PARTIAL') && valence !== 'none' && valence !== 'mixed') {
    if (valence !== expected) {
      polarityMismatch = true;
      grade = grade === 'STRONG' ? 'PARTIAL' : 'NONE';
    }
  }

  const reason = buildReason(signals.year, category, primary, grade, fired, polarityMismatch);

  return {
    year: signals.year,
    category,
    governingPalace: primary,
    grade,
    landingsOnGoverning,
    firedSignals: fired,
    valence,
    polarityMismatch,
    reason,
  };
}

function buildReason(
  year: number,
  category: LifeCategory,
  primary: string,
  grade: MatchGrade,
  fired: string[],
  polarityMismatch: boolean,
): string {
  if (grade === 'NONE') {
    return `Năm ${year}: lá số KHÔNG cho thấy cung ${primary} được kích hoạt — theo phương pháp này, lá số không ghi dấu rõ sự kiện bạn báo ở năm đó. (Đây là một "trượt" — được tính thành thật vào tỉ lệ.)`;
  }
  const lead =
    grade === 'STRONG'
      ? `Năm ${year}: lá số kích hoạt MẠNH cung ${primary}`
      : `Năm ${year}: lá số có dấu hiệu (một phần) ở cung ${primary}`;
  const tail = polarityMismatch
    ? ' ⚠️ Nhưng tính chất năng lượng (Tứ Hóa) không khớp chiều của sự kiện bạn báo → hạ một bậc, ghi nhận thành thật.'
    : '';
  return (
    `${lead}: ${fired.join('; ')}. ` +
    'Đây là DẤU HIỆU lĩnh vực được NHẤN trong năm, KHÔNG phải lá số "đoán" được sự kiện cụ thể (cùng một kích hoạt có thể ứng với nhiều kết cục khác nhau).' +
    tail
  );
}

export interface PalaceBaseRate {
  palace: string;
  /** Of the 10 possible year-stems, how many land a Tứ Hóa star toạ thủ in this palace. */
  hits: number;
  total: number;
  /** hits / total — the chance this palace gets a year Tứ Hóa landing, for THIS chart. */
  rate: number;
}

/**
 * Per-chart base rate: across all 10 heavenly stems, how often a year's Tứ Hóa
 * lands a star directly in the given palace. Computed analytically from the
 * verified stem→Tứ Hóa table + the chart's natal star positions — ZERO engine
 * calls. This is the honesty keystone: a "hit" on a palace that lights up in, say,
 * 5/10 years is barely better than a coin flip and must be presented as such.
 */
export function palaceBaseRate(chart: TuViChart, palace: string): PalaceBaseRate {
  const idx = starPalaceIndex(chart);
  let hits = 0;
  for (const stem of ALL_STEMS) {
    const stars = TU_HOA_BY_STEM[stem]!;
    if (stars.some((s) => idx.get(s) === palace)) hits += 1;
  }
  const total = ALL_STEMS.length;
  return { palace, hits, total, rate: hits / total };
}
