/**
 * Admin auth — KV-backed dynamic user list with HMAC-signed sessions.
 *
 * Approach:
 *   - User enters email+password at /login → POST /api/admin/login.
 *   - Login route fetches GET https://api.hieu.asia/admin/users (X-Admin-Token)
 *     and matches email + sha256(password) against the KV-stored list.
 *   - On success: set httpOnly cookie `hieu_admin_session=<email>:<role>:<issuedAt>.<hmac>`.
 *     HMAC-SHA256 with ADMIN_COOKIE_SECRET prevents cookie forgery; the signed
 *     `issuedAt` (epoch ms) bounds the session lifetime (see SESSION_TTL_MS) so a
 *     captured cookie cannot be replayed forever.
 *   - middleware.ts + admin-proxy + layout call `verifySession()` which checks
 *     both shape AND signature. Forged or modified cookies return null.
 *
 * Security note:
 *   - Sub-agent F (2026-05-21 audit) verified the previous unsigned-cookie
 *     scheme allowed full admin bypass: `curl -H "Cookie: hieu_admin_session=
 *     attacker@evil.com:owner" /api/admin-proxy/admin/customers` returned
 *     HTTP 200 with real PII. The HMAC layer below closes that hole.
 *
 * Break-glass: env `ADMIN_PASSWORD` (legacy) still works for `admin@hieu.asia`
 *   if KV fetch fails — opt-in via env presence only.
 */

export const ADMIN_SESSION_COOKIE = 'hieu_admin_session';

export type AdminRole = 'owner' | 'admin' | 'viewer';

export interface AdminUserSafe {
  id: string;
  email: string;
  role: AdminRole;
  created_at: string;
}

interface AdminUserFull extends AdminUserSafe {
  password_hash: string;
}

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';

/** SHA-256 hex digest using Web Crypto (works in Node 18+ and Edge runtime). */
export async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Sanitize a post-login `?next=` redirect target to a SAME-ORIGIN path.
 *
 * Open-redirect fix: a bare `next.startsWith('/')` check is NOT enough — the
 * browser normalizes protocol-relative `//evil.com` and backslash `/\evil.com`
 * into a cross-origin URL, so those would redirect the freshly-authenticated
 * admin off-site (phishing / token-handoff). Accept only a real same-origin
 * absolute path; anything else falls back to `/`.
 */
export function safeNextPath(next: string | null | undefined): string {
  if (!next) return '/';
  // The WHATWG URL parser STRIPS ASCII tab/newline/CR from input before parsing,
  // so `/\t/evil.com` (or \n, \r) would smuggle a protocol-relative `//evil.com`
  // past a naive prefix check and redirect off-site. Strip those first, then
  // reject any other control char defensively, then validate the result.
  const cleaned = next.replace(/[\t\n\r]/g, '');
  for (let i = 0; i < cleaned.length; i++) {
    const code = cleaned.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) return "/"; // reject control chars (URL parser strips some)
  }
  if (!cleaned.startsWith('/')) return '/';
  if (cleaned.startsWith('//') || cleaned.startsWith('/\\')) return '/';
  return cleaned;
}

/** Constant-time string compare for equal-length strings. */
export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Fetch admin users from the Worker (returns full records including password_hash).
 * Server-side only — must include X-Admin-Token.
 */
export async function fetchAdminUsersFull(): Promise<AdminUserFull[]> {
  const token = process.env.HIEU_API_ADMIN_TOKEN;
  if (!token) throw new Error('HIEU_API_ADMIN_TOKEN not configured');
  const r = await fetch(`${GATEWAY}/admin/users?with_hash=1`, {
    headers: { 'X-Admin-Token': token },
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`gateway HTTP ${r.status}`);
  const data = (await r.json()) as { ok: boolean; users?: AdminUserFull[]; error?: string };
  if (!data.ok || !data.users) throw new Error(data.error ?? 'gateway returned !ok');
  return data.users;
}

// ============================================================================
// HMAC-signed session cookie
// ============================================================================

const SIG_SEPARATOR = '.';

/**
 * Max admin session lifetime, in milliseconds.
 *
 * MUST match the login cookie `maxAge`
 * (apps/admin/src/app/api/admin/login/route.ts → `60 * 60 * 24 * 7` seconds),
 * so the signed `issuedAt` and the browser cookie expire together. After this
 * window `verifySession()` rejects the cookie even if the signature is valid —
 * a session captured from a proxy/OS/CDN log or a shared machine stops working.
 */
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function getCookieSecret(): string | null {
  return process.env.ADMIN_COOKIE_SECRET ?? null;
}

/**
 * Sign a short-lived realtime WebSocket ticket.
 *
 * Used so the MASTER admin token NEVER travels in the WS URL query string
 * (which Cloudflare/proxies log and browsers keep in history). Both this app
 * and the AdminRealtime DO already hold the master admin token; we use it as
 * the HMAC KEY (never transmitted) and send only the resulting ticket.
 *
 * Message format MUST stay byte-for-byte identical to the DO verifier:
 *   `${email}:${expiresAt}`
 */
export async function signRealtimeTicket(
  secret: string,
  email: string,
  expiresAt: number,
): Promise<string> {
  return hmacSha256Hex(secret, `${email}:${expiresAt}`);
}

/**
 * Encode (email, role, issuedAt) into a SIGNED cookie value.
 *
 * Format: `<email>:<role>:<issuedAt>.<hmac_hex>`
 *
 * `issuedAt` (epoch ms, defaults to now) is part of the signed payload, so it
 * cannot be tampered with. `verifySession()` rejects cookies older than
 * SESSION_TTL_MS — this bounds how long a leaked cookie stays usable and rotates
 * the token on every login.
 *
 * Fail-closed: if `ADMIN_COOKIE_SECRET` is not set this THROWS rather than
 * minting an unsigned (forgeable) cookie. The secret must be present for login
 * to work — there is no insecure fallback.
 */
export async function encodeSession(
  email: string,
  role: AdminRole,
  issuedAt: number = Date.now(),
): Promise<string> {
  const payload = `${email}:${role}:${issuedAt}`;
  const secret = getCookieSecret();
  if (!secret) {
    // Fail-closed (Wave 64 security audit P0): NEVER issue an unsigned session.
    // An unsigned cookie is trivially forgeable (`attacker@evil.com:owner`) → full
    // admin/owner bypass. Refuse to mint a session rather than mint an insecure one.
    throw new Error(
      '[auth] ADMIN_COOKIE_SECRET not set — refusing to issue an unsigned session. ' +
        'Set ADMIN_COOKIE_SECRET on the admin app (Vercel env) before login can work.',
    );
  }
  const sig = await hmacSha256Hex(secret, payload);
  return `${payload}${SIG_SEPARATOR}${sig}`;
}

/**
 * Parse + VERIFY cookie value. Returns null if:
 *   - cookie absent
 *   - cookie malformed
 *   - role not in allow-list
 *   - HMAC mismatch (forgery attempt)
 *   - session older than SESSION_TTL_MS (expired / replayed leaked cookie)
 *
 * `now` (epoch ms) is injectable for deterministic tests; callers omit it.
 *
 * IMPORTANT: This function is async because HMAC verification needs Web Crypto.
 * All callers must `await`.
 */
export async function verifySession(
  cookieValue: string | undefined | null,
  now: number = Date.now(),
): Promise<{ email: string; role: AdminRole } | null> {
  if (!cookieValue) return null;

  const secret = getCookieSecret();

  // Split payload from signature on the LAST dot (emails don't contain `.role`
  // structure issues; role is in {owner,admin,viewer}, never has a dot).
  const sigSplit = cookieValue.lastIndexOf(SIG_SEPARATOR);

  // Fail-closed (Wave 64 security audit P0): without a signing secret we CANNOT
  // trust any cookie — an unsigned value is trivially forgeable
  // (`attacker@evil.com:owner`). Reject everything rather than fall back to the
  // old unsigned grace-period path that allowed full admin/owner bypass.
  if (!secret) {
    console.error(
      '[auth] ADMIN_COOKIE_SECRET not set — rejecting ALL admin sessions (fail-closed)',
    );
    return null;
  }

  if (sigSplit === -1) return null; // signature required but absent → reject
  const payload = cookieValue.slice(0, sigSplit);
  const providedSig = cookieValue.slice(sigSplit + 1);
  if (!/^[0-9a-f]{64}$/.test(providedSig)) return null;
  const expectedSig = await hmacSha256Hex(secret, payload);
  if (!constantTimeEqual(providedSig, expectedSig)) return null;

  const parsed = parseAuthPayload(payload);
  if (!parsed) return null;

  // Expiry (2026-07-12 audit): reject sessions older than SESSION_TTL_MS. Because
  // `issuedAt` lives inside the signed payload it cannot be forged, so a stolen
  // cookie is only replayable until this window elapses. Signature is already
  // verified above, so a valid-but-stale cookie lands here and is rejected.
  if (now - parsed.issuedAt > SESSION_TTL_MS) return null;

  return { email: parsed.email, role: parsed.role };
}

/**
 * Parse the signed payload `<email>:<role>:<issuedAt>` (right-to-left, since the
 * role is always one of the fixed tokens and `issuedAt` is digits-only).
 *
 * Returns null on any shape mismatch, including OLD `<email>:<role>` cookies
 * (no timestamp) — even though their signature is still valid, dropping the
 * timestamp field fails the numeric `issuedAt` check, so they are rejected and
 * the operator simply logs in again (acceptable: only the founder holds a
 * session pre-launch).
 */
function parseAuthPayload(
  payload: string,
): { email: string; role: AdminRole; issuedAt: number } | null {
  const tsColon = payload.lastIndexOf(':');
  if (tsColon === -1) return null;
  const issuedAtStr = payload.slice(tsColon + 1);
  if (!/^\d+$/.test(issuedAtStr)) return null; // missing/non-numeric ts → reject (incl. legacy)
  const issuedAt = Number(issuedAtStr);
  if (!Number.isSafeInteger(issuedAt)) return null;

  const rest = payload.slice(0, tsColon); // `<email>:<role>`
  const roleColon = rest.lastIndexOf(':');
  if (roleColon === -1) return null;
  const email = rest.slice(0, roleColon);
  const role = rest.slice(roleColon + 1) as AdminRole;
  if (!email) return null;
  if (!['owner', 'admin', 'viewer'].includes(role)) return null;
  return { email, role, issuedAt };
}

/**
 * @deprecated Removed (Wave 64 security audit P0). This skipped HMAC verification
 * and accepted unsigned/forged cookies, so it is now neutered to always return
 * `null` (fail-closed). Any auth decision MUST use the async `verifySession()`,
 * which enforces the signature. Kept as an export only so stray imports fail
 * safely (reject) instead of failing to build.
 */
export function decodeSession(
  _cookieValue?: string | undefined | null,
): { email: string; role: AdminRole } | null {
  return null;
}
