/**
 * GET /api/partner/payouts?status=pending|paid
 *
 * Wave 44 — own payout history. RLS `affiliate_own_payouts_read` filters by
 * affiliate_code matching the user's affiliate_network row.
 *
 * Wave 44.1 hotfix: the actual DB schema is
 *   id, affiliate_code, period, amount_vnd, paid_at, method, reference, batch_id
 * — there is no `destination`, no `status` column, no `requested_at`. Derive
 * status from paid_at presence; method already encodes bank/momo/zalo.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { sbUser, extractBearer } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PayoutRow {
  id: number;
  affiliate_code: string;
  period: string | null;
  amount_vnd: number;
  method: string | null;
  reference: string | null;
  batch_id: string | null;
  paid_at: string | null;
}

export async function GET(req: NextRequest) {
  const jwt = extractBearer(req.headers);
  if (!jwt) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const statusFilter = url.searchParams.get('status');
  // paid_at desc with nullsfirst surfaces pending (paid_at IS NULL) rows first.
  let q =
    'affiliate_payouts?select=id,affiliate_code,period,amount_vnd,method,reference,batch_id,paid_at&order=paid_at.desc.nullsfirst&limit=200';
  if (statusFilter === 'pending') {
    q += '&paid_at=is.null';
  } else if (statusFilter === 'paid') {
    q += '&paid_at=not.is.null';
  }

  const r = await sbUser<PayoutRow[]>(q, jwt);
  if (!r.ok) {
    return NextResponse.json(
      { ok: false, error: r.error ?? 'lookup failed' },
      { status: r.status === 503 ? 503 : 502 },
    );
  }
  return NextResponse.json({ ok: true, payouts: r.body ?? [] });
}
