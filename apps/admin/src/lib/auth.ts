/**
 * Admin auth — KV-backed dynamic user list (V2).
 *
 * Approach:
 *   - User enters email+password at /login → POST /api/admin/login.
 *   - Login route fetches GET https://api.hieu.asia/admin/users (X-Admin-Token)
 *     and matches email + sha256(password) against the KV-stored list.
 *   - On success: set httpOnly cookie `hieu_admin_session=<email>:<role>`.
 *   - middleware.ts checks cookie presence on every route.
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

/** Encode (email, role) into the cookie value. */
export function encodeSession(email: string, role: AdminRole): string {
  return `${email}:${role}`;
}

/** Parse cookie value. Returns null if malformed. */
export function decodeSession(cookieValue: string | undefined | null): { email: string; role: AdminRole } | null {
  if (!cookieValue) return null;
  const idx = cookieValue.lastIndexOf(':');
  if (idx === -1) {
    // Legacy cookie (email only) — treat as viewer for safety
    return { email: cookieValue, role: 'viewer' };
  }
  const email = cookieValue.slice(0, idx);
  const role = cookieValue.slice(idx + 1) as AdminRole;
  if (!['owner', 'admin', 'viewer'].includes(role)) return null;
  return { email, role };
}
