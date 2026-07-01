/**
 * Admin proxy → Worker POST /admin/sessions/:id/re-orchestrate.
 * Re-runs the full agent pipeline (paid LLM work) → admin+. No body required.
 */
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  const { id } = await params;
  return proxyToGateway(req, {
    path: `admin/sessions/${encodeURIComponent(id)}/re-orchestrate`,
    adminEmail: auth.session.email,
  });
}
