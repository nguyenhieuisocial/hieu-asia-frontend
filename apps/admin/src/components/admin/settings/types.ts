/**
 * Wave 60.81.D — shared types for /settings components.
 */

export interface AdminApiKey {
  id: string;
  name: string;
  scopes: string[];
  /** Worker returns `key_prefix` (last 4 chars) — was mistyped as `prefix`. */
  key_prefix: string;
  created_by: string | null;
  created_at: string;
  revoked_at: string | null;
  /** Not tracked by migration 0041 yet — optional so the UI degrades to "—". */
  last_used_at?: string | null;
  expires_at?: string | null;
}

/**
 * Mirrors the backend KV shape exactly (wave-60-82.ts NotificationPrefs).
 * The backend stores only these three booleans; any other field is silently
 * dropped on PATCH, so the tab must read+write exactly these.
 */
export interface NotificationPrefs {
  email_alerts: boolean;
  sentry_high_priority: boolean;
  weekly_digest: boolean;
}

export interface AdminProfile {
  email: string;
  display_name: string | null;
  role: 'owner' | 'admin' | 'viewer';
  last_login_at: string | null;
}

// Backend (wave-60-82.ts handleRetentionPatch) accepts 7–730 only; there is no
// "forever" sentinel, so 0 is not a valid option.
export type RetentionDays = 30 | 90 | 365 | 730;

/**
 * Operator-editable alert thresholds. Mirrors the backend
 * /admin/settings/alert-thresholds contract 1:1 (six numeric fields).
 * These were previously hardcoded in the worker; the backend now persists
 * them in KV so a solo operator can tune alerting without a redeploy.
 *
 * Defaults: errors_per_hour=2, llm_cost_usd_per_day=50,
 * signup_drop_ratio=0.5, ai_balance_usd=3, queue_warn_seconds=3600,
 * queue_critical_seconds=14400.
 */
export interface AlertThresholds {
  errors_per_hour: number;
  llm_cost_usd_per_day: number;
  signup_drop_ratio: number;
  ai_balance_usd: number;
  queue_warn_seconds: number;
  queue_critical_seconds: number;
}

export const SCOPE_OPTIONS = [
  { id: 'admin:read', label: 'Đọc dữ liệu admin' },
  { id: 'admin:write', label: 'Ghi mutation admin' },
  { id: 'metrics:read', label: 'Đọc metrics + analytics' },
  { id: 'audit:read', label: 'Đọc audit log' },
  { id: 'users:read', label: 'Đọc users' },
  { id: 'users:write', label: 'Ghi user mutation' },
] as const;

export type ScopeId = (typeof SCOPE_OPTIONS)[number]['id'];
