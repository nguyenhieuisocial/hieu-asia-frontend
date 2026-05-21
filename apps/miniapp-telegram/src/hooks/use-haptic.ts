'use client';

import { useMemo } from 'react';
import { hapticSync, type HapticKind } from '@/lib/haptic';

/**
 * React hook returning haptic trigger helpers.
 *
 * Use inside event handlers — calls are sync (no await) and safe outside
 * Telegram (no-op). Memoised, so safe in deps arrays.
 *
 * Example:
 *   const h = useHaptic();
 *   <button onClick={() => { h.light(); doThing(); }} />
 */
export interface UseHapticReturn {
  trigger: (kind: HapticKind) => void;
  light: () => void;
  medium: () => void;
  heavy: () => void;
  soft: () => void;
  rigid: () => void;
  success: () => void;
  error: () => void;
  warning: () => void;
  select: () => void;
}

export function useHaptic(): UseHapticReturn {
  return useMemo<UseHapticReturn>(
    () => ({
      trigger: (kind) => hapticSync(kind),
      light: () => hapticSync('light'),
      medium: () => hapticSync('medium'),
      heavy: () => hapticSync('heavy'),
      soft: () => hapticSync('soft'),
      rigid: () => hapticSync('rigid'),
      success: () => hapticSync('success'),
      error: () => hapticSync('error'),
      warning: () => hapticSync('warning'),
      select: () => hapticSync('select'),
    }),
    [],
  );
}
