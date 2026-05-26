/**
 * POST /api/onboarding/complete
 *
 * Wave 58 — Persist mandatory onboarding wizard payload to hieu_asia.users.
 *
 * Auth model:
 *   Requires `Authorization: Bearer <supabase access_token>` so we can verify
 *   the caller's user_id server-side before applying the PATCH. We then use
 *   the service-role key for the actual UPDATE because the wizard sets
 *   columns (consent_flags, phone, chart_data, onboarding_completed_at) that
 *   currently have no per-user UPDATE policy on hieu_asia.users.
 *
 * Body (JSON):
 *   {
 *     full_name: string,
 *     gender: 'M' | 'F' | 'NB',
 *     birth_year: number,
 *     birth_month: number,
 *     birth_day: number,
 *     birth_hour: number | null,           // null when "không nhớ giờ sinh"
 *     phone: string | null,                // null when user skipped
 *     consent_flags: {
 *       sms_anniversary: boolean,
 *       zalo_optin: boolean,
 *       email_tips: boolean,
 *       meta_retargeting: boolean,
 *       google_retargeting: boolean,
 *       zalo_oa_broadcast: boolean,
 *     }
 *   }
 *
 * Response: { ok: true } | { ok: false, error: string }
 *
 * NOTE: This route writes to columns added by migration 0036. If that
 * migration has not been applied yet, the PATCH will fail with a Postgres
 * "column does not exist" error and we surface a 503.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { extractBearer } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Wave 60.49.b — zod schema replaces the hand-rolled validator.
// Same rules (Vietnam phone regex, 1900–2100 year window, 0–23 hour),
// same response contract (`{ ok: false, error: string }` on failure),
// stricter parsing now bubbles up the first issue as `error` for back-compat.
const ConsentFlagsSchema = z.object({
  sms_anniversary: z.boolean().optional().default(false),
  zalo_optin: z.boolean().optional().default(false),
  email_tips: z.boolean().optional().default(false),
  meta_retargeting: z.boolean().optional().default(false),
  google_retargeting: z.boolean().optional().default(false),
  zalo_oa_broadcast: z.boolean().optional().default(false),
});

const VN_PHONE_RE = /^(\+84|0)\d{9}$/;

const WizardSchema = z.object({
  full_name: z.string().trim().min(1, 'full_name must be 1-120 chars').max(120, 'full_name must be 1-120 chars'),
  gender: z.enum(['M', 'F', 'NB'], { message: 'gender must be M | F | NB' }),
  birth_year: z.number().int().min(1900, 'birth_year must be 1900-2100').max(2100, 'birth_year must be 1900-2100'),
  birth_month: z.number().int().min(1, 'birth_month must be 1-12').max(12, 'birth_month must be 1-12'),
  birth_day: z.number().int().min(1, 'birth_day must be 1-31').max(31, 'birth_day must be 1-31'),
  birth_hour: z.number().int().min(0, 'birth_hour must be 0-23 or null').max(23, 'birth_hour must be 0-23 or null').nullable(),
  phone: z
    .string()
    .trim()
    .nullable()
    .transform((v) => (v === null || v.length === 0 ? null : v))
    .refine(
      (v) => v === null || VN_PHONE_RE.test(v),
      'phone must be Vietnam format (+84XXXXXXXXX or 0XXXXXXXXX)',
    ),
  consent_flags: ConsentFlagsSchema.optional().default({
    sms_anniversary: false,
    zalo_optin: false,
    email_tips: false,
    meta_retargeting: false,
    google_retargeting: false,
    zalo_oa_broadcast: false,
  }),
});

/**
 * Verify the bearer token by calling Supabase's /auth/v1/user endpoint and
 * return the auth user_id. Returns null when the token is invalid/expired.
 */
async function verifyJwt(jwt: string): Promise<string | null> {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';
  if (!url || !anonKey) return null;
  try {
    const r = await fetch(`${url.replace(/\/+$/, '')}/auth/v1/user`, {
      method: 'GET',
      headers: { apikey: anonKey, authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    });
    if (!r.ok) return null;
    const body = (await r.json()) as { id?: string };
    return body?.id ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const jwt = extractBearer(req.headers);
  if (!jwt) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const userId = await verifyJwt(jwt);
  if (!userId) {
    return NextResponse.json({ ok: false, error: 'invalid_token' }, { status: 401 });
  }

  const raw = await req.json().catch(() => null);
  const result = WizardSchema.safeParse(raw);
  if (!result.success) {
    // First issue's message preserves the prior `{ ok: false, error: <human msg> }`
    // contract used by the onboarding wizard's error toast.
    const firstIssue = result.error.issues[0];
    return NextResponse.json(
      { ok: false, error: firstIssue?.message ?? 'invalid_input' },
      { status: 400 },
    );
  }
  const payload = result.data;

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
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

  // chart_data captures Steps 1+2 (everything needed to compute the chart
  // later). Phone + consent_flags live in their own columns for indexability.
  const chart_data = {
    full_name: payload.full_name,
    gender: payload.gender,
    birth_year: payload.birth_year,
    birth_month: payload.birth_month,
    birth_day: payload.birth_day,
    birth_hour: payload.birth_hour,
    birth_hour_unknown: payload.birth_hour === null,
  };

  const patchBody = {
    onboarding_completed_at: new Date().toISOString(),
    chart_data,
    phone: payload.phone,
    consent_flags: payload.consent_flags,
  };

  const r = await fetch(
    `${url.replace(/\/+$/, '')}/rest/v1/users?id=eq.${encodeURIComponent(userId)}`,
    {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        apikey: svcKey,
        authorization: `Bearer ${svcKey}`,
        'Accept-Profile': 'hieu_asia',
        'Content-Profile': 'hieu_asia',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(patchBody),
      cache: 'no-store',
    },
  );

  if (!r.ok) {
    const text = await r.text();
    // 42703 = undefined column → migration 0036 not applied yet.
    const missingColumn = text.includes('42703') || text.includes('does not exist');
    return NextResponse.json(
      {
        ok: false,
        error: missingColumn
          ? 'migration 0036 not applied — onboarding columns missing'
          : text || `HTTP ${r.status}`,
      },
      { status: missingColumn ? 503 : 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
