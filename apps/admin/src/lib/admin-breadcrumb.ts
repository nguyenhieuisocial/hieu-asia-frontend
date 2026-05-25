/**
 * Wave 60.16 — extracted from inline Sentry calls duplicated across Wave 60.14
 * (users page) + Wave 60.15 (coupons / feature-flags). Emits a Sentry
 * breadcrumb under `category=admin.mutation` so post-mortem queries stay
 * consistent across the admin surface.
 *
 * Tag convention:   "<page>.<action>"  e.g. "users.delete", "coupons.revoke"
 * Kind convention:  "attempt" / "success" / "failure" / "result" / etc.
 * Level:            auto-warning when `kind === 'failure'`. Pass `level`
 *                   explicitly for partial results (e.g. bulk: 'warning'
 *                   when any item failed, 'info' otherwise).
 *
 * Note: `useInlineEdit` emits its own breadcrumbs under
 * `category=admin.inline-edit` (Wave 60.13). Separate category so cell-edit
 * UX traces stay distinct from page-level mutation traces in Sentry filters.
 *
 * PII contract — caller is responsible for keeping `data` PII-safe.
 * Default-safe recipes:
 *   ✅ aggregate counts (ok/fail), durations
 *   ✅ field changed boolean
 *   ✅ trimmed error message (cap at 200 chars per Wave 60.13 precedent)
 *   ✅ operational config flags (e.g. feature-flag key + enabled state)
 *   ❌ user IDs, emails, display_name, coupon codes — NEVER include
 */

import * as Sentry from '@sentry/nextjs';

export type BreadcrumbLevel = 'info' | 'warning';

export function trackAdminMutation(
  tag: string,
  kind: string,
  data?: Record<string, unknown>,
  level?: BreadcrumbLevel,
): void {
  Sentry.addBreadcrumb({
    category: 'admin.mutation',
    message: `${tag}:${kind}`,
    level: level ?? (kind === 'failure' ? 'warning' : 'info'),
    data,
  });
}
