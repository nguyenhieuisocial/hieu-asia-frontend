/**
 * Wave 61.02 — Browser client for Mentor conversation persistence.
 *
 * Talks to Next.js proxy routes under `/api/mentor/conversations/*`. Each call
 * needs the user's Supabase access_token in `Authorization: Bearer ...`. The
 * proxy forwards it to the Worker which verifies the JWT and forces user_id
 * from the token (no IDOR vector).
 *
 * All helpers return `null` / `[]` on failure instead of throwing — chat flow
 * should never crash because persistence hiccupped (we fall back to localStorage
 * via `lib/mentor-history.ts`).
 */

import { getSupabaseAuth } from './auth-client';

export interface MentorConversation {
  id: string;
  user_id: string;
  title: string | null;
  summary: string | null;
  reading_session_id: string | null;
  intent: string | null;
  message_count: number;
  last_message_at: string;
  created_at: string;
}

export type MentorConversationRole = 'user' | 'mentor' | 'system';

export interface MentorConversationMessage {
  id: string;
  conversation_id: string;
  role: MentorConversationRole;
  content: string;
  tokens_in: number | null;
  tokens_out: number | null;
  cost_usd: number | null;
  model: string | null;
  created_at: string;
}

export interface ConversationEnvelope {
  conversation: MentorConversation;
  messages: MentorConversationMessage[];
}

async function getAccessToken(): Promise<string | null> {
  const sb = getSupabaseAuth();
  if (!sb) return null;
  try {
    const { data } = await sb.auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    // getSession() có thể reject ở storage bị chặn (iOS/private). Trả null để
    // caller (conversations + mentor pages) coi như chưa đăng nhập, thay vì để
    // lỗi nổi thành unhandled-rejection.
    return null;
  }
}

async function authedFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response | null> {
  const token = await getAccessToken();
  if (!token) return null;
  const headers = new Headers(init.headers ?? {});
  headers.set('authorization', `Bearer ${token}`);
  if (init.method && init.method !== 'GET' && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }
  try {
    return await fetch(input, { ...init, headers, cache: 'no-store' });
  } catch {
    return null;
  }
}

export interface CreateConversationInput {
  title?: string;
  reading_session_id?: string;
  intent?: string;
}

export async function createMentorConversation(
  input: CreateConversationInput = {},
): Promise<MentorConversation | null> {
  const res = await authedFetch('/api/mentor/conversations', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  if (!res || !res.ok) return null;
  try {
    const data = (await res.json()) as { ok?: boolean; conversation?: MentorConversation };
    if (data.ok === false || !data.conversation) return null;
    return data.conversation;
  } catch {
    return null;
  }
}

export async function listMentorConversations(
  limit = 50,
): Promise<MentorConversation[]> {
  const res = await authedFetch(`/api/mentor/conversations?limit=${encodeURIComponent(String(limit))}`, {
    method: 'GET',
  });
  if (!res || !res.ok) return [];
  try {
    const data = (await res.json()) as { ok?: boolean; conversations?: MentorConversation[] };
    if (data.ok === false || !Array.isArray(data.conversations)) return [];
    return data.conversations;
  } catch {
    return [];
  }
}

export async function getMentorConversation(
  conversationId: string,
): Promise<ConversationEnvelope | null> {
  if (!conversationId) return null;
  const res = await authedFetch(
    `/api/mentor/conversations/${encodeURIComponent(conversationId)}`,
    { method: 'GET' },
  );
  if (!res || !res.ok) return null;
  try {
    const data = (await res.json()) as {
      ok?: boolean;
      conversation?: MentorConversation;
      messages?: MentorConversationMessage[];
    };
    if (data.ok === false || !data.conversation) return null;
    return {
      conversation: data.conversation,
      messages: Array.isArray(data.messages) ? data.messages : [],
    };
  } catch {
    return null;
  }
}

export interface AppendMessageInput {
  role: MentorConversationRole;
  content: string;
  tokens_in?: number;
  tokens_out?: number;
  cost_usd?: number;
  model?: string;
}

export interface AppendMessageResult {
  message: MentorConversationMessage;
  conversation: MentorConversation;
}

export async function appendMentorMessage(
  conversationId: string,
  input: AppendMessageInput,
): Promise<AppendMessageResult | null> {
  if (!conversationId) return null;
  const res = await authedFetch(
    `/api/mentor/conversations/${encodeURIComponent(conversationId)}/messages`,
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  );
  if (!res || !res.ok) return null;
  try {
    const data = (await res.json()) as {
      ok?: boolean;
      message?: MentorConversationMessage;
      conversation?: MentorConversation;
    };
    if (data.ok === false || !data.message || !data.conversation) return null;
    return { message: data.message, conversation: data.conversation };
  } catch {
    return null;
  }
}

/**
 * Best-effort one-shot helper: ensures a conversation row exists for the
 * current chat session and returns its id. If creation fails (auth missing,
 * Supabase down), returns null and callers fall back to localStorage-only mode.
 */
export async function ensureMentorConversation(
  existingId: string | null | undefined,
  init: CreateConversationInput = {},
): Promise<string | null> {
  if (existingId) return existingId;
  const created = await createMentorConversation(init);
  return created?.id ?? null;
}
