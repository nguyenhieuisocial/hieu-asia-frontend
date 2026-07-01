/**
 * Admin proxy → Worker POST /admin/sessions/bulk-delete (destructive, admin+).
 * Body verbatim — UI must include { session_ids, confirm: "DELETE_BULK" }.
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  return proxyToGateway(req, { path: 'admin/sessions/bulk-delete', adminEmail: auth.session.email });
}
