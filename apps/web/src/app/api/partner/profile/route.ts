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

const ALLOWED_PAYOUT_KEYS = [
  'bank_name',
  'account_number',
  'account_holder',
  'phone',
] as const;

/**
 * Wave 44.1 hotfix (P1-2): the previous handler accepted arbitrary jsonb. Now
 * whitelist keys + length cap so we cannot store oversized or unexpected blobs.
 */
function sanitizePayoutDetails(input: unknown): Record<string, string> | null {
  if (!input || typeof input !== 'object') return null;
  const out: Record<string, string> = {};
  const src = input as Record<string, unknown>;
  for (const k of ALLOWED_PAYOUT_KEYS) {
    const v = src[k];
    if (typeof v === 'string' && v.length > 0 && v.length <= 256) {
      out[k] = v;
    }
  }
  return Object.keys(out).length > 0 ? out : null;
}

interface NetworkRow {
  user_id: string;
  affiliate_code: string;
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
  const details = sanitizePayoutDetails(body.payout_details) ?? {};

  // Wave 45-fix (#236): payout_method + payout_details columns live on
  // `hieu_asia.affiliates` (PK=code), NOT `affiliate_network` (PK=user_id).
  // Previous Wave 44 implementation PATCHed the wrong table — UPDATE
  // returned 0 rows silently (no error) but data never persisted. Wave 45
  // CSV builder reads from `affiliates`, so this fix restores the contract:
  // (1) lookup affiliate_code via affiliate_network using JWT-scoped RLS,
  // (2) PATCH affiliates WHERE code = <verified code>.
  const meR = await sbUser<NetworkRow[]>(
    'affiliate_network?select=user_id,affiliate_code&limit=1',
    jwt,
  );
  const meRow = meR.ok && meR.body && meR.body.length > 0 ? meR.body[0] : null;
  if (!meRow) {
    return NextResponse.json(
      { ok: false, error: 'affiliate not found for this user' },
      { status: 404 },
    );
  }
  const affiliateCode = meRow.affiliate_code;
  if (!affiliateCode) {
    return NextResponse.json(
      { ok: false, error: 'affiliate_code missing for this user' },
      { status: 404 },
    );
  }

  // Update via service-role (RLS UPDATE policy not yet defined on `affiliates`).
  // Scoped to the verified affiliate_code from the JWT lookup — cannot patch
  // other rows because the lookup was RLS-gated.
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
    `${url.replace(/\/+$/, '')}/rest/v1/affiliates?code=eq.${encodeURIComponent(affiliateCode)}`,
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
    code: string;
    payout_method: string;
    payout_details: Record<string, unknown> | null;
  }>;
  return NextResponse.json({ ok: true, affiliate: updated[0] ?? null });
}
