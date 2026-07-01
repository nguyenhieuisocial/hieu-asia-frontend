/**
 * Admin proxy: GET /api/admin/affiliates → Worker /admin/affiliates (viewer+).
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export async function GET(req: Request) {
  // defense-in-depth verifySession backfill (PII list → viewer+).
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/affiliates', adminEmail: auth.session.email });
}
