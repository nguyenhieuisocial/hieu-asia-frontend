/** Admin proxy → Worker GET /admin/ledger/accounting. Money data → admin+. */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  // Heavy accounting query — keep the original 25s timeout (vs the 8s default).
  return proxyToGateway(req, {
    path: 'admin/ledger/accounting',
    adminEmail: auth.session.email,
    timeoutMs: 25_000,
  });
}
