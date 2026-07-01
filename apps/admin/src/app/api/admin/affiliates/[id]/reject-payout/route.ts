/** Admin proxy: POST /api/admin/affiliates/[id]/reject-payout (financial → admin+). */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  const { id } = await params;
  return proxyToGateway(req, {
    path: `admin/affiliates/${encodeURIComponent(id)}/reject-payout`,
    adminEmail: auth.session.email,
  });
}
