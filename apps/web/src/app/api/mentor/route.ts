/**
 * Server-side proxy to api.hieu.asia mentor endpoint.
 *
 * Hides HIEU_API_SERVICE_TOKEN from the browser. Browser POSTs
 * `/api/mentor` with `{ messages, session_id? }`; this handler forwards
 * to `https://api.hieu.asia/ai/role/mentor` with the service token header.
 *
 * When `session_id` is provided, the handler also fetches the corresponding
 * reading from Supabase (`reading-get`) and prepends a system message that
 * embeds the user's report + bát tự context, so the mentor responds with
 * "bộ não cố định" tied to that reading.
 */

import { NextResponse } from 'next/server';
import { checkBotId } from 'botid/server';
import { isKillswitchActive } from '@/lib/edge-config';
import { resolveReadingOwnerIds } from '@/lib/reasoning/session-auth';
import type {
  MentorMessage,
  Reading,
} from '@hieu-asia/types';
import {
  DEFAULT_MENTOR_SYSTEM_PROMPT,
  buildMentorSystemPrompt,
} from '@/lib/mentor-system-prompt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL =
  process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const HIEU_API_SERVICE_TOKEN = process.env.HIEU_API_SERVICE_TOKEN;
const SUPABASE_URL =
  process.env.SUPABASE_URL ?? 'https://fvftbqairezsybasqsek.supabase.co';
// Wave 65: reading-get is owner-gated — call it with the service token + the
// caller's verified owner ids (mirrors /api/reading/[id]).
const READING_PROXY_TOKEN = process.env.READING_PROXY_TOKEN;

interface MentorRequestBody {
  session_id?: string;
  messages?: MentorMessage[];
  /** Wave 42.2 — PostHog `mentor_model_variant` flag value forwarded from
   *  the browser. Validated against an allowlist worker-side. */
  model_variant?: string;
  /** Personality summary from localStorage (MBTI / Big Five / DISC / Enneagram).
   *  Optional; capped at 500 chars server-side. */
  personalitySummary?: string;
}

interface SupabaseReadingEnvelope {
  ok?: boolean;
  session?: Reading;
  error?: string;
}

async function fetchReading(sessionId: string, ownerIds: string[]): Promise<Reading | null> {
  if (!READING_PROXY_TOKEN || ownerIds.length === 0) return null;
  try {
    const qs = new URLSearchParams({ id: sessionId, owner_ids: ownerIds.join(',') });
    const url = `${SUPABASE_URL}/functions/v1/reading-get?${qs.toString()}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'x-service-token': READING_PROXY_TOKEN },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as SupabaseReadingEnvelope;
    if (data.ok === false) return null;
    return data.session ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  // Bot guard (Wave 64 audit P0): mentor is anon-capable (the reading→mentor
  // funnel isn't login-gated), so we can't hard-require a session without
  // breaking it — but we MUST block automated abuse of the paid LLM. BotID
  // classifies scripted clients; pairs with the protect-list entry in
  // instrumentation-client.ts.
  const bot = await checkBotId();
  if (bot.isBot) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  // Nút tắt khẩn (Edge Config `killswitch_mentor`) — xem lib/edge-config.ts.
  const kill = await isKillswitchActive('mentor');
  if (kill.active) {
    return NextResponse.json(
      { ok: false, error: 'mentor_disabled', reason: kill.reason },
      { status: 503, headers: { 'Retry-After': '300' } },
    );
  }

  if (!HIEU_API_SERVICE_TOKEN) {
    return NextResponse.json(
      {
        ok: false,
        error: 'service_unavailable',
      },
      { status: 500 },
    );
  }

  let body: MentorRequestBody;
  try {
    body = (await req.json()) as MentorRequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'invalid_json' },
      { status: 400 },
    );
  }

  const incomingMessages: MentorMessage[] = Array.isArray(body.messages)
    ? body.messages
    : [];
  const sessionId =
    typeof body.session_id === 'string' && body.session_id.length > 0
      ? body.session_id
      : undefined;

  // Build system prompt — session-aware when possible, fallback default.
  let systemPrompt = DEFAULT_MENTOR_SYSTEM_PROMPT;
  let userId: string | undefined;
  if (sessionId) {
    const ownerIds = await resolveReadingOwnerIds(req);
    const session = await fetchReading(sessionId, ownerIds);
    if (session) {
      systemPrompt = buildMentorSystemPrompt(session);
      userId = session.user_id;
    }
  }

  // Append personality profile when the client sends one.
  const ps =
    typeof body.personalitySummary === 'string'
      ? body.personalitySummary.slice(0, 500).trim()
      : '';
  if (ps) {
    systemPrompt +=
      '\n\n--- CHÂN DUNG TÍNH CÁCH (Big Five / MBTI / DISC / Enneagram) ---\n' +
      ps +
      '\nCá nhân hoá lời khuyên theo chân dung này và nêu điểm mù phù hợp; KHÔNG dán nhãn cứng, KHÔNG phán số mệnh.';
  }

  // Always use the server-built system prompt and STRIP any client-supplied
  // system messages (Wave 64 audit P1): otherwise a caller could include their
  // own role:"system" entry to override the guardrails ("AI chỉ gợi mở").
  const userMessages = incomingMessages.filter((m) => m.role !== 'system');
  const finalMessages: MentorMessage[] = [
    { role: 'system', content: systemPrompt },
    ...userMessages,
  ];

  const forwardBody = {
    ...body,
    messages: finalMessages,
  };

  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'X-Service-Token': HIEU_API_SERVICE_TOKEN,
  };
  if (sessionId) headers['X-Session-Id'] = sessionId;
  if (userId) headers['X-User-Id'] = userId;
  // Wave 42.2 — forward mentor_model_variant PostHog assignment.
  if (typeof body.model_variant === 'string' && body.model_variant) {
    headers['X-Model-Variant'] = body.model_variant;
  }

  try {
    const res = await fetch(`${HIEU_API_URL}/ai/role/mentor`, {
      method: 'POST',
      headers,
      body: JSON.stringify(forwardBody),
      cache: 'no-store',
    });

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        'content-type':
          res.headers.get('content-type') ?? 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: 'upstream_fetch_failed',
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }
}
