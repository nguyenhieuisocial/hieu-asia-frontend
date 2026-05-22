/**
 * Wave 41 Track D — Facebook CAPI mirror.
 *
 * Browser fires `Lead` / `Purchase` to FB Pixel client-side; we forward the
 * same event to the Worker which sends it to the FB Conversions API with
 * the hashed user identifiers for ITP / iOS 14+ dedup.
 *
 * Worker endpoint: POST /event/fb-capi (gated by service token).
 *
 * Fire-and-forget — never blocks UI.
 */

import { NextResponse, type NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const HIEU_API_URL = process.env.HIEU_API_URL ?? "https://api.hieu.asia";
const HIEU_API_SERVICE_TOKEN = process.env.HIEU_API_SERVICE_TOKEN;

export async function POST(req: NextRequest) {
  if (!HIEU_API_SERVICE_TOKEN) {
    return new NextResponse(null, { status: 204 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  try {
    const res = await fetch(`${HIEU_API_URL}/event/fb-capi`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Service-Token": HIEU_API_SERVICE_TOKEN,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    return new NextResponse(await res.text(), {
      status: res.status,
      headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message ?? "upstream_error" },
      { status: 502 },
    );
  }
}
