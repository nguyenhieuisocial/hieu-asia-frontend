/**
 * Audit-log retention proxy.
 *  GET   → { retention_days } (viewer+)
 *  PATCH → update window (owner+, destructive) + audit_log
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/settings/retention', adminEmail: auth.session.email });
}

export async function PATCH(req: Request) {
  const auth = await requireAdminSession('owner');
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/settings/retention', adminEmail: auth.session.email });
}
