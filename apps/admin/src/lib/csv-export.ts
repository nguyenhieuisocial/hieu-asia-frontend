/**
 * Generic CSV export helper for admin tables.
 *
 * - Client-side: builds a CSV blob from in-memory rows, no server round-trip.
 * - RFC 4180 escaping: quotes fields containing commas, double-quotes, CR or LF.
 * - Header row uses optional pretty labels via `columnMap`.
 *
 * Pages that already have CSV (sessions server-stream, audit inline, affiliates
 * `downloadCsv`, transactions inline) can keep those — this util is for pages
 * adopting CSV anew without a dedicated server endpoint.
 */

export type CsvValue = string | number | boolean | null | undefined | Date;
export type CsvRow = Record<string, CsvValue>;

/**
 * RFC 4180 cell escape. Wrap in double quotes whenever the value contains
 * a comma, quote, CR or LF. Internal quotes are doubled.
 */
function escapeCell(value: CsvValue): string {
  if (value == null) return '';
  let s: string;
  if (value instanceof Date) {
    s = value.toISOString();
  } else if (typeof value === 'boolean') {
    s = value ? 'true' : 'false';
  } else {
    s = String(value);
  }
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Format the current date as `YYYY-MM-DD` for filename suffixes.
 */
export function todayStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Compose the standard hieu.asia admin CSV filename.
 * @example fmtCsvFilename('users')  → 'hieu-asia-users-2026-05-22.csv'
 */
export function fmtCsvFilename(resource: string): string {
  return `hieu-asia-${resource}-${todayStamp()}.csv`;
}

/**
 * Trigger a browser download for the given blob. Cleans up the object URL
 * after the click so we don't leak.
 */
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Defer revoke so Safari/Firefox have time to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Convert an array of plain objects into CSV and trigger a download.
 *
 * @param rows       The rows to export. If empty, emits a header-only file
 *                   (or `(empty)` when no `columnMap` is given) so the user
 *                   still gets feedback.
 * @param filename   Suggested filename (use `fmtCsvFilename`).
 * @param columnMap  Optional `{ key: 'Pretty Label' }`. Keys in the map
 *                   define the column order; only those keys are included.
 *                   If omitted, columns are inferred from `Object.keys(rows[0])`.
 *
 * @example
 * exportToCSV(users, fmtCsvFilename('users'), {
 *   email: 'Email',
 *   role: 'Role',
 *   created_at: 'Created',
 * });
 */
export function exportToCSV<T extends CsvRow>(
  rows: T[],
  filename: string,
  columnMap?: Partial<Record<keyof T & string, string>>,
): void {
  const keys: string[] =
    columnMap != null
      ? (Object.keys(columnMap) as string[])
      : rows.length > 0
        ? Object.keys(rows[0] ?? {})
        : [];

  if (keys.length === 0) {
    triggerDownload(
      new Blob(['(empty)\n'], { type: 'text/csv;charset=utf-8' }),
      filename,
    );
    return;
  }

  const header = keys
    .map((k) => escapeCell(columnMap?.[k as keyof T & string] ?? k))
    .join(',');
  const body = rows
    .map((r) => keys.map((k) => escapeCell(r[k as keyof T])).join(','))
    .join('\r\n');

  // BOM helps Excel detect UTF-8 (Vietnamese diacritics).
  const csv = `﻿${header}\r\n${body}`;
  triggerDownload(
    new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    filename,
  );
}
