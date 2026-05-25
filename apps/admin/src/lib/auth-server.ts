/**
 * Wave 60.28 — Defense-in-depth session guard for App Router route handlers
 * that use `sbServer` (service-role JWT — bypasses RLS).
 *
 * Why: the admin middleware HMAC-verifies the cookie globally, so reaching
 * a handler today implies validity. BUT — a future middleware regression
 * (matcher drift, accidental excludePaths, header rename) would expose
 * service-role queries to anyone with any cookie. Defense-in-depth makes
 * the guard local + explicit per handler so the regression is bounded.
 *
 * Server-only (`cookies()` from next/headers requires server context).
 * Keep separate from `./auth.ts` which is edge-safe (used by middleware).
 *
 * Usage:
 *   export async function GET() {
 *     const auth = await requireAdminSession();
 *     if ('error' in auth) return auth.error;
 *     // ...use auth.session.email / auth.session.role
 *   }
 *
 * Optionally require a minimum role:
 *   const auth = await requireAdminSession('admin'); // owner+admin pass, viewer 403
 *
 * Per vault 94 prevention contract (Wave 60.28): every NEW route handler
 * that imports `sbServer` MUST call `requireAdminSession()` as the first
 * statement. Sweep query in vault to catch regressions.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE, verifySession, type AdminRole } from './auth';

export interface AdminSession {
  email: string;
  role: AdminRole;
}

const ROLE_RANK: Record<AdminRole, number> = { viewer: 0, admin: 1, owner: 2 };

export type RequireAdminSessionResult =
  | { session: AdminSession }
  | { error: NextResponse };

export async function requireAdminSession(
  minRole: AdminRole = 'viewer',
): Promise<RequireAdminSessionResult> {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    return {
      error: NextResponse.json(
        { ok: false, error: 'unauthenticated' },
        { status: 401 },
      ),
    };
  }

  if (ROLE_RANK[session.role] < ROLE_RANK[minRole]) {
    return {
      error: NextResponse.json(
        { ok: false, error: `forbidden: requires ${minRole} or higher` },
        { status: 403 },
      ),
    };
  }

  return { session };
}
