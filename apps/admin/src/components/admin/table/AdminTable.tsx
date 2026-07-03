'use client';

/**
 * Wave 60.71.T2.customers — AdminTable primitive (vault 107 §5.5 + §6).
 *
 * Sits one layer above @hieu-asia/ui's lower-level `<DataTable>`: the shared
 * primitive is a dumb renderer (header / rows / pagination only), while
 * <AdminTable> adds the admin-app concerns we hand-rolled in 6+ places:
 *
 *   - column visibility on mobile (`hideOnMobile`)
 *   - client-side sort hook (`sortKey`)
 *   - skeleton loading rows
 *   - empty state node (centered)
 *   - row click handler (typically routes to detail)
 *   - bulk-select callback (checkbox column, top-level)
 *   - getRowId for stable keys
 *   - <caption> for a11y
 *
 * Future consumers per vault 107 §5.10: /sessions, /audit-log, /feature-flags,
 * /coupons, /vendors, /jobs. Each Tier 3 rebuild swaps its `<table>` for
 * <AdminTable> + AdminTableColumn config — Tier 3 effort drops from ~2h to
 * ~30min per route.
 *
 * Design tokens: gold accents on dark ink (admin in-app palette, NOT marketing
 * Option D). Sticky header on scroll. Hover gold/[0.03] when onRowClick set.
 */

import * as React from 'react';
import { cn } from '@hieu-asia/ui';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

export type AdminTableColumn<TRow> = {
  /** Unique column id. */
  id: string;
  /** Header label (vi-VN). Accepts a node so a column can host a select-all
   *  checkbox or icon header (e.g. controlled bulk-select columns). */
  header: React.ReactNode;
  /** Optional sort key for client-side sort. Falsy → not sortable. */
  sortKey?: keyof TRow;
  /** Cell renderer — receives full row. */
  cell: (row: TRow) => React.ReactNode;
  /** Optional CSS class for both header + cells (text-right for numbers). */
  className?: string;
  /** Width hint, e.g. "120px" or "20%". */
  width?: string;
  /** Hide on viewports < md (≤768px). Default false. */
  hideOnMobile?: boolean;
};

export type AdminTableProps<TRow> = {
  rows: TRow[];
  columns: AdminTableColumn<TRow>[];
  /** Row click handler — typically routes to /detail. */
  onRowClick?: (row: TRow) => void;
  /** Loading state — show skeleton rows. */
  loading?: boolean;
  /** Empty state — show "Chưa có dữ liệu" or custom message. */
  empty?: React.ReactNode;
  /** Optional bulk-select callback. When set, a leading checkbox column appears. */
  onBulkSelect?: (selectedIds: string[]) => void;
  /** Stable id getter. Defaults to `(row as { id: string }).id`. */
  getRowId?: (row: TRow) => string;
  /** Caption for a11y. */
  caption?: string;
  /** Sticky header (default true). */
  stickyHeader?: boolean;
  /** Extra container class. */
  className?: string;
  /** Optional per-row class (e.g. highlight a row matched by a query param,
   *  or dim a non-selectable row). Merged after the base row classes. */
  rowClassName?: (row: TRow) => string | undefined;
  /** Optional footer, rendered as a `<tfoot>` INSIDE the same `<table>` so its
   *  cells share the auto-width columns (e.g. a totals row that must line up
   *  under the data columns). Pass a `<tr>` of `<td>` cells matching the column
   *  count + `className`s; when the table has a bulk-select column, prepend an
   *  empty leading `<td>`. */
  footer?: React.ReactNode;
};

type SortState<TRow> = {
  key: keyof TRow;
  dir: 'asc' | 'desc';
} | null;

const DEFAULT_EMPTY = (
  <span className="text-sm text-muted-foreground">
    Chưa có dữ liệu — bảng sẽ tự hiện khi có bản ghi.
  </span>
);

function defaultGetRowId<TRow>(row: TRow): string {
  // Lean on a conventional `id` field — falls back to JSON if missing so we
  // never collide on a malformed row.
  const candidate = (row as { id?: unknown }).id;
  if (typeof candidate === 'string' && candidate.length > 0) return candidate;
  if (typeof candidate === 'number') return String(candidate);
  return JSON.stringify(row);
}

export function AdminTable<TRow>({
  rows,
  columns,
  onRowClick,
  loading = false,
  empty,
  onBulkSelect,
  getRowId = defaultGetRowId,
  caption,
  stickyHeader = true,
  className,
  rowClassName,
  footer,
}: AdminTableProps<TRow>) {
  const [sort, setSort] = React.useState<SortState<TRow>>(null);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  // Bubble selection changes up — guard with useEffect so children don't
  // setState during render. (Defensive: parent may snapshot the ids into a
  // bulk-action bar.)
  React.useEffect(() => {
    onBulkSelect?.(Array.from(selected));
  }, [selected, onBulkSelect]);

  const sortedRows = React.useMemo(() => {
    if (!sort) return rows;
    const { key, dir } = sort;
    const factor = dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = a[key];
      const vb = b[key];
      if (va == null && vb == null) return 0;
      if (va == null) return 1; // nulls last
      if (vb == null) return -1;
      if (typeof va === 'number' && typeof vb === 'number') {
        return (va - vb) * factor;
      }
      return String(va).localeCompare(String(vb), 'vi') * factor;
    });
  }, [rows, sort]);

  const toggleSort = React.useCallback((key: keyof TRow) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return null; // 3rd click clears
    });
  }, []);

  const allRowIds = React.useMemo(
    () => sortedRows.map((r) => getRowId(r)),
    [sortedRows, getRowId],
  );

  const allSelected = onBulkSelect != null
    && allRowIds.length > 0
    && allRowIds.every((id) => selected.has(id));

  const toggleAll = React.useCallback(() => {
    setSelected((prev) => {
      if (allRowIds.every((id) => prev.has(id))) {
        const next = new Set(prev);
        allRowIds.forEach((id) => next.delete(id));
        return next;
      }
      const next = new Set(prev);
      allRowIds.forEach((id) => next.add(id));
      return next;
    });
  }, [allRowIds]);

  const toggleOne = React.useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const colspan = columns.length + (onBulkSelect ? 1 : 0);

  return (
    <div
      className={cn(
        'overflow-x-auto rounded-lg border border-gold/15 bg-card/60',
        className,
      )}
    >
      <table className="min-w-full divide-y divide-gold/15 text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead
          className={cn(
            'bg-card/80 backdrop-blur',
            stickyHeader && 'sticky top-0 z-10',
          )}
        >
          <tr className="text-left text-xs uppercase tracking-wider text-gold/80">
            {onBulkSelect && (
              <th scope="col" className="w-10 px-3 py-2">
                <input
                  type="checkbox"
                  aria-label="Chọn tất cả dòng"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-3.5 w-3.5 cursor-pointer rounded border-gold/30 bg-card text-gold focus:ring-1 focus:ring-gold/50"
                />
              </th>
            )}
            {columns.map((col) => {
              const sortable = col.sortKey != null;
              const active = sort?.key === col.sortKey;
              const SortIcon = !active ? ArrowUpDown : sort?.dir === 'asc' ? ArrowUp : ArrowDown;
              return (
                <th
                  key={col.id}
                  scope="col"
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    'px-3 py-2 font-mono font-medium',
                    col.hideOnMobile && 'hidden md:table-cell',
                    col.className,
                  )}
                >
                  {sortable ? (
                    <button
                      type="button"
                      onClick={() => col.sortKey && toggleSort(col.sortKey)}
                      className={cn(
                        'inline-flex items-center gap-1 transition-colors hover:text-gold',
                        active && 'text-gold',
                      )}
                    >
                      {col.header}
                      <SortIcon className="h-3 w-3" aria-hidden />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-gold/10">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow
                  key={`skel-${i}`}
                  columns={columns}
                  showSelect={onBulkSelect != null}
                />
              ))
            : sortedRows.length === 0
              ? (
                <tr>
                  <td colSpan={colspan} className="px-3 py-12 text-center">
                    {empty ?? DEFAULT_EMPTY}
                  </td>
                </tr>
              )
              : sortedRows.map((row) => {
                  const id = getRowId(row);
                  return (
                    <AdminTableRow
                      key={id}
                      row={row}
                      rowId={id}
                      columns={columns}
                      onRowClick={onRowClick}
                      selectable={onBulkSelect != null}
                      isSelected={selected.has(id)}
                      onToggle={toggleOne}
                      extraClassName={rowClassName?.(row)}
                    />
                  );
                })}
        </tbody>
        {footer && <tfoot className="bg-card/40">{footer}</tfoot>}
      </table>
    </div>
  );
}

/**
 * Single row — extracted so click + selection handlers don't recreate per render
 * of the parent table. Memoised on rowId so unrelated row updates don't churn
 * every row.
 */
const AdminTableRow = React.memo(function AdminTableRow<TRow>({
  row,
  rowId,
  columns,
  onRowClick,
  selectable,
  isSelected,
  onToggle,
  extraClassName,
}: {
  row: TRow;
  rowId: string;
  columns: AdminTableColumn<TRow>[];
  onRowClick?: (row: TRow) => void;
  selectable: boolean;
  isSelected: boolean;
  onToggle: (id: string) => void;
  extraClassName?: string;
}) {
  const handleRowClick = React.useCallback(() => {
    onRowClick?.(row);
  }, [onRowClick, row]);

  const handleToggle = React.useCallback(
    (e: React.MouseEvent | React.ChangeEvent) => {
      e.stopPropagation();
      onToggle(rowId);
    },
    [onToggle, rowId],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTableRowElement>) => {
      if (!onRowClick) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onRowClick(row);
      }
    },
    [onRowClick, row],
  );

  return (
    <tr
      onClick={onRowClick ? handleRowClick : undefined}
      onKeyDown={onRowClick ? handleKeyDown : undefined}
      tabIndex={onRowClick ? 0 : undefined}
      role={onRowClick ? 'button' : undefined}
      className={cn(
        'transition-all duration-300 ease-editorial',
        onRowClick && 'cursor-pointer hover:bg-gold/[0.04] focus-visible:bg-gold/[0.06] focus-visible:outline-none',
        isSelected && 'bg-gold/[0.06]',
        extraClassName,
      )}
    >
      {selectable && (
        <td className="w-10 px-3 py-2">
          <input
            type="checkbox"
            aria-label={`Chọn dòng ${rowId}`}
            checked={isSelected}
            onChange={handleToggle}
            onClick={(e) => e.stopPropagation()}
            className="h-3.5 w-3.5 cursor-pointer rounded border-gold/30 bg-card text-gold focus:ring-1 focus:ring-gold/50"
          />
        </td>
      )}
      {columns.map((col) => (
        <td
          key={col.id}
          className={cn(
            'px-3 py-2 align-middle',
            col.hideOnMobile && 'hidden md:table-cell',
            col.className,
          )}
        >
          {col.cell(row)}
        </td>
      ))}
    </tr>
  );
}) as <TRow>(props: {
  row: TRow;
  rowId: string;
  columns: AdminTableColumn<TRow>[];
  onRowClick?: (row: TRow) => void;
  selectable: boolean;
  isSelected: boolean;
  onToggle: (id: string) => void;
  extraClassName?: string;
}) => React.ReactElement;

function SkeletonRow<TRow>({
  columns,
  showSelect,
}: {
  columns: AdminTableColumn<TRow>[];
  showSelect: boolean;
}) {
  return (
    <tr>
      {showSelect && (
        <td className="w-10 px-3 py-2">
          <div className="h-3.5 w-3.5 animate-pulse rounded bg-muted/30" />
        </td>
      )}
      {columns.map((col) => (
        <td
          key={col.id}
          className={cn(
            'px-3 py-2',
            col.hideOnMobile && 'hidden md:table-cell',
          )}
        >
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted/30" />
        </td>
      ))}
    </tr>
  );
}
