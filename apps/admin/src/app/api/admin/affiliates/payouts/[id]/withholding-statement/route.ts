/**
 * GET /api/admin/affiliates/payouts/[id]/withholding-statement
 *
 * Proxies to worker GET /admin/affiliates/payouts/:id/withholding-statement —
 * the INTERNAL TNCN withholding statement (bảng kê tạm tính) for the accountant.
 * NOT a NĐ123/2020 official e-certificate. Pass-through of JSON / ?format=html /
 * ?format=pdf (binary-safe). Admin-role gated (the statement carries the
 * recipient's name + masked MST/CCCD).
 */

import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession('admin', { read: true });
  if ('error' in auth) return auth.error;
  const session = auth.session;
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const { id } = await params;
  const format = req.nextUrl.searchParams.get('format');
  const qs = format ? `?format=${encodeURIComponent(format)}` : '';
  try {
    const r = await fetch(
      `${GATEWAY}/admin/affiliates/payouts/${encodeURIComponent(id)}/withholding-statement${qs}`,
      {
        method: 'GET',
        headers: {
          'X-Admin-Token': TOKEN,
          ...(session?.email ? { 'x-admin-email': session.email } : {}),
        },
        cache: 'no-store',
      },
    );
    // Pass through verbatim (PDF/HTML are binary/markup; JSON is the default).
    const buf = await r.arrayBuffer();
    const headers: Record<string, string> = {
      'content-type': r.headers.get('content-type') ?? 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    };
    const cd = r.headers.get('content-disposition');
    if (cd) headers['content-disposition'] = cd;
    return new NextResponse(buf, { status: r.status, headers });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: `gateway unreachable: ${(err as Error).message}` },
      { status: 502 },
    );
  }
}
