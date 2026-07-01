/**
 * POST /api/admin/integrations/oauth/[vendor]/start → worker /oauth/:vendor/start.
 * Start AI-provider OAuth credential binding (privileged mutation) → admin+.
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

type Ctx = { params: Promise<{ vendor: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  const { vendor } = await ctx.params;
  return proxyToGateway(req, { path: `oauth/${vendor}/start`, adminEmail: auth.session.email });
}
