/**
 * GET /api/partner/me
 *
 * Wave 44 — returns the logged-in affiliate's user row + affiliate_network row
 * (if any). Used by the /partner portal guard to verify `app_role`.
 *
 * Auth: requires `Authorization: Bearer <supabase_access_token>` from the
 * browser session. RLS scopes the response — non-affiliates see no
 * affiliate_network row, non-partners see no portal access.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { sbUser, extractBearer } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface UserRow {
  id: string;
  email: string | null;
  app_role: string;
}

interface NetworkRow {
  user_id: string;
  affiliate_code: string;
  path: string;
  depth: number;
  tier: string;
  status: string;
  parent_user_id: string | null;
  created_at: string;
  payout_method: string | null;
  payout_details: Record<string, unknown> | null;
}

export async function GET(req: NextRequest) {
  const jwt = extractBearer(req.headers);
  if (!jwt) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const [userR, netR] = await Promise.all([
    sbUser<UserRow[]>('users?select=id,email,app_role&limit=1', jwt),
    sbUser<NetworkRow[]>(
      'affiliate_network?select=user_id,affiliate_code,path,depth,tier,status,parent_user_id,created_at,payout_method,payout_details&limit=1',
      jwt,
    ),
  ]);

  const u = userR.ok && userR.body && userR.body.length > 0 ? userR.body[0] : null;
  if (!u) {
    return NextResponse.json(
      { ok: false, error: userR.error ?? 'user lookup failed', status: userR.status },
      { status: userR.status === 503 ? 503 : 401 },
    );
  }

  const aff = netR.ok && netR.body && netR.body.length > 0 ? netR.body[0] : null;

  return NextResponse.json({
    ok: true,
    me: {
      user_id: u.id,
      email: u.email,
      app_role: u.app_role,
      affiliate: aff,
    },
  });
}
