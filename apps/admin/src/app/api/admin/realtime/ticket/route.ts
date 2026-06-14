/**
 * Mint a short-lived HMAC ticket for the AdminRealtime WebSocket.
 *
 * Security (BUG #3): the master admin token must NEVER travel in the WS URL
 * query string (Cloudflare/proxies log query strings, browsers keep them in
 * history). Instead the client fetches this server-only endpoint, which signs
 * a `${email}:${expires_at}` ticket using the master admin token as the HMAC
 * KEY. The token itself is never sent — only the ticket. The DO holds the same
 * token and recomputes the HMAC to verify.
 */

import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';
import { signRealtimeTicket } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export async function GET() {
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }

  const expires_at = Date.now() + 60_000;
  const ticket = await signRealtimeTicket(TOKEN, auth.session.email, expires_at);

  return NextResponse.json({
    ok: true,
    ticket,
    admin_email: auth.session.email,
    expires_at,
  });
}
