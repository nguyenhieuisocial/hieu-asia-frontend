/**
 * Bulk-selection helper for admin tables.
 *
 * - Generic over row type — pass a `getId(row) => string` extractor.
 * - Stable selection set keyed by `id`, survives row reorders.
 * - `toggleAll` is "select-all-on-page": flips between full-set / empty for
 *   the currently visible `rows` argument. It does NOT touch ids that aren't
 *   in the current visible set (so filtered-out selections stay selected on
 *   page change). If that's not desired, call `clear()` before `toggleAll()`.
 *
 * @example
 * const sel = useBulkSelection(filteredUsers, (u) => u.id);
 * <input
 *   type="checkbox"
 *   checked={sel.allSelected}
 *   onChange={sel.toggleAll}
 * />
 * {filteredUsers.map((u) => (
 *   <input
 *     type="checkbox"
 *     checked={sel.isSelected(u.id)}
 *     onChange={() => sel.toggle(u.id)}
 *   />
 * ))}
 */

import * as React from 'react';

export interface BulkSelection {
  /** Set of selected ids. Stable reference between renders when unchanged. */
  selected: Set<string>;
  /** True iff `id` is in `selected`. */
  isSelected: (id: string) => boolean;
  /** Toggle membership of a single id. */
  toggle: (id: string) => void;
  /** Select-all / deselect-all for the current `rows` argument. */
  toggleAll: () => void;
  /** True iff every row in the current `rows` argument is selected. */
  allSelected: boolean;
  /** True iff at least one but not all current rows are selected. */
  someSelected: boolean;
  /** Clear all selections (including ones not in current visible rows). */
  clear: () => void;
  /** Selected count across all (not just visible). */
  count: number;
  /** Selected ids that are still in the current `rows` set (page-scoped). */
  visibleSelectedIds: string[];
}

export function useBulkSelection<T>(
  rows: ReadonlyArray<T>,
  getId: (row: T) => string,
): BulkSelection {
  const [selected, setSelected] = React.useState<Set<string>>(() => new Set());

  const visibleIds = React.useMemo(() => rows.map(getId), [rows, getId]);

  const isSelected = React.useCallback((id: string) => selected.has(id), [selected]);

  const toggle = React.useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = React.useCallback(() => {
    setSelected((prev) => {
      const next = new Set(prev);
      const allOn = visibleIds.length > 0 && visibleIds.every((id) => next.has(id));
      if (allOn) {
        for (const id of visibleIds) next.delete(id);
      } else {
        for (const id of visibleIds) next.add(id);
      }
      return next;
    });
  }, [visibleIds]);

  const clear = React.useCallback(() => setSelected(new Set()), []);

  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));
  const someSelected = !allSelected && visibleIds.some((id) => selected.has(id));
  const visibleSelectedIds = visibleIds.filter((id) => selected.has(id));

  return {
    selected,
    isSelected,
    toggle,
    toggleAll,
    allSelected,
    someSelected,
    clear,
    count: selected.size,
    visibleSelectedIds,
  };
}
