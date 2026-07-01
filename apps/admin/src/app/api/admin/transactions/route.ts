/**
 * Admin proxy to Worker `GET /payment/transactions` (forwards query, viewer+).
 * Browser calls /api/admin/transactions?limit=...&user_id=...
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'payment/transactions', adminEmail: auth.session.email });
}
