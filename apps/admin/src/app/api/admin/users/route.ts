/**
 * Admin proxy → Worker /admin/users (admin-user management → owner only).
 *  GET → list, POST → create.
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const auth = await requireAdminSession('owner');
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/users', adminEmail: auth.session.email });
}

export async function POST(req: Request) {
  const auth = await requireAdminSession('owner');
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/users', adminEmail: auth.session.email });
}
