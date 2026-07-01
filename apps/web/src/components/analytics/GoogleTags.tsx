"use client";

import * as React from "react";
import { initGoogleTags } from "@/lib/google-tags";

/**
 * Boots GTM + GA4 with Google Consent Mode v2 on every page load. The tags load
 * for all visitors but start with storage DENIED (see lib/google-tags); cookies
 * only switch on once the visitor grants consent via the CMP, which calls the
 * consent-update helpers from lib/consent.ts setConsent().
 *
 * Renders nothing.
 */
export function GoogleTags(): null {
  React.useEffect(() => {
    initGoogleTags();
  }, []);
  return null;
}
