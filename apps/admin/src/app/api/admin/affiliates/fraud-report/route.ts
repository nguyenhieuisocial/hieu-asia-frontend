/**
 * Admin proxy: GET /api/admin/affiliates/fraud-report → Worker
 * /admin/affiliates/fraud-report (fraud signals read → viewer+).
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export async function GET(req: Request) {
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/affiliates/fraud-report', adminEmail: auth.session.email });
}
