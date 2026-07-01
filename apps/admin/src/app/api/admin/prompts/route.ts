/**
 * Admin proxy to Worker `GET /admin/prompts` (list of 7 role prompts, viewer+).
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // defense-in-depth verifySession backfill (prompt list read → viewer+).
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/prompts', adminEmail: auth.session.email });
}
