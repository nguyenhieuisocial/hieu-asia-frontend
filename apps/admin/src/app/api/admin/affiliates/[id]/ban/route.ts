/** Admin proxy: POST /api/admin/affiliates/[id]/ban  body: { banned } (admin+). */
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
    path: `admin/affiliates/${encodeURIComponent(id)}/ban`,
    adminEmail: auth.session.email,
  });
}
