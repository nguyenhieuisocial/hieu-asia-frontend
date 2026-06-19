/**
 * POST /api/admin/posthog/query  { query: string }
 *
 * In-admin HogQL Query Explorer. Runs an admin-authored read-only HogQL query
 * server-side via the server-only PostHog client and returns columns + rows.
 * The Personal API key never reaches the browser and there is NO public share
 * link — the result is rendered inside the auth-gated admin only. Admin-gated.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';
import { runExplorerQuery } from '@/lib/posthog-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;

  const body = (await req.json().catch(() => ({}))) as { query?: unknown };
  const sql = typeof body.query === 'string' ? body.query : '';
  const result = await runExplorerQuery(sql);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
