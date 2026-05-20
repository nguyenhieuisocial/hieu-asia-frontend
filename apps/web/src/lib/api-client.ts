/**
 * Browser-side API client for hieu.asia web app.
 *
 * Talks to Next.js proxy routes (`/api/reading/[id]`, `/api/mentor`)
 * which forward to Supabase Edge Functions / api.hieu.asia with
 * server-only credentials.
 */

export type ReadingState =
  | 'vision_pending'
  | 'vision_done'
  | 'logic_pending'
  | 'logic_done'
  | 'psychology_pending'
  | 'psychology_done'
  | 'alignment_pending'
  | 'alignment_done'
  | 'report_pending'
  | 'report_ready'
  | `error_at_${string}`
  | string;

export interface ReadingInsights {
  vision?: string;
  logic?: string;
  psychology?: string;
  alignment?: string;
}

export interface ReadingReport {
  core_personality: string;
  strengths: string;
  blind_spots: string;
  career_insights: string;
  life_path: string;
  relationship_guide: string;
  action_plan: string;
  caution_flags: string;
  summary: string;
}

export interface ReadingSession {
  id: string;
  user_id: string;
  state: ReadingState;
  inputs: Record<string, unknown>;
  insights?: ReadingInsights;
  report?: ReadingReport;
}

export interface GetReadingResponse {
  ok: boolean;
  session?: ReadingSession;
  error?: string;
}

export type MentorRole = 'system' | 'user' | 'assistant';

export interface MentorMessage {
  role: MentorRole;
  content: string;
}

export interface ChatMentorResponse {
  ok: boolean;
  vendor?: string;
  model?: string;
  response?: string;
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

/** GET /api/reading/{id} — server proxies to Supabase reading-get. */
export async function getReading(id: string): Promise<GetReadingResponse> {
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
  return body;
}

/** POST /api/mentor — server proxies to api.hieu.asia/ai/role/mentor. */
export async function chatMentor(
  messages: MentorMessage[],
  sessionId?: string,
): Promise<ChatMentorResponse> {
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

  const body = await readJson<ChatMentorResponse>(res);

  if (!res.ok || body.ok === false) {
    throw new ApiClientError(
      res.status,
      body,
      body?.error ?? 'Mentor call failed',
    );
  }
  return body;
}
