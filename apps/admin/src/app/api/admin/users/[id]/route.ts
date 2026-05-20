import { NextRequest, NextResponse } from 'next/server';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

type Ctx = { params: Promise<{ id: string }> };

async function proxy(req: NextRequest, ctx: Ctx, method: 'PATCH' | 'DELETE') {
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const { id } = await ctx.params;
  const body = method === 'PATCH' ? await req.text() : undefined;
  try {
    const r = await fetch(`${GATEWAY}/admin/users/${encodeURIComponent(id)}`, {
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

export const PATCH = (req: NextRequest, ctx: Ctx) => proxy(req, ctx, 'PATCH');
export const DELETE = (req: NextRequest, ctx: Ctx) => proxy(req, ctx, 'DELETE');
