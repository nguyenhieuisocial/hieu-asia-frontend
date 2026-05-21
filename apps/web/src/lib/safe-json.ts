/**
 * Safe JSON fetch helpers — defend against the
 * `Unexpected token '<', "<!DOCTYPE "... is not valid JSON` class of bug.
 *
 * The bug pattern: a fetch() call hits an endpoint that returns HTML
 * (a Next.js / Vercel 404 page, a Cloudflare error page, an auth redirect)
 * but the caller does `await res.json()` unconditionally. The JSON parser
 * sees `<!DOCTYPE …` and throws SyntaxError mid-render.
 *
 * Use `safeJson(res)` to get a JSON envelope or a structured failure that
 * encodes the HTTP status + content-type + a short body excerpt, so callers
 * can branch cleanly without throwing.
 */

export type SafeJsonResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; contentType: string; bodyExcerpt: string; data: null };

/**
 * Read a Response as JSON only when the content-type advertises JSON.
 * For everything else (HTML 404 / 502 / redirect, opaque), return a
 * structured failure that includes a small excerpt for debugging.
 */
export async function safeJson<T = unknown>(res: Response): Promise<SafeJsonResult<T>> {
  const contentType = res.headers.get('content-type') ?? '';
  const isJson = /\bjson\b/i.test(contentType);
  if (!isJson) {
    // Read first 500 chars for debug. Never feed to JSON.parse.
    let bodyExcerpt = '';
    try {
      const text = await res.text();
      bodyExcerpt = text.slice(0, 500);
    } catch {
      bodyExcerpt = '<unreadable body>';
    }
    return { ok: false, status: res.status, contentType, bodyExcerpt, data: null };
  }
  try {
    const data = (await res.json()) as T;
    return { ok: true, status: res.status, data };
  } catch (e) {
    return {
      ok: false,
      status: res.status,
      contentType,
      bodyExcerpt: e instanceof Error ? e.message : 'json_parse_failed',
      data: null,
    };
  }
}

/**
 * Convenience: fetch + safeJson in one call. The HTTP error path
 * (4xx/5xx) still returns through safeJson — caller decides what to do.
 * Network errors throw as usual.
 */
export async function fetchJson<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<SafeJsonResult<T>> {
  const res = await fetch(input, init);
  return safeJson<T>(res);
}
