/**
 * Shared admin → Worker gateway proxy.
 *
 * Consolidates the fetch boilerplate that ~57 `/api/admin/*` route handlers
 * each re-implemented slightly differently (timeout present or not, non-JSON
 * guard present in only ~21/56, inconsistent 502/503/504 codes). This helper
 * does ONLY the gateway call + error normalization:
 *   - 8s AbortController timeout            → 504 on timeout
 *   - non-JSON guard (Cloudflare HTML etc.) → 502 (or upstream 5xx passthrough)
 *   - missing server token                  → 503
 *   - gateway unreachable                   → 502
 * and forwards the query string + body, injecting the shared X-Admin-Token.
 *
 * SECURITY: this helper performs NO authentication or role checks. Callers MUST
 * gate the request themselves (e.g. `requireAdminSession(minRole)`) BEFORE
 * calling it, exactly as they do today — migrating a route to this helper must
 * not change its existing auth/role line.
 */
import { NextResponse } from 'next/server';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export interface ProxyOptions {
  /** Worker path WITHOUT leading slash, e.g. "admin/customers". */
  path: string;
  /** Verified admin email → forwarded as X-Admin-Email audit header. */
  adminEmail?: string;
  /** Override the forwarded method (default: the incoming request method). */
  method?: string;
  /** Fetch timeout in ms (default 8000). */
  timeoutMs?: number;
}

/** Forward an already-authenticated admin request to the Worker gateway. */
export async function proxyToGateway(
  req: Request,
  opts: ProxyOptions,
): Promise<NextResponse> {
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }

  const method = (opts.method ?? req.method ?? 'GET').toUpperCase();
  const url = new URL(req.url);
  const target = `${GATEWAY}/${opts.path}${url.search}`;
  const body =
    method === 'GET' || method === 'DELETE' ? undefined : await req.text();

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), opts.timeoutMs ?? 8000);
  try {
    const r = await fetch(target, {
      method,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': TOKEN,
        ...(opts.adminEmail ? { 'X-Admin-Email': opts.adminEmail } : {}),
      },
      body,
      signal: ac.signal,
    });
    clearTimeout(timer);

    // Guard against non-JSON (Cloudflare HTML error pages, empty 5xx bodies) so
    // the page never hits the "Invalid JSON" fallback path.
    const text = await r.text();
    try {
      return NextResponse.json(text ? JSON.parse(text) : {}, { status: r.status });
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: `gateway returned non-JSON (status ${r.status})`,
          body: text.slice(0, 500),
        },
        { status: r.status >= 500 ? r.status : 502 },
      );
    }
  } catch (err) {
    clearTimeout(timer);
    const msg = (err as Error).message;
    const isAbort = msg.toLowerCase().includes('abort');
    return NextResponse.json(
      {
        ok: false,
        error: isAbort
          ? `gateway timeout: exceeded ${opts.timeoutMs ?? 8000}ms`
          : `gateway unreachable: ${msg}`,
        gateway: GATEWAY,
      },
      { status: isAbort ? 504 : 502 },
    );
  }
}
