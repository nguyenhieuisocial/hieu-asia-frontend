/**
 * Admin proxy → Worker GET /ai/providers (read-only providers status, viewer+).
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export async function GET(req: Request) {
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'ai/providers', adminEmail: auth.session.email });
}
