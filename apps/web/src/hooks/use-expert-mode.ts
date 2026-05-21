'use client';

/**
 * useExpertMode — roadmap §3.5 "Chế độ Chuyên gia" toggle.
 *
 * Wraps localStorage (`hieu:expert-mode:v1`) so anonymous visitors can switch
 * reading pages between "Dễ hiểu" (default, false) and "Chuyên gia" (true).
 *
 * Hydration-safe: returns `null` during SSR / first paint, then resolves on
 * mount. Reading pages MUST render both variants in initial HTML (SEO) and
 * use CSS / `aria-hidden` to hide one — never gate content on this hook.
 *
 * URL override: `?expert=1` forces expert mode for the current view (sharable
 * deep-links). `?expert=0` forces beginner. URL takes precedence over storage
 * but does NOT write to storage.
 */

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'hieu:expert-mode:v1';
const URL_PARAM = 'expert';

function readUrlOverride(): boolean | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = new URL(window.location.href).searchParams.get(URL_PARAM);
    if (value === '1' || value === 'true') return true;
    if (value === '0' || value === 'false') return false;
    return null;
  } catch {
    return null;
  }
}

function readStorage(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function writeStorage(on: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
  } catch {
    /* quota / disabled — best-effort */
  }
}

interface UseExpertModeReturn {
  /** True = expert, false = beginner, null = not yet hydrated (SSR/first paint). */
  expertMode: boolean | null;
  /** Setter — writes to localStorage. No-op when a URL override is active. */
  setExpertMode: (on: boolean) => void;
  /** True when `?expert=…` is forcing the value (setter is ignored). */
  isUrlForced: boolean;
}

export function useExpertMode(): UseExpertModeReturn {
  const [mode, setMode] = useState<boolean | null>(null);
  const [urlForced, setUrlForced] = useState(false);

  useEffect(() => {
    const override = readUrlOverride();
    if (override !== null) {
      setMode(override);
      setUrlForced(true);
      return;
    }
    setMode(readStorage());
    setUrlForced(false);
  }, []);

  const setExpertMode = useCallback(
    (on: boolean) => {
      if (urlForced) return;
      setMode(on);
      writeStorage(on);
    },
    [urlForced],
  );

  return { expertMode: mode, setExpertMode, isUrlForced: urlForced };
}
