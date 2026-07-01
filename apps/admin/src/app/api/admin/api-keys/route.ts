/**
 * Admin proxy → Worker /admin/api-keys.
 *  GET  → list (viewer+)
 *  POST → create + return plaintext once (admin+)
 * Gateway hashes the secret, writes audit_log, returns cleartext exactly once.
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/api-keys', adminEmail: auth.session.email });
}

export async function POST(req: Request) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/api-keys', adminEmail: auth.session.email });
}
