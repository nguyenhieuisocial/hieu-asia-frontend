import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

type Ctx = { params: Promise<{ vendor: string }> };

async function proxy(req: NextRequest, ctx: Ctx, method: 'POST' | 'DELETE') {
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const { vendor } = await ctx.params;
  if (!['anthropic', 'openai', 'google'].includes(vendor)) {
    return NextResponse.json({ ok: false, error: 'unknown vendor' }, { status: 400 });
  }
  const body = method === 'POST' ? await req.text() : undefined;
  try {
    const r = await fetch(`${GATEWAY}/ai/keys/${vendor}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': TOKEN,
      },
      body,
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: `gateway unreachable: ${(err as Error).message}` },
      { status: 502 },
    );
  }
}

export const POST = (req: NextRequest, ctx: Ctx) => proxy(req, ctx, 'POST');
export const DELETE = (req: NextRequest, ctx: Ctx) => proxy(req, ctx, 'DELETE');
