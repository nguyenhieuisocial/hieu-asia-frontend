/**
 * Admin proxy to Worker `GET /admin/prompts/:role/history`.
 * Returns past versions of a role prompt (newest first) for the revert UI.
 * Read-only → viewer+.
 */
import { type NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

type Ctx = { params: Promise<{ role: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const auth = await requireAdminSession('viewer');
  if ('error' in auth) return auth.error;
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const { role } = await ctx.params;
  try {
    const r = await fetch(
      `${GATEWAY}/admin/prompts/${encodeURIComponent(role)}/history`,
      {
        method: 'GET',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Token': TOKEN },
      },
    );
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: `gateway unreachable: ${(err as Error).message}` },
      { status: 502 },
    );
  }
}
