/**
 * GET   /api/admin/affiliates/batches
 * PATCH /api/admin/affiliates/batches  body: { id, status:'approved' }
 *
 * Wave 43.2 — view + approve hieu_asia.affiliate_payout_batches.
 */

import { NextResponse, type NextRequest } from 'next/server';
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

const ALLOWED_NEXT = new Set(['approved', 'rejected']);

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

export async function PATCH(req: NextRequest) {
  // Wave 60.28 — RULE AUTH-1 STRENGTHENED: previous code used
  // `verifySession()` only for email attribution with `?? 'admin'` fallback,
  // which meant unauthenticated PATCH would silently write `approved_by='admin'`
  // (weak defense-in-depth). New helper fail-closes on missing/invalid session.
  // PATCH = batch approval (financial mutation) → require admin+ role.
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  const adminEmail = auth.session.email;

  const body = (await req.json().catch(() => ({}))) as { id?: string; status?: string };
  if (!body.id || !body.status) {
    return NextResponse.json({ ok: false, error: 'id + status required' }, { status: 400 });
  }
  if (!ALLOWED_NEXT.has(body.status)) {
    return NextResponse.json({ ok: false, error: `status must be one of ${[...ALLOWED_NEXT].join(',')}` }, { status: 400 });
  }

  const payload: Record<string, unknown> = {
    status: body.status,
    approved_by: adminEmail,
    approved_at: new Date().toISOString(),
  };

  const r = await sbServer<BatchRow[]>(
    `affiliate_payout_batches?id=eq.${encodeURIComponent(body.id)}&status=eq.pending_approval`,
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(payload),
    },
  );
  if (!r.ok) {
    return NextResponse.json(
      { ok: false, error: r.error ?? 'Supabase error' },
      { status: r.status === 503 ? 503 : 502 },
    );
  }
  const updated = (r.body ?? [])[0];
  if (!updated) {
    return NextResponse.json(
      { ok: false, error: 'Batch not found or not in pending_approval state' },
      { status: 409 },
    );
  }
  return NextResponse.json({ ok: true, batch: updated });
}
