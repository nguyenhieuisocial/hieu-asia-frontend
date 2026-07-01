/**
 * Admin proxies for broadcast:
 *  - POST /api/admin/affiliates/email-blast → create a broadcast (admin+)
 *  - GET  /api/admin/affiliates/email-blast → list past broadcasts (viewer+,
 *    worker path /admin/affiliates/broadcasts)
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export async function POST(req: Request) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/affiliates/email-blast', adminEmail: auth.session.email });
}

export async function GET(req: Request) {
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/affiliates/broadcasts', adminEmail: auth.session.email });
}
