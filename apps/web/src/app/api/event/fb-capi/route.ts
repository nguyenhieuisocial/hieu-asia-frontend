/**
 * Wave 41 Track D — Facebook CAPI mirror (+ Wave 41.3/41.5 hardening).
 *
 * Browser fires `Lead` / `Purchase` to FB Pixel client-side; we forward the
 * same event to the Worker which sends it to the FB Conversions API with
 * the hashed user identifiers for ITP / iOS 14+ dedup.
 *
 * Worker endpoint: POST /event/fb-capi (gated by service token).
 *
 * Fire-and-forget — never blocks UI. Always returns 204 except on payload
 * parse error (400) or consent check fail (204 silent).
 *
 * Wave 41.3 — defense-in-depth: the client's `mirrorToCAPI()` already
 * checks `hasMarketingConsent()` before fetching, but a malicious or
 * mistaken same-origin caller could bypass that. We verify the
 * `hieu_consent_marketing` cookie here and 204 silently if not `true`.
 *
 * Wave 41.5 — return 204 on upstream failure (not 502) so Sentry +
 * Vercel logs don't fill up on transient FB outages.
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

  // Wave 41.3 — defense-in-depth: cookie-gate before forwarding PII.
  const marketingConsent = req.cookies.get("hieu_consent_marketing")?.value;
  if (marketingConsent !== "true") {
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
        // Mirror cookie value so the Worker can also enforce consent.
        "X-Hieu-Marketing-Consent": marketingConsent,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    return new NextResponse(await res.text(), {
      status: res.status,
      headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    // Wave 41.5 — fire-and-forget never reports failures upstream.
    return new NextResponse(null, { status: 204 });
  }
}
