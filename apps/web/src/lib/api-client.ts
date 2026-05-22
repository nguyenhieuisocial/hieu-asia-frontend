/**
 * Browser-side API client for hieu.asia web app.
 *
 * Talks to Next.js proxy routes (`/api/reading/[id]`, `/api/mentor`)
 * which forward to Supabase Edge Functions / api.hieu.asia with
 * server-only credentials.
 */

import type {
  MentorMessage,
  MentorResponse,
  Reading,
} from '@hieu-asia/types';

export type {
  MentorMessage,
  MentorResponse,
  MentorRole,
  Reading,
  ReadingInsights,
  ReadingInputs,
  ReadingReportMarkdown,
  ReadingState,
} from '@hieu-asia/types';

/** Envelope returned by `/api/reading/[id]` proxy. */
export interface GetReadingResponse {
  ok: boolean;
  session?: Reading;
  error?: string;
}

export class ApiClientError extends Error {
  constructor(
    public status: number,
    public payload: unknown,
    message?: string,
  ) {
    super(message ?? `API error ${status}`);
    this.name = 'ApiClientError';
  }
}

async function readJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiClientError(
      res.status,
      text,
      `Invalid JSON from ${res.url} (status ${res.status})`,
    );
  }
}

/**
 * GET /api/reading/{id} — server proxies to Supabase reading-get.
 *
 * Returns the raw {@link Reading} row, or `null` when the proxy reports
 * `ok: true` without a session (e.g. row not yet inserted).
 */
export async function getReading(id: string): Promise<Reading | null> {
  if (!id) throw new ApiClientError(400, null, 'reading id required');

  const res = await fetch(`/api/reading/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: { accept: 'application/json' },
    cache: 'no-store',
  });

  const body = await readJson<GetReadingResponse>(res);

  if (!res.ok || body.ok === false) {
    throw new ApiClientError(
      res.status,
      body,
      body?.error ?? `Failed to fetch reading ${id}`,
    );
  }
  return body.session ?? null;
}

/**
 * Convenience helper for callers that still want the legacy envelope shape.
 * Prefer {@link getReading} for new code.
 */
export async function getReadingEnvelope(
  id: string,
): Promise<GetReadingResponse> {
  const session = await getReading(id);
  return { ok: true, session: session ?? undefined };
}

/** POST /api/mentor — server proxies to api.hieu.asia/ai/role/mentor. */
export async function chatMentor(
  messages: MentorMessage[],
  sessionId?: string,
): Promise<MentorResponse> {
  if (!messages?.length) {
    throw new ApiClientError(400, null, 'messages required');
  }

  const res = await fetch('/api/mentor', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({ messages, session_id: sessionId }),
    cache: 'no-store',
  });

  const body = await readJson<MentorResponse>(res);

  if (!res.ok || body.ok === false) {
    throw new ApiClientError(
      res.status,
      body,
      body?.error ?? 'Mentor call failed',
    );
  }
  return body;
}

// NOTE: legacy `ReadingReport` (rich object) was removed. The backend now
// returns `Reading.report.markdown`, a single Markdown blob with H2 sections.
// Consumers should parse `markdown` into sections themselves.

// ---------- Mentor streaming (SSE) ----------

export type MentorStreamEvent =
  | { type: 'chunk'; text: string }
  | { type: 'done'; vendor?: string; model?: string }
  | { type: 'error'; status?: number; error: string };

/**
 * POST /api/mentor/stream — opens an SSE connection and yields events
 * (`chunk`, `done`, `error`) as they arrive. Consumer typically does:
 *
 *   for await (const ev of chatMentorStream(messages, sessionId, signal)) {
 *     if (ev.type === 'chunk') appendToken(ev.text);
 *     else if (ev.type === 'done') ...
 *     else if (ev.type === 'error') ...
 *   }
 *
 * `EventSource` only supports GET, so this implementation reads the
 * response body manually and parses `event:` / `data:` lines.
 *
 * `modelVariant` — Wave 42.2 PostHog `mentor_model_variant` flag value.
 * Forwarded to the Next.js proxy (which forwards to the worker as
 * `X-Model-Variant`). The worker honours the variant against an allowlist
 * and falls back to the default mentor route on `control` / invalid input.
 */
export async function* chatMentorStream(
  messages: MentorMessage[],
  sessionId?: string,
  signal?: AbortSignal,
  modelVariant?: string,
): AsyncGenerator<MentorStreamEvent, void, void> {
  if (!messages?.length) {
    throw new ApiClientError(400, null, 'messages required');
  }

  const res = await fetch('/api/mentor/stream', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'text/event-stream',
    },
    body: JSON.stringify({
      messages,
      session_id: sessionId,
      model_variant: modelVariant,
    }),
    cache: 'no-store',
    signal,
  });

  if (!res.ok || !res.body) {
    yield {
      type: 'error',
      status: res.status,
      error: `stream_open_failed_${res.status}`,
    };
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE frames are separated by a blank line (\n\n).
      let sep: number;
      while ((sep = buffer.indexOf('\n\n')) !== -1) {
        const raw = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        const ev = parseSseFrame(raw);
        if (ev) yield ev;
      }
    }
    if (buffer.trim()) {
      const ev = parseSseFrame(buffer);
      if (ev) yield ev;
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {
      /* ignore */
    }
  }
}

function parseSseFrame(frame: string): MentorStreamEvent | null {
  let event = 'message';
  const dataLines: string[] = [];
  for (const line of frame.split('\n')) {
    if (line.startsWith('event:')) {
      event = line.slice(6).trim();
    } else if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trim());
    }
  }
  if (!dataLines.length) return null;
  const raw = dataLines.join('\n');
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (event === 'chunk' && typeof parsed === 'string') {
      return { type: 'chunk', text: parsed };
    }
    if (event === 'done' && parsed && typeof parsed === 'object') {
      const p = parsed as { vendor?: string; model?: string };
      return { type: 'done', vendor: p.vendor, model: p.model };
    }
    if (event === 'error' && parsed && typeof parsed === 'object') {
      const p = parsed as { status?: number; error?: string };
      return {
        type: 'error',
        status: p.status,
        error: p.error ?? 'unknown_error',
      };
    }
  } catch {
    // Non-JSON payload — surface raw text on chunk frames only.
    if (event === 'chunk') return { type: 'chunk', text: raw };
  }
  return null;
}
