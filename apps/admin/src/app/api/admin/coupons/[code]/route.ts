/**
 * Admin proxy → Worker PATCH /admin/coupons/:code (edit a live coupon in place, admin+).
 * Body { discount_pct?, valid_to?, max_uses?, notes? } forwarded verbatim.
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  const { code } = await params;
  return proxyToGateway(req, {
    path: `admin/coupons/${encodeURIComponent(code)}`,
    adminEmail: auth.session.email,
  });
}
