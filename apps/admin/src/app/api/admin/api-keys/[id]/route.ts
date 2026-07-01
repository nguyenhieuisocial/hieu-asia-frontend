/**
 * DELETE /api/admin/api-keys/[id] — revoke API key (privilege-revoke → admin+).
 * Gateway hashes-out the key + writes audit_log.
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  const { id } = await ctx.params;
  return proxyToGateway(req, { path: `admin/api-keys/${encodeURIComponent(id)}`, adminEmail: auth.session.email });
}
