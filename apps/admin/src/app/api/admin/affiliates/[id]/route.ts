/**
 * Admin proxy: GET /api/admin/affiliates/[id] — affiliate detail (PII → viewer+).
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;
  const { id } = await params;
  return proxyToGateway(req, {
    path: `admin/affiliates/${encodeURIComponent(id)}`,
    adminEmail: auth.session.email,
  });
}
