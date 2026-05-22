/**
 * Wave 41 Track D — Marketing pixels (CONSENT-GATED).
 *
 * Wraps Facebook Pixel + CAPI, Google Ads conversion tag, and TikTok Pixel.
 * No SDK is loaded — no <script> tag injected, no `window.fbq()` defined —
 * until `localStorage["hieu.consent.marketing"] === "true"`.
 *
 * Lifecycle helpers:
 *   - loadMarketingPixels()   — inject script tags + queue any pending events
 *   - unloadMarketingPixels() — remove scripts, delete window globals, drop
 *                               pixel cookies (`_fbp`, `_gcl_*`, `_ttp`)
 *   - hasMarketingConsent()   — single source of truth for any caller
 *   - fire helpers (track*) — no-op when consent is off
 *
 * Server-side CAPI dedup: events are mirrored to the Worker `/event/fb-capi`
 * endpoint so iOS 14+ / ITP browsers still report conversions to Meta.
 *
 * Env vars (leave empty until user provides real IDs):
 *   NEXT_PUBLIC_FB_PIXEL_ID
 *   NEXT_PUBLIC_GOOGLE_ADS_ID
 *   NEXT_PUBLIC_TIKTOK_PIXEL_ID
 */

const CONSENT_KEY = "hieu.consent.marketing";

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID ?? "";
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "";
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? "";

let _loaded = false;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    ttq?: {
      load?: (id: string) => void;
      page?: () => void;
      track?: (event: string, params?: Record<string, unknown>) => void;
      identify?: (params: Record<string, unknown>) => void;
      [k: string]: unknown;
    };
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function hasMarketingConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "true";
  } catch {
    return false;
  }
}

function injectScript(src: string, id: string, attrs?: Record<string, string>): void {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.async = true;
  s.src = src;
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
  }
  document.head.appendChild(s);
}

function removeScriptById(id: string): void {
  const el = document.getElementById(id);
  if (el && el.parentNode) el.parentNode.removeChild(el);
}

function deleteCookieByPrefix(prefix: string): void {
  try {
    const cookies = document.cookie.split(";");
    for (const raw of cookies) {
      const name = raw.split("=")[0]?.trim();
      if (!name) continue;
      if (name === prefix || name.startsWith(prefix)) {
        // Delete on this hostname and apex (e.g. `.hieu.asia`).
        // Wave 41.7 — fix apex calc: prior `host.replace(/^[^.]+\./, ".")`
        // failed on apex visits (e.g. `hieu.asia` had nothing to strip and
        // resulted in `hieu.asia` instead of `.hieu.asia`). Take last 2
        // labels and prepend a dot.
        const host = window.location.hostname;
        const parts = host.split(".");
        const apex = parts.length >= 2 ? "." + parts.slice(-2).join(".") : `.${host}`;
        for (const dom of ["", `; Domain=${host}`, `; Domain=${apex}`]) {
          document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT${dom}`;
        }
      }
    }
  } catch {
    /* ignore */
  }
}

// ── Facebook Pixel ──────────────────────────────────────────────────────────

function loadFacebookPixel(): void {
  if (!FB_PIXEL_ID) return;
  if (window.fbq) return;

  // Inlined Meta stub from https://developers.facebook.com/docs/meta-pixel/get-started
  // — sets up the `fbq` queue before the SDK loads.
  const n = function (...args: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (n as any).callMethod
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-spread
      ? (n as any).callMethod.apply(n, args)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : (n as any).queue.push(args);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (n as any).push = n;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (n as any).loaded = true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (n as any).version = "2.0";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (n as any).queue = [];
  window.fbq = n as unknown as Window["fbq"];
  if (!window._fbq) window._fbq = n;

  injectScript("https://connect.facebook.net/en_US/fbevents.js", "hieu-fb-pixel");
  window.fbq?.("init", FB_PIXEL_ID);
  window.fbq?.("track", "PageView");
}

function unloadFacebookPixel(): void {
  removeScriptById("hieu-fb-pixel");
  try {
    delete window.fbq;
    delete window._fbq;
  } catch {
    /* ignore */
  }
  deleteCookieByPrefix("_fbp");
  deleteCookieByPrefix("_fbc");
}

// ── Google Ads ──────────────────────────────────────────────────────────────

function loadGoogleAds(): void {
  if (!GOOGLE_ADS_ID) return;
  if (window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window.gtag = function gtag(...args: unknown[]) {
    (window.dataLayer as unknown[]).push(args);
  };
  injectScript(
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GOOGLE_ADS_ID)}`,
    "hieu-google-ads",
  );
  window.gtag?.("js", new Date());
  window.gtag?.("config", GOOGLE_ADS_ID);
}

function unloadGoogleAds(): void {
  removeScriptById("hieu-google-ads");
  try {
    delete window.gtag;
    delete window.dataLayer;
  } catch {
    /* ignore */
  }
  deleteCookieByPrefix("_gcl_");
  deleteCookieByPrefix("_gac_");
  deleteCookieByPrefix("_gid");
  deleteCookieByPrefix("_ga");
}

// ── TikTok Pixel ────────────────────────────────────────────────────────────

function loadTikTokPixel(): void {
  if (!TIKTOK_PIXEL_ID) return;
  if (window.ttq && typeof window.ttq.load === "function") {
    window.ttq.load(TIKTOK_PIXEL_ID);
    return;
  }
  // Minimal TikTok ttq stub (mirrors official snippet).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.TiktokAnalyticsObject = "ttq";
  const ttq: Record<string, unknown> = (w.ttq = w.ttq || {});
  (ttq as { methods?: string[] }).methods = [
    "page",
    "track",
    "identify",
    "instances",
    "debug",
    "on",
    "off",
    "once",
    "ready",
    "alias",
    "group",
    "enableCookie",
    "disableCookie",
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (ttq as any).setAndDefer = function (t: any, e: string) {
    t[e] = function (...args: unknown[]) {
      t.push([e as unknown, ...args]);
    };
  };
  for (const m of (ttq as { methods: string[] }).methods) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ttq as any).setAndDefer(ttq, m);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (ttq as any).load = function (e: string, n?: Record<string, unknown>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ttq as any)._i = (ttq as any)._i || {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ttq as any)._i[e] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ttq as any)._i[e]._u = "https://analytics.tiktok.com/i18n/pixel/events.js";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ttq as any)._t = (ttq as any)._t || {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ttq as any)._t[e] = +new Date();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ttq as any)._o = (ttq as any)._o || {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ttq as any)._o[e] = n || {};
    const o = document.createElement("script");
    o.async = true;
    o.id = "hieu-tiktok-pixel";
    o.src = "https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=" + e + "&lib=ttq";
    document.head.appendChild(o);
  };
  (window.ttq as { load?: (id: string) => void }).load?.(TIKTOK_PIXEL_ID);
  window.ttq?.page?.();
}

function unloadTikTokPixel(): void {
  removeScriptById("hieu-tiktok-pixel");
  try {
    delete window.ttq;
  } catch {
    /* ignore */
  }
  deleteCookieByPrefix("_ttp");
}

// ── Lifecycle ───────────────────────────────────────────────────────────────

/**
 * Load all 3 marketing pixels. Must only be called from consent-flow code —
 * this function does NOT re-check `hasMarketingConsent()` because the caller
 * has already gathered explicit opt-in.
 */
export function loadMarketingPixels(): void {
  if (typeof window === "undefined") return;
  if (_loaded) return;
  if (!hasMarketingConsent()) return; // belt-and-braces
  _loaded = true;
  loadFacebookPixel();
  loadGoogleAds();
  loadTikTokPixel();
}

/**
 * Tear down all 3 pixels and best-effort delete their cookies. Called when
 * the user revokes marketing consent in the CMP banner / privacy page.
 */
export function unloadMarketingPixels(): void {
  if (typeof window === "undefined") return;
  unloadFacebookPixel();
  unloadGoogleAds();
  unloadTikTokPixel();
  _loaded = false;
}

// ── Event firing helpers (all consent-gated) ────────────────────────────────

interface ServerSideEventCtx {
  /** Hashed email (sha256 lowercase) for CAPI dedup. */
  emailHash?: string;
  /** Hashed phone (sha256 e164 → lowercase) for CAPI dedup. */
  phoneHash?: string;
  /** Idempotency key — server will use as eventID for dedup. */
  eventId?: string;
}

export function trackPixelPageView(): void {
  if (!hasMarketingConsent()) return;
  window.fbq?.("track", "PageView");
  window.ttq?.page?.();
}

export function trackPixelViewContent(params: { content_name?: string; value?: number } = {}): void {
  if (!hasMarketingConsent()) return;
  window.fbq?.("track", "ViewContent", params);
  window.ttq?.track?.("ViewContent", params);
}

export function trackPixelLead(params: { content_name?: string } = {}, ctx?: ServerSideEventCtx): void {
  if (!hasMarketingConsent()) return;
  window.fbq?.("track", "Lead", params, ctx?.eventId ? { eventID: ctx.eventId } : undefined);
  window.ttq?.track?.("CompleteRegistration", params);
  mirrorToCAPI("Lead", params, ctx);
}

export function trackPixelPurchase(
  params: { value: number; currency: string; tier?: string; transaction_id?: string },
  ctx?: ServerSideEventCtx,
): void {
  if (!hasMarketingConsent()) return;
  window.fbq?.(
    "track",
    "Purchase",
    { value: params.value, currency: params.currency },
    ctx?.eventId ? { eventID: ctx.eventId } : undefined,
  );
  if (GOOGLE_ADS_ID) {
    window.gtag?.("event", "conversion", {
      send_to: GOOGLE_ADS_ID,
      value: params.value,
      currency: params.currency,
      transaction_id: params.transaction_id,
    });
  }
  window.ttq?.track?.("CompletePayment", {
    value: params.value,
    currency: params.currency,
  });
  mirrorToCAPI("Purchase", params, ctx);
}

function mirrorToCAPI(
  event: string,
  params: Record<string, unknown>,
  ctx?: ServerSideEventCtx,
): void {
  // Server-side CAPI mirror for FB pixel only — Google + TikTok server APIs
  // are P3 (separate user accounts required). Fire-and-forget.
  if (!FB_PIXEL_ID) return;
  try {
    void fetch("/api/event/fb-capi", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event,
        params,
        event_id: ctx?.eventId ?? null,
        email_hash: ctx?.emailHash ?? null,
        phone_hash: ctx?.phoneHash ?? null,
        url: window.location.href,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}
