/**
 * GET /api/admin/affiliates/payouts-ledger
 *
 * Wave 43.2 — view-only Postgres-side payouts list (separate from the
 * KV-backed pending-payouts in /api/admin/affiliates). Distinct name to avoid
 * conflicting with the existing /api/admin/affiliates/[id]/approve-payout
 * structure.
 */

import { NextRequest, NextResponse } from 'next/server';
import { sbServer } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PayoutRow {
  id: number;
  affiliate_code: string;
  period: string;
  amount_vnd: number;
  paid_at: string | null;
  method: string | null;
  reference: string | null;
  batch_id: string | null;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const status = url.searchParams.get('status'); // 'pending' | 'paid' | null
  const limit = Math.min(Number(url.searchParams.get('limit') ?? 200) || 200, 500);

  let filter = '';
  if (status === 'pending') filter = '&paid_at=is.null';
  else if (status === 'paid') filter = '&paid_at=not.is.null';

  const r = await sbServer<PayoutRow[]>(
    `affiliate_payouts?select=*${filter}&order=id.desc&limit=${limit}`,
  );
  if (!r.ok) {
    return NextResponse.json(
      { ok: false, error: r.error ?? 'Supabase error' },
      { status: r.status === 503 ? 503 : 502 },
    );
  }
  return NextResponse.json({ ok: true, payouts: r.body ?? [] });
}
