/** Admin proxy → Worker POST /admin/ledger/reconcile (bookkeeping mark → admin+). */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, {
    path: 'admin/ledger/reconcile',
    adminEmail: auth.session.email,
    timeoutMs: 20_000,
  });
}
