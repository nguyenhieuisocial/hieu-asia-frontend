/**
 * Shared formatters for /customers list + detail (Wave 60.71.T2.customers).
 *
 * Re-export từ `@/lib/format` (gom formatter 2026-07-03) — giữ tên cũ:
 * `fmtDate` ở đây từ đầu vẫn render NGÀY + GIỜ nên trỏ về fmtDateTime.
 */

export { fmtDateTime as fmtDate, fmtRelative } from '@/lib/format';
