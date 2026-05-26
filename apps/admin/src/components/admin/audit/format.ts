/**
 * Wave 60.71.T2.audit — shared formatters + action taxonomy for /audit list.
 */

/** vi-VN short date + medium time (seconds visible — audit forensics). */
export function fmtAuditDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      dateStyle: 'short',
      timeStyle: 'medium',
    });
  } catch {
    return iso;
  }
}

/** "5m", "2h", "3d" — "" when missing. */
export function fmtRelative(iso: string | null | undefined): string {
  if (!iso) return '';
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60_000);
    if (m < 1) return 'vừa xong';
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
  } catch {
    return '';
  }
}

/**
 * Actions considered "critical" for compliance — they erase data, rotate
 * secrets, or revoke commercial credentials. Surface in red on the list and
 * count separately in the KPI strip.
 */
export const CRITICAL_ACTIONS = new Set<string>([
  'user_erased',
  'secret_rotated',
  'coupon_revoked',
  'admin_user_deleted',
  'admin_user_role_changed',
  'feature_flag_force_on',
  'feature_flag_force_off',
]);

export function isCritical(action: string | null | undefined): boolean {
  if (!action) return false;
  return CRITICAL_ACTIONS.has(action);
}

/** Pretty-print JSON for the row popover. Soft-cap at 12 lines to avoid blow-up. */
export function prettyJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value ?? '');
  }
}
