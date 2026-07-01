"use client";

import * as React from "react";
import { hasAnalyticsConsent, loadGoogleTags } from "@/lib/google-tags";

/**
 * Mounts GTM + GA4 on page load for RETURNING visitors who already granted
 * analytics consent. First-time grant (and revocation) is handled synchronously
 * in lib/consent.ts setConsent(); this covers the case where consent was stored
 * in a previous session, so the tags come back on every subsequent load.
 *
 * Renders nothing. No tag loads unless `hieu.consent.analytics === "true"`.
 */
export function GoogleTags(): null {
  React.useEffect(() => {
    if (hasAnalyticsConsent()) loadGoogleTags();
  }, []);
  return null;
}
