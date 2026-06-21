/**
 * Admin proxy to Worker `POST /admin/prompts/:role/revert`.
 * Restores a previous prompt version (body `{ at }` = the snapshot's updated_at).
 * Mutation → admin+.
 */
import { type NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

type Ctx = { params: Promise<{ role: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const { role } = await ctx.params;
  const body = await req.text();
  try {
    const r = await fetch(
      `${GATEWAY}/admin/prompts/${encodeURIComponent(role)}/revert`,
      {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Token': TOKEN },
        body,
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
