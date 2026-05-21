/**
 * Admin proxy to Worker `GET /admin/customers`.
 * Forwards search/plan/limit/cursor query params with X-Admin-Token.
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export async function GET(req: Request) {
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const url = new URL(req.url);
  try {
    const r = await fetch(`${GATEWAY}/admin/customers${url.search}`, {
      cache: 'no-store',
      headers: { 'X-Admin-Token': TOKEN },
    });
    // Guard against non-JSON responses (Cloudflare HTML error pages, etc.)
    // so the page never sees the "Invalid JSON" fallback path.
    const text = await r.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: r.status });
    } catch {
      return NextResponse.json(
        { ok: false, error: `gateway returned non-JSON (status ${r.status})`, body: text.slice(0, 500) },
        { status: r.status >= 500 ? r.status : 502 },
      );
    }
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: `gateway unreachable: ${(err as Error).message}` },
      { status: 502 },
    );
  }
}
