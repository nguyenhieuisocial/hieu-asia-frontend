/**
 * GET /api/admin/posthog/recordings?limit&offset
 *
 * Lists recent session recordings (metadata) for the in-admin replay viewer.
 * Server-only PostHog client; key never leaks; admin-gated. Soft envelope.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';
import { fetchRecordings, isPostHogServerConfigured } from '@/lib/posthog-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;

  const sp = req.nextUrl.searchParams;
  const limit = Number(sp.get('limit') ?? '30');
  const offset = Number(sp.get('offset') ?? '0');
  const result = await fetchRecordings(
    Number.isFinite(limit) ? limit : 30,
    Number.isFinite(offset) ? offset : 0,
  );
  return NextResponse.json({ ...result, configured: isPostHogServerConfigured() });
}
