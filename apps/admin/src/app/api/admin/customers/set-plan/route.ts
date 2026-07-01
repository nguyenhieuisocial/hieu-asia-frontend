/**
 * POST /api/admin/customers/set-plan → worker POST /admin/users/set-plan.
 * Comp/extend/revoke an end-user's paid plan — revenue-affecting → owner+.
 * Body { email, plan, days? } forwarded verbatim.
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const auth = await requireAdminSession('owner');
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, {
    path: 'admin/users/set-plan',
    adminEmail: auth.session.email,
    timeoutMs: 20_000,
  });
}
