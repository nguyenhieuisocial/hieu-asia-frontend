/**
 * POST /api/partner/rail/switch
 *
 * Wave 45 — proxies to worker POST /partner/rail/switch with the user's
 * Supabase JWT. The worker independently verifies the JWT + role.
 * Body: { rail: 'manual_csv'|'wise'|'stripe_connect', account_external_id?: string }
 */

import { NextResponse, type NextRequest } from 'next/server';
import { extractBearer } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';

export async function POST(req: NextRequest) {
  const jwt = extractBearer(req.headers);
  if (!jwt) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const body = await req.text();
  try {
    const r = await fetch(`${GATEWAY}/partner/rail/switch`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${jwt}`,
        'content-type': 'application/json',
      },
      body,
      cache: 'no-store',
    });
    const text = await r.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: r.status });
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: `gateway returned non-JSON (status ${r.status})`,
          body: text.slice(0, 500),
        },
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
