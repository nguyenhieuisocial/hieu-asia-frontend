/**
 * POST /api/admin/affiliates/payouts/build-batch → worker (admin+).
 * Body { rail, min_amount_vnd? } forwarded verbatim. Payout routes move money —
 * admin+ in-handler backstop (fail closed).
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, {
    path: 'admin/affiliates/payouts/build-batch',
    adminEmail: auth.session.email,
  });
}
