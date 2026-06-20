/**
 * Shared client-side pacing for tuvi-v2 casts ("Bằng Chứng").
 *
 * The Tử Vi worker caps requests at ≤5 / 10s (Cloudflare rule, error 1015).
 * `backtestChart` AND `forecastTimeline` each cast multiple times, and a forecast
 * fired right after a backtest used to burst past the cap — the forecast's first
 * cast had NO gap from the backtest's last, and each function's own 2.1s spacing
 * left zero headroom (5 casts in ~8.4s sits right on the limit). Result: clicking
 * "xem 5 năm tới" straight after a backtest reliably hit 1015 → "Chưa xem được".
 *
 * Routing BOTH functions through this one module-level gate enforces a ≥CAST_GAP_MS
 * gap between ANY two casts across the whole page (not just within one call), which
 * keeps the combined rate at ≤4 casts / 10s — one under the worker cap, regardless
 * of how soon the forecast follows the backtest.
 */

/** Minimum gap between consecutive casts. ≥2.6s ⇒ ≤4 casts in any rolling 10s. */
export const CAST_GAP_MS = 2600;

/** Pure: how long to wait before the next cast given the clock + last cast time. */
export function castDelayMs(now: number, lastCastAt: number): number {
  return Math.max(0, CAST_GAP_MS - (now - lastCastAt));
}

let lastCastAt = 0;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Resolve once it is safe to start the next cast under the shared budget, then
 * reserve this slot. Call immediately BEFORE every castTuViHoroscope call.
 * `now` is injectable for tests.
 */
export async function awaitCastSlot(now: () => number = Date.now): Promise<void> {
  const delay = castDelayMs(now(), lastCastAt);
  if (delay > 0) await sleep(delay);
  lastCastAt = now();
}
