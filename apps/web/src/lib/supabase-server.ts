/**
 * Server-side Supabase REST helper for /partner/* portal API routes.
 *
 * Wave 44 — used by /api/partner/{me,subtree,commissions,payouts} to query
 * `hieu_asia.*` tables on behalf of the logged-in affiliate. Passes the
 * user's JWT through so RLS policies enforce subtree visibility
 * (affiliate_self_or_descendants_read, affiliate_own_commissions_read,
 * affiliate_own_payouts_read added in migration 0017).
 *
 * Env required:
 *   NEXT_PUBLIC_SUPABASE_URL              — Supabase project URL
 *   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  — anon key (apikey header)
 *
 * NOTE: this helper intentionally does NOT use the service-role key. The
 * caller passes `userJwt` (the Supabase access token from the browser
 * session, forwarded via the Authorization header) so RLS scopes the
 * response to the requesting affiliate's subtree.
 */

export interface SbUserResult<T> {
  ok: boolean;
  status: number;
  body: T | null;
  error?: string;
}

const SCHEMA = 'hieu_asia';

function envUrl(): string | null {
  return (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    null
  );
}

function envAnonKey(): string | null {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    null
  );
}

/**
 * Run a PostgREST query against `hieu_asia.*` using the affiliate's own JWT.
 * RLS policies (migration 0017) ensure the affiliate only sees their own
 * subtree / commissions / payouts.
 */
export async function sbUser<T = unknown>(
  path: string,
  userJwt: string,
  init: Omit<RequestInit, 'headers'> & { headers?: Record<string, string> } = {},
): Promise<SbUserResult<T>> {
  const url = envUrl();
  const key = envAnonKey();
  if (!url || !key) {
    return {
      ok: false,
      status: 503,
      body: null,
      error: 'Supabase not configured (set NEXT_PUBLIC_SUPABASE_URL + key)',
    };
  }
  const fullUrl = `${url.replace(/\/+$/, '')}/rest/v1/${path}`;
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    apikey: key,
    authorization: `Bearer ${userJwt}`,
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

/**
 * Extract a Bearer token from the inbound request headers. Returns null if
 * missing or malformed.
 */
export function extractBearer(headers: Headers): string | null {
  const auth = headers.get('authorization');
  if (!auth) return null;
  const m = auth.match(/^Bearer\s+(.+)$/i);
  const token = m?.[1];
  return token ? token.trim() : null;
}
