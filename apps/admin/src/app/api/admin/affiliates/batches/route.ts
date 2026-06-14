/**
 * GET /api/admin/affiliates/batches
 *
 * Wave 43.2 — view hieu_asia.affiliate_payout_batches. Approval is NOT handled
 * here: the real approve path is POST /api/admin/affiliates/payouts/batches/[id]/approve,
 * which goes through the worker's rail dispatch (moves money / emits CSV). The
 * old PATCH handler that wrote status='approved' straight to Supabase was dead
 * code (no caller) and bypassed dispatch, so it was removed.
 */

import { NextResponse } from 'next/server';
import { sbServer } from '@/lib/supabase-server';
import { requireAdminSession } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface BatchRow {
  id: string;
  status: string;
  rail: string | null;
  total_amount_vnd: number;
  affiliate_count: number;
  approved_by: string | null;
  approved_at: string | null;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export async function GET() {
  // Wave 60.28 — RULE AUTH-1 defense-in-depth (vault 94).
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;

  const r = await sbServer<BatchRow[]>(
    'affiliate_payout_batches?select=*&order=created_at.desc&limit=200',
  );
  if (!r.ok) {
    return NextResponse.json(
      { ok: false, error: r.error ?? 'Supabase error' },
      { status: r.status === 503 ? 503 : 502 },
    );
  }
  return NextResponse.json({ ok: true, batches: r.body ?? [] });
}
