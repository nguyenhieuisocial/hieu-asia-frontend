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
import { assertCostGuard } from '@/lib/reasoning/cost-guard';
import { getSessionFromRequest } from '@/lib/reasoning/session-auth';
import { assertFreeQuota } from '@/lib/reasoning/free-quota';

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

/**
 * imageUrl must be HTTPS with hostname strictly under .supabase.co or .hieu.asia
 * (defense against arbitrary remote URL — could be used to scan internal hosts
 * via SSRF).
 *
 * /ultrareview Phase 2.4+2.5 caught the previous version (2026-05-23): substring
 * `.includes('supabase.co')` accepts `https://evil.com/?x=supabase.co` because
 * "supabase.co" appears anywhere in the string. Replaced with WHATWG URL parse +
 * `hostname.endsWith('.supabase.co')` proper host check. Leading dot prevents
 * "evilsupabase.co" suffix match.
 */
function isAllowedImageUrl(s: unknown): s is string {
  if (typeof s !== 'string' || s.length > 500 || !s.startsWith('https://')) return false;
  let u: URL;
  try {
    u = new URL(s);
  } catch {
    return false;
  }
  // Note: explicit `u.protocol !== 'https:'` check removed per /ultrareview
  // Wave 58.1 F4 as redundant — `startsWith('https://')` above already
  // guarantees the scheme (URL parser canonicalises). Hostname check below
  // is the real gate. Do NOT re-add the protocol check — it would just be
  // dead code that confuses next reviewer.
  const h = u.hostname.toLowerCase();
  return (
    h === 'supabase.co' ||
    h.endsWith('.supabase.co') ||
    h === 'hieu.asia' ||
    h.endsWith('.hieu.asia')
  );
}

function validateInput(i: unknown): i is PalmInput {
  if (!i || typeof i !== 'object') return false;
  const inp = i as PalmInput;
  return (
    typeof inp.displayName === 'string' &&
    inp.displayName.length > 0 &&
    inp.displayName.length <= 100 &&
    ['M', 'F', 'NB'].includes(inp.gender) &&
    ['left', 'right'].includes(inp.hand) &&
    isAllowedImageUrl(inp.imageUrl)
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
        signin_url: '/signin?next=/palm/upload',
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
      {
        ok: false,
        error: 'invalid_input',
        hint: 'imageUrl must be HTTPS Supabase Storage or hieu.asia origin',
      },
      { status: 400 },
    );
  }
  const input = body.input;

  // Wave 58 free quota + Phase 2.6 cost guard.
  const quota = await assertFreeQuota(session.userId);
  if (!quota.ok) return quota.response;
  const guard = await assertCostGuard({ graph: 'palm', userId: session.userId, headers: req.headers });
  if (!guard.ok) return guard.response;

  const supabase = getSupabase();
  const { data: runRow, error: runErr } = await supabase
    .from('agent_runs')
    .insert({
      user_id: session.userId,
      graph_name: 'palm',
      current_node: 'parse_input',
      state: { displayName: input.displayName, hand: input.hand },
      status: 'running',
    })
    .select('run_id')
    .single();
  if (runErr || !runRow) {
    console.error('[reasoning/palm] run_create_failed', runErr?.message);
    return NextResponse.json(
      { ok: false, error: 'run_create_failed' },
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
      upsell_variant: quota.upsellVariant, // Wave 58.1 P2-1 — coarse enum, not literal plan
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
      { ok: false, error: 'graph_failed', runId },
      { status: 502 },
    );
  }
}
