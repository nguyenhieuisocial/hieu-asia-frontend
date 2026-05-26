/**
 * DELETE /api/admin/api-keys/[id] — revoke API key.
 *
 * Wave 60.81.D vault 107 §5.7. Proxies to gateway which hashes-out the
 * key + writes audit_log row.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  // Privilege-revoke — restrict to admin+.
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const { id } = await ctx.params;
  try {
    const r = await fetch(
      `${GATEWAY}/admin/api-keys/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
        cache: 'no-store',
        headers: { 'X-Admin-Token': TOKEN },
      },
    );
    const text = await r.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: r.status });
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: `gateway returned non-JSON (status ${r.status})`,
          body: text.slice(0, 500),
        },
        { status: r.status >= 500 ? r.status : 502 },
      );
    }
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: `gateway unreachable: ${(err as Error).message}` },
      { status: 502 },
    );
  }
}
