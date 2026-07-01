/**
 * Admin proxy → Worker POST /admin/prompts/:role/revert (restore version, admin+).
 * Body { at } forwarded verbatim.
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ role: string }> },
) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  const { role } = await params;
  return proxyToGateway(req, {
    path: `admin/prompts/${encodeURIComponent(role)}/revert`,
    adminEmail: auth.session.email,
  });
}
