/**
 * Admin proxy to Worker `POST /admin/copilot/ask`.
 * Read-only ops copilot: forwards a Vietnamese ops question, returns an AI
 * summary + the raw signals. admin+ (returns aggregated ops data).
 */
import { type NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const body = await req.text();
  try {
    const r = await fetch(`${GATEWAY}/admin/copilot/ask`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': TOKEN },
      body,
      // The worker may call the AI gateway — allow a generous timeout.
      signal: AbortSignal.timeout(30_000),
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: `gateway unreachable: ${(err as Error).message}` },
      { status: 502 },
    );
  }
}
