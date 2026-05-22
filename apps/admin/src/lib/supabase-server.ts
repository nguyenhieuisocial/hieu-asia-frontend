/**
 * Server-side Supabase REST helper for admin proxy routes.
 *
 * Used by /api/admin/affiliates/{promoters,commissions,payouts,batches,activity}
 * proxy routes to query `hieu_asia.*` tables with service-role JWT (bypasses RLS).
 *
 * Env required:
 *   NEXT_PUBLIC_SUPABASE_URL          — Supabase project URL
 *   HIEU_SUPABASE_SERVICE_ROLE_KEY    — service-role JWT (do NOT expose to browser)
 *
 * If either is missing → returns { ok:false, status:503 } so the admin page can
 * show a "Supabase not configured" notice instead of crashing.
 */

export interface SbServerResult<T> {
  ok: boolean;
  status: number;
  body: T | null;
  error?: string;
}

const SCHEMA = 'hieu_asia';

function envUrl(): string | null {
  // Try server-only var first, fall back to public for parity with worker.
  return (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    null
  );
}

function envKey(): string | null {
  return (
    process.env.HIEU_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    null
  );
}

export async function sbServer<T = unknown>(
  path: string,
  init: Omit<RequestInit, 'headers'> & { headers?: Record<string, string> } = {},
): Promise<SbServerResult<T>> {
  const url = envUrl();
  const key = envKey();
  if (!url || !key) {
    return { ok: false, status: 503, body: null, error: 'Supabase not configured (set HIEU_SUPABASE_SERVICE_ROLE_KEY)' };
  }
  const fullUrl = `${url.replace(/\/+$/, '')}/rest/v1/${path}`;
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    apikey: key,
    authorization: `Bearer ${key}`,
    'Accept-Profile': SCHEMA,
    'Content-Profile': SCHEMA,
    ...(init.headers ?? {}),
  };
  try {
    const r = await fetch(fullUrl, { ...init, headers, cache: 'no-store' });
    const text = await r.text();
    if (!r.ok) {
      return { ok: false, status: r.status, body: null, error: text || `HTTP ${r.status}` };
    }
    return { ok: true, status: r.status, body: text ? (JSON.parse(text) as T) : null };
  } catch (err) {
    return { ok: false, status: 502, body: null, error: (err as Error).message };
  }
}
