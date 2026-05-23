/**
 * Wave 58 — Server-side Supabase JWT verification for reasoning routes.
 *
 * Pattern: client passes its Supabase access_token as `Authorization: Bearer`.
 * We verify the JWT signature + extract user_id via `supabase.auth.getUser(token)`
 * which round-trips to GoTrue.
 *
 * Why not @supabase/ssr cookies migration:
 *   - Existing auth client (`lib/auth-client.ts`) stores JWT in localStorage
 *     with `storageKey: 'hieu.auth.session'` (Wave 13 design)
 *   - Migrating to cookie-based session = breaks every existing logged-in user
 *     until they re-login (worse UX than just sending a header)
 *   - Wave 44.2 already deferred full cookie migration to "Wave 52+" — Wave 58
 *     is not the right place to bundle it
 *
 * Trust model:
 *   - JWT signature verified against Supabase JWKS (Wave D Phase 47 work)
 *   - Anyone with a valid JWT IS that user — no impersonation
 *   - service_role token NEVER accepted from clients (different audience claim)
 *
 * Failure modes:
 *   - Missing/malformed header → returns null (caller handles as anon → 401)
 *   - Expired/invalid JWT → returns null
 *   - GoTrue unreachable → throws (caller can decide: fail closed = 503, or
 *     fail open for a degraded experience). Our reasoning routes fail closed.
 */

import { createClient } from '@supabase/supabase-js';

export interface AuthedSession {
  userId: string;
  email: string | null;
}

let _anonClient: ReturnType<typeof createClient> | null = null;
function getAnonClient() {
  if (_anonClient) return _anonClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Need the publishable/anon key here — service role would bypass auth checks
  // and `getUser(token)` would happily return the service-role "user" if we
  // accidentally passed the service-role JWT.
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('session-auth: NEXT_PUBLIC_SUPABASE_URL + ANON/PUBLISHABLE key required');
  _anonClient = createClient(url, key, { auth: { persistSession: false } });
  return _anonClient;
}

function extractBearer(headers: Headers): string | null {
  const auth = headers.get('authorization') ?? headers.get('Authorization');
  if (!auth) return null;
  const m = auth.match(/^Bearer\s+(\S+)$/i);
  if (!m) return null;
  const token = m[1]!;
  // Sanity: Supabase JWTs are ~200-400 bytes. 8KB ceiling guards against
  // a hostile Authorization header that's actually a payload smuggle attempt.
  if (token.length < 20 || token.length > 8000) return null;
  return token;
}

/**
 * Verify the Bearer JWT from the request and return the user.
 *
 * Returns:
 *   - `AuthedSession` when token is valid
 *   - `null` when no token, malformed, expired, or invalid signature
 *
 * THROWS only when Supabase GoTrue is unreachable (caller decides fail-open
 * vs fail-closed).
 */
export async function getSessionFromRequest(req: Request): Promise<AuthedSession | null> {
  const token = extractBearer(req.headers);
  if (!token) return null;
  const sb = getAnonClient();
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data?.user) return null;
  const id = data.user.id;
  // GoTrue user IDs are always UUIDs; sanity-check anyway since downstream
  // RPC expects UUID and PostgREST text-vs-uuid mismatch would 400.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return null;
  }
  return { userId: id, email: data.user.email ?? null };
}
