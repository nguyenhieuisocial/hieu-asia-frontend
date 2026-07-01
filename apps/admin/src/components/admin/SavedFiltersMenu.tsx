'use client';

/**
 * Reusable saved-filter preset menu for admin table pages.
 *
 * Pairs with the `useSavedFilters` hook (lib/saved-filters.ts): the hook owns
 * localStorage persistence + the presets array; this component renders the
 * apply / delete / save UI. Extracted verbatim from the hand-rolled UsersList
 * pattern so every table gets the same control instead of re-implementing it.
 *
 * The caller wires three callbacks:
 *   - onApply(name):  loadPreset(name) → apply to your own filter state
 *   - onDelete(name): deletePreset(name)
 *   - onSave(name):   savePreset(name, currentFilters)   // name prompted here
 *
 * @example
 * const { presets, savePreset, loadPreset, deletePreset } =
 *   useSavedFilters<Filters>('coupons', defaults);
 * <SavedFiltersMenu
 *   presets={presets}
 *   onApply={(n) => { const p = loadPreset(n); if (p) applyFilters(p); }}
 *   onDelete={deletePreset}
 *   onSave={(n) => savePreset(n, { search, status })}
 *   saveHint="Lưu bộ lọc + trạng thái hiện tại"
 * />
 */

import * as React from 'react';
import { BookmarkPlus } from 'lucide-react';
import { cn } from '@hieu-asia/ui';
import type { FilterPreset } from '@/lib/saved-filters';

export interface SavedFiltersMenuProps<F> {
  presets: FilterPreset<F>[];
  onApply: (name: string) => void;
  onDelete: (name: string) => void;
  onSave: (name: string) => void;
  /** Tooltip on the save button describing what gets captured. */
  saveHint?: string;
  className?: string;
}

export function SavedFiltersMenu<F>({
  presets,
  onApply,
  onDelete,
  onSave,
  saveHint = 'Lưu bộ lọc hiện tại thành preset',
  className,
}: SavedFiltersMenuProps<F>) {
  const handleSave = React.useCallback(() => {
    const name = window.prompt('Đặt tên cho bộ lọc:');
    if (name && name.trim()) onSave(name.trim());
  }, [onSave]);

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {presets.length > 0 && (
        <select
          onChange={(e) => {
            if (e.target.value) onApply(e.target.value);
            e.target.value = '';
          }}
          defaultValue=""
          className="h-7 rounded-md border border-gold/20 bg-card/60 px-2 text-xs text-foreground focus:border-gold focus:outline-none"
          aria-label="Chọn bộ lọc đã lưu"
        >
          <option value="" disabled>
            Bộ lọc đã lưu…
          </option>
          {presets.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      )}
      {presets.length > 0 && (
        <select
          onChange={(e) => {
            if (!e.target.value) return;
            if (window.confirm(`Xoá bộ lọc "${e.target.value}"?`)) {
              onDelete(e.target.value);
            }
            e.target.value = '';
          }}
          defaultValue=""
          className="h-7 rounded-md border border-red-400/20 bg-card/60 px-2 text-xs text-red-700 focus:border-red-400 focus:outline-none dark:text-red-300"
          aria-label="Xoá bộ lọc đã lưu"
        >
          <option value="" disabled>
            Xoá…
          </option>
          {presets.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      )}
      <button
        type="button"
        onClick={handleSave}
        className="inline-flex h-7 items-center gap-1 rounded-md border border-gold/20 bg-card/60 px-2 text-xs text-foreground/85 hover:border-gold/50 hover:text-gold"
        title={saveHint}
      >
        <BookmarkPlus className="h-3 w-3" />
        Lưu bộ lọc
      </button>
    </div>
  );
}
