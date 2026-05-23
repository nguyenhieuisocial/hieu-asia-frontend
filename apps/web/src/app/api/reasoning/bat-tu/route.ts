/**
 * Wave 56 Phase 2.4 — Bát Tự reading route.
 *
 * POST body: { input: BatTuInput }
 * Response: { ok, runId, synthesis, fiveElements, elapsedMs, pillars[] }
 */

import { NextResponse, after, type NextRequest } from 'next/server';
import { checkBotId } from 'botid/server';
import { createClient } from '@supabase/supabase-js';
import { buildBatTuGraph, type BatTuInput } from '@/lib/reasoning/bat-tu-graph';
import { startTrace } from '@/lib/reasoning/observability';
import { assertCostGuard } from '@/lib/reasoning/cost-guard';
import { getSessionFromRequest } from '@/lib/reasoning/session-auth';
import { assertFreeQuota } from '@/lib/reasoning/free-quota';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 180; // 4 pillars + balance + synth ~60-90s p99

interface Req {
  input?: Partial<BatTuInput>;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE env required');
  return createClient(url, key, { auth: { persistSession: false } });
}

function validateInput(i: unknown): i is BatTuInput {
  if (!i || typeof i !== 'object') return false;
  const inp = i as BatTuInput;
  const pillarsOk =
    Array.isArray(inp.pillars) &&
    inp.pillars.length === 4 &&
    inp.pillars.every(
      (p) =>
        typeof p.stem === 'string' &&
        p.stem.length <= 20 &&
        typeof p.branch === 'string' &&
        p.branch.length <= 20 &&
        typeof p.element === 'string' &&
        p.element.length <= 20 &&
        (!p.hidden || (Array.isArray(p.hidden) && p.hidden.length <= 5)),
    );
  return (
    typeof inp.displayName === 'string' &&
    inp.displayName.length > 0 &&
    inp.displayName.length <= 100 &&
    ['M', 'F', 'NB'].includes(inp.gender) &&
    typeof inp.birthYear === 'number' &&
    inp.birthYear >= 1900 &&
    inp.birthYear <= 2100 &&
    typeof inp.dayMaster === 'string' &&
    inp.dayMaster.length <= 20 &&
    pillarsOk
  );
}

export async function POST(req: NextRequest) {
  const bot = await checkBotId();
  if (bot.isBot) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });

  // Wave 58 — authed-only.
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

  let body: Req;
  try {
    body = (await req.json()) as Req;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  if (!validateInput(body.input)) {
    return NextResponse.json(
      { ok: false, error: 'invalid_input', hint: '4 pillars + dayMaster required' },
      { status: 400 },
    );
  }
  const input = body.input;

  // Wave 58 free quota + Phase 2.6 cost guard.
  const quota = await assertFreeQuota(session.userId);
  if (!quota.ok) return quota.response;
  const guard = await assertCostGuard({ graph: 'bat-tu', userId: session.userId, headers: req.headers });
  if (!guard.ok) return guard.response;

  const supabase = getSupabase();
  const { data: runRow, error: runErr } = await supabase
    .from('agent_runs')
    .insert({
      user_id: session.userId,
      graph_name: 'bat-tu',
      current_node: 'parse_input',
      state: { displayName: input.displayName, dayMaster: input.dayMaster },
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

  const trace = startTrace({
    name: 'reasoning.bat-tu',
    input: { runId, displayName: input.displayName, dayMaster: input.dayMaster },
    tags: ['phase-2', 'bat-tu'],
  });

  const startedAt = Date.now();
  try {
    const graph = buildBatTuGraph();
    const finalState = await graph.invoke(
      { input, runId, pillars: [], fiveElements: '', synthesis: '' },
      { configurable: { thread_id: runId } },
    );
    const elapsedMs = Date.now() - startedAt;

    await supabase
      .from('agent_runs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        current_node: 'synthesize',
        state: {
          displayName: input.displayName,
          dayMaster: input.dayMaster,
          synthesis: finalState.synthesis,
        },
      })
      .eq('run_id', runId);

    trace.end({ runId, elapsedMs, pillars: finalState.pillars.length });
    after(() => trace.flush());

    return NextResponse.json({
      ok: true,
      runId,
      synthesis: finalState.synthesis,
      fiveElements: finalState.fiveElements,
      elapsedMs,
      upsell_variant: quota.upsellVariant, // Wave 58.1 P2-1 — coarse enum, not literal plan
      pillars: finalState.pillars.map((p) => ({
        pillar: p.pillar,
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
