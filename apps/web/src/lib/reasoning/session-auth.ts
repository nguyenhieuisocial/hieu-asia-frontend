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
  /**
   * Prior anonymous user id this account claimed at login, IF any.
   *
   * SECURITY: read from the GoTrue-signed `user_metadata` (set via the
   * authenticated `supabase.auth.updateUser` call at /auth/callback), NOT from
   * raw client input — so it is server-trusted exactly like `userId`. The value
   * round-trips through `getUser(token)` (GoTrue) so a forged Authorization
   * header can't inject an arbitrary anon id. Shape-validated to `anon_<uuid>`;
   * anything else is dropped to null. Used so a logged-in user can see readings
   * created under their prior anon id.
   */
  linkedAnonId: string | null;
}

// `anon_<uuid v4>` — must mirror getOrCreateAnonUserId() in @hieu-asia/supabase.
const ANON_ID_RE =
  /^anon_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function sanitizeLinkedAnonId(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  return ANON_ID_RE.test(raw) ? raw : null;
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
  // user_metadata is part of the GoTrue-signed user record returned by
  // getUser(token); reading the linked anon id from here (not the request body)
  // is what keeps the reading-claim path free of an IDOR.
  const meta = (data.user.user_metadata ?? {}) as Record<string, unknown>;
  const linkedAnonId = sanitizeLinkedAnonId(meta.linked_anon_user_id);
  return { userId: id, email: data.user.email ?? null, linkedAnonId };
}

/**
 * Wave 65 IDOR fix — resolve the owner id(s) a caller may read readings for.
 *
 * `reading-get` scopes the row to these ids, so a leaked `session_id` (the value
 * in a shared URL) is no longer enough: the caller must BE the owner (verified
 * JWT) or hold the owner's anon id (in their own localStorage, NOT in the URL).
 *
 *   - authed → verified `userId` + GoTrue-signed `linkedAnonId`
 *   - anon   → the caller's own `x-anon-id` header, shape-guarded to `anon_<uuid>`
 *             so it can never be a victim's bare auth uid
 *
 * Returns `[]` when the caller proves no identity → the proxy should 401.
 * Fails CLOSED: if JWT verification throws (GoTrue down), authed ids are simply
 * omitted — the caller sees "not found", never another user's data.
 */
export async function resolveReadingOwnerIds(req: Request): Promise<string[]> {
  const ids = new Set<string>();
  try {
    const session = await getSessionFromRequest(req);
    if (session) {
      ids.add(session.userId);
      if (session.linkedAnonId) ids.add(session.linkedAnonId);
    }
  } catch {
    // GoTrue unreachable — omit authed ids (fail closed: no access, no leak).
  }
  const anon = req.headers.get('x-anon-id')?.trim();
  if (anon && ANON_ID_RE.test(anon)) ids.add(anon);
  return [...ids];
}
