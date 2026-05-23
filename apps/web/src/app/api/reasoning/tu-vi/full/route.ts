/**
 * Wave 56 Phase 2.2 — Tử Vi 12-palace full reading route.
 *
 * POST body:
 *   {
 *     "chart": { displayName, gender, birthYear, palaces: [...] },
 *     "userId"?: "uuid"  // optional — authenticated session attaches this
 *   }
 *
 * Response:
 *   {
 *     "ok": true,
 *     "runId": "uuid",
 *     "synthesis": "...500-800 word mentor reading...",
 *     "elapsedMs": 28500,
 *     "cost": { usd: 1.74, tokensIn: 8500, tokensOut: 3200 },
 *     "palaces": [{ palace, hasAnalysis, hasError, contextCount }]
 *   }
 *
 * The graph runs server-side via LangGraph; the client subscribes to
 * `agent_runs:run_id=eq.<run>` for live progress (Phase 2.3 work).
 *
 * Bot guard: route is in `instrumentation-client.ts` protect list
 * (`/api/reasoning/*` wildcard from Wave 56 Phase 1). Each call costs
 * ~$1.74 in LLM tokens — abuse would burn the cap fast.
 */

import { NextResponse, after, type NextRequest } from 'next/server';
import { checkBotId } from 'botid/server';
import { createClient } from '@supabase/supabase-js';
import { buildTuViGraph, type ChartInput } from '@/lib/reasoning/tu-vi-graph';
import { startTrace } from '@/lib/reasoning/observability';
import { assertCostGuard } from '@/lib/reasoning/cost-guard';
import { getSessionFromRequest } from '@/lib/reasoning/session-auth';
import { assertFreeQuota } from '@/lib/reasoning/free-quota';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Wave 56 Phase 2 routes MUST set 300s (Pro Fluid Compute ceiling) — 12-palace
// graph with parallel mid + top tier easily takes 20-90s depending on cache hits.
export const maxDuration = 300;

interface ReasoningRequest {
  chart?: Partial<ChartInput>;
  userId?: string;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE env required');
  return createClient(url, key, { auth: { persistSession: false } });
}

function validateChart(c: unknown): c is ChartInput {
  if (!c || typeof c !== 'object') return false;
  const chart = c as ChartInput;
  // /ultrareview Phase 2.2 P2-2 fix: cap mainStars length + per-string length
  // to prevent OOM via 12 palaces × 1M-string mainStars OOM attack.
  // iztro never emits >4-5 chính tinh per palace; 8 is generous headroom.
  const palacesOk =
    Array.isArray(chart.palaces) &&
    chart.palaces.length === 12 &&
    chart.palaces.every(
      (p) =>
        typeof p.name === 'string' &&
        p.name.length <= 50 &&
        Array.isArray(p.mainStars) &&
        p.mainStars.length <= 8 &&
        p.mainStars.every((s) => typeof s === 'string' && s.length <= 50),
    );
  return (
    typeof chart.displayName === 'string' &&
    chart.displayName.length > 0 &&
    chart.displayName.length <= 100 &&
    ['M', 'F', 'NB'].includes(chart.gender) &&
    typeof chart.birthYear === 'number' &&
    chart.birthYear >= 1900 &&
    chart.birthYear <= 2100 &&
    palacesOk
  );
}

export async function POST(req: NextRequest) {
  // 1. BotID guard — block scripted abuse before we mint a run row
  const botCheck = await checkBotId();
  if (botCheck.isBot) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  // 2. Wave 58 — authed-only. Anon callers get 401 with a signin redirect URL
  // so the client can pop a login modal (Founder decision: capture all reader
  // identities for upsell sequence). Verified via Supabase JWT in
  // Authorization: Bearer header. NO anon path.
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json(
      {
        ok: false,
        error: 'auth_required',
        message: 'Đăng nhập miễn phí (10 giây) để xem phân tích chi tiết.',
        signin_url: '/signin?next=/reading/new',
      },
      { status: 401 },
    );
  }

  // 3. Parse + validate body
  let body: ReasoningRequest;
  try {
    body = (await req.json()) as ReasoningRequest;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  if (!validateChart(body.chart)) {
    return NextResponse.json(
      { ok: false, error: 'invalid_chart', hint: '12 palaces required with name + mainStars' },
      { status: 400 },
    );
  }
  const chart = body.chart;

  // 4. Wave 58 free quota — 1 reading per 30 days for free tier; subs unlimited.
  // Runs BEFORE cost-guard so the upsell message is more useful than "daily $5
  // cap" for users who've used their free reading.
  const quota = await assertFreeQuota(session.userId);
  if (!quota.ok) return quota.response;

  // 5. Phase 2.6 cost guard — kill switch + per-day cap. Fails CLOSED on
  // Supabase blip (503 + Retry-After). agent_runs row is the primary cost
  // ledger; this guard is only a *gate*, not the source of truth for spend.
  const guard = await assertCostGuard({
    graph: 'tu-vi',
    userId: session.userId,
    headers: req.headers,
  });
  if (!guard.ok) return guard.response;

  // 6. Create agent_runs row — graph nodes update cost via RPC; Realtime
  // publishes UPDATE so client progress UI tracks live (Phase 2.3).
  // Wave 58: user_id now derived from verified Bearer JWT (session.userId),
  // not from body — replaces /ultrareview Phase 2.2 P2-3 null guard.
  const supabase = getSupabase();
  const { data: runRow, error: runErr } = await supabase
    .from('agent_runs')
    .insert({
      user_id: session.userId,
      graph_name: 'tu-vi-full',
      current_node: 'parse_input',
      state: { chart: { displayName: chart.displayName, birthYear: chart.birthYear } },
      status: 'running',
    })
    .select('run_id')
    .single();
  if (runErr || !runRow) {
    return NextResponse.json(
      { ok: false, error: 'run_create_failed', detail: runErr?.message },
      { status: 500 },
    );
  }
  const runId = (runRow as { run_id: string }).run_id;

  // 4. Trace start
  const trace = startTrace({
    name: 'reasoning.tu-vi.full',
    input: { runId, displayName: chart.displayName, birthYear: chart.birthYear },
    tags: ['phase-2', 'tu-vi', 'full-reading'],
  });

  // 5. Run graph
  const startedAt = Date.now();
  try {
    const graph = buildTuViGraph();
    const finalState = await graph.invoke(
      { chart, runId, palaces: [], crossReference: '', synthesis: '' },
      { configurable: { thread_id: runId } },
    );
    const elapsedMs = Date.now() - startedAt;

    // 6. Mark run completed (cost was incremented per-node via RPC inside graph)
    await supabase
      .from('agent_runs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        current_node: 'synthesize',
        state: {
          chart: { displayName: chart.displayName, birthYear: chart.birthYear },
          synthesis: finalState.synthesis,
        },
      })
      .eq('run_id', runId);

    trace.end({ runId, elapsedMs, palaces: finalState.palaces.length });
    after(() => trace.flush());

    return NextResponse.json({
      ok: true,
      runId,
      synthesis: finalState.synthesis,
      crossReference: finalState.crossReference,
      elapsedMs,
      // Wave 58 + 58.1 P2-1: expose only the coarse upsell variant, never
      // the literal plan name (would leak "this account paid 4.99M" for
      // lifetime tier — phishing seed).
      upsell_variant: quota.upsellVariant,
      palaces: finalState.palaces.map((p) => ({
        palace: p.palace,
        hasAnalysis: p.analysis !== null,
        hasError: p.error !== null,
        contextCount: p.context.length,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await supabase
      .from('agent_runs')
      .update({
        status: 'failed',
        error_message: message,
        completed_at: new Date().toISOString(),
      })
      .eq('run_id', runId);
    trace.end({ error: message, runId });
    after(() => trace.flush());
    return NextResponse.json(
      { ok: false, error: 'graph_failed', runId, detail: message },
      { status: 502 },
    );
  }
}
