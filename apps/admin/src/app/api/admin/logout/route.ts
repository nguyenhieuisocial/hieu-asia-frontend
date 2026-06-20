import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/lib/auth';
import { requireAdminSession } from '@/lib/auth-server';

// nodejs runtime: logout calls requireAdminSession() which is server-only
// (uses next/headers cookies(), not edge-safe). Logout isn't a hot path, so
// the cold-start cost is negligible.
export const runtime = 'nodejs';

export async function POST() {
  // Require a valid admin session before clearing it — otherwise a cross-site
  // POST could force-logout a logged-in admin (CSRF). A genuine logout always
  // carries the session cookie, so the happy path is unaffected.
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, '', { maxAge: 0, path: '/' });
  return res;
}
