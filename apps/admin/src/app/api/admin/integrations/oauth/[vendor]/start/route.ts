import { NextRequest, NextResponse } from 'next/server';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

type Ctx = { params: Promise<{ vendor: string }> };

export async function POST(_req: NextRequest, ctx: Ctx) {
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured' },
      { status: 503 },
    );
  }
  const { vendor } = await ctx.params;
  try {
    const r = await fetch(`${GATEWAY}/oauth/${vendor}/start`, {
      method: 'POST',
      headers: { 'X-Admin-Token': TOKEN },
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
