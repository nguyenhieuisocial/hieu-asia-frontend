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

// Relative time — re-export từ @/lib/format (gom formatter 2026-07-03).
export { fmtRelative } from '@/lib/format';

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
