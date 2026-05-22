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
  // Wave 38.2: add 8s fetch timeout. Previously a hung outbound fetch would
  // burn the whole serverless 10s budget and the function would return
  // Vercel's default 503 with no body, making debugging hell. With AbortController
  // we surface a useful error in <8s.
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 8000);
  try {
    const r = await fetch(`${GATEWAY}/admin/customers${url.search}`, {
      cache: 'no-store',
      headers: { 'X-Admin-Token': TOKEN },
      signal: ac.signal,
    });
    clearTimeout(timer);
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
    clearTimeout(timer);
    const msg = (err as Error).message;
    const isAbort = msg.toLowerCase().includes('abort');
    return NextResponse.json(
      {
        ok: false,
        error: isAbort
          ? `gateway timeout: fetch to ${GATEWAY} exceeded 8s`
          : `gateway unreachable: ${msg}`,
        gateway: GATEWAY,
      },
      { status: 504 },
    );
  }
}
