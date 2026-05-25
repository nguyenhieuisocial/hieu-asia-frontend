/**
 * GET /api/admin/affiliates/activity
 *
 * Wave 43.2 — last 10 affiliate-related audit_log rows for the dashboard feed.
 */

import { NextResponse } from 'next/server';
import { sbServer } from '@/lib/supabase-server';
import { requireAdminSession } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface AuditRow {
  id: number;
  timestamp: string;
  user_id: string | null;
  action: string;
  resource_id: string | null;
  audit_metadata: Record<string, unknown>;
  actor_type: string | null;
}

export async function GET() {
  // Wave 60.28 — RULE AUTH-1 defense-in-depth (vault 94).
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;

  const r = await sbServer<AuditRow[]>(
    'audit_log?select=*&action=like.affiliate*&order=timestamp.desc&limit=10',
  );
  if (!r.ok) {
    return NextResponse.json(
      { ok: false, error: r.error ?? 'Supabase error', activity: [] },
      { status: r.status === 503 ? 503 : 502 },
    );
  }
  return NextResponse.json({ ok: true, activity: r.body ?? [] });
}
