/**
 * Operator-editable alert thresholds proxy.
 *  GET   → { thresholds } (viewer+)
 *  PATCH → update (owner+ — loosening a threshold silences alerts) + audit_log
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/settings/alert-thresholds', adminEmail: auth.session.email });
}

export async function PATCH(req: Request) {
  const auth = await requireAdminSession('owner');
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/settings/alert-thresholds', adminEmail: auth.session.email });
}
