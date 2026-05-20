import { NextResponse } from 'next/server';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';

// Public read-only — surfaces only boolean status of which providers are configured.
// Safe to expose because cookie-gated middleware already required admin login.
export async function GET() {
  try {
    const r = await fetch(`${GATEWAY}/ai/providers`, { cache: 'no-store' });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: `gateway unreachable: ${(err as Error).message}` },
      { status: 502 },
    );
  }
}
