/**
 * GET /api/admin/integrations/webhooks — webhook delivery log proxy (viewer+).
 * Until the worker route lands the UI uses a 404 → "chưa wire" fallback.
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/integrations/webhooks', adminEmail: auth.session.email });
}
