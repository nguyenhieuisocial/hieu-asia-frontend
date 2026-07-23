/**
 * Wave 56 Phase 1 — AI Gateway pipeline smoke route.
 *
 * Purpose: prove end-to-end that Vercel AI Gateway + `ai` SDK +
 * Langfuse trace + Vercel Function (Node 24 Fluid Compute) work
 * together. This is intentionally minimal — no graph, no business logic,
 * no auth. Once verified, Phase 2 (Tử Vi palace graph) reuses the same
 * `reasoningGenerate` + `startTrace` helpers.
 *
 * GET → ping. Verify route reachable, env detect, no-op trace works.
 * POST → 1 LLM call (cheap tier). Body: `{ prompt: string }`.
 *
 * Bot guard: included in `instrumentation-client.ts` protect list, so
 * legitimate browser users carry BotID headers; pure-script bots get 403
 * before consuming a Gateway quota slot.
 */

import { NextResponse, after, type NextRequest } from 'next/server';
import { checkBotId } from 'botid/server';
import { reasoningGenerate } from '@/lib/reasoning/llm';
import { startTrace } from '@/lib/reasoning/observability';
import { safeErrorDetail } from '@/lib/safe-error';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Wave 56 Phase 1 — pilot route only. 60s is plenty for 1 cheap-tier call.
// Phase 2 multi-step graphs (12-palace Tử Vi etc.) MUST set
// `maxDuration = 300` (Pro Fluid Compute ceiling). Do NOT copy this value
// blindly — choose per route based on expected graph depth.
export const maxDuration = 60;

interface HelloRequest {
  prompt?: string;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: '/api/reasoning/hello',
    runtime: 'nodejs',
    region: process.env.VERCEL_REGION ?? 'unknown',
    deployment: process.env.VERCEL_DEPLOYMENT_ID ?? 'unknown',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  const botCheck = await checkBotId();
  if (botCheck.isBot) {
    return NextResponse.json({ ok: false, error: 'bot_detected' }, { status: 403 });
  }

  let body: HelloRequest;
  try {
    body = (await req.json()) as HelloRequest;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const prompt = (body.prompt ?? '').trim();
  if (!prompt) {
    return NextResponse.json({ ok: false, error: 'prompt_required' }, { status: 400 });
  }
  if (prompt.length > 500) {
    return NextResponse.json({ ok: false, error: 'prompt_too_long' }, { status: 400 });
  }

  const trace = startTrace({
    name: 'reasoning.hello',
    input: { promptLength: prompt.length },
    tags: ['phase-1', 'smoke-test'],
  });
  const span = trace.span('generate', { tier: 'cheap', prompt });

  const startedAt = Date.now();
  try {
    const result = await reasoningGenerate({
      tier: 'cheap',
      system: 'Bạn là người trợ lý ngắn gọn. Trả lời bằng tiếng Việt, dưới 100 từ.',
      prompt,
      maxOutputTokens: 200,
      label: 'reasoning.hello',
    });
    const elapsedMs = Date.now() - startedAt;
    span.end({ text: result.text, usage: result.usage });
    trace.end({ text: result.text, elapsedMs });
    // /ultrareview P1-1 fix: defer Langfuse flush so it doesn't block the
    // response. Vercel Fluid Compute holds the function instance open via
    // `after()` until the flush resolves. For 12-palace graphs this saves
    // 100–500ms × N spans = visible UX win.
    after(() => trace.flush());
    return NextResponse.json({
      ok: true,
      text: result.text,
      usage: result.usage,
      elapsedMs,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    span.end({ error: message });
    trace.end({ error: message });
    after(() => trace.flush());
    return NextResponse.json(
      { ok: false, error: 'llm_failed', detail: safeErrorDetail('reasoning/hello', err) },
      { status: 502 },
    );
  }
}
