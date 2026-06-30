/**
 * Admin proxy to Worker `GET /admin/customers`.
 * Forwards search/plan/limit/cursor query params with X-Admin-Token.
 *
 * Gateway fetch (timeout + non-JSON guard + status normalization) is handled by
 * the shared `proxyToGateway` helper; auth/role gate stays local (viewer+).
 */

import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // Wave 60.62.T1.4 — defense-in-depth verifySession backfill (customer PII list → viewer+).
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/customers', adminEmail: auth.session.email });
}
