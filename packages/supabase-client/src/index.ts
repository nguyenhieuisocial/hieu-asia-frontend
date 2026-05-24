/**
 * @hieu-asia/supabase — frontend client for Supabase REST + Edge Functions.
 *
 * Anon key is publishable (safe in browser). Writes that touch the `hieu_asia`
 * schema go through Edge Functions because the schema isn't exposed via PostgREST.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL_KEY = 'NEXT_PUBLIC_SUPABASE_URL';
const ANON_KEY = 'NEXT_PUBLIC_SUPABASE_ANON_KEY';
const FN_KEY = 'NEXT_PUBLIC_EDGE_FN_URL';

function readEnv(name: string): string {
  // Explicit literal references are mandatory for Next.js compile-time static inlining in client-side bundles.
  if (name === 'NEXT_PUBLIC_SUPABASE_URL') {
    return (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  }
  if (name === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
    return (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
  }
  if (name === 'NEXT_PUBLIC_EDGE_FN_URL') {
    return (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_EDGE_FN_URL || '').trim();
  }

  const v =
    (typeof process !== 'undefined' && process.env?.[name]) ||
    undefined;
  return (v ?? '').trim();
}

export interface SupabaseConfig {
  url?: string;
  anonKey?: string;
  edgeFnUrl?: string;
}

let _client: SupabaseClient | null = null;

export function getSupabase(config: SupabaseConfig = {}): SupabaseClient {
  if (_client) return _client;
  const url = config.url || readEnv(URL_KEY);
  const anon = config.anonKey || readEnv(ANON_KEY);
  if (!url || !anon) {
    throw new Error(
      `[@hieu-asia/supabase] missing ${URL_KEY} or ${ANON_KEY} env vars`,
    );
  }
  _client = createClient(url, anon, {
    auth: { persistSession: false },
  });
  return _client;
}

export function getEdgeFnBase(config: SupabaseConfig = {}): string {
  const explicit = config.edgeFnUrl || readEnv(FN_KEY);
  if (explicit) return explicit.replace(/\/$/, '');
  const url = config.url || readEnv(URL_KEY);
  if (!url) {
    throw new Error(`[@hieu-asia/supabase] missing ${URL_KEY} or ${FN_KEY}`);
  }
  return `${url.replace(/\/$/, '')}/functions/v1`;
}

// ---------- Anonymous user id helper ----------

const USER_ID_KEY = 'hieu.user_id';

export function getOrCreateAnonUserId(): string {
  if (typeof window === 'undefined') return '';
  let id = window.localStorage.getItem(USER_ID_KEY);
  if (!id) {
    let uuid: string;
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      uuid = crypto.randomUUID();
    } else {
      // Fallback pseudo-UUID v4 generator for non-secure HTTP contexts
      uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
    id = `anon_${uuid}`;
    window.localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

// ---------- Edge function callers ----------

async function callEdgeFn<TBody, TResp>(
  path: string,
  body: TBody | null,
  init: { method?: 'GET' | 'POST'; query?: Record<string, string> } = {},
): Promise<TResp> {
  const base = getEdgeFnBase();
  const anon = readEnv(ANON_KEY);
  const method = init.method ?? 'POST';
  let url = `${base}/${path.replace(/^\//, '')}`;
  if (init.query) {
    const q = new URLSearchParams(init.query);
    url += `?${q.toString()}`;
  }
  const headers: Record<string, string> = {
    'apikey': anon,
    'Authorization': `Bearer ${anon}`,
  };
  if (body !== null && method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, {
    method,
    headers,
    body: body !== null && method !== 'GET' ? JSON.stringify(body) : undefined,
  });
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    const detail =
      (data && typeof data === 'object' && 'error' in data && (data as { error: unknown }).error) ||
      `HTTP ${res.status}`;
    throw new Error(`[edge-fn ${path}] ${String(detail)}`);
  }
  return data as TResp;
}

// ---------- Typed API surface ----------

export interface BirthData {
  birth_date: string; // YYYY-MM-DD
  birth_time?: string | null;
  birth_place: string;
  gender?: string | null;
  display_name?: string | null;
  calendar?: string | null;
  timezone?: string | null;
  primary_concern?: string | null;
  [extra: string]: unknown;
}

export interface CreateReadingResult {
  session_id: string;
  task_id: string;
  status: 'pending';
}

export function createReading(
  userId: string,
  birthData: BirthData,
): Promise<CreateReadingResult> {
  return callEdgeFn<{ user_id: string; birth_data: BirthData }, CreateReadingResult>(
    'reading-create',
    { user_id: userId, birth_data: birthData },
  );
}

export interface AuditEntry {
  user_id?: string;
  action: string;
  resource_id?: string | null;
  audit_metadata?: Record<string, unknown>;
}

export function logAudit(entry: AuditEntry): Promise<{ ok: boolean; id?: number }> {
  return callEdgeFn<AuditEntry, { ok: boolean; id?: number }>('audit-log', entry);
}

export interface ReadingSessionRow {
  session_id: string;
  state_json: {
    user_id?: string;
    birth_data?: BirthData;
    status?: string;
    task_id?: string;
    created_at?: string;
    [extra: string]: unknown;
  };
  updated_at: string;
}

export async function listReadings(userId: string): Promise<ReadingSessionRow[]> {
  const res = await callEdgeFn<null, { sessions: ReadingSessionRow[] }>(
    'reading-list',
    null,
    { method: 'GET', query: { user_id: userId } },
  );
  return res.sessions;
}
