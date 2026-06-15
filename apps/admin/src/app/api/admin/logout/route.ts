import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/lib/auth';
import { requireAdminSession } from '@/lib/auth-server';

// Edge runtime for 0ms cold-start parity with login route.
export const runtime = 'edge';

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
