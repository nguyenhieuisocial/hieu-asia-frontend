// hieu.asia — DiSC scoring (Wave 60.94.n)
//
// Sums Likert-1-5 responses per DiSC dimension (D/i/S/C), handles
// reverse-scored items, normalizes to 0-100 score per dimension.
//
// Note: this is an OPEN-SOURCE DiSC short-form clone, NOT licensed
// Wiley DiSC. For Premium tier production use, evaluate licensed assessment.

import { DISC_AXIS_MAP, REVERSE_SCORED, type DiscDimension } from '../survey-schema-extended';

export interface DiscScore {
  dominance: number;
  influence: number;
  steadiness: number;
  compliance: number;
}

export interface DiscScoreWithMeta {
  scores: DiscScore;
  primary_style: DiscDimension; // highest-scoring dimension
  secondary_style: DiscDimension; // second-highest (DiSC reads "D/i" or "S/C" as combination)
  items_per_dimension: Record<DiscDimension, number>;
  total_items: number;
  total_answered: number;
}

export function scoreDisc(answers: Record<string, number>): DiscScoreWithMeta {
  const raw_per_dim: Record<DiscDimension, number> = {
    dominance: 0,
    influence: 0,
    steadiness: 0,
    compliance: 0,
  };
  const items_per_dim: Record<DiscDimension, number> = {
    dominance: 0,
    influence: 0,
    steadiness: 0,
    compliance: 0,
  };
  let total_items = 0;
  let total_answered = 0;

  for (const [questionName, dim] of Object.entries(DISC_AXIS_MAP)) {
    total_items += 1;
    const response = answers[questionName];
    if (typeof response !== 'number' || response < 1 || response > 5) continue;
    total_answered += 1;
    const scoredValue = REVERSE_SCORED.has(questionName) ? 6 - response : response;
    raw_per_dim[dim] += scoredValue;
    items_per_dim[dim] += 1;
  }

  const scores: DiscScore = { dominance: 0, influence: 0, steadiness: 0, compliance: 0 };
  for (const dim of Object.keys(scores) as DiscDimension[]) {
    const items = items_per_dim[dim];
    if (items === 0) {
      scores[dim] = 0;
      continue;
    }
    const min = items;
    const max = items * 5;
    scores[dim] = Math.round(((raw_per_dim[dim] - min) / (max - min)) * 100);
  }

  // Sort dimensions by score descending to find primary + secondary.
  // Wave 60.95.fix: explicit non-null assertion + fallback for TS strict mode
  // (`noUncheckedIndexedAccess`). Object.entries always returns 4 entries for
  // 4-dimension DiscScore so sortedDims[0]/[1] are guaranteed defined, but TS
  // can't prove it from the type. Use `!` + fallback to satisfy compiler.
  const sortedDims = (Object.entries(scores) as Array<[DiscDimension, number]>).sort(
    (a, b) => b[1] - a[1],
  );
  const primary_style: DiscDimension = sortedDims[0]?.[0] ?? 'dominance';
  const secondary_style: DiscDimension = sortedDims[1]?.[0] ?? 'influence';

  return {
    scores,
    primary_style,
    secondary_style,
    items_per_dimension: items_per_dim,
    total_items,
    total_answered,
  };
}

export function formatForDB(score: DiscScoreWithMeta) {
  return {
    disc_dominance: score.scores.dominance,
    disc_influence: score.scores.influence,
    disc_steadiness: score.scores.steadiness,
    disc_compliance: score.scores.compliance,
    disc_primary_style: score.primary_style,
    disc_secondary_style: score.secondary_style,
    disc_items_total: score.total_items,
    disc_items_answered: score.total_answered,
  };
}
