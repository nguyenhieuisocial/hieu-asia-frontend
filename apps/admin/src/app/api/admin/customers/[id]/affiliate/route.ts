/** Admin proxy → Worker GET /admin/customers/:id/affiliate (CDP outbound view). admin+. */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession('admin', { read: true });
  if ('error' in auth) return auth.error;
  const { id } = await params;
  return proxyToGateway(req, {
    path: `admin/customers/${encodeURIComponent(id)}/affiliate`,
    adminEmail: auth.session.email,
    timeoutMs: 20_000,
  });
}
