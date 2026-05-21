/**
 * Admin auth — KV-backed dynamic user list with HMAC-signed sessions.
 *
 * Approach:
 *   - User enters email+password at /login → POST /api/admin/login.
 *   - Login route fetches GET https://api.hieu.asia/admin/users (X-Admin-Token)
 *     and matches email + sha256(password) against the KV-stored list.
 *   - On success: set httpOnly cookie `hieu_admin_session=<email>:<role>.<hmac>`.
 *     HMAC-SHA256 with ADMIN_COOKIE_SECRET prevents cookie forgery.
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
 * Encode (email, role) into a SIGNED cookie value.
 *
 * Format: `<email>:<role>.<hmac_hex>`
 *
 * If `ADMIN_COOKIE_SECRET` is not set, falls back to unsigned (legacy) format.
 * This fallback is INSECURE — only used during the rollout grace period.
 * Once the secret is deployed everywhere, remove the fallback.
 */
export async function encodeSession(email: string, role: AdminRole): Promise<string> {
  const payload = `${email}:${role}`;
  const secret = getCookieSecret();
  if (!secret) {
    // Legacy unsigned format — log a warning so ops sees this in Vercel logs.
    console.warn('[auth] ADMIN_COOKIE_SECRET not set; issuing UNSIGNED session (insecure)');
    return payload;
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
 *
 * IMPORTANT: This function is async because HMAC verification needs Web Crypto.
 * All callers must `await`.
 */
export async function verifySession(
  cookieValue: string | undefined | null,
): Promise<{ email: string; role: AdminRole } | null> {
  if (!cookieValue) return null;

  const secret = getCookieSecret();

  // Split payload from signature on the LAST dot (emails don't contain `.role`
  // structure issues; role is in {owner,admin,viewer}, never has a dot).
  const sigSplit = cookieValue.lastIndexOf(SIG_SEPARATOR);

  // If we have a secret configured, require a signature. Otherwise, fall back
  // to legacy unsigned format. This is the migration grace period.
  if (secret) {
    if (sigSplit === -1) {
      // No signature in cookie but server requires one → reject.
      return null;
    }
    const payload = cookieValue.slice(0, sigSplit);
    const providedSig = cookieValue.slice(sigSplit + 1);
    if (!/^[0-9a-f]{64}$/.test(providedSig)) return null;
    const expectedSig = await hmacSha256Hex(secret, payload);
    if (!constantTimeEqual(providedSig, expectedSig)) return null;
    return parseAuthPayload(payload);
  }

  // Legacy fallback — no secret, accept unsigned cookies.
  return parseAuthPayload(
    sigSplit === -1 ? cookieValue : cookieValue.slice(0, sigSplit),
  );
}

function parseAuthPayload(
  payload: string,
): { email: string; role: AdminRole } | null {
  const idx = payload.lastIndexOf(':');
  if (idx === -1) {
    // Legacy cookie (email only) — treat as viewer for safety
    return { email: payload, role: 'viewer' };
  }
  const email = payload.slice(0, idx);
  const role = payload.slice(idx + 1) as AdminRole;
  if (!['owner', 'admin', 'viewer'].includes(role)) return null;
  return { email, role };
}

/**
 * @deprecated Use `verifySession` instead. Kept temporarily for callers being
 * migrated; this version skips HMAC verification (INSECURE).
 */
export function decodeSession(
  cookieValue: string | undefined | null,
): { email: string; role: AdminRole } | null {
  if (!cookieValue) return null;
  const sigSplit = cookieValue.lastIndexOf(SIG_SEPARATOR);
  const payload = sigSplit === -1 ? cookieValue : cookieValue.slice(0, sigSplit);
  return parseAuthPayload(payload);
}
