/**
 * GET /api/partner/commissions?status=...
 *
 * Wave 44 — lists the logged-in affiliate's own commission ledger.
 * RLS `affiliate_own_commissions_read` scopes to beneficiary_id = auth.uid().
 *
 * Also computes per-status aggregates for the dashboard strip.
 *
 * Wave 44.1 hotfix: the DB columns are `status` (not `state`) and `order_id`
 * (not `source_order_id`). Pass-through DB names to avoid alias-mapping.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { sbUser, extractBearer } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface CommissionRow {
  id: string;
  order_id: string | null;
  tier_level: number;
  gross_amount_vnd: number;
  commission_vnd: number;
  status: string;
  created_at: string;
  available_at: string | null;
  beneficiary_id: string;
}

const VALID_STATES = new Set([
  'pending',
  'held',
  'available',
  'paid',
  'clawed_back',
  'void',
]);

export async function GET(req: NextRequest) {
  const jwt = extractBearer(req.headers);
  if (!jwt) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const statusFilter = url.searchParams.get('status') ?? url.searchParams.get('state');
  let q =
    'affiliate_commissions?select=id,order_id,tier_level,gross_amount_vnd,commission_vnd,status,created_at,available_at,beneficiary_id&order=created_at.desc&limit=500';
  if (statusFilter && VALID_STATES.has(statusFilter)) {
    q += `&status=eq.${statusFilter}`;
  }

  const r = await sbUser<CommissionRow[]>(q, jwt);
  if (!r.ok) {
    return NextResponse.json(
      { ok: false, error: r.error ?? 'lookup failed' },
      { status: r.status === 503 ? 503 : 502 },
    );
  }
  const rows = r.body ?? [];

  // Aggregate per status (unfiltered query for the strip).
  let stripRows = rows;
  if (statusFilter) {
    const allR = await sbUser<CommissionRow[]>(
      'affiliate_commissions?select=status,commission_vnd&limit=2000',
      jwt,
    );
    stripRows = allR.ok && allR.body ? (allR.body as CommissionRow[]) : rows;
  }
  const aggregates: Record<string, { count: number; vnd: number }> = {};
  for (const s of VALID_STATES) aggregates[s] = { count: 0, vnd: 0 };
  for (const c of stripRows) {
    const bucket = aggregates[c.status] ?? { count: 0, vnd: 0 };
    bucket.count += 1;
    bucket.vnd += c.commission_vnd;
    aggregates[c.status] = bucket;
  }

  return NextResponse.json({ ok: true, commissions: rows, aggregates });
}
