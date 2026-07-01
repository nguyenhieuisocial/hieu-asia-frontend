/**
 * POST /api/admin/affiliates/[id]/reparent → worker /admin/affiliates/:id/reparent.
 * Body: { new_parent_user_id: uuid | null }. Admin+.
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  const { id } = await params;
  return proxyToGateway(req, {
    path: `admin/affiliates/${encodeURIComponent(id)}/reparent`,
    adminEmail: auth.session.email,
  });
}
