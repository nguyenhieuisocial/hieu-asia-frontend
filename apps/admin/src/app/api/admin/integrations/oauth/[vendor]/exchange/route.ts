import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

type Ctx = { params: Promise<{ vendor: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  // Binding AI-provider OAuth credentials is a privileged mutation → admin+ (a
  // viewer must not initiate/complete provider credential exchange). Worker is
  // role-blind, so enforce here.
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured' },
      { status: 503 },
    );
  }
  const { vendor } = await ctx.params;
  const body = await req.text();
  try {
    const r = await fetch(`${GATEWAY}/oauth/${vendor}/exchange`, {
      method: 'POST',
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
