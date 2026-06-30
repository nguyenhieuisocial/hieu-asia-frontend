/**
 * Admin proxy → Worker /admin/prompts/:role (+ /reset).
 *  GET  → fetch single role prompt (viewer+)
 *  PUT  → upsert override, body { system } (admin+)
 *  POST → reset to default (admin+, forwards to /admin/prompts/:role/reset)
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ role: string }> };

export async function GET(req: Request, ctx: Ctx) {
  const auth = await requireAdminSession('viewer');
  if ('error' in auth) return auth.error;
  const { role } = await ctx.params;
  return proxyToGateway(req, { path: `admin/prompts/${encodeURIComponent(role)}`, adminEmail: auth.session.email });
}

export async function PUT(req: Request, ctx: Ctx) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  const { role } = await ctx.params;
  return proxyToGateway(req, { path: `admin/prompts/${encodeURIComponent(role)}`, adminEmail: auth.session.email });
}

export async function POST(req: Request, ctx: Ctx) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  const { role } = await ctx.params;
  return proxyToGateway(req, { path: `admin/prompts/${encodeURIComponent(role)}/reset`, adminEmail: auth.session.email });
}
