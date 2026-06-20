/**
 * GET /api/admin/posthog/heatmap?url&type&dateFrom&widthMin&widthMax&aggregation
 *
 * Click/scroll heatmap density for a URL, for the in-admin heatmap viewer.
 * Server-only PostHog client; key never leaks; admin-gated. Soft envelope.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';
import { fetchHeatmap, isPostHogServerConfigured } from '@/lib/posthog-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;

  const sp = req.nextUrl.searchParams;
  const url = (sp.get('url') ?? '').trim();
  const widthMin = sp.get('widthMin');
  const widthMax = sp.get('widthMax');
  const result = await fetchHeatmap({
    url,
    type: sp.get('type') ?? undefined,
    dateFrom: sp.get('dateFrom') ?? undefined,
    aggregation: sp.get('aggregation') ?? undefined,
    widthMin: widthMin ? Number(widthMin) : undefined,
    widthMax: widthMax ? Number(widthMax) : undefined,
  });
  return NextResponse.json({ ...result, configured: isPostHogServerConfigured() });
}
