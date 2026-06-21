/**
 * POST /api/admin/affiliates/payouts/batches/[id]/mark-paid
 *
 * Proxies to worker POST /admin/affiliates/payouts/batches/:id/mark-paid —
 * RECORD-ONLY: marks a manual_csv batch completed after the founder has done the
 * bank transfers off-platform. Moves NO money. Admin-role gated (mirrors the
 * approve/csv sibling routes).
 */

import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  const session = auth.session;
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const { id } = await params;
  try {
    const r = await fetch(
      `${GATEWAY}/admin/affiliates/payouts/batches/${encodeURIComponent(id)}/mark-paid`,
      {
        method: 'POST',
        headers: {
          'X-Admin-Token': TOKEN,
          'content-type': 'application/json',
          ...(session?.email ? { 'x-admin-email': session.email } : {}),
        },
        cache: 'no-store',
      },
    );
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
