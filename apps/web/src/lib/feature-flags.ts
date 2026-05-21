/**
 * Feature flag hook backed by PostHog.
 *
 * Used for A/B testing prompts and UI variants. Configure flags in the
 * PostHog dashboard (Feature Flags section). A boolean flag returns
 * `true`/`false`; a multivariate flag returns the variant key (string).
 *
 * Falls back to `defaultValue` when PostHog isn't initialized (missing key,
 * SSR, user opted out, etc.).
 */

"use client";

import * as React from "react";
import { getPostHog } from "./posthog";
import { track } from "./analytics";

export function useFeatureFlag<T extends boolean | string = boolean>(
  key: string,
  defaultValue: T = false as T,
): T {
  const [value, setValue] = React.useState<T>(defaultValue);
  const reportedRef = React.useRef<string | boolean | null>(null);

  React.useEffect(() => {
    const ph = getPostHog();
    if (!ph) return;

    const read = () => {
      const flag = ph.getFeatureFlag(key);
      if (flag === undefined) return;
      setValue(flag as T);
      // Fire `feature_flag_evaluated` once per (key, variant) per session
      // so we can correlate downstream events with the variant they saw.
      const variant = flag as string | boolean;
      if (reportedRef.current !== variant) {
        reportedRef.current = variant;
        track("feature_flag_evaluated", { flag_key: key, variant });
      }
    };

    // Initial read (flags may already be loaded).
    read();
    // Re-read whenever PostHog finishes loading remote flag config.
    const unsubscribe = ph.onFeatureFlags(() => read());
    return () => {
      try {
        unsubscribe?.();
      } catch {
        /* ignore */
      }
    };
  }, [key]);

  return value;
}
