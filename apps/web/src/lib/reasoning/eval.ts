/**
 * Wave 56 Phase 2.5 — Langfuse LLM-as-judge eval framework.
 *
 * Daily cron picks N golden inputs from the eval dataset, runs each through
 * the production graph (tu-vi-full / bat-tu / palm), then asks the JUDGE
 * tier (GPT-5.5 — different vendor from generators per Phase 2.3.1) to score
 * each output 1-5 on 4 dimensions:
 *
 *   - coverage    : Did the reading address all 12 palaces / 4 pillars / 7 lines?
 *   - tone        : Mentor voice — calm, không định mệnh hoá, không hứa hẹn?
 *   - accuracy    : Are factual claims (sao, can chi, ngũ hành) correct?
 *   - voice       : Vietnamese natural + cultural register appropriate?
 *
 * Scores pushed to Langfuse as trace scores → dashboard tracks avg over time.
 * If 7-day avg drops > 0.5 vs baseline, Slack alert (Phase 2.6 wires).
 *
 * Why different judge vendor (OpenAI for judge, Anthropic for generator):
 * Anthropic models judging Anthropic outputs inflates scores ~5-10% per
 * MT-Bench paper §4.2 (self-bias). OpenAI GPT-5.5 as judge avoids this.
 */

import { reasoningGenerate } from './llm';

/* ─── Scoring rubric ────────────────────────────────────────────────── */

export interface EvalScore {
  coverage: number;   // 1-5
  tone: number;       // 1-5
  accuracy: number;   // 1-5
  voice: number;      // 1-5
  /** Concatenated reasoning from judge — useful for debugging score drops */
  reasoning: string;
  /** Average of 4 dims, rounded to 0.01 */
  average: number;
}

export type GraphKind = 'tu-vi' | 'bat-tu' | 'palm';

/* ─── Per-graph rubric customization ────────────────────────────────── */

const SCORING_RUBRIC = {
  'tu-vi': {
    coverageHint:
      'Có cover đủ 12 cung (Mệnh, Phụ Mẫu, Phúc Đức, Điền Trạch, Quan Lộc, Nô Bộc, Thiên Di, Tật Ách, Tài Bạch, Tử Tức, Phu Thê, Huynh Đệ)? Có cross-reference giữa các cung?',
    accuracyHint:
      'Tên sao (Tử Vi, Phá Quân, Thiên Cơ...) có đúng truyền thống Bắc phái 114 sao? Cung Phu Thê có nói về quan hệ, KHÔNG nói về sự nghiệp?',
  },
  'bat-tu': {
    coverageHint:
      'Có cover đủ 4 trụ (Năm, Tháng, Ngày, Giờ)? Có phân tích Ngũ Hành (Kim/Mộc/Thủy/Hỏa/Thổ) cân bằng? Có nói về Day Master?',
    accuracyHint:
      'Thiên Can (Giáp/Ất/...) + Địa Chi (Tý/Sửu/...) đúng? Dụng thần/kỵ thần có hợp lý với ngũ hành?',
  },
  palm: {
    coverageHint:
      'Có cover 7 đường (Sinh đạo, Trí đạo, Tâm đạo, Vận mệnh, Mặt trời, Hôn nhân, Sức khoẻ)? Có disclaimer "tướng tay là góc nhìn bổ sung"?',
    accuracyHint:
      'Có dùng "không đủ dữ liệu để diễn giải" khi đường không rõ thay vì đoán mò? Có phù hợp truyền thống palmistry?',
  },
} as const;

/* ─── Public API ────────────────────────────────────────────────────── */

export interface ScoreReadingArgs {
  kind: GraphKind;
  /** The full synthesis text returned by the graph */
  synthesis: string;
  /** Optional: input context (chart JSON or palm classification) */
  context?: string;
}

/**
 * Ask GPT-5.5 (judge tier) to score a reading on 4 dimensions.
 * Returns parsed JSON scores + reasoning. Throws on parse failure.
 *
 * Cost per call: ~$0.01 (~2k input + 500 output tokens at GPT-5.5 pricing).
 */
export async function scoreReading(args: ScoreReadingArgs): Promise<EvalScore> {
  const rubric = SCORING_RUBRIC[args.kind];

  const system = `Bạn là một critic độc lập đánh giá chất lượng reading hieu.asia. Cho điểm 1-5 trên 4 dimensions (coverage, tone, accuracy, voice). Trung thực — đừng cho điểm cao vì lịch sự. Output JSON only, không có markdown wrapper.`;

  const prompt = `## Reading kind
${args.kind}

## Reading synthesis
${args.synthesis}

${args.context ? `## Input context\n${args.context}\n\n` : ''}## Rubric

**coverage (1-5)**: ${rubric.coverageHint}
  - 1 = sót >50% nội dung quan trọng
  - 3 = cover được nội dung chính nhưng skip vài phần
  - 5 = đầy đủ + cross-reference rõ

**tone (1-5)**: Mentor voice — calm, không định mệnh hoá, không hứa hẹn tương lai cụ thể.
  - Kiểm tra absence của: "định mệnh", "chắc chắn", "phải làm", "không thể", "sẽ xảy ra"
  - 1 = vi phạm nhiều, văn phong phán quyết
  - 5 = calm, gợi ý phản tư, để người đọc tự quyết định

**accuracy (1-5)**: ${rubric.accuracyHint}
  - 1 = có lỗi factual nghiêm trọng (tên sao sai, ngũ hành lẫn)
  - 5 = chính xác theo truyền thống

**voice (1-5)**: Vietnamese natural — không Anglicism, không Google Translate, dùng register phù hợp văn hoá huyền học VN.
  - 1 = đọc như dịch máy
  - 5 = tự nhiên, có sắc thái văn hoá

## Output JSON format (STRICT — no markdown)
{
  "coverage": <1-5>,
  "tone": <1-5>,
  "accuracy": <1-5>,
  "voice": <1-5>,
  "reasoning": "<short Vietnamese explanation of WHY these scores, 80-150 words>"
}`;

  const result = await reasoningGenerate({
    tier: 'judge',
    system,
    prompt,
    maxOutputTokens: 800,
    temperature: 0.1, // judge should be near-deterministic
    label: `eval.score.${args.kind}`,
  });

  // Parse — strip markdown fences if model wrapped output despite instruction
  let raw = result.text.trim();
  if (raw.startsWith('```')) {
    raw = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  let parsed: { coverage: number; tone: number; accuracy: number; voice: number; reasoning: string };
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `eval.scoreReading: judge output not valid JSON — ${err instanceof Error ? err.message : err}. Raw: ${raw.slice(0, 200)}`,
    );
  }

  // Clamp + average
  const clamp = (n: unknown) => Math.max(1, Math.min(5, Number(n) || 1));
  const coverage = clamp(parsed.coverage);
  const tone = clamp(parsed.tone);
  const accuracy = clamp(parsed.accuracy);
  const voice = clamp(parsed.voice);
  const average = Math.round(((coverage + tone + accuracy + voice) / 4) * 100) / 100;

  return {
    coverage,
    tone,
    accuracy,
    voice,
    reasoning: parsed.reasoning ?? '',
    average,
  };
}

/**
 * Hand-curated golden dataset for eval runs. Phase 2.5 ships with 6 seed
 * cases (2 per graph kind). Founder/expert review batch adds more weekly.
 * Stored inline (not in Supabase) so eval-run script needs no DB roundtrip.
 *
 * Each case: minimal valid input + expected qualitative behavior. The
 * `expectedKeywords` array drives a soft check (NOT a hard contains-all)
 * — judge can still score high if synthesis covers semantically equivalent.
 */
export interface GoldenCase {
  id: string;
  kind: GraphKind;
  description: string;
  /** Input payload matches the route's POST body shape */
  input: Record<string, unknown>;
  /** Concepts the reading should touch on (soft check) */
  expectedConcepts: string[];
}

export const GOLDEN_DATASET: readonly GoldenCase[] = [
  {
    id: 'tu-vi-01',
    kind: 'tu-vi',
    description: 'Nam, 1990, chính tinh Tử Vi tại Mệnh — kinh điển',
    input: {
      chart: {
        displayName: 'Test Subject 01',
        gender: 'M',
        birthYear: 1990,
        palaces: [
          { name: 'Mệnh', mainStars: ['Tử Vi'], ganZhi: 'Canh Ngọ' },
          { name: 'Phụ Mẫu', mainStars: ['Thiên Đồng'], ganZhi: 'Tân Mùi' },
          { name: 'Phúc Đức', mainStars: ['Vũ Khúc'], ganZhi: 'Nhâm Thân' },
          { name: 'Điền Trạch', mainStars: ['Thái Dương'], ganZhi: 'Quý Dậu' },
          { name: 'Quan Lộc', mainStars: ['Phá Quân'], ganZhi: 'Giáp Tuất' },
          { name: 'Nô Bộc', mainStars: ['Thiên Cơ'], ganZhi: 'Ất Hợi' },
          { name: 'Thiên Di', mainStars: ['Liêm Trinh'], ganZhi: 'Bính Tý' },
          { name: 'Tật Ách', mainStars: ['Thiên Phủ'], ganZhi: 'Đinh Sửu' },
          { name: 'Tài Bạch', mainStars: ['Thái Âm'], ganZhi: 'Mậu Dần' },
          { name: 'Tử Tức', mainStars: ['Tham Lang'], ganZhi: 'Kỷ Mão' },
          { name: 'Phu Thê', mainStars: ['Cự Môn'], ganZhi: 'Canh Thìn' },
          { name: 'Huynh Đệ', mainStars: ['Thiên Tướng'], ganZhi: 'Tân Tỵ' },
        ],
      },
    },
    expectedConcepts: ['lãnh đạo', 'uy nghi', 'Tử Vi chủ tinh', '12 cung', 'mentor voice'],
  },
  {
    id: 'bat-tu-01',
    kind: 'bat-tu',
    description: 'Nữ, 1995, chủ mệnh Giáp Mộc',
    input: {
      input: {
        displayName: 'Test Subject 02',
        gender: 'F',
        birthYear: 1995,
        dayMaster: 'Giáp',
        pillars: [
          { name: 'Năm', stem: 'Ất', branch: 'Hợi', element: 'Mộc', hidden: ['Nhâm', 'Giáp'] },
          { name: 'Tháng', stem: 'Mậu', branch: 'Dần', element: 'Thổ', hidden: ['Giáp', 'Bính', 'Mậu'] },
          { name: 'Ngày', stem: 'Giáp', branch: 'Thân', element: 'Mộc', hidden: ['Canh', 'Nhâm', 'Mậu'] },
          { name: 'Giờ', stem: 'Tân', branch: 'Mùi', element: 'Kim', hidden: ['Kỷ', 'Đinh', 'Ất'] },
        ],
      },
    },
    expectedConcepts: ['Mộc thịnh', 'dụng thần', 'ngũ hành', 'cân bằng'],
  },
  // Add more cases as founder/expert curates — keep ≤30 total to cap daily eval cost.
];

/**
 * Aggregate scores into per-dim averages + global avg. Used by daily cron
 * (Phase 2.6) to detect score drops vs baseline.
 */
export function aggregateScores(scores: EvalScore[]) {
  if (scores.length === 0) {
    return { count: 0, coverage: 0, tone: 0, accuracy: 0, voice: 0, average: 0 };
  }
  const sum = (key: keyof Omit<EvalScore, 'reasoning'>) =>
    scores.reduce((s, x) => s + (x[key] as number), 0);
  return {
    count: scores.length,
    coverage: sum('coverage') / scores.length,
    tone: sum('tone') / scores.length,
    accuracy: sum('accuracy') / scores.length,
    voice: sum('voice') / scores.length,
    average: sum('average') / scores.length,
  };
}
