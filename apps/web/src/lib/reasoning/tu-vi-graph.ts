/**
 * Wave 56 Phase 2.2 — Tử Vi 12-palace LangGraph analyzer.
 *
 * Input: pre-computed chart JSON (worker handles iztro compute via existing
 * service binding — we don't bring iztro into the Next.js bundle) + birth
 * data context (name, gender, year).
 *
 * Graph flow:
 *
 *   parse_input
 *     ↓
 *   retrieve_context  ── parallel × 12 palaces ──┐
 *     ↓                                          │
 *   analyze_palace_×12  ── parallel mid tier ────┤
 *     ↓                                          │
 *   cross_reference (mid tier) ←─────────────────┘
 *     ↓
 *   synthesize (top tier — Opus 4.7)
 *     ↓
 *   <result>
 *
 * Each LLM call:
 *   - Goes through `reasoningGenerate` → Vercel AI Gateway → tier-aware
 *     fallback chain (cheap/mid/top).
 *   - Wrapped in Langfuse `span` so cost + latency + model used is captured
 *     per node.
 *   - Updates `agent_runs.cost_usd` atomically via `increment_agent_run_cost`
 *     RPC after each call (Supabase Realtime publishes the row UPDATE so the
 *     client progress bar moves).
 *
 * Failure mode: a single palace analysis erroring does NOT abort the graph;
 * the palace's analysis becomes `null` in state and cross_reference handles
 * the gap. Only `parse_input` and `synthesize` are blocking nodes.
 *
 * Cost (Phase 2.4 budget guard will enforce):
 *   - retrieve_context: 12 × $0.00002 embed = $0.00024
 *   - analyze_palace ×12: 12 × ~$0.04 mid = $0.48
 *   - cross_reference: ~$0.06 mid
 *   - synthesize: ~$1.20 top
 *   - Total per reading: ~$1.74 (matches Wave 56 architecture estimate)
 */

import { Annotation, StateGraph, Send, START, END } from '@langchain/langgraph';
import { createClient } from '@supabase/supabase-js';
import { reasoningGenerate } from './llm';
import { retrieveContext, type CorpusChunk } from './rag';

/**
 * Per-tier USD cost per 1M tokens. Used to estimate cost from `usage` returned
 * by reasoningGenerate and push to agent_runs.cost_usd via RPC.
 * Numbers from Vercel AI Gateway public pricing 2026-05-23.
 */
const TIER_COST_PER_M_TOKENS = {
  cheap: { input: 0.075, output: 0.3 },   // gemini-3.5-flash
  mid:   { input: 3,     output: 15 },    // claude-sonnet-4
  top:   { input: 15,    output: 75 },    // claude-opus-4.7
} as const;

type Tier = keyof typeof TIER_COST_PER_M_TOKENS;

let _supabase: ReturnType<typeof createClient> | null = null;
function getServiceRoleClient() {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('tu-vi-graph: SUPABASE env required');
  _supabase = createClient(url, key, { auth: { persistSession: false } });
  return _supabase;
}

/**
 * Estimate USD cost from token usage and push to agent_runs row.
 * Non-blocking: errors are swallowed (cost telemetry must not abort a reading).
 * Triggers Supabase Realtime publication so client progress UI updates.
 */
async function incrementCost(
  runId: string,
  tier: Tier,
  usage: { inputTokens?: number; outputTokens?: number } | undefined,
  currentNode: string,
) {
  if (!runId) return;
  const tIn = usage?.inputTokens ?? 0;
  const tOut = usage?.outputTokens ?? 0;
  const cost =
    (tIn / 1_000_000) * TIER_COST_PER_M_TOKENS[tier].input +
    (tOut / 1_000_000) * TIER_COST_PER_M_TOKENS[tier].output;
  try {
    await getServiceRoleClient().rpc('increment_agent_run_cost' as never, {
      p_run_id: runId,
      p_cost_usd: cost,
      p_tokens_in: tIn,
      p_tokens_out: tOut,
      p_current_node: currentNode,
    } as never);
  } catch {
    /* telemetry-only; never fail the graph */
  }
}

/* ─── Palace catalog ────────────────────────────────────────────────── */

const PALACE_NAMES = [
  'Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc',
  'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ',
] as const;
type PalaceName = (typeof PALACE_NAMES)[number];

export interface PalaceInput {
  name: PalaceName;
  /** Main stars (chính tinh) in this palace per iztro output, e.g. ["Tử Vi","Phá Quân"] */
  mainStars: string[];
  /** Stem-branch label, e.g. "Giáp Tý" */
  ganZhi?: string;
  /** Raw palace data slice from chart JSON (passed through to prompt for context) */
  raw: unknown;
}

export interface ChartInput {
  /** User-facing display name (may be pseudonym) */
  displayName: string;
  gender: 'M' | 'F' | 'NB';
  /** Birth year in Western calendar — used for da yun phrasing */
  birthYear: number;
  /** Pre-computed by worker iztro service: 12 palaces in fixed order */
  palaces: PalaceInput[];
}

interface PalaceAnalysis {
  palace: PalaceName;
  context: CorpusChunk[];
  analysis: string | null;
  error: string | null;
}

/* ─── Graph state ───────────────────────────────────────────────────── */

const GraphState = Annotation.Root({
  chart: Annotation<ChartInput>({
    reducer: (_prev, next) => next,
  }),
  /** Realtime telemetry — graph code calls `incrementCost` on each LLM result. */
  runId: Annotation<string>({
    reducer: (_prev, next) => next,
  }),
  /** Palace analyses accumulate as parallel branches return. */
  palaces: Annotation<PalaceAnalysis[]>({
    reducer: (prev, next) => [...prev, ...next],
    default: () => [],
  }),
  /** Cross-reference output — fills tensions/synergies between palaces. */
  crossReference: Annotation<string>({
    reducer: (_prev, next) => next,
    default: () => '',
  }),
  /** Final synthesis — mentor-voice reading shown to user. */
  synthesis: Annotation<string>({
    reducer: (_prev, next) => next,
    default: () => '',
  }),
});

type State = typeof GraphState.State;

/* ─── Node: parse_input ─────────────────────────────────────────────── */

async function parseInput(state: State) {
  const chart = state.chart;
  if (!chart || !Array.isArray(chart.palaces) || chart.palaces.length !== 12) {
    throw new Error(
      `tu-vi-graph parseInput: expected 12 palaces, got ${chart?.palaces?.length ?? 0}`,
    );
  }
  // Pure validation node — no LLM call. Just gate downstream branches.
  return {};
}

/* ─── Fan-out: one Send() per palace into retrieve_context_palace ───── */

function fanOutPalaces(state: State) {
  return state.chart.palaces.map(
    (palace) => new Send('analyze_palace', { palace, chart: state.chart, runId: state.runId }),
  );
}

/* ─── Node: analyze_palace (runs once per palace via Send) ──────────── */

interface AnalyzePalaceArgs {
  palace: PalaceInput;
  chart: ChartInput;
  runId: string;
}

async function analyzePalace(args: AnalyzePalaceArgs): Promise<{ palaces: PalaceAnalysis[] }> {
  const { palace, chart } = args;

  // 1. Retrieve top-3 corpus chunks for this palace + its main stars.
  // Tag filter narrows to the relevant book section.
  let context: CorpusChunk[] = [];
  try {
    const query = `cung ${palace.name} ${palace.mainStars.join(' ')} ý nghĩa luận giải`;
    context = await retrieveContext({
      query,
      k: 3,
      tags: ['tu-vi', `cung-${palace.name.toLowerCase().replace(/\s+/g, '-')}`],
    });
  } catch (err) {
    // RAG miss is non-fatal — analyze without context using model prior knowledge
    context = [];
  }

  // 2. Mid-tier LLM analysis using the retrieved context.
  const contextText = context.length
    ? context.map((c, i) => `[${i + 1}] ${c.source}/${c.chapter ?? '_'}: ${c.content}`).join('\n\n')
    : '(không có corpus context — phân tích từ kiến thức tổng quan)';

  const system = `Bạn là một Tử Vi gia có 30 năm kinh nghiệm theo phái Bắc. Phân tích một cung trong lá số của ${chart.displayName} (${chart.gender === 'M' ? 'nam' : chart.gender === 'F' ? 'nữ' : 'phi nhị nguyên'}, sinh năm ${chart.birthYear}). Văn phong calm, không định mệnh hoá, không hứa hẹn tương lai cụ thể. Mục tiêu: giúp người đọc thấy mẫu hình hành vi và động lực bẩm sinh để TỰ ra quyết định.`;

  const prompt = `## Cung ${palace.name}
Chính tinh: ${palace.mainStars.join(', ') || '(vô chính diệu)'}
Can chi: ${palace.ganZhi ?? '(không có)'}

## Corpus context
${contextText}

## Yêu cầu
Phân tích cung ${palace.name} trong khoảng 120-180 từ tiếng Việt. Cấu trúc:
1. **Năng lượng cốt lõi**: 1 câu nói rõ mẫu hình chính.
2. **Điểm mạnh**: 1-2 ý cụ thể.
3. **Điểm cần lưu ý**: 1-2 ý cụ thể (không phải "điểm yếu" — văn phong xây dựng).
4. **Câu hỏi gợi ý cho chính mình**: 1 câu hỏi mở để người đọc tự phản tư.

Không liệt kê quá nhiều sao chi tiết — tập trung vào ý nghĩa tổng hợp.`;

  try {
    const result = await reasoningGenerate({
      tier: 'mid',
      system,
      prompt,
      maxOutputTokens: 400,
      label: `analyze_palace.${palace.name}`,
    });
    await incrementCost(args.runId, 'mid', result.usage, `analyze_palace.${palace.name}`);
    return {
      palaces: [{ palace: palace.name, context, analysis: result.text, error: null }],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      palaces: [{ palace: palace.name, context, analysis: null, error: message }],
    };
  }
}

/* ─── Node: cross_reference ─────────────────────────────────────────── */

async function crossReference(state: State) {
  const valid = state.palaces.filter((p) => p.analysis !== null);
  if (valid.length === 0) {
    return { crossReference: '(Không có phân tích cung nào thành công — bỏ qua cross-reference.)' };
  }

  const palaceSummaries = valid
    .map((p) => `### Cung ${p.palace}\n${p.analysis}`)
    .join('\n\n');

  const system = `Bạn là một Tử Vi gia. Tìm các kết nối — tensions (mâu thuẫn) và synergies (cộng hưởng) — giữa 12 cung trong lá số. Văn phong calm, không phán xét.`;

  const prompt = `## 12 phân tích cung
${palaceSummaries}

## Yêu cầu
Tổng hợp các kết nối quan trọng trong 200-300 từ tiếng Việt:
- **3 cộng hưởng nổi bật**: cung nào hỗ trợ cung nào, vì sao
- **2-3 mâu thuẫn cần ý thức**: cung nào kéo cung khác xuống, làm sao cân bằng
- **Trục chủ đạo**: mệnh-quan-tài hay mệnh-phu-tử, etc.`;

  const result = await reasoningGenerate({
    tier: 'mid',
    system,
    prompt,
    maxOutputTokens: 600,
    label: 'cross_reference',
  });
  await incrementCost(state.runId, 'mid', result.usage, 'cross_reference');
  return { crossReference: result.text };
}

/* ─── Node: synthesize (top tier) ───────────────────────────────────── */

async function synthesize(state: State) {
  const valid = state.palaces.filter((p) => p.analysis !== null);
  const palaceSummaries = valid
    .map((p) => `### ${p.palace}\n${p.analysis}`)
    .join('\n\n');

  const system = `Bạn là một Tử Vi gia kiêm life coach, viết cho ${state.chart.displayName} (sinh năm ${state.chart.birthYear}). Tổng hợp toàn bộ lá số thành một bản đọc mentor-voice — không định mệnh hoá, không hứa hẹn, tập trung giúp người đọc hiểu mẫu hình bản thân để tự quyết định.`;

  const prompt = `## Phân tích 12 cung
${palaceSummaries}

## Cross-reference
${state.crossReference}

## Yêu cầu: viết bản đọc Tử Vi tổng hợp (500-800 từ tiếng Việt)
Cấu trúc:
1. **Mở đầu** (~80 từ): chân dung tổng thể — bạn là ai về bản chất.
2. **Trục chủ đạo** (~120 từ): 1-2 chủ đề lớn xuyên suốt lá số (sự nghiệp + tình cảm, hoặc tài chính + sức khoẻ, etc.).
3. **3 ưu thế nổi bật** (~120 từ): cụ thể, hành động được.
4. **3 điểm cần ý thức** (~120 từ): không phải khuyết điểm — là điểm mù dễ rơi vào.
5. **Hướng đi gợi ý** (~80 từ): không phải "dự đoán", mà là "nếu bạn đang phân vân giữa A và B, hãy hỏi mình câu này".
6. **Đóng** (~40 từ): lời nhắc bạn là người ra quyết định, lá số chỉ là góc nhìn.

KHÔNG dùng các cụm: "định mệnh", "chắc chắn", "phải", "không thể", "sẽ xảy ra".`;

  const result = await reasoningGenerate({
    tier: 'top',
    system,
    prompt,
    maxOutputTokens: 2000,
    label: 'synthesize',
  });
  await incrementCost(state.runId, 'top', result.usage, 'synthesize');
  return { synthesis: result.text };
}

/* ─── Graph wiring ──────────────────────────────────────────────────── */

export function buildTuViGraph() {
  const graph = new StateGraph(GraphState)
    .addNode('parse_input', parseInput)
    .addNode('analyze_palace', analyzePalace)
    .addNode('cross_reference', crossReference)
    .addNode('synthesize', synthesize)
    .addEdge(START, 'parse_input')
    .addConditionalEdges('parse_input', fanOutPalaces, ['analyze_palace'])
    .addEdge('analyze_palace', 'cross_reference')
    .addEdge('cross_reference', 'synthesize')
    .addEdge('synthesize', END);
  return graph.compile();
}

export type CompiledTuViGraph = ReturnType<typeof buildTuViGraph>;
