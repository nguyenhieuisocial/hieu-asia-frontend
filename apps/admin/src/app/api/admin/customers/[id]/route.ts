/**
 * Admin proxy to Worker `GET /admin/customers/:id` (customer PII read → viewer+).
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;
  const { id } = await context.params;
  return proxyToGateway(req, {
    path: `admin/customers/${encodeURIComponent(id)}`,
    adminEmail: auth.session.email,
  });
}
