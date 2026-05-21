/** Admin proxy: POST /api/admin/affiliates/[id]/approve-payout */
import { NextRequest, NextResponse } from 'next/server';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!TOKEN) {
    return NextResponse.json({ ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured' }, { status: 503 });
  }
  const body = await req.text();
  try {
    const r = await fetch(`${GATEWAY}/admin/affiliates/${encodeURIComponent(id)}/approve-payout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': TOKEN },
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
