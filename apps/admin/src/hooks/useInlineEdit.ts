'use client';

/**
 * Wave 60.10 — Vault 102 §A inline-edit primitive.
 *
 * Manages the local state machine for "click cell → edit → save/cancel" UX
 * that replaces the multi-step modal flow for trivial admin field edits
 * (role toggle, display-name fix, quota tweak). Save is delegated to the
 * caller via `onSave` so the hook is API-agnostic — works with PATCH /
 * RPC / optimistic mutations alike.
 *
 * Usage:
 *   const edit = useInlineEdit({ initialValue: user.role, onSave });
 *   {edit.editing ? <input value={edit.draft} … /> : <button onClick={edit.startEdit}>…</button>}
 *
 * State machine: idle → editing → saving → (idle | editing-with-error).
 * Errors keep the editor open with the failed draft + error string so the
 * user can correct + retry without losing input.
 */

import * as React from 'react';
import * as Sentry from '@sentry/nextjs';

export interface UseInlineEditOptions<T> {
  initialValue: T;
  onSave: (value: T) => Promise<void>;
  /** Reset draft to `initialValue` after a failed save. Default: false (keep
   * draft so user can retry / edit further). Set true for one-shot saves. */
  rollbackOnError?: boolean;
  /** Optional breadcrumb tag — appears in Sentry breadcrumb `data.tag` so
   * post-mortem search can filter inline-edit events by surface (e.g.
   * "users.role", "coupons.notes"). Falsy = no tag emitted. */
  breadcrumbTag?: string;
}

export interface UseInlineEdit<T> {
  editing: boolean;
  draft: T;
  saving: boolean;
  error: string | null;
  startEdit: () => void;
  cancel: () => void;
  setDraft: (v: T) => void;
  save: (overrideValue?: T) => Promise<void>;
}

export function useInlineEdit<T>({
  initialValue,
  onSave,
  rollbackOnError = false,
  breadcrumbTag,
}: UseInlineEditOptions<T>): UseInlineEdit<T> {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState<T>(initialValue);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Sync draft when the source-of-truth changes externally (parent refresh)
  // — but only when we're NOT editing, to avoid stomping in-flight input.
  React.useEffect(() => {
    if (!editing) setDraft(initialValue);
  }, [initialValue, editing]);

  const startEdit = React.useCallback(() => {
    setDraft(initialValue);
    setError(null);
    setEditing(true);
  }, [initialValue]);

  const cancel = React.useCallback(() => {
    setEditing(false);
    setError(null);
    setDraft(initialValue);
  }, [initialValue]);

  const save = React.useCallback(async (overrideValue?: T) => {
    // `overrideValue` lets a caller that sets the draft and saves in the same
    // tick (e.g. <select> onChange) pass the new value explicitly — `draft`
    // state hasn't flushed yet, so reading it here would persist the STALE value.
    const valueToSave = overrideValue !== undefined ? overrideValue : draft;
    setSaving(true);
    setError(null);
    // Wave 60.13 — Sentry breadcrumb for post-mortem reconstruction of admin
    // action flows. We log only a `changed` boolean + the caller-supplied tag,
    // NEVER raw values, so adopting this hook on PII-bearing fields (email,
    // name) stays GDPR/CCPA-safe out of the box.
    const t0 = Date.now();
    const changed = valueToSave !== initialValue;
    try {
      await onSave(valueToSave);
      Sentry.addBreadcrumb({
        category: 'admin.inline-edit',
        message: 'save:success',
        level: 'info',
        data: { tag: breadcrumbTag, changed, duration_ms: Date.now() - t0 },
      });
      setEditing(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lưu thất bại';
      Sentry.addBreadcrumb({
        category: 'admin.inline-edit',
        message: 'save:failure',
        level: 'warning',
        data: {
          tag: breadcrumbTag,
          changed,
          duration_ms: Date.now() - t0,
          error: msg.slice(0, 200), // cap message length to avoid breadcrumb bloat
        },
      });
      setError(msg);
      if (rollbackOnError) setDraft(initialValue);
    } finally {
      setSaving(false);
    }
  }, [draft, onSave, initialValue, rollbackOnError, breadcrumbTag]);

  return { editing, draft, saving, error, startEdit, cancel, setDraft, save };
}
