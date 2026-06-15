/**
 * GET /api/admin/me — returns the calling admin's profile (read from the
 * HMAC-signed cookie, no gateway round-trip needed).
 *
 * Wave 60.81.D vault 107 §5.7. last_login_at + display_name come from the
 * gateway when configured; falls back to cookie-only data otherwise.
 */

import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export async function GET() {
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;

  // Always include the cookie-derived data; gateway extends it if reachable.
  const base = {
    email: auth.session.email,
    role: auth.session.role,
    display_name: null as string | null,
    last_login_at: null as string | null,
  };

  if (!TOKEN) {
    return NextResponse.json({ ok: true, profile: base });
  }

  try {
    const r = await fetch(
      `${GATEWAY}/admin/me?email=${encodeURIComponent(auth.session.email)}`,
      { cache: 'no-store', headers: { 'X-Admin-Token': TOKEN } },
    );
    if (!r.ok) {
      // Gateway reachable but errored → cookie-only data, flag as degraded so
      // the UI can note that last_login / display_name are temporarily missing.
      return NextResponse.json({ ok: true, degraded: true, profile: base });
    }
    const text = await r.text();
    try {
      const data = JSON.parse(text) as {
        profile?: { display_name?: string; last_login_at?: string };
      };
      return NextResponse.json({
        ok: true,
        profile: {
          ...base,
          display_name: data.profile?.display_name ?? null,
          last_login_at: data.profile?.last_login_at ?? null,
        },
      });
    } catch {
      // Non-JSON gateway response → degraded.
      return NextResponse.json({ ok: true, degraded: true, profile: base });
    }
  } catch {
    // Gateway down → degrade gracefully.
    return NextResponse.json({ ok: true, degraded: true, profile: base });
  }
}
