/**
 * Admin proxy to Worker `GET|PUT /admin/prompts/:role` and `POST /admin/prompts/:role/reset`.
 *
 * - GET → fetch single role prompt
 * - PUT body `{ system: string }` → upsert override
 * - POST (with `?reset=1`) → reset to default
 */
import { type NextRequest, NextResponse } from 'next/server';
import { requireAdminSession, type AdminSession } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

type Ctx = { params: Promise<{ role: string }> };

async function forward(
  req: NextRequest,
  ctx: Ctx,
  method: 'GET' | 'PUT' | 'POST',
  pathSuffix = '',
) {
  // Wave 60.62.T1.4 — defense-in-depth verifySession backfill.
  // GET = read (viewer+), PUT/POST = prompt mutation (admin+).
  const minRole: AdminSession['role'] = method === 'GET' ? 'viewer' : 'admin';
  const auth = await requireAdminSession(minRole);
  if ('error' in auth) return auth.error;
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const { role } = await ctx.params;
  const body = method === 'PUT' ? await req.text() : undefined;
  try {
    const r = await fetch(
      `${GATEWAY}/admin/prompts/${encodeURIComponent(role)}${pathSuffix}`,
      {
        method,
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': TOKEN,
        },
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

export const GET = (req: NextRequest, ctx: Ctx) => forward(req, ctx, 'GET');
export const PUT = (req: NextRequest, ctx: Ctx) => forward(req, ctx, 'PUT');

/**
 * `POST /api/admin/prompts/:role` → reset to default
 * (Forwards to Worker `POST /admin/prompts/:role/reset`.)
 */
export const POST = (req: NextRequest, ctx: Ctx) => forward(req, ctx, 'POST', '/reset');
