/**
 * POST /api/admin/affiliates/payouts/batches/[id]/mark-paid → worker (admin+).
 * RECORD-ONLY: marks a manual_csv batch completed after off-platform transfers;
 * moves no money.
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
    path: `admin/affiliates/payouts/batches/${encodeURIComponent(id)}/mark-paid`,
    adminEmail: auth.session.email,
  });
}
