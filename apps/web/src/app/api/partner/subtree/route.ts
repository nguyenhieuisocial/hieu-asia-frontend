/**
 * GET /api/partner/subtree
 *
 * Wave 44 — lists descendants of the logged-in affiliate. RLS policy
 * `affiliate_self_or_descendants_read` (migration 0017) ensures the response
 * is naturally scoped to the user's subtree via ltree `path <@ self.path`.
 *
 * Returns rows minus the user's own row. Joins owner email via a follow-up
 * query (RLS on hieu_asia.users is permissive for authenticated reads of
 * id/email — see migration 0012 auth_user_sync grants).
 */

import { NextResponse, type NextRequest } from 'next/server';
import { sbUser, extractBearer } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface NetworkRow {
  user_id: string;
  parent_user_id: string | null;
  affiliate_code: string;
  depth: number;
  tier: string;
  status: string;
  created_at: string;
  path: string;
}

export async function GET(req: NextRequest) {
  const jwt = extractBearer(req.headers);
  if (!jwt) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const depthFilter = url.searchParams.get('depth');
  const statusFilter = url.searchParams.get('status');

  let q =
    'affiliate_network?select=user_id,parent_user_id,affiliate_code,depth,tier,status,created_at,path&order=depth.asc,created_at.desc&limit=500';
  if (depthFilter && /^\d+$/.test(depthFilter)) {
    q += `&depth=eq.${depthFilter}`;
  }
  if (statusFilter && /^[a-z_]+$/.test(statusFilter)) {
    q += `&status=eq.${statusFilter}`;
  }

  const r = await sbUser<NetworkRow[]>(q, jwt);
  if (!r.ok) {
    return NextResponse.json(
      { ok: false, error: r.error ?? 'lookup failed' },
      { status: r.status === 503 ? 503 : 502 },
    );
  }
  const rows = r.body ?? [];

  // Find self row (depth-relative-to-self filter happens client-side via path).
  // For the table we exclude the user's own row by looking up who has the
  // shortest path among the returned set — that's the requesting user (self
  // is included by RLS).
  let selfPath: string | null = null;
  for (const row of rows) {
    if (selfPath === null || row.path.length < selfPath.length) {
      selfPath = row.path;
    }
  }
  const descendants = rows.filter((r) => r.path !== selfPath);

  // Owner email lookup (best-effort).
  const ids = descendants.map((r) => r.user_id);
  const emailById = new Map<string, string>();
  if (ids.length > 0) {
    const idsCsv = ids.map(encodeURIComponent).join(',');
    const usrR = await sbUser<Array<{ id: string; email: string | null }>>(
      `users?select=id,email&id=in.(${idsCsv})&limit=1000`,
      jwt,
    );
    if (usrR.ok && usrR.body) {
      for (const u of usrR.body) {
        if (u.email) emailById.set(u.id, u.email);
      }
    }
  }

  // Mask emails (privacy in subtree view — show first 2 chars + domain).
  function maskEmail(e: string | undefined): string | null {
    if (!e) return null;
    const at = e.indexOf('@');
    if (at < 0) return e.slice(0, 2) + '***';
    const local = e.slice(0, at);
    const domain = e.slice(at);
    return local.slice(0, 2) + '***' + domain;
  }

  const out = descendants.map((r) => {
    const depthRelative =
      selfPath !== null && r.path.startsWith(selfPath + '.')
        ? r.path.slice(selfPath.length + 1).split('.').length
        : r.depth;
    return {
      user_id: r.user_id,
      parent_user_id: r.parent_user_id,
      affiliate_code: r.affiliate_code,
      email_masked: maskEmail(emailById.get(r.user_id) ?? undefined),
      depth: r.depth,
      depth_relative: depthRelative,
      tier: r.tier,
      status: r.status,
      created_at: r.created_at,
    };
  });

  return NextResponse.json({
    ok: true,
    descendants: out,
    total: out.length,
  });
}
