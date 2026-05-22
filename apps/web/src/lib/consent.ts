/**
 * Wave 41 Track E — Consent Management Platform (CMP) state.
 *
 * Single source of truth for cookie-consent toggles. Stores:
 *   - `hieu.consent.shown`          — "true" after first banner dismissal
 *   - `hieu.consent.analytics`      — "true" | "false" (default true)
 *   - `hieu.consent.marketing`      — "true" | "false" (default false)
 *   - `hieu.consent.personalization`— "true" | "false" (default true)
 *
 * All values mirror to first-party cookies with 365d TTL so the Worker
 * (Track F /event/track) can honour them server-side without a separate
 * round trip.
 *
 * On change:
 *   - PostHog opt_in / opt_out applied per analytics toggle
 *   - Marketing pixels load / unload per marketing toggle
 *   - `consent_changed` event fired
 */

import { optInPostHog, optOutPostHog } from "./posthog";
import { loadMarketingPixels, unloadMarketingPixels } from "./marketing-pixels";
import { track } from "./analytics";

export const CONSENT_SHOWN_KEY = "hieu.consent.shown";
export const CONSENT_ANALYTICS_KEY = "hieu.consent.analytics";
export const CONSENT_MARKETING_KEY = "hieu.consent.marketing";
export const CONSENT_PERSONALIZATION_KEY = "hieu.consent.personalization";

const COOKIE_TTL_DAYS = 365;

export interface ConsentState {
  shown: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

export type ConsentSource =
  | "banner_accept_all"
  | "banner_necessary_only"
  | "banner_custom"
  | "settings_page";

function readBool(key: string, fallback: boolean): boolean {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === "true") return true;
    if (raw === "false") return false;
    return fallback;
  } catch {
    return fallback;
  }
}

/**
 * Wave 41.7 — compute apex domain for cross-subdomain consent cookies.
 * `null` on localhost / Vercel preview / single-label hosts.
 */
function computeApexDomain(): string | null {
  try {
    const host = window.location.hostname;
    if (!host) return null;
    if (host === "localhost" || /^\d/.test(host) || !host.includes(".")) return null;
    if (host.endsWith(".vercel.app")) return null;
    const parts = host.split(".");
    if (parts.length < 2) return null;
    return "." + parts.slice(-2).join(".");
  } catch {
    return null;
  }
}

function writeBoolCookie(name: string, value: boolean): void {
  try {
    const maxAge = COOKIE_TTL_DAYS * 86400;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    const apex = computeApexDomain();
    const domain = apex ? `; Domain=${apex}` : "";
    document.cookie = `${name}=${value ? "true" : "false"}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}${domain}`;
  } catch {
    /* ignore */
  }
}

function writeBoth(key: string, cookieName: string, value: boolean): void {
  try {
    window.localStorage.setItem(key, value ? "true" : "false");
  } catch {
    /* ignore */
  }
  writeBoolCookie(cookieName, value);
}

/**
 * Read the current consent state. Returns conservative defaults on SSR /
 * before the banner has been shown (everything OFF except `shown=false`).
 *
 * GDPR / ePrivacy: analytics + marketing + personalization all require
 * explicit opt-in. The banner is shown to VN + EU on first visit; ROW
 * geo gets legitimate-interest defaults applied silently by
 * `shouldShowBanner()` AFTER it resolves country. Until then we do NOT
 * track — `analytics:false` until the banner records an explicit choice
 * (or `shouldShowBanner()` writes the legitimate-interest defaults).
 */
export function getConsent(): ConsentState {
  if (typeof window === "undefined") {
    return { shown: false, analytics: false, marketing: false, personalization: false };
  }
  return {
    shown: readBool(CONSENT_SHOWN_KEY, false),
    analytics: readBool(CONSENT_ANALYTICS_KEY, false),
    marketing: readBool(CONSENT_MARKETING_KEY, false),
    personalization: readBool(CONSENT_PERSONALIZATION_KEY, false),
  };
}

/**
 * Apply a consent state — writes localStorage + cookies, then fires the
 * appropriate PostHog opt-in/out + marketing pixel load/unload. Also fires
 * `consent_changed` so it lands in the analytics warehouse.
 */
export function setConsent(state: Partial<ConsentState>, source: ConsentSource): void {
  if (typeof window === "undefined") return;
  const current = getConsent();
  const next: ConsentState = {
    shown: true,
    analytics: state.analytics ?? current.analytics,
    marketing: state.marketing ?? current.marketing,
    personalization: state.personalization ?? current.personalization,
  };

  writeBoth(CONSENT_SHOWN_KEY, "hieu_consent_shown", true);
  writeBoth(CONSENT_ANALYTICS_KEY, "hieu_consent_analytics", next.analytics);
  writeBoth(CONSENT_MARKETING_KEY, "hieu_consent_marketing", next.marketing);
  writeBoth(CONSENT_PERSONALIZATION_KEY, "hieu_consent_personalization", next.personalization);

  // Analytics opt-in/out.
  try {
    if (next.analytics) optInPostHog();
    else optOutPostHog();
  } catch {
    /* ignore */
  }

  // Marketing pixels load/unload.
  try {
    if (next.marketing) loadMarketingPixels();
    else unloadMarketingPixels();
  } catch {
    /* ignore */
  }

  // Surface to analytics warehouse. `track` itself respects opt-out — fire
  // BEFORE flipping opt-out so PostHog still sees the off-event.
  try {
    track("consent_changed", {
      analytics: next.analytics,
      marketing: next.marketing,
      personalization: next.personalization,
      source,
    });
  } catch {
    /* ignore */
  }
}

/**
 * Determine whether the CMP banner should be shown. Geo-aware: VN + EU
 * users always see it on first visit; other geos auto-accept analytics
 * under legitimate interest (still default marketing OFF).
 */
export async function shouldShowBanner(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const current = getConsent();
  if (current.shown) return false;

  // Geo detect — non-blocking. Default behaviour: show banner. If we can
  // determine the user is OUTSIDE VN/EU, auto-apply legitimate-interest
  // defaults without showing the banner.
  try {
    const res = await fetch("/api/edge/geo", { cache: "force-cache" });
    if (res.ok) {
      const data = (await res.json()) as { country?: string };
      const country = (data.country ?? "").toUpperCase();
      const EU = new Set([
        "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE",
        "IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE",
        "IS","LI","NO","CH","GB",
      ]);
      const requiresBanner = country === "VN" || EU.has(country);
      if (!requiresBanner) {
        // Auto-apply legitimate-interest defaults silently.
        setConsent(
          { analytics: true, marketing: false, personalization: true },
          "settings_page",
        );
        return false;
      }
    }
  } catch {
    // On error, default to showing the banner.
  }
  return true;
}

/**
 * Re-open the banner — used by the "Quản lý cookies" link in /privacy and
 * the footer. Clears the `shown` flag so the banner re-renders on next mount.
 */
export function reopenBanner(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONSENT_SHOWN_KEY);
    writeBoolCookie("hieu_consent_shown", false);
  } catch {
    /* ignore */
  }
  // Dispatch a custom event so any mounted banner can re-render.
  try {
    window.dispatchEvent(new CustomEvent("hieu:consent:reopen"));
  } catch {
    /* ignore */
  }
}
