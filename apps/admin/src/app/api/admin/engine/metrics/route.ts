/**
 * Admin proxy to Worker `GET /admin/engine/metrics?hours=24` (Analytics Engine
 * — real per-request cost / latency / errors). Admin-session gated, viewer+.
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/engine/metrics', adminEmail: auth.session.email });
}
