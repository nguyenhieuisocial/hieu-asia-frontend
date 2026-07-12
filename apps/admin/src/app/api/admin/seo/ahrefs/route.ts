/**
 * GET /api/admin/seo/ahrefs
 *
 * Ahrefs Site Explorer snapshot (Domain Rating + backlinks + organic
 * keywords/traffic) for the configured target, read server-side so the
 * AHREFS_API_KEY never reaches the client. Admin-auth gated (mirrors the
 * sibling /api/admin/users/[id]/journey route).
 *
 * Soft envelope — always HTTP 200 on success. When the key is unset
 * (`configured:false`) or Ahrefs is unreachable (`overview:null`), the panel
 * degrades to a setup / retry card rather than surfacing an error. Auth
 * failures pass through the requireAdminSession envelope (401/403) unchanged.
 */
import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';
import { fetchAhrefsOverview, isAhrefsConfigured } from '@/lib/ahrefs-api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireAdminSession('admin', { read: true });
  if ('error' in auth) return auth.error;

  const overview = await fetchAhrefsOverview();
  return NextResponse.json({
    ok: true,
    configured: isAhrefsConfigured(),
    overview: overview ?? null,
  });
}
