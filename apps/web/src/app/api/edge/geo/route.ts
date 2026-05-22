/**
 * Wave 41 — edge geo lookup.
 *
 * Returns the visitor's country from Vercel's edge geo headers. Used by the
 * CMP banner to decide whether to show (VN + EU) or auto-accept legitimate
 * interest defaults (rest of world).
 *
 * Cached for 1 hour at the edge — country doesn't change per visitor in a
 * single session and CF/Vercel geo lookups are stable.
 */

import { NextResponse, type NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Vercel Edge runtime: `request.geo` is populated automatically.
  // Fallback to CF-IPCountry / X-Vercel-IP-Country headers when missing.
  const geoRequest = req as NextRequest & {
    geo?: { country?: string; city?: string; region?: string };
  };
  const country =
    geoRequest.geo?.country ??
    req.headers.get("x-vercel-ip-country") ??
    req.headers.get("cf-ipcountry") ??
    "";
  const city =
    geoRequest.geo?.city ??
    req.headers.get("x-vercel-ip-city") ??
    "";
  const region =
    geoRequest.geo?.region ??
    req.headers.get("x-vercel-ip-country-region") ??
    "";

  return NextResponse.json(
    { country, city, region },
    { headers: { "cache-control": "public, max-age=3600" } },
  );
}
