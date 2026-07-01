/**
 * Google Tag Manager (GTM) + Google Analytics 4 (GA4) — CONSENT-GATED.
 *
 * Mirrors lib/marketing-pixels.ts: NO <script> is injected and neither gtm.js
 * nor gtag.js loads until the visitor grants ANALYTICS consent
 * (`localStorage["hieu.consent.analytics"] === "true"`). Firing before consent
 * would break the site's CMP (ConsentBanner) + VN Decree 13/2023 + EU GDPR,
 * which the whole app already honours.
 *
 * Wiring:
 *   - lib/consent.ts setConsent() → loadGoogleTags() on grant, unloadGoogleTags() on revoke
 *   - <GoogleTags/> (components/analytics) mounts in the root layout and calls
 *     loadGoogleTags() on page load for RETURNING already-consented visitors.
 *
 * The GTM `<noscript>` iframe is intentionally OMITTED: it cannot be
 * consent-gated (no JS to read consent), so shipping it would leak a tag load
 * for no-JS visitors — inconsistent with the load-on-consent model here.
 *
 * IDs default to the production containers but can be overridden via env
 * (NEXT_PUBLIC_GTM_ID / NEXT_PUBLIC_GA4_ID). `gtag`/`dataLayer` are shared with
 * lib/marketing-pixels.ts (Google Ads); this module never deletes those
 * globals on unload — it uses GA4's official `ga-disable-<id>` opt-out flag
 * instead so revoking analytics can't break a still-consented Ads pixel.
 */

const CONSENT_KEY = "hieu.consent.analytics";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-TP7KDWN5";
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? "G-RR1YSW2J7T";

let _loaded = false;

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "true";
  } catch {
    return false;
  }
}

function injectScript(src: string, id: string): void {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

function removeScriptById(id: string): void {
  const el = document.getElementById(id);
  if (el && el.parentNode) el.parentNode.removeChild(el);
}

function deleteCookieByPrefix(prefix: string): void {
  try {
    for (const raw of document.cookie.split(";")) {
      const name = raw.split("=")[0]?.trim();
      if (!name || !(name === prefix || name.startsWith(prefix))) continue;
      const host = window.location.hostname;
      const parts = host.split(".");
      const apex = parts.length >= 2 ? "." + parts.slice(-2).join(".") : `.${host}`;
      for (const dom of ["", `; Domain=${host}`, `; Domain=${apex}`]) {
        document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT${dom}`;
      }
    }
  } catch {
    /* ignore */
  }
}

/**
 * Load GTM + GA4. Must only be called once analytics consent is granted — the
 * belt-and-braces `hasAnalyticsConsent()` guard keeps it safe if a caller
 * forgets. Idempotent.
 */
export function loadGoogleTags(): void {
  if (typeof window === "undefined") return;
  if (_loaded) return;
  if (!hasAnalyticsConsent()) return;
  _loaded = true;

  window.dataLayer = window.dataLayer || [];
  // Reuse the shared gtag shim (marketing-pixels may already have defined it).
  const gtag =
    window.gtag ??
    function gtag(...args: unknown[]) {
      (window.dataLayer as unknown[]).push(args);
    };
  window.gtag = gtag;

  // GA4 (gtag.js).
  if (GA4_ID) {
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA4_ID}`] = false;
    injectScript(
      `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`,
      "hieu-ga4",
    );
    gtag("js", new Date());
    gtag("config", GA4_ID);
  }

  // GTM container.
  if (GTM_ID) {
    (window.dataLayer as unknown[]).push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js",
    });
    injectScript(
      `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`,
      "hieu-gtm",
    );
  }
}

/**
 * Tear down GTM + GA4 when the visitor revokes analytics consent. Removes the
 * injected scripts, sets GA4's runtime opt-out flag, and best-effort clears
 * GA cookies. Does NOT delete the shared `window.gtag`/`window.dataLayer`
 * (Google Ads in marketing-pixels.ts shares them).
 */
export function unloadGoogleTags(): void {
  if (typeof window === "undefined") return;
  _loaded = false;
  removeScriptById("hieu-ga4");
  removeScriptById("hieu-gtm");
  if (GA4_ID) {
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA4_ID}`] = true;
  }
  deleteCookieByPrefix("_ga");
  deleteCookieByPrefix("_gid");
}
