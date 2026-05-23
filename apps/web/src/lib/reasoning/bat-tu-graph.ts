/**
 * Wave 56 Phase 2.4 — Bát Tự (4-pillar / 8-character) LangGraph analyzer.
 *
 * Bát Tự = "Eight characters" of birth: Year + Month + Day + Hour, each
 * having a Heavenly Stem (Thiên Can) + Earthly Branch (Địa Chi) = 8 chars.
 *
 * Graph structure (parallels tu-vi-graph but smaller):
 *
 *   parse_input
 *     ↓
 *   analyze_pillar_×4  (Year/Month/Day/Hour — Send fan-out, mid tier)
 *     ↓
 *   five_elements_balance (mid tier — Kim/Mộc/Thủy/Hỏa/Thổ ratio analysis)
 *     ↓
 *   synthesize (top tier — Opus 4.7, mentor-voice synthesis)
 *
 * Reuses Phase 2.2 patterns: agent_runs row, incrementCost fire-and-forget,
 * RAG retrieval per pillar via `retrieveContext`, forbidden-word post-validator.
 *
 * Cost estimate: 4 × mid $0.04 + balance mid $0.05 + synth top $0.80 = ~$1.01
 * Cheaper than Tử Vi ($1.74) because fewer parallel branches.
 */

import { Annotation, StateGraph, Send, START, END } from '@langchain/langgraph';
import { createClient } from '@supabase/supabase-js';
import { reasoningGenerate } from './llm';
import { retrieveContext, type CorpusChunk } from './rag';

/* ─── Cost helper (same pattern as tu-vi-graph) ──────────────────────── */

const TIER_COST_PER_M_TOKENS = {
  cheap: { input: 0.075, output: 0.3 },
  mid: { input: 3, output: 15 },
  top: { input: 15, output: 75 },
} as const;
type Tier = keyof typeof TIER_COST_PER_M_TOKENS;

let _supabase: ReturnType<typeof createClient> | null = null;
function getServiceRoleClient() {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('bat-tu-graph: SUPABASE env required');
  _supabase = createClient(url, key, { auth: { persistSession: false } });
  return _supabase;
}

function incrementCost(
  runId: string,
  tier: Tier,
  usage: { inputTokens?: number; outputTokens?: number } | undefined,
  currentNode: string,
): void {
  if (!runId) return;
  const tIn = usage?.inputTokens ?? 0;
  const tOut = usage?.outputTokens ?? 0;
  const cost =
    (tIn / 1_000_000) * TIER_COST_PER_M_TOKENS[tier].input +
    (tOut / 1_000_000) * TIER_COST_PER_M_TOKENS[tier].output;
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 2000);
  const rpc = getServiceRoleClient().rpc(
    'increment_agent_run_cost' as never,
    {
      p_run_id: runId,
      p_cost_usd: cost,
      p_tokens_in: tIn,
      p_tokens_out: tOut,
      p_current_node: currentNode,
    } as never,
    { signal: ac.signal } as never,
  );
  void Promise.resolve(rpc).then(
    () => clearTimeout(timer),
    () => clearTimeout(timer),
  );
}

/* ─── Pillar catalog ─────────────────────────────────────────────────── */

const PILLAR_NAMES = ['Năm', 'Tháng', 'Ngày', 'Giờ'] as const;
type PillarName = (typeof PILLAR_NAMES)[number];

export interface PillarInput {
  name: PillarName;
  /** Heavenly Stem — Giáp / Ất / Bính / ... */
  stem: string;
  /** Earthly Branch — Tý / Sửu / Dần / ... */
  branch: string;
  /** Element of stem (Kim/Mộc/Thủy/Hỏa/Thổ) */
  element: string;
  /** Optional: hidden stems in branch (cát thần / hung thần catalog) */
  hidden?: string[];
}

export interface BatTuInput {
  displayName: string;
  gender: 'M' | 'F' | 'NB';
  birthYear: number;
  /** 4 pillars in fixed order: Năm, Tháng, Ngày, Giờ */
  pillars: PillarInput[];
  /** Day-master element (chủ mệnh) computed by worker iztro service */
  dayMaster: string;
}

interface PillarAnalysis {
  pillar: PillarName;
  context: CorpusChunk[];
  analysis: string | null;
  error: string | null;
}

/* ─── State ──────────────────────────────────────────────────────────── */

const GraphState = Annotation.Root({
  input: Annotation<BatTuInput>({ reducer: (_p, n) => n }),
  runId: Annotation<string>({ reducer: (_p, n) => n }),
  pillars: Annotation<PillarAnalysis[]>({
    reducer: (prev, next) => [...prev, ...next],
    default: () => [],
  }),
  fiveElements: Annotation<string>({ reducer: (_p, n) => n, default: () => '' }),
  synthesis: Annotation<string>({ reducer: (_p, n) => n, default: () => '' }),
});
type State = typeof GraphState.State;

/* ─── Nodes ──────────────────────────────────────────────────────────── */

async function parseInput(state: State) {
  if (!state.input || state.input.pillars?.length !== 4) {
    throw new Error(
      `bat-tu-graph parseInput: expected 4 pillars, got ${state.input?.pillars?.length ?? 0}`,
    );
  }
  return {};
}

function fanOutPillars(state: State) {
  return state.input.pillars.map(
    (pillar) =>
      new Send('analyze_pillar', { pillar, input: state.input, runId: state.runId }),
  );
}

interface AnalyzePillarArgs {
  pillar: PillarInput;
  input: BatTuInput;
  runId: string;
}

async function analyzePillar(args: AnalyzePillarArgs): Promise<{ pillars: PillarAnalysis[] }> {
  if (!args?.pillar || !args.input || !args.pillar.stem || !args.pillar.branch) {
    throw new Error(
      'analyze_pillar: Send payload missing pillar/input/stem/branch — ' +
        'fanOutPillars contract changed?',
    );
  }
  const { pillar, input } = args;
  let context: CorpusChunk[] = [];
  try {
    const query = `trụ ${pillar.name} ${pillar.stem} ${pillar.branch} ngũ hành ${pillar.element} ý nghĩa`;
    context = await retrieveContext({
      query,
      k: 3,
      tags: ['bat-tu', `tru-${pillar.name.toLowerCase()}`],
    });
  } catch {
    context = [];
  }

  const contextText = context.length
    ? context.map((c, i) => `[${i + 1}] ${c.source}/${c.chapter ?? '_'}: ${c.content}`).join('\n\n')
    : '(không có corpus context — phân tích từ kiến thức tổng quan)';

  const system = `Bạn là một học giả Bát Tự (Tứ Trụ) có 30 năm kinh nghiệm. Phân tích một trụ trong lá Bát Tự của ${input.displayName} (${input.gender === 'M' ? 'nam' : input.gender === 'F' ? 'nữ' : 'phi nhị nguyên'}, sinh năm ${input.birthYear}). Chủ mệnh (Day Master): ${input.dayMaster}. Văn phong calm, không định mệnh hoá. Mục tiêu giúp người đọc hiểu cấu trúc năng lượng bẩm sinh để tự ra quyết định.`;

  const prompt = `## Trụ ${pillar.name}
Thiên Can: ${pillar.stem} (${pillar.element})
Địa Chi: ${pillar.branch}
${pillar.hidden?.length ? `Tàng can: ${pillar.hidden.join(', ')}` : ''}

## Corpus context
${contextText}

## Yêu cầu
Phân tích trụ ${pillar.name} trong 120-180 từ tiếng Việt:
1. **Năng lượng cốt lõi**: 1 câu nói rõ tính chất.
2. **Tương tác với chủ mệnh (${input.dayMaster})**: hỗ trợ, kiềm chế, hay xung khắc — và ý nghĩa thực tế.
3. **Điểm cần lưu ý**: 1-2 ý cụ thể, văn phong xây dựng.
4. **Câu hỏi gợi ý**: 1 câu để người đọc tự phản tư.`;

  try {
    const result = await reasoningGenerate({
      tier: 'mid',
      system,
      prompt,
      maxOutputTokens: 400,
      label: `analyze_pillar.${pillar.name}`,
    });
    incrementCost(args.runId, 'mid', result.usage, `analyze_pillar.${pillar.name}`);
    return {
      pillars: [{ pillar: pillar.name, context, analysis: result.text, error: null }],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      pillars: [{ pillar: pillar.name, context, analysis: null, error: message }],
    };
  }
}

async function fiveElementsBalance(state: State) {
  const valid = state.pillars.filter((p) => p.analysis !== null);
  if (valid.length === 0) {
    return { fiveElements: '(Không có phân tích trụ nào — bỏ qua ngũ hành.)' };
  }

  // Count element occurrences across all 4 pillars (heavenly stems only)
  const elements = state.input.pillars.map((p) => p.element);
  const counts = elements.reduce<Record<string, number>>((acc, e) => {
    acc[e] = (acc[e] || 0) + 1;
    return acc;
  }, {});

  const summaries = valid.map((p) => `### Trụ ${p.pillar}\n${p.analysis}`).join('\n\n');

  const system = `Bạn là học giả Bát Tự. Phân tích cân bằng Ngũ Hành (Kim/Mộc/Thủy/Hỏa/Thổ) trong lá Bát Tự.`;
  const prompt = `## Đếm ngũ hành (chỉ thiên can):
${JSON.stringify(counts, null, 2)}

## Chủ mệnh: ${state.input.dayMaster}

## Phân tích 4 trụ
${summaries}

## Yêu cầu (200-300 từ tiếng Việt)
- **Hành thịnh / hành suy**: hành nào dư, hành nào thiếu so với chủ mệnh.
- **Dụng thần / kỵ thần**: hành nào nên bổ sung (dụng), hành nào nên tránh (kỵ) — giải thích đơn giản.
- **Ứng dụng thực tế**: 2-3 gợi ý hành động (màu sắc, hướng, thời điểm) dựa trên ngũ hành — không hứa hẹn kết quả, chỉ gợi ý hỗ trợ.`;

  const result = await reasoningGenerate({
    tier: 'mid',
    system,
    prompt,
    maxOutputTokens: 600,
    label: 'five_elements_balance',
  });
  incrementCost(state.runId, 'mid', result.usage, 'five_elements_balance');
  return { fiveElements: result.text };
}

const FORBIDDEN_PHRASES = /định mệnh|chắc chắn|phải làm|không thể|sẽ xảy ra/i;

async function synthesize(state: State) {
  const valid = state.pillars.filter((p) => p.analysis !== null);
  if (valid.length === 0) {
    throw new Error(
      'synthesize: all 4 pillar analyses failed — refusing to fabricate Bát Tự reading.',
    );
  }
  const pillarSummaries = valid.map((p) => `### Trụ ${p.pillar}\n${p.analysis}`).join('\n\n');

  const system = `Bạn là học giả Bát Tự kiêm life coach, viết cho ${state.input.displayName} (sinh năm ${state.input.birthYear}, chủ mệnh ${state.input.dayMaster}). Tổng hợp toàn bộ lá Bát Tự thành bản đọc mentor-voice — không định mệnh hoá, tập trung giúp người đọc hiểu cấu trúc năng lượng bẩm sinh để tự quyết định.`;

  const prompt = `## Phân tích 4 trụ
${pillarSummaries}

## Cân bằng Ngũ Hành
${state.fiveElements}

## Yêu cầu: bản đọc Bát Tự tổng hợp (400-600 từ tiếng Việt)
Cấu trúc:
1. **Mở đầu** (~60 từ): chân dung tổng thể qua chủ mệnh + ngũ hành.
2. **Năng lượng cốt lõi** (~120 từ): 1-2 chủ đề lớn xuyên suốt 4 trụ.
3. **3 ưu thế** (~120 từ): cụ thể, hành động được.
4. **3 điểm cần ý thức** (~120 từ): điểm mù dễ rơi, văn phong xây dựng.
5. **Gợi ý hành động** (~80 từ): theo ngũ hành dụng thần — không hứa kết quả, chỉ gợi ý hỗ trợ.

KHÔNG dùng: "định mệnh", "chắc chắn", "phải", "không thể", "sẽ xảy ra".`;

  const first = await reasoningGenerate({
    tier: 'top',
    system,
    prompt,
    maxOutputTokens: 1600,
    label: 'synthesize',
  });
  incrementCost(state.runId, 'top', first.usage, 'synthesize');

  if (!FORBIDDEN_PHRASES.test(first.text)) {
    return { synthesis: first.text };
  }

  const retry = await reasoningGenerate({
    tier: 'top',
    system:
      system +
      '\n\nBẮT BUỘC: KHÔNG BAO GIỜ dùng các cụm "định mệnh", "chắc chắn", ' +
      '"phải làm", "không thể", "sẽ xảy ra". Bản nháp trước đó vi phạm; viết lại với văn phong mentor — chỉ gợi ý, không phán quyết.',
    prompt,
    maxOutputTokens: 1600,
    label: 'synthesize.retry',
  });
  incrementCost(state.runId, 'top', retry.usage, 'synthesize.retry');
  return { synthesis: retry.text };
}

/* ─── Wiring ─────────────────────────────────────────────────────────── */

export function buildBatTuGraph() {
  return new StateGraph(GraphState)
    .addNode('parse_input', parseInput)
    .addNode('analyze_pillar', analyzePillar)
    .addNode('five_elements_balance', fiveElementsBalance)
    .addNode('synthesize', synthesize)
    .addEdge(START, 'parse_input')
    .addConditionalEdges('parse_input', fanOutPillars, ['analyze_pillar'])
    .addEdge('analyze_pillar', 'five_elements_balance')
    .addEdge('five_elements_balance', 'synthesize')
    .addEdge('synthesize', END)
    .compile();
}
