/**
 * Shared formatters for /customers list + detail (Wave 60.71.T2.customers).
 */

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

export function fmtRelative(iso: string | null | undefined): string {
  if (!iso) return '';
  try {
    const t = new Date(iso).getTime();
    const diff = Date.now() - t;
    const d = Math.floor(diff / 86_400_000);
    if (d < 1) {
      const h = Math.floor(diff / 3_600_000);
      if (h < 1) return 'vừa xong';
      return `${h}h trước`;
    }
    if (d < 7) return `${d} ngày trước`;
    if (d < 30) return `${Math.floor(d / 7)} tuần trước`;
    return `${Math.floor(d / 30)} tháng trước`;
  } catch {
    return '';
  }
}
