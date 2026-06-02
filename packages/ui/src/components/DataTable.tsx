'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

/**
 * Generic DataTable — admin/back-office style.
 * Brand: gold accents on dark ink. Mobile: horizontal scroll.
 *
 * Lightweight: no virtualization, no sort plugins (rows wrapper handles).
 * Pagination + search are caller-controlled to keep this dumb & re-usable.
 */

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  /** Renderer. Default = `row[key]` cast to string. */
  cell?: (row: T) => React.ReactNode;
  className?: string;
  /** Width hint, e.g. "120px" or "20%". */
  width?: string;
  align?: 'left' | 'right' | 'center';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Click handler — useful for "open detail drawer". */
  onRowClick?: (row: T) => void;
  /** Show "no rows" state. */
  emptyState?: React.ReactNode;
  className?: string;
  /** Pagination: optional. Caller controls page slicing. */
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  emptyState,
  className,
  page,
  pageSize,
  total,
  onPageChange,
}: DataTableProps<T>) {
  const hasPagination = typeof page === 'number' && typeof pageSize === 'number' && typeof total === 'number';
  const totalPages = hasPagination ? Math.max(1, Math.ceil(total / pageSize)) : 1;

  return (
    <div className={cn('rounded-lg border border-gold/15 bg-card backdrop-blur-sm', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/15 text-left">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    'px-4 py-3 font-mono text-xs uppercase tracking-wider text-gold/80',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">
                  {emptyState ?? 'Không có dữ liệu.'}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'border-b border-gold/10 transition-colors last:border-0',
                    onRowClick && 'cursor-pointer hover:bg-gold/5',
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3 text-foreground/90',
                        col.align === 'right' && 'text-right',
                        col.align === 'center' && 'text-center',
                        col.className,
                      )}
                    >
                      {col.cell ? col.cell(row) : ((row as Record<string, unknown>)[col.key] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {hasPagination && (
        <div className="flex items-center justify-between border-t border-gold/15 px-4 py-3 text-xs text-foreground/70">
          <span>
            Trang <span className="text-gold">{page}</span> / {totalPages} ·{' '}
            <span className="text-muted-foreground">{total} bản ghi</span>
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => onPageChange?.(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="rounded border border-gold/20 px-2.5 py-1 hover:border-gold/40 disabled:opacity-40"
            >
              ← Trước
            </button>
            <button
              type="button"
              onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="rounded border border-gold/20 px-2.5 py-1 hover:border-gold/40 disabled:opacity-40"
            >
              Sau →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Status pill — colored chip used in cells. */
export function StatusBadge({
  status,
  label,
}: {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  label: React.ReactNode;
}) {
  // Text tone is deep enough to read on the tinted bg in LIGHT mode, with a
  // lighter dark: variant for dark mode. The old jade-50/purple-50 were near
  // white — fine on dark bg, illegible on light (e.g. PUBLISHED badge on the
  // light /content table). warning/error already used this readable pattern.
  const tone = {
    success: 'border-jade/40 bg-jade/15 text-jade-700 dark:text-jade-50',
    warning: 'border-gold/40 bg-gold/10 text-gold-700 dark:text-gold-200',
    error: 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300',
    info: 'border-purple/40 bg-purple/15 text-purple-700 dark:text-purple-50',
    neutral: 'border-border/40 bg-cream/5 text-foreground/80',
  }[status];
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider', tone)}>
      {label}
    </span>
  );
}
