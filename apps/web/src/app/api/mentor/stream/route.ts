/**
 * Server-Sent Events proxy for the mentor endpoint.
 *
 * Mirrors `/api/mentor`'s auth + system-prompt injection, but instead of
 * returning the upstream JSON verbatim it splits the assistant response into
 * short chunks and streams them to the browser as SSE events:
 *
 *   event: chunk    data: "..."           (one per text chunk)
 *   event: done     data: "{ ... }"        (final envelope, includes vendor/model)
 *   event: error    data: "{ ... }"        (on upstream failure)
 *
 * MVP: artificial chunking from a complete upstream response. Worker-native
 * streaming is deferred — when the upstream learns to stream, this handler
 * is the place to switch over.
 */

import type { NextRequest } from 'next/server';
import { checkBotId } from 'botid/server';
import { resolveReadingOwnerIds } from '@/lib/reasoning/session-auth';
import type {
  MentorMessage,
  MentorResponse,
  Reading,
} from '@hieu-asia/types';
import {
  DEFAULT_MENTOR_SYSTEM_PROMPT,
  buildMentorSystemPrompt,
} from '@/lib/mentor-system-prompt';
import { safeErrorDetail } from '@/lib/safe-error';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL =
  process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const HIEU_API_SERVICE_TOKEN = process.env.HIEU_API_SERVICE_TOKEN;
const SUPABASE_URL =
  process.env.SUPABASE_URL ?? 'https://fvftbqairezsybasqsek.supabase.co';
// Wave 65: reading-get is owner-gated — service token + verified owner ids.
const READING_PROXY_TOKEN = process.env.READING_PROXY_TOKEN;

const CHUNK_DELAY_MS = 50;
const CHUNK_TARGET_CHARS = 60;

interface MentorRequestBody {
  session_id?: string;
  messages?: MentorMessage[];
  /** Wave 42.2 — PostHog `mentor_model_variant` flag value forwarded from
   *  the browser. The worker validates this against an allowlist; unknown /
   *  missing values fall through to the default route, so the client can't
   *  request arbitrary models. */
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

/**
 * Split text into chunks of roughly CHUNK_TARGET_CHARS, preferring sentence
 * boundaries so the output reads naturally as it streams in.
 */
function chunkResponse(text: string): string[] {
  if (!text) return [];
  // Split on sentence boundaries first.
  const sentences = text.split(/(?<=[.!?…])\s+/);
  const chunks: string[] = [];
  let buf = '';
  for (const s of sentences) {
    if (!buf) {
      buf = s;
    } else if ((buf + ' ' + s).length <= CHUNK_TARGET_CHARS) {
      buf = buf + ' ' + s;
    } else {
      chunks.push(buf);
      buf = s;
    }
    // Long sentence — flush in word-sized pieces.
    while (buf.length > CHUNK_TARGET_CHARS * 2) {
      const cut = buf.lastIndexOf(' ', CHUNK_TARGET_CHARS);
      const idx = cut > 20 ? cut : CHUNK_TARGET_CHARS;
      chunks.push(buf.slice(0, idx));
      buf = buf.slice(idx).trimStart();
    }
  }
  if (buf) chunks.push(buf);
  return chunks;
}

function sseLine(event: string, data: string): string {
  return `event: ${event}\ndata: ${data}\n\n`;
}

export async function POST(req: NextRequest) {
  // Bot guard (Wave 64 audit P0) — same rationale as /api/mentor: anon-capable
  // funnel, so block automated abuse of the paid LLM via BotID rather than a
  // hard session requirement.
  const bot = await checkBotId();
  if (bot.isBot) {
    return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), {
      status: 403,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (!HIEU_API_SERVICE_TOKEN) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'service_unavailable',
      }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  let body: MentorRequestBody;
  try {
    body = (await req.json()) as MentorRequestBody;
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'invalid_json' }),
      { status: 400, headers: { 'content-type': 'application/json' } },
    );
  }

  const incomingMessages: MentorMessage[] = Array.isArray(body.messages)
    ? body.messages
    : [];
  const sessionId =
    typeof body.session_id === 'string' && body.session_id.length > 0
      ? body.session_id
      : undefined;

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
  // system messages (Wave 64 audit P1) — prevents guardrail override.
  const userMessages = incomingMessages.filter((m) => m.role !== 'system');
  const finalMessages: MentorMessage[] = [
    { role: 'system', content: systemPrompt },
    ...userMessages,
  ];

  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'X-Service-Token': HIEU_API_SERVICE_TOKEN,
  };
  if (sessionId) headers['X-Session-Id'] = sessionId;
  if (userId) headers['X-User-Id'] = userId;
  // Wave 42.2 — forward the PostHog mentor_model_variant assignment to the
  // worker. Worker enforces an allowlist (see MENTOR_VARIANT_ALLOWLIST in
  // api-gateway/src/index.ts). Header is preferred over body so the worker
  // can ignore variant without touching the JSON payload.
  if (typeof body.model_variant === 'string' && body.model_variant) {
    headers['X-Model-Variant'] = body.model_variant;
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const write = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(sseLine(event, JSON.stringify(data))),
        );
      };

      try {
        const res = await fetch(`${HIEU_API_URL}/ai/role/mentor`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ ...body, messages: finalMessages }),
          cache: 'no-store',
        });

        const text = await res.text();
        let parsed: MentorResponse | null = null;
        try {
          parsed = JSON.parse(text) as MentorResponse;
        } catch {
          parsed = null;
        }

        if (!res.ok || !parsed || parsed.ok === false) {
          write('error', {
            ok: false,
            status: res.status,
            error:
              parsed?.error ?? `upstream_error_${res.status}`,
          });
          controller.close();
          return;
        }

        const answer = (parsed.response ?? '').trim();
        if (!answer) {
          write('error', {
            ok: false,
            error: 'empty_response',
          });
          controller.close();
          return;
        }

        const chunks = chunkResponse(answer);
        for (let i = 0; i < chunks.length; i++) {
          write('chunk', chunks[i] + (i < chunks.length - 1 ? ' ' : ''));
          if (i < chunks.length - 1) {
            await new Promise((r) => setTimeout(r, CHUNK_DELAY_MS));
          }
        }

        write('done', {
          ok: true,
          vendor: parsed.vendor,
          model: parsed.model,
        });
        controller.close();
      } catch (err) {
        write('error', {
          ok: false,
          error: 'upstream_fetch_failed',
          detail: safeErrorDetail('mentor/stream', err),
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-store, no-transform',
      connection: 'keep-alive',
      'x-accel-buffering': 'no',
    },
  });
}
