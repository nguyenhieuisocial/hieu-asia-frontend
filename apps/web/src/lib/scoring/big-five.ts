// hieu.asia — Big Five (OCEAN) scoring (Wave 60.94.n)
//
// Sums Likert-1-5 responses per trait, handles reverse-scored items,
// normalizes to 0-100 percentile-like score per trait.
//
// Formula:
//   raw_per_item = response (1-5)
//   if reverse_scored: raw_per_item = 6 - response
//   trait_raw = sum(raw_per_item per trait)
//   trait_max = num_items * 5
//   trait_score_0_100 = (trait_raw - trait_min) / (trait_max - trait_min) * 100

import { BIG_FIVE_AXIS_MAP, REVERSE_SCORED, type BigFiveTrait } from '../survey-schema-extended';

export interface BigFiveScore {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface BigFiveScoreWithMeta {
  scores: BigFiveScore;
  // Items answered per trait — useful for confidence (if < 80% answered, flag low confidence)
  items_per_trait: Record<BigFiveTrait, number>;
  total_items: number;
  total_answered: number;
}

/**
 * Score a Big Five survey response.
 *
 * @param answers - { ipip_o_01: 4, ipip_o_02: 5, ipip_o_03: 2, ... } (skipped items omitted)
 * @returns Normalized scores 0-100 per OCEAN trait + completion metadata
 */
export function scoreBigFive(answers: Record<string, number>): BigFiveScoreWithMeta {
  const raw_per_trait: Record<BigFiveTrait, number> = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  };
  const items_per_trait: Record<BigFiveTrait, number> = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  };
  let total_items = 0;
  let total_answered = 0;

  for (const [questionName, trait] of Object.entries(BIG_FIVE_AXIS_MAP)) {
    total_items += 1;
    const response = answers[questionName];
    if (typeof response !== 'number' || response < 1 || response > 5) continue;
    total_answered += 1;
    const scoredValue = REVERSE_SCORED.has(questionName) ? 6 - response : response;
    raw_per_trait[trait] += scoredValue;
    items_per_trait[trait] += 1;
  }

  // Normalize: per-trait raw range = [items, items * 5]
  // Map to 0-100
  const scores: BigFiveScore = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  };
  for (const trait of Object.keys(scores) as BigFiveTrait[]) {
    const items = items_per_trait[trait];
    if (items === 0) {
      // No answers for this trait → neutral 50 (mirrors MBTI scorer).
      // Avoids mis-reading "cực thấp" (0) when the trait simply wasn't answered.
      scores[trait] = 50;
      continue;
    }
    const min = items * 1;
    const max = items * 5;
    scores[trait] = Math.round(((raw_per_trait[trait] - min) / (max - min)) * 100);
  }

  return { scores, items_per_trait, total_items, total_answered };
}

/**
 * Format Big Five scores as JSON for DB storage (table: personality_scores).
 */
export function formatForDB(score: BigFiveScoreWithMeta) {
  return {
    big_five_openness: score.scores.openness,
    big_five_conscientiousness: score.scores.conscientiousness,
    big_five_extraversion: score.scores.extraversion,
    big_five_agreeableness: score.scores.agreeableness,
    big_five_neuroticism: score.scores.neuroticism,
    big_five_items_total: score.total_items,
    big_five_items_answered: score.total_answered,
    big_five_confidence: score.total_answered / score.total_items, // 0-1
  };
}
