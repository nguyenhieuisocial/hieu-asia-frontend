/**
 * GET   /api/admin/affiliates/commissions?status=held,available
 * PATCH /api/admin/affiliates/commissions  body: { id, status }
 *
 * Wave 43.2 — read + manual clawback for hieu_asia.affiliate_commissions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { sbServer } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface CommissionRow {
  id: string;
  source_user_id: string;
  beneficiary_id: string;
  tier_level: number;
  gross_amount_vnd: number;
  commission_vnd: number;
  status: string;
  available_at: string | null;
  cooling_period_days: number | null;
  paid_at: string | null;
  created_at: string;
}

interface UserRow {
  id: string;
  email: string | null;
}

const ALLOWED_STATUSES = new Set([
  'pending',
  'held',
  'available',
  'paid',
  'clawed_back',
  'void',
]);

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const statusParam = url.searchParams.get('status') ?? 'held,available';
  const statuses = statusParam
    .split(',')
    .map((s) => s.trim())
    .filter((s) => ALLOWED_STATUSES.has(s));

  const limit = Math.min(Number(url.searchParams.get('limit') ?? 200) || 200, 500);

  const filter = statuses.length > 0
    ? `&status=in.(${statuses.map(encodeURIComponent).join(',')})`
    : '';
  const r = await sbServer<CommissionRow[]>(
    `affiliate_commissions?select=*${filter}&order=created_at.desc&limit=${limit}`,
  );
  if (!r.ok) {
    return NextResponse.json(
      { ok: false, error: r.error ?? 'Supabase error' },
      { status: r.status === 503 ? 503 : 502 },
    );
  }

  const rows = r.body ?? [];
  const ids = Array.from(new Set(rows.map((c) => c.beneficiary_id))).filter(Boolean);
  let emailById = new Map<string, string>();
  if (ids.length > 0) {
    const usrR = await sbServer<UserRow[]>(
      `users?select=id,email&id=in.(${ids.map(encodeURIComponent).join(',')})&limit=1000`,
    );
    if (usrR.ok && usrR.body) {
      emailById = new Map(
        usrR.body
          .filter((u): u is { id: string; email: string } => !!u.email)
          .map((u) => [u.id, u.email]),
      );
    }
  }

  return NextResponse.json({
    ok: true,
    commissions: rows.map((c) => ({
      ...c,
      beneficiary_email: emailById.get(c.beneficiary_id) ?? null,
    })),
  });
}

export async function PATCH(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { id?: string; status?: string };
  if (!body.id || !body.status) {
    return NextResponse.json({ ok: false, error: 'id + status required' }, { status: 400 });
  }
  if (!ALLOWED_STATUSES.has(body.status)) {
    return NextResponse.json({ ok: false, error: `status must be one of ${[...ALLOWED_STATUSES].join(',')}` }, { status: 400 });
  }
  const r = await sbServer(
    `affiliate_commissions?id=eq.${encodeURIComponent(body.id)}`,
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ status: body.status }),
    },
  );
  if (!r.ok) {
    return NextResponse.json(
      { ok: false, error: r.error ?? 'Supabase error' },
      { status: r.status === 503 ? 503 : 502 },
    );
  }
  return NextResponse.json({ ok: true, commission: r.body });
}
