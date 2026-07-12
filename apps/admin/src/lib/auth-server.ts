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
import { resolveLiveRole, decideEffectiveRole } from './admin-user-store';

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
  opts: { fresh?: boolean; read?: boolean } = {},
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

  // Instant revocation (2026-07-12 audit, step 3): re-derive the role from the live
  // user store, never trusting the (possibly stale) signed cookie role for a
  // privileged decision. Privileged checks (a mutation/capability route — elevated
  // role by default, or explicit `fresh`) skip the cache and FAIL CLOSED when the
  // authority can't be confirmed. A `read: true` GET stays on the cached, fail-open
  // path (a read can't escalate, so a slow /admin/users must not 503 an otherwise
  // healthy PostHog/Ahrefs/Supabase read). `decideEffectiveRole` centralizes that.
  const privileged = opts.read ? false : (opts.fresh ?? minRole !== 'viewer');
  const live = await resolveLiveRole(session.email, Date.now(), privileged);
  const decision = decideEffectiveRole(live, session.role, privileged);
  if ('deny' in decision) {
    return decision.deny === 'revoked'
      ? { error: NextResponse.json({ ok: false, error: 'session_revoked' }, { status: 401 }) }
      : { error: NextResponse.json({ ok: false, error: 'role_unverifiable' }, { status: 503 }) };
  }

  if (ROLE_RANK[decision.role] < ROLE_RANK[minRole]) {
    return {
      error: NextResponse.json(
        { ok: false, error: `forbidden: requires ${minRole} or higher` },
        { status: 403 },
      ),
    };
  }

  return { session: { email: session.email, role: decision.role } };
}
