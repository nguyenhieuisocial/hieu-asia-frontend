/**
 * Saved filter presets for admin tables — localStorage-backed.
 *
 * Storage key pattern: `hieu-admin:filters:<storageKey>:v1`
 * Shape: `{ presets: Array<{ name: string; filters: F; created_at: string }> }`
 *
 * - SSR-safe: returns `[]` presets during server render, hydrates on mount.
 * - Same-tab + cross-tab sync via the `storage` event.
 * - Caller owns the `filters` state — this hook only persists named snapshots
 *   of it. To apply a preset: read `loadPreset(name)` then call your own
 *   setters.
 *
 * @example
 * const [search, setSearch] = useState('');
 * const [role, setRole] = useState<'all' | AdminRole>('all');
 * const { presets, savePreset, loadPreset, deletePreset } = useSavedFilters(
 *   'users',
 *   { search: '', role: 'all' as const },
 * );
 *
 * // Save current combo:
 * savePreset('Gmail admins', { search, role });
 *
 * // Apply a preset:
 * const p = loadPreset('Gmail admins');
 * if (p) { setSearch(p.search); setRole(p.role); }
 */

import * as React from 'react';

const KEY_PREFIX = 'hieu-admin:filters:';
const KEY_SUFFIX = ':v1';

export interface FilterPreset<F> {
  name: string;
  filters: F;
  created_at: string;
}

interface Stored<F> {
  presets: FilterPreset<F>[];
}

function storageKey(scope: string): string {
  return `${KEY_PREFIX}${scope}${KEY_SUFFIX}`;
}

function readStored<F>(scope: string): Stored<F> {
  if (typeof window === 'undefined') return { presets: [] };
  try {
    const raw = window.localStorage.getItem(storageKey(scope));
    if (!raw) return { presets: [] };
    const parsed = JSON.parse(raw) as Stored<F>;
    if (!parsed || !Array.isArray(parsed.presets)) return { presets: [] };
    return parsed;
  } catch {
    return { presets: [] };
  }
}

function writeStored<F>(scope: string, data: Stored<F>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey(scope), JSON.stringify(data));
  } catch {
    // Quota/disabled — silently ignore. Worst case: presets don't persist.
  }
}

export interface UseSavedFiltersResult<F> {
  presets: FilterPreset<F>[];
  savePreset: (name: string, filters: F) => void;
  loadPreset: (name: string) => F | null;
  deletePreset: (name: string) => void;
}

export function useSavedFilters<F>(
  storageScope: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- reserved for future "default preset" feature
  _defaultFilter?: F,
): UseSavedFiltersResult<F> {
  const [presets, setPresets] = React.useState<FilterPreset<F>[]>([]);

  // Hydrate on mount + listen for cross-tab changes.
  React.useEffect(() => {
    setPresets(readStored<F>(storageScope).presets);
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey(storageScope)) {
        setPresets(readStored<F>(storageScope).presets);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [storageScope]);

  const savePreset = React.useCallback(
    (name: string, filters: F) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const current = readStored<F>(storageScope);
      const idx = current.presets.findIndex((p) => p.name === trimmed);
      const entry: FilterPreset<F> = {
        name: trimmed,
        filters,
        created_at: new Date().toISOString(),
      };
      const next: FilterPreset<F>[] =
        idx >= 0
          ? current.presets.map((p, i) => (i === idx ? entry : p))
          : [...current.presets, entry];
      writeStored<F>(storageScope, { presets: next });
      setPresets(next);
    },
    [storageScope],
  );

  const loadPreset = React.useCallback(
    (name: string): F | null => {
      const found = presets.find((p) => p.name === name);
      return found ? found.filters : null;
    },
    [presets],
  );

  const deletePreset = React.useCallback(
    (name: string) => {
      const current = readStored<F>(storageScope);
      const next = current.presets.filter((p) => p.name !== name);
      writeStored<F>(storageScope, { presets: next });
      setPresets(next);
    },
    [storageScope],
  );

  return { presets, savePreset, loadPreset, deletePreset };
}
