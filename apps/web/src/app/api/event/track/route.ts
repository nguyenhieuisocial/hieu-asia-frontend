/**
 * Wave 41 Track F — High-value event proxy.
 *
 * Forwards browser-fired high-value events (payment, signup, mentor message)
 * to the Worker `/event/track` endpoint which enriches with CF geo, UA parse,
 * login state, tier/persona, then pushes to PostHog server-side.
 *
 * Fire-and-forget — never blocks the UI.
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
    const res = await fetch(`${HIEU_API_URL}/event/track`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Service-Token": HIEU_API_SERVICE_TOKEN,
        // Forward IP/UA so the worker can enrich correctly.
        "x-forwarded-for": req.headers.get("x-forwarded-for") ?? "",
        "user-agent": req.headers.get("user-agent") ?? "",
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
