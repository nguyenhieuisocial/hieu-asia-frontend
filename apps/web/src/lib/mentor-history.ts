/**
 * Persistent mentor chat history keyed by reading session id.
 *
 * Stored in `localStorage` under `hieu.mentor.history.<sessionId>`, capped at
 * 50 messages per session to keep well below the ~5MB browser quota.
 *
 * SSR-safe: all helpers no-op when `window` is undefined.
 */

const KEY_PREFIX = 'hieu.mentor.history.';
const MAX_MESSAGES = 50;

export type StoredRole = 'user' | 'mentor';

export interface StoredMessage {
  id: string;
  role: StoredRole;
  content: string;
  ts: string; // ISO timestamp
  feedback?: 'up' | 'down' | null;
  pinned?: boolean;
}

function isStoredMessage(v: unknown): v is StoredMessage {
  if (!v || typeof v !== 'object') return false;
  const m = v as Record<string, unknown>;
  return (
    typeof m.id === 'string' &&
    (m.role === 'user' || m.role === 'mentor') &&
    typeof m.content === 'string' &&
    typeof m.ts === 'string'
  );
}

export function loadHistory(sessionId: string): StoredMessage[] {
  if (typeof window === 'undefined' || !sessionId) return [];
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + sessionId);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredMessage);
  } catch {
    return [];
  }
}

export function saveHistory(
  sessionId: string,
  messages: StoredMessage[],
): void {
  if (typeof window === 'undefined' || !sessionId) return;
  try {
    const capped =
      messages.length > MAX_MESSAGES
        ? messages.slice(messages.length - MAX_MESSAGES)
        : messages;
    window.localStorage.setItem(
      KEY_PREFIX + sessionId,
      JSON.stringify(capped),
    );
  } catch {
    /* ignore quota / serialization errors */
  }
}

export function appendMessage(
  sessionId: string,
  msg: Omit<StoredMessage, 'ts'> & { ts?: string },
): StoredMessage[] {
  const history = loadHistory(sessionId);
  const next: StoredMessage = {
    ...msg,
    ts: msg.ts ?? new Date().toISOString(),
  };
  const merged = [...history, next];
  saveHistory(sessionId, merged);
  return merged.length > MAX_MESSAGES
    ? merged.slice(merged.length - MAX_MESSAGES)
    : merged;
}

export function clearHistory(sessionId: string): void {
  if (typeof window === 'undefined' || !sessionId) return;
  try {
    window.localStorage.removeItem(KEY_PREFIX + sessionId);
  } catch {
    /* ignore */
  }
}

export const MENTOR_HISTORY_MAX = MAX_MESSAGES;
