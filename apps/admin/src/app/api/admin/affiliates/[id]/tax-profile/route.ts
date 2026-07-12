/**
 * GET /api/admin/affiliates/[id]/tax-profile → worker /admin/affiliates/:id/tax-profile.
 * Admin view of a promoter's tax/KYC profile (masked MST/CCCD — the worker
 * reuses the affiliate self-read handler). Gap audit 2026-07-02: the data was
 * collected + feeds the withholding statement but had no admin read. Admin+.
 */
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
    path: `admin/affiliates/${encodeURIComponent(id)}/tax-profile`,
    adminEmail: auth.session.email,
  });
}
