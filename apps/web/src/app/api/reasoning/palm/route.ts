/**
 * Wave 56 Phase 2.4 — Palm Reading route.
 *
 * POST body: { input: PalmInput }
 * Response: { ok, runId, synthesis, classification, elapsedMs }
 *
 * Note: not wired to UX until Wave 57.3 ships /palm/upload page. Engine
 * preparedness only.
 */

import { NextResponse, after, type NextRequest } from 'next/server';
import { checkBotId } from 'botid/server';
import { createClient } from '@supabase/supabase-js';
import { buildPalmGraph, type PalmInput } from '@/lib/reasoning/palm-graph';
import { startTrace } from '@/lib/reasoning/observability';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120; // vision + 2 LLM steps ~30-60s p99

interface Req {
  input?: Partial<PalmInput>;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE env required');
  return createClient(url, key, { auth: { persistSession: false } });
}

function validateInput(i: unknown): i is PalmInput {
  if (!i || typeof i !== 'object') return false;
  const inp = i as PalmInput;
  // imageUrl must be HTTPS Supabase Storage URL (defense against arbitrary
  // remote URL — could be used to scan internal hosts via SSRF)
  const urlOk =
    typeof inp.imageUrl === 'string' &&
    inp.imageUrl.startsWith('https://') &&
    (inp.imageUrl.includes('supabase.co') || inp.imageUrl.includes('hieu.asia')) &&
    inp.imageUrl.length <= 500;
  return (
    typeof inp.displayName === 'string' &&
    inp.displayName.length > 0 &&
    inp.displayName.length <= 100 &&
    ['M', 'F', 'NB'].includes(inp.gender) &&
    ['left', 'right'].includes(inp.hand) &&
    urlOk
  );
}

export async function POST(req: NextRequest) {
  const bot = await checkBotId();
  if (bot.isBot) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });

  let body: Req;
  try {
    body = (await req.json()) as Req;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  if (!validateInput(body.input)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_input',
        hint: 'imageUrl must be HTTPS Supabase Storage or hieu.asia origin',
      },
      { status: 400 },
    );
  }
  const input = body.input;

  const supabase = getSupabase();
  const { data: runRow, error: runErr } = await supabase
    .from('agent_runs')
    .insert({
      user_id: null,
      graph_name: 'palm',
      current_node: 'parse_input',
      state: { displayName: input.displayName, hand: input.hand },
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
    name: 'reasoning.palm',
    input: { runId, displayName: input.displayName, hand: input.hand },
    tags: ['phase-2', 'palm', 'vision'],
  });

  const startedAt = Date.now();
  try {
    const graph = buildPalmGraph();
    const finalState = await graph.invoke(
      { input, runId, classification: '', analysis: '', synthesis: '' },
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
          hand: input.hand,
          synthesis: finalState.synthesis,
        },
      })
      .eq('run_id', runId);

    trace.end({ runId, elapsedMs });
    after(() => trace.flush());

    return NextResponse.json({
      ok: true,
      runId,
      synthesis: finalState.synthesis,
      classification: finalState.classification,
      elapsedMs,
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
