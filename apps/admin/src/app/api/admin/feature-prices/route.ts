/**
 * Admin proxy → Worker /admin/feature-prices.
 *  GET → list (viewer+)
 *  PUT → update one price { slug, vnd } (admin+)
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/feature-prices', adminEmail: auth.session.email });
}

export async function PUT(req: Request) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/feature-prices', adminEmail: auth.session.email });
}
