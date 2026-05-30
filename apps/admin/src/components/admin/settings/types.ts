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

export interface NotificationPrefs {
  email_digest: 'daily' | 'weekly' | 'off';
  slack_webhook_url: string;
  telegram_bot_token: string;
  critical_alerts_enabled: boolean;
}

export interface AdminProfile {
  email: string;
  display_name: string | null;
  role: 'owner' | 'admin' | 'viewer';
  last_login_at: string | null;
}

export type RetentionDays = 30 | 90 | 365 | 0; // 0 = forever

export const SCOPE_OPTIONS = [
  { id: 'admin:read', label: 'Đọc dữ liệu admin' },
  { id: 'admin:write', label: 'Ghi mutation admin' },
  { id: 'metrics:read', label: 'Đọc metrics + analytics' },
  { id: 'audit:read', label: 'Đọc audit log' },
  { id: 'users:read', label: 'Đọc users' },
  { id: 'users:write', label: 'Ghi user mutation' },
] as const;

export type ScopeId = (typeof SCOPE_OPTIONS)[number]['id'];
