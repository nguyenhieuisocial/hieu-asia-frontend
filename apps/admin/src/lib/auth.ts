/**
 * Admin auth — minimal V1 implementation.
 *
 * Approach (V1): cookie-based session with hardcoded admin email allow-list.
 *   - User enters email at /login → email is checked against `ADMIN_EMAILS` env.
 *   - On match, set httpOnly cookie `hieu_admin_session=<email>`.
 *   - middleware.ts checks cookie on every route.
 *
 * V2 plan: swap to Auth.js EmailProvider w/ magic link (resend or postmark)
 *   or GitHub OAuth restricted by email allow-list. Keep `isAdminEmail` as gate.
 */

export const ADMIN_SESSION_COOKIE = 'hieu_admin_session';

/** Read allow-list from env. Defaults to a dev sentinel so local works. */
export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? 'admin@hieu.asia';
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}
