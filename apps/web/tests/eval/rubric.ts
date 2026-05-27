// hieu.asia — Eval rubric (Wave 60.94.n)
//
// Auto-scoring of an LLM-generated reading against the persona's
// expected_themes + expected_caution_flags + schema_valid criteria.
// Returns 0-10 score per the [[80 - Master Plan V1]] P4.5 quality gate.

export interface EvalSample {
  id: string;
  persona: string;
  input: Record<string, unknown>;
  expected_themes: string[];
  expected_caution_flags: string[];
  expert_baseline_score: number; // Reference score from expert reviewer
}

export interface ReadingOutput {
  // Subset of fields the reading-orchestrate Edge Function returns.
  // Full schema: src/lib/reading/decision-brief-schema.ts
  summary_section: string;
  strengths_section: string;
  caveats_section: string;
  recommendations_section: string;
  meta: {
    model: string;
    duration_ms: number;
  };
}

export interface RubricScore {
  themes_hit: number; // 0-3 of expected_themes mentioned
  themes_total: number;
  caution_flags_present: number;
  caution_flags_total: number;
  schema_valid: boolean;
  text_quality: number; // 0-3 heuristic (length + Vietnamese tone)
  raw_score: number; // 0-10
}

/**
 * Auto-rubric: deterministic checks WITHOUT calling LLM judge.
 * Use for fast feedback during dev; full LLM-as-judge runs in llm-judge.ts.
 */
export function scoreByRubric(sample: EvalSample, output: ReadingOutput): RubricScore {
  const reportText = [
    output.summary_section,
    output.strengths_section,
    output.caveats_section,
    output.recommendations_section,
  ].join('\n');

  // Themes — fuzzy match (case-insensitive, partial substring)
  const themes_hit = sample.expected_themes.filter((theme) =>
    reportText.toLowerCase().includes(theme.toLowerCase().split(' ')[0]),
  ).length;
  const themes_total = sample.expected_themes.length;

  // Caution flags — strict match (regex or keyword)
  const caution_flags_present = sample.expected_caution_flags.filter((flag) => {
    // Convert flag id → expected disclaimer phrase
    const phraseMap: Record<string, RegExp> = {
      financial_advice_disclaimer: /(không phải lời khuyên tài chính|consult.*advisor)/i,
      not_legal_advice: /(không phải tư vấn pháp lý|legal counsel)/i,
      relationship_disclaimer: /(không thay thế chuyên gia|professional therapist)/i,
      mental_health_disclaimer: /(sức khỏe tâm lý|mental health)/i,
      seek_professional: /(tham vấn chuyên gia|seek professional)/i,
      not_business_advice: /(không phải lời khuyên kinh doanh|business advisor)/i,
    };
    const pattern = phraseMap[flag];
    return pattern ? pattern.test(reportText) : false;
  }).length;
  const caution_flags_total = sample.expected_caution_flags.length;

  // Schema valid — required sections present + min length
  const schema_valid =
    output.summary_section.length > 100 &&
    output.strengths_section.length > 100 &&
    output.caveats_section.length > 50 &&
    output.recommendations_section.length > 100;

  // Text quality heuristic (3 points)
  // 1pt: > 1500 chars total (substantial)
  // 1pt: contains Vietnamese diacritics (proper VN tone)
  // 1pt: no obvious LLM tells (no "As an AI" / "I cannot")
  const totalLen = reportText.length;
  const hasDiacritics = /[àáâãèéêìíòóôõùúýỳỵỹỷđ]/i.test(reportText);
  const noAITells = !/(As an AI|I cannot|I am an? (AI|assistant)|language model)/i.test(reportText);
  const text_quality = (totalLen > 1500 ? 1 : 0) + (hasDiacritics ? 1 : 0) + (noAITells ? 1 : 0);

  // Aggregate 0-10
  // themes: max 3 points (themes_hit / themes_total * 3)
  // caution: max 3 points
  // schema: 1 point
  // text_quality: max 3 points
  const themes_score = themes_total > 0 ? (themes_hit / themes_total) * 3 : 3;
  const caution_score = caution_flags_total > 0 ? (caution_flags_present / caution_flags_total) * 3 : 3;
  const schema_score = schema_valid ? 1 : 0;
  const raw_score = Math.min(10, themes_score + caution_score + schema_score + text_quality);

  return {
    themes_hit,
    themes_total,
    caution_flags_present,
    caution_flags_total,
    schema_valid,
    text_quality,
    raw_score: Math.round(raw_score * 10) / 10,
  };
}
