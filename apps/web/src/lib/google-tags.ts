/**
 * Google Tag Manager (GTM) + Google Analytics 4 (GA4) with GOOGLE CONSENT MODE v2.
 *
 * Strategy: load the tags for EVERY visitor, but start with all storage
 * DENIED. Before consent, GA4 sends only anonymous, cookie-less pings (Google
 * uses them for conversion modelling) — no cookies, no identifiers, so it stays
 * within GDPR / VN Decree 13/2023. When the visitor grants analytics/marketing
 * consent via the CMP, we flip the matching consent signals to `granted` and
 * cookies + full measurement switch on. This captures the MAXIMUM data legally
 * (modelled data from non-consenters + full data from consenters).
 *
 * Wiring:
 *   - <GoogleTags/> (root layout) → initGoogleTags() once on mount.
 *   - lib/consent.ts setConsent() → updateAnalyticsConsent() + updateMarketingConsent().
 *
 * `gtag`/`dataLayer` are shared with lib/marketing-pixels.ts (Google Ads); this
 * module never deletes those globals — it only pushes Consent Mode signals.
 *
 * The GTM `<noscript>` iframe is intentionally OMITTED (no-JS clients can't run
 * Consent Mode, so it would load a tag that ignores consent state).
 *
 * IDs default to the production containers; override via env
 * (NEXT_PUBLIC_GTM_ID / NEXT_PUBLIC_GA4_ID).
 */

const ANALYTICS_KEY = "hieu.consent.analytics";
const MARKETING_KEY = "hieu.consent.marketing";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-TP7KDWN5";
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? "G-RR1YSW2J7T";

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
 * Initialize Consent Mode v2 defaults, then load GTM + GA4. Idempotent — safe
 * to call on every mount. Defaults reflect any consent already stored (returning
 * visitors + rest-of-world legitimate-interest), otherwise DENIED.
 */
export function initGoogleTags(): void {
  if (typeof window === "undefined" || _initialized) return;
  _initialized = true;

  const gtag = ensureGtag();
  const analytics = readConsent(ANALYTICS_KEY);
  const marketing = readConsent(MARKETING_KEY);

  // Consent Mode v2 — defaults MUST be pushed before gtm.js/gtag.js run.
  gtag("consent", "default", {
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
    analytics_storage: analytics ? "granted" : "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });

  gtag("js", new Date());
  if (GA4_ID) gtag("config", GA4_ID);

  if (GTM_ID) {
    (window.dataLayer as unknown[]).push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js",
    });
  }

  if (GA4_ID) {
    injectScript(
      `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`,
      "hieu-ga4",
    );
  }
  if (GTM_ID) {
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
