/**
 * GET /api/admin/affiliates/promoters
 *
 * Wave 43.2 — lists hieu_asia.affiliate_network joined with subtree stats and
 * user email. Returns up to 500 rows.
 */

import { NextResponse } from 'next/server';
import { sbServer } from '@/lib/supabase-server';
import { requireAdminSession } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface NetworkRow {
  user_id: string;
  parent_user_id: string | null;
  affiliate_code: string;
  path: string | null;
  depth: number;
  tier: string;
  status: string;
  created_at: string;
}

interface SubtreeRow {
  root_user_id: string;
  affiliate_code: string;
  l1_count: number;
  l2_count: number;
  l3_count: number;
  total_subtree: number;
}

interface UserRow {
  id: string;
  email: string | null;
}

export async function GET() {
  // Wave 60.28 — RULE AUTH-1 defense-in-depth (vault 94).
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;

  const [netR, subR] = await Promise.all([
    sbServer<NetworkRow[]>('affiliate_network?select=*&order=created_at.desc&limit=500'),
    sbServer<SubtreeRow[]>('affiliate_subtree_stats?select=*'),
  ]);

  if (!netR.ok) {
    return NextResponse.json(
      { ok: false, error: netR.error ?? 'Supabase error' },
      { status: netR.status === 503 ? 503 : 502 },
    );
  }

  const networkRows: NetworkRow[] = netR.body ?? [];
  const subtreeRows: SubtreeRow[] = subR.body ?? [];
  const subBy = new Map(subtreeRows.map((r) => [r.root_user_id, r]));

  const ids = networkRows.map((r) => r.user_id);
  let emailById = new Map<string, string>();
  if (ids.length > 0) {
    const idsCsv = ids.map(encodeURIComponent).join(',');
    const usrR = await sbServer<UserRow[]>(
      `users?select=id,email&id=in.(${idsCsv})&limit=1000`,
    );
    if (usrR.ok && usrR.body) {
      emailById = new Map(
        usrR.body
          .filter((u): u is { id: string; email: string } => !!u.email)
          .map((u) => [u.id, u.email]),
      );
    }
  }

  const rows = networkRows.map((r) => {
    const sub = subBy.get(r.user_id);
    return {
      user_id: r.user_id,
      parent_user_id: r.parent_user_id,
      affiliate_code: r.affiliate_code,
      email: emailById.get(r.user_id) ?? null,
      depth: r.depth,
      tier: r.tier,
      status: r.status,
      l1_count: sub?.l1_count ?? 0,
      l2_count: sub?.l2_count ?? 0,
      l3_count: sub?.l3_count ?? 0,
      total_subtree: sub?.total_subtree ?? 0,
      created_at: r.created_at,
    };
  });

  return NextResponse.json({ ok: true, promoters: rows });
}
