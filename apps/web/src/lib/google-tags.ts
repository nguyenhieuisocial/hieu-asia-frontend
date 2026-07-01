/**
 * Google Tag Manager (GTM) container loader + GOOGLE CONSENT MODE v2.
 *
 * GA4 is configured INSIDE the GTM container (a "Google tag" for G-RR1YSW2J7T
 * firing on Initialization - All Pages), NOT loaded directly here — so every
 * tag (GA4, Ads, pixels, events) is managed in the GTM UI without a code
 * deploy, and GA4 is never double-counted.
 *
 * This module only: (1) pushes Consent Mode v2 defaults BEFORE gtm.js runs,
 * then (2) loads the GTM container for EVERY visitor. Consent starts DENIED, so
 * pre-consent GA4 (via GTM) sends anonymous, cookie-less pings that Google uses
 * for conversion modelling — within GDPR / VN Decree 13/2023. On consent grant
 * via the CMP we push a Consent Mode `update`, and GTM's tags switch to full
 * measurement. This captures the MAXIMUM data legally (modelled + full).
 *
 * Wiring:
 *   - <GoogleTags/> (root layout) → initGoogleTags() once on mount.
 *   - lib/consent.ts setConsent() → updateAnalyticsConsent() + updateMarketingConsent().
 *
 * `gtag`/`dataLayer` are shared with lib/marketing-pixels.ts (Google Ads); this
 * module never deletes those globals — it only pushes Consent Mode signals.
 *
 * The GTM `<noscript>` iframe is intentionally OMITTED (no-JS clients can't run
 * Consent Mode, so it would load tags that ignore consent state).
 *
 * Container ID defaults to production; override via NEXT_PUBLIC_GTM_ID.
 */

const ANALYTICS_KEY = "hieu.consent.analytics";
const MARKETING_KEY = "hieu.consent.marketing";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-TP7KDWN5";

let _initialized = false;

function readConsent(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

export function hasAnalyticsConsent(): boolean {
  return readConsent(ANALYTICS_KEY);
}

function ensureGtag(): (...args: unknown[]) => void {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      (window.dataLayer as unknown[]).push(args);
    };
  }
  return window.gtag;
}

function injectScript(src: string, id: string): void {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

/**
 * Push Consent Mode v2 defaults, then load the GTM container (which hosts GA4).
 * Idempotent — safe to call on every mount. Defaults reflect any consent
 * already stored (returning visitors + rest-of-world legitimate-interest),
 * otherwise DENIED.
 */
export function initGoogleTags(): void {
  if (typeof window === "undefined" || _initialized) return;
  _initialized = true;

  const gtag = ensureGtag();
  const analytics = readConsent(ANALYTICS_KEY);
  const marketing = readConsent(MARKETING_KEY);

  // Consent Mode v2 — defaults MUST be pushed before gtm.js runs.
  gtag("consent", "default", {
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
    analytics_storage: analytics ? "granted" : "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });

  // Load the GTM container — GA4 + any future tags live inside it.
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

/** Flip GA4 analytics storage on/off when the visitor changes analytics consent. */
export function updateAnalyticsConsent(granted: boolean): void {
  if (typeof window === "undefined") return;
  initGoogleTags(); // guarantee 'default' was pushed before this 'update'
  ensureGtag()("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}

/** Flip Ads storage/signals on/off when the visitor changes marketing consent. */
export function updateMarketingConsent(granted: boolean): void {
  if (typeof window === "undefined") return;
  initGoogleTags();
  ensureGtag()("consent", "update", {
    ad_storage: granted ? "granted" : "denied",
    ad_user_data: granted ? "granted" : "denied",
    ad_personalization: granted ? "granted" : "denied",
  });
}
