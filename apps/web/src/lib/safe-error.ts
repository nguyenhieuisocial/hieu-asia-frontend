/**
 * Server-side error sanitiser for Next.js route handlers under
 * `apps/web/src/app/api/`.
 *
 * Problem: proxy routes used to answer `detail: err.message`. A raw fetch/SDK
 * error message leaks internal hostnames (`api.hieu.asia`, Supabase project
 * refs), internal network failures (`ECONNREFUSED 10.x.x.x`) and third-party
 * vendor wording straight to the browser.
 *
 * Fix: log the full error server-side (Vercel logs keep the diagnostics) and
 * hand the client one generic Vietnamese sentence. HTTP status codes and JSON
 * field names stay exactly as they were, so existing callers keep working.
 *
 * NOT for client components — the browser-side counterpart is
 * `describeApiError()` in `./api-error`.
 */

/** Single generic sentence shown to end users in place of internal details. */
export const GENERIC_ERROR_DETAIL =
  'Không kết nối được máy chủ, vui lòng thử lại sau ít phút.';

/**
 * Log `err` in full under `[scope]`, return the generic client-facing message.
 *
 * @param scope short route tag used as the log prefix, e.g. `payment/intent`
 */
export function safeErrorDetail(scope: string, err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[${scope}] ${message}`, err);
  return GENERIC_ERROR_DETAIL;
}
