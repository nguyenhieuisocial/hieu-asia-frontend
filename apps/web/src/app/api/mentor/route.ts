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
import type {
  MentorMessage,
  Reading,
} from '@hieu-asia/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL =
  process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const HIEU_API_SERVICE_TOKEN = process.env.HIEU_API_SERVICE_TOKEN;
const SUPABASE_URL =
  process.env.SUPABASE_URL ?? 'https://fvftbqairezsybasqsek.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const DEFAULT_SYSTEM_PROMPT =
  'Bạn là mentor cá nhân. Trả lời ấm áp, đồng cảm, ngắn gọn (2-3 đoạn), tiếng Việt. Luôn nhắc rằng user quyết định, AI chỉ gợi mở.';

interface MentorRequestBody {
  session_id?: string;
  messages?: MentorMessage[];
  /** Wave 42.2 — PostHog `mentor_model_variant` flag value forwarded from
   *  the browser. Validated against an allowlist worker-side. */
  model_variant?: string;
}

interface SupabaseReadingEnvelope {
  ok?: boolean;
  session?: Reading;
  error?: string;
}

async function fetchReading(sessionId: string): Promise<Reading | null> {
  if (!SUPABASE_ANON_KEY) return null;
  try {
    const url = `${SUPABASE_URL}/functions/v1/reading-get?id=${encodeURIComponent(sessionId)}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
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

function buildSystemPrompt(session: Reading): string {
  const reportMd = session.report?.markdown?.trim();
  const chart = session.tuvi_chart;

  const lines: string[] = [
    'Bạn là mentor cá nhân của user này. Sử dụng báo cáo dưới đây làm "Bộ não cố định" — không nói trái với nội dung báo cáo, tham chiếu cụ thể vào các phần đã viết.',
  ];

  if (reportMd) {
    lines.push('', '--- BÁO CÁO CỦA USER ---', reportMd);
  }

  if (chart) {
    lines.push(
      '',
      '--- BÁT TỰ ---',
      `Năm: ${chart.year}, Tháng: ${chart.month}, Ngày: ${chart.day}, Giờ: ${chart.hour}`,
    );
  }

  lines.push(
    '',
    '--- CONTEXT ---',
    'User đang trò chuyện trên giao diện chat. Trả lời ấm áp, đồng cảm, ngắn gọn (2-3 đoạn), tiếng Việt. Luôn nhắc rằng user quyết định, AI chỉ gợi mở.',
  );

  return lines.join('\n');
}

export async function POST(req: Request) {
  if (!HIEU_API_SERVICE_TOKEN) {
    return NextResponse.json(
      {
        ok: false,
        error: 'server_misconfigured: HIEU_API_SERVICE_TOKEN missing',
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
  let systemPrompt = DEFAULT_SYSTEM_PROMPT;
  let userId: string | undefined;
  if (sessionId) {
    const session = await fetchReading(sessionId);
    if (session) {
      systemPrompt = buildSystemPrompt(session);
      userId = session.user_id;
    }
  }

  // Prepend system message if caller didn't already include one.
  const hasSystem = incomingMessages.some((m) => m.role === 'system');
  const finalMessages: MentorMessage[] = hasSystem
    ? incomingMessages
    : [{ role: 'system', content: systemPrompt }, ...incomingMessages];

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
