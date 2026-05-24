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
import { extractBearer } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Gender = 'M' | 'F' | 'NB';

interface ConsentFlags {
  sms_anniversary: boolean;
  zalo_optin: boolean;
  email_tips: boolean;
  meta_retargeting: boolean;
  google_retargeting: boolean;
  zalo_oa_broadcast: boolean;
}

interface WizardPayload {
  full_name: string;
  gender: Gender;
  birth_year: number;
  birth_month: number;
  birth_day: number;
  birth_hour: number | null;
  phone: string | null;
  consent_flags: ConsentFlags;
}

const VALID_GENDERS: ReadonlySet<Gender> = new Set<Gender>(['M', 'F', 'NB']);

function asBool(v: unknown): boolean {
  return v === true;
}

function validate(raw: unknown): { ok: true; data: WizardPayload } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'invalid_body' };
  const r = raw as Record<string, unknown>;

  const full_name = typeof r.full_name === 'string' ? r.full_name.trim() : '';
  if (full_name.length < 1 || full_name.length > 120) {
    return { ok: false, error: 'full_name must be 1-120 chars' };
  }

  const gender = r.gender as Gender;
  if (!VALID_GENDERS.has(gender)) {
    return { ok: false, error: 'gender must be M | F | NB' };
  }

  const birth_year = Number(r.birth_year);
  if (!Number.isInteger(birth_year) || birth_year < 1900 || birth_year > 2100) {
    return { ok: false, error: 'birth_year must be 1900-2100' };
  }
  const birth_month = Number(r.birth_month);
  if (!Number.isInteger(birth_month) || birth_month < 1 || birth_month > 12) {
    return { ok: false, error: 'birth_month must be 1-12' };
  }
  const birth_day = Number(r.birth_day);
  if (!Number.isInteger(birth_day) || birth_day < 1 || birth_day > 31) {
    return { ok: false, error: 'birth_day must be 1-31' };
  }

  let birth_hour: number | null = null;
  if (r.birth_hour !== null && r.birth_hour !== undefined) {
    const h = Number(r.birth_hour);
    if (!Number.isInteger(h) || h < 0 || h > 23) {
      return { ok: false, error: 'birth_hour must be 0-23 or null' };
    }
    birth_hour = h;
  }

  let phone: string | null = null;
  if (typeof r.phone === 'string') {
    const trimmed = r.phone.trim();
    if (trimmed.length > 0) {
      // Vietnam: +84 followed by 9 digits, OR 0 followed by 9 digits.
      if (!/^(\+84|0)\d{9}$/.test(trimmed)) {
        return { ok: false, error: 'phone must be Vietnam format (+84XXXXXXXXX or 0XXXXXXXXX)' };
      }
      phone = trimmed;
    }
  }

  const cf = (r.consent_flags ?? {}) as Record<string, unknown>;
  const consent_flags: ConsentFlags = {
    sms_anniversary: asBool(cf.sms_anniversary),
    zalo_optin: asBool(cf.zalo_optin),
    email_tips: asBool(cf.email_tips),
    meta_retargeting: asBool(cf.meta_retargeting),
    google_retargeting: asBool(cf.google_retargeting),
    zalo_oa_broadcast: asBool(cf.zalo_oa_broadcast),
  };

  return {
    ok: true,
    data: {
      full_name,
      gender,
      birth_year,
      birth_month,
      birth_day,
      birth_hour,
      phone,
      consent_flags,
    },
  };
}

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
  const result = validate(raw);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
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
