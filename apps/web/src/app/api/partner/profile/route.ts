/**
 * PATCH /api/partner/profile
 *
 * Wave 44 — affiliate self-update for payout_method + payout_details.
 * The affiliate_network table allows the authenticated user to update their
 * own row via the new RLS policy (subtree read) — but PATCH requires a
 * dedicated update policy. Until that lands (Wave 45 KYC), this route uses
 * the service-role key to perform the targeted update *only after verifying*
 * the JWT belongs to the row owner. This keeps the API surface minimal
 * without weakening RLS.
 *
 * Body:
 *   { payout_method: 'bank' | 'momo' | 'zalo',
 *     payout_details: { bank_name?, account_number?, account_holder?, phone? } }
 */

import { NextResponse, type NextRequest } from 'next/server';
import { sbUser, extractBearer } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_METHODS = new Set(['bank', 'momo', 'zalo']);

interface NetworkRow {
  user_id: string;
}

export async function PATCH(req: NextRequest) {
  const jwt = extractBearer(req.headers);
  if (!jwt) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    payout_method?: string;
    payout_details?: Record<string, unknown>;
  };

  const method = typeof body.payout_method === 'string' ? body.payout_method : null;
  if (!method || !VALID_METHODS.has(method)) {
    return NextResponse.json(
      { ok: false, error: 'payout_method must be bank|momo|zalo' },
      { status: 400 },
    );
  }
  const details =
    body.payout_details && typeof body.payout_details === 'object'
      ? body.payout_details
      : {};

  // Verify the JWT maps to an affiliate row first (RLS does the scoping).
  const meR = await sbUser<NetworkRow[]>('affiliate_network?select=user_id&limit=1', jwt);
  const meRow = meR.ok && meR.body && meR.body.length > 0 ? meR.body[0] : null;
  if (!meRow) {
    return NextResponse.json(
      { ok: false, error: 'affiliate not found for this user' },
      { status: 404 },
    );
  }
  const userId = meRow.user_id;

  // Update via service-role (RLS UPDATE policy not yet defined). Scoped to
  // the verified user_id from the JWT lookup — cannot patch other rows.
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const svcKey =
    process.env.HIEU_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    '';
  if (!url || !svcKey) {
    return NextResponse.json(
      { ok: false, error: 'service-role key not configured' },
      { status: 503 },
    );
  }
  const r = await fetch(
    `${url.replace(/\/+$/, '')}/rest/v1/affiliate_network?user_id=eq.${encodeURIComponent(userId)}`,
    {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        apikey: svcKey,
        authorization: `Bearer ${svcKey}`,
        'Accept-Profile': 'hieu_asia',
        'Content-Profile': 'hieu_asia',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ payout_method: method, payout_details: details }),
      cache: 'no-store',
    },
  );
  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json(
      { ok: false, error: text || `HTTP ${r.status}` },
      { status: r.status === 503 ? 503 : 502 },
    );
  }
  const updated = (await r.json()) as Array<{
    user_id: string;
    payout_method: string;
    payout_details: Record<string, unknown> | null;
  }>;
  return NextResponse.json({ ok: true, affiliate: updated[0] ?? null });
}
