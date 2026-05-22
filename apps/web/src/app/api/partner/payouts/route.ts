/**
 * GET /api/partner/payouts?status=pending|paid
 *
 * Wave 44 — own payout history. RLS `affiliate_own_payouts_read` filters by
 * affiliate_code matching the user's affiliate_network row.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { sbUser, extractBearer } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PayoutRow {
  id: string;
  affiliate_code: string;
  amount_vnd: number;
  method: string | null;
  destination: string | null;
  status: string;
  reference: string | null;
  batch_id: string | null;
  paid_at: string | null;
  requested_at: string;
}

export async function GET(req: NextRequest) {
  const jwt = extractBearer(req.headers);
  if (!jwt) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const statusFilter = url.searchParams.get('status');
  let q =
    'affiliate_payouts?select=id,affiliate_code,amount_vnd,method,destination,status,reference,batch_id,paid_at,requested_at&order=requested_at.desc&limit=200';
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
