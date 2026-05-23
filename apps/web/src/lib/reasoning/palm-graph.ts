/**
 * Wave 56 Phase 2.4 — Palm Reading vision graph.
 *
 * Input: uploaded palm image URL (from Supabase Storage signed upload) +
 * birth-data context (name, gender).
 *
 * Graph flow:
 *
 *   parse_input (validates URL accessible)
 *     ↓
 *   classify_lines (cheap tier — Gemini Flash 3.5 vision: identify which
 *                   of the 7 lines are visible + their general shape)
 *     ↓
 *   analyze_lines (mid tier — interprets the classifier output per the
 *                  7 palmistry lines: life/head/heart/fate/sun/marriage/health)
 *     ↓
 *   synthesize (top tier — mentor-voice synthesis, gentle uncertainty)
 *
 * IMPORTANT (per /ultrareview Wave 57.1.9 Palm flow doesn't exist yet):
 * MethodChooser Palm CTA currently routes to /learn/palm (not this route).
 * This graph is built but not wired into UX until Wave 57.3 roadmap ships
 * the /palm/upload page. Phase 2.4 prepares the engine; Wave 57.3 wires it.
 *
 * No RAG retrieval for palm (palmistry corpus less standardized than Tử Vi /
 * Bát Tự; relying on model prior knowledge with strong cultural disclaimer).
 *
 * Cost estimate per reading: $0.10 cheap (vision) + $0.20 mid + $0.60 top = ~$0.90.
 * Vision token math: 1 image @ 1024x1024 ≈ 765 tokens in Gemini Flash 3.5.
 */

import { Annotation, StateGraph, START, END } from '@langchain/langgraph';
import { createClient } from '@supabase/supabase-js';
import { reasoningGenerate } from './llm';

/* ─── Cost helper (same as bat-tu-graph) ─────────────────────────────── */

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
  if (!url || !key) throw new Error('palm-graph: SUPABASE env required');
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

/* ─── Input + state ──────────────────────────────────────────────────── */

export interface PalmInput {
  displayName: string;
  gender: 'M' | 'F' | 'NB';
  /** Signed Supabase Storage URL of the uploaded palm photo (1024x1024 max) */
  imageUrl: string;
  /** Which hand was photographed — palmistry interprets left/right differently */
  hand: 'left' | 'right';
}

const GraphState = Annotation.Root({
  input: Annotation<PalmInput>({ reducer: (_p, n) => n }),
  runId: Annotation<string>({ reducer: (_p, n) => n }),
  classification: Annotation<string>({ reducer: (_p, n) => n, default: () => '' }),
  analysis: Annotation<string>({ reducer: (_p, n) => n, default: () => '' }),
  synthesis: Annotation<string>({ reducer: (_p, n) => n, default: () => '' }),
});
type State = typeof GraphState.State;

/* ─── Nodes ──────────────────────────────────────────────────────────── */

async function parseInput(state: State) {
  if (!state.input?.imageUrl) {
    throw new Error('palm-graph parseInput: imageUrl required');
  }
  if (!['left', 'right'].includes(state.input.hand)) {
    throw new Error(`palm-graph parseInput: hand must be left|right, got ${state.input.hand}`);
  }
  return {};
}

async function classifyLines(state: State) {
  const system = `Bạn là chuyên gia phân tích ảnh tướng tay (palmistry). Nhận diện 7 đường chỉ tay chính trên ảnh — chỉ MÔ TẢ những gì NHÌN THẤY, không diễn giải ý nghĩa ở bước này.`;

  const prompt = `Phân tích ảnh ${state.input.hand === 'left' ? 'bàn tay trái' : 'bàn tay phải'}. Đối với MỖI đường trong 7 đường chính dưới đây, trả lời:
- **Có thấy không** (yes/no/partial)
- **Hình dáng** nếu thấy (dài, ngắn, đậm, mờ, đứt khúc, cong, thẳng, có nhánh, v.v.)
- **Vị trí tương đối** trên bàn tay

7 đường: Sinh đạo (life line), Trí đạo (head line), Tâm đạo (heart line), Vận mệnh (fate line), Mặt trời (sun line), Hôn nhân (marriage line), Sức khoẻ (health line).

KHÔNG diễn giải vận số. KHÔNG đưa kết luận. CHỈ mô tả quan sát thị giác.

Output JSON-friendly format (key: line name → object with seen/shape/position).`;

  const result = await reasoningGenerate({
    tier: 'cheap',
    system,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          // Vision input — Gemini Flash 3.5 accepts image URLs through AI SDK
          { type: 'image', image: new URL(state.input.imageUrl) },
        ],
      },
    ],
    maxOutputTokens: 600,
    label: 'classify_lines',
  });
  incrementCost(state.runId, 'cheap', result.usage, 'classify_lines');
  return { classification: result.text };
}

async function analyzeLines(state: State) {
  const system = `Bạn là chuyên gia tướng tay với 20 năm kinh nghiệm. Diễn giải 7 đường chỉ tay từ mô tả quan sát thị giác, văn phong calm, không định mệnh hoá.`;

  const prompt = `## Mô tả quan sát từ ảnh
${state.classification}

## Yêu cầu (300-500 từ tiếng Việt)
Diễn giải cấu trúc 7 đường chỉ tay đã thấy:
- Mỗi đường có 1 đoạn (~50 từ): ý nghĩa truyền thống + sắc thái cá nhân hoá theo hình dáng thực tế.
- Nhấn mạnh: tướng tay phản ánh "khuynh hướng tự nhiên" chứ không phải "kết quả định sẵn".
- Nếu một đường không rõ trong ảnh, ghi rõ "không đủ dữ liệu để diễn giải" thay vì đoán mò.

KHÔNG dùng: "định mệnh", "chắc chắn", "phải", "không thể", "sẽ xảy ra".`;

  const result = await reasoningGenerate({
    tier: 'mid',
    system,
    prompt,
    maxOutputTokens: 1000,
    label: 'analyze_lines',
  });
  incrementCost(state.runId, 'mid', result.usage, 'analyze_lines');
  return { analysis: result.text };
}

const FORBIDDEN_PHRASES = /định mệnh|chắc chắn|phải làm|không thể|sẽ xảy ra/i;

async function synthesize(state: State) {
  const system = `Bạn là chuyên gia tướng tay kiêm life coach, viết cho ${state.input.displayName}. Văn phong mentor — gợi ý phản tư, không phán quyết.`;

  const prompt = `## Quan sát thị giác
${state.classification}

## Diễn giải 7 đường
${state.analysis}

## Yêu cầu (300-500 từ tiếng Việt)
Tổng hợp thành bản đọc tướng tay mentor-voice:
1. **Mở đầu** (~50 từ): chân dung tổng thể qua 7 đường.
2. **3 chủ đề nổi bật** (~150 từ): sức khoẻ + tình cảm + sự nghiệp hoặc tương tự.
3. **2-3 điểm cần ý thức** (~100 từ): không phải "điểm yếu" — là điểm mù.
4. **Lưu ý phương pháp** (~50 từ): nhắc người đọc tướng tay là góc nhìn bổ sung, không thay thế lá số ngày sinh; ảnh chụp tại thời điểm này — đường tay thay đổi theo thời gian.

KHÔNG dùng các cụm cấm.`;

  const first = await reasoningGenerate({
    tier: 'top',
    system,
    prompt,
    maxOutputTokens: 1400,
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
      '\n\nBẮT BUỘC: KHÔNG dùng các cụm "định mệnh", "chắc chắn", "phải làm", "không thể", "sẽ xảy ra". Bản nháp trước vi phạm; viết lại với văn phong mentor.',
    prompt,
    maxOutputTokens: 1400,
    label: 'synthesize.retry',
  });
  incrementCost(state.runId, 'top', retry.usage, 'synthesize.retry');
  return { synthesis: retry.text };
}

/* ─── Wiring ─────────────────────────────────────────────────────────── */

export function buildPalmGraph() {
  return new StateGraph(GraphState)
    .addNode('parse_input', parseInput)
    .addNode('classify_lines', classifyLines)
    .addNode('analyze_lines', analyzeLines)
    .addNode('synthesize', synthesize)
    .addEdge(START, 'parse_input')
    .addEdge('parse_input', 'classify_lines')
    .addEdge('classify_lines', 'analyze_lines')
    .addEdge('analyze_lines', 'synthesize')
    .addEdge('synthesize', END)
    .compile();
}
