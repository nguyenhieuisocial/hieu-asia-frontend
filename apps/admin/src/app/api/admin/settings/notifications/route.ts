/**
 * Notification preferences proxy.
 *  GET   → current prefs (viewer+)
 *  PATCH → update (admin+); the gateway writes audit_log on PATCH.
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/settings/notifications', adminEmail: auth.session.email });
}

export async function PATCH(req: Request) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/settings/notifications', adminEmail: auth.session.email });
}
