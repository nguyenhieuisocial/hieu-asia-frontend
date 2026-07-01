/**
 * Admin proxy → Worker /admin/users/:id (admin-user management → owner only).
 *  PATCH → update, DELETE → remove.
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await requireAdminSession('owner');
  if ('error' in auth) return auth.error;
  const { id } = await ctx.params;
  return proxyToGateway(req, { path: `admin/users/${encodeURIComponent(id)}`, adminEmail: auth.session.email });
}

export async function DELETE(req: Request, ctx: Ctx) {
  const auth = await requireAdminSession('owner');
  if ('error' in auth) return auth.error;
  const { id } = await ctx.params;
  return proxyToGateway(req, { path: `admin/users/${encodeURIComponent(id)}`, adminEmail: auth.session.email });
}
