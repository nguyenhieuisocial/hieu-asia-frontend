/**
 * Admin proxy to Worker `GET /admin/sessions/export?format=csv`.
 *
 * Streams CSV through to the browser so the user can download via <a download>.
 */
import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export async function GET(req: NextRequest) {
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const url = new URL(req.url);
  try {
    const r = await fetch(`${GATEWAY}/admin/sessions/export${url.search}`, {
      cache: 'no-store',
      headers: { 'X-Admin-Token': TOKEN },
    });
    if (!r.ok || !r.body) {
      const text = await r.text();
      return new NextResponse(text, { status: r.status });
    }
    return new NextResponse(r.body, {
      status: r.status,
      headers: {
        'Content-Type': r.headers.get('content-type') ?? 'text/csv; charset=utf-8',
        'Content-Disposition':
          r.headers.get('content-disposition') ??
          `attachment; filename="hieu-asia-sessions-${new Date()
            .toISOString()
            .slice(0, 10)}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: `gateway unreachable: ${(err as Error).message}` },
      { status: 502 },
    );
  }
}
