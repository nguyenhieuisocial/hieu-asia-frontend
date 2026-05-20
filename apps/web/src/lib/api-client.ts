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
