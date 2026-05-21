'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  clearProfile as clearFromStorage,
  readSavedProfile,
  saveProfile as saveToStorage,
  type SavedProfile,
} from '../lib/saved-profile';

interface UseSavedProfileReturn {
  profile: SavedProfile | null;
  isLoaded: boolean;
  save: (p: SavedProfile) => void;
  clear: () => void;
}

const DEBOUNCE_MS = 250;

export function useSavedProfile(): UseSavedProfileReturn {
  const [profile, setProfile] = useState<SavedProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<SavedProfile | null>(null);

  useEffect(() => {
    setProfile(readSavedProfile());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    return () => {
      if (flushTimer.current) {
        clearTimeout(flushTimer.current);
        // Flush any pending write synchronously on unmount.
        if (pending.current) saveToStorage(pending.current);
      }
    };
  }, []);

  const save = useCallback((p: SavedProfile) => {
    setProfile(p);
    pending.current = p;
    if (flushTimer.current) clearTimeout(flushTimer.current);
    flushTimer.current = setTimeout(() => {
      if (pending.current) {
        saveToStorage(pending.current);
        pending.current = null;
      }
      flushTimer.current = null;
    }, DEBOUNCE_MS);
  }, []);

  const clear = useCallback(() => {
    if (flushTimer.current) {
      clearTimeout(flushTimer.current);
      flushTimer.current = null;
    }
    pending.current = null;
    setProfile(null);
    clearFromStorage();
  }, []);

  return { profile, isLoaded, save, clear };
}
