/**
 * Admin proxy → Worker POST /admin/copilot/ask (read-only ops copilot, admin+).
 * Worker may call the AI gateway → generous 30s timeout. Returns JSON (no stream).
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, {
    path: 'admin/copilot/ask',
    adminEmail: auth.session.email,
    timeoutMs: 30_000,
  });
}
