/**
 * Admin proxy → Worker GET /admin/prompts/:role/history (revert UI, read-only viewer+).
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ role: string }> },
) {
  const auth = await requireAdminSession('viewer');
  if ('error' in auth) return auth.error;
  const { role } = await params;
  return proxyToGateway(req, {
    path: `admin/prompts/${encodeURIComponent(role)}/history`,
    adminEmail: auth.session.email,
  });
}
