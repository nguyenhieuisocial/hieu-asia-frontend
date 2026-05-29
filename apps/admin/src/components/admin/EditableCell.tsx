'use client';

/**
 * Wave 60.10 — Vault 102 §A inline-edit cell.
 *
 * Drop-in replacement for read-only `<td>` content in admin tables. Click
 * the value → it becomes an `<input>` or `<select>` → blur or Enter saves
 * via the caller-provided `onSave` (PATCH/RPC); Escape cancels.
 *
 * Two variants:
 *   - `variant="text"`   → text/email/number input, save on Enter or blur
 *   - `variant="select"` → dropdown, save immediately on change
 *
 * The `display` prop accepts a renderer so callers can preserve styled
 * pills/badges in read mode (e.g. role chip with icon) while only the
 * editor swaps in on click. `disabled` hides the edit affordance entirely
 * — useful for "owner" rows that must go through the full modal flow.
 *
 * a11y: button-based affordance, role=status for error, aria-label echoes
 * the field semantics. Escape cancels even if editor not focused.
 */

import * as React from 'react';
import { cn } from '@hieu-asia/ui';
import { Loader2 } from 'lucide-react';
import { useInlineEdit } from '@/hooks/useInlineEdit';

interface EditableCellBaseProps<T extends string> {
  value: T;
  onSave: (value: T) => Promise<void>;
  /** Custom renderer for read mode. Default: raw value as string. */
  display?: (v: T) => React.ReactNode;
  /** When true, the value renders as plain text (no click affordance). */
  disabled?: boolean;
  /** Tooltip when disabled. */
  disabledReason?: string;
  /** ARIA label for the editor input. */
  ariaLabel?: string;
  /** Wave 60.13 — forwards to `useInlineEdit` Sentry breadcrumb (e.g.
   * "users.role", "coupons.notes"). Lets Sentry post-mortem filter
   * inline-edit events by surface. Falsy = no tag emitted. Values NEVER
   * appear in breadcrumb data (PII-safe). */
  breadcrumbTag?: string;
  className?: string;
}

// Text variant always works at the `string` level — free input can't honour
// a narrower union — so it's locked to T=string regardless of the outer T.
interface EditableTextCellProps extends EditableCellBaseProps<string> {
  variant: 'text';
  type?: 'text' | 'email' | 'number';
  placeholder?: string;
}

// Select variant respects the caller's narrower union so option/value/onSave
// stay type-safe end-to-end (no `as AdminRole` cast tax at call sites).
interface EditableSelectCellProps<T extends string> extends EditableCellBaseProps<T> {
  variant: 'select';
  options: ReadonlyArray<{ value: T; label: string }>;
}

export type EditableCellProps<T extends string = string> =
  | EditableTextCellProps
  | EditableSelectCellProps<T>;

export function EditableCell<T extends string = string>(props: EditableCellProps<T>) {
  const { value, onSave, display, disabled, disabledReason, ariaLabel, breadcrumbTag, className } = props;
  // Internal hook uses T (or string for text variant); cast at this single
  // boundary lets the public API stay generic without leaking `as T` to JSX.
  const edit = useInlineEdit<T | string>({
    initialValue: value,
    onSave: onSave as (v: T | string) => Promise<void>,
    breadcrumbTag,
  });

  // Discriminant-narrowed display caller. Without this helper, calling
  // `display(value)` widens to `((v: T)=>RN) | ((v: string)=>RN)` applied
  // to `T | string`, which TS rejects (contravariant intersection). The
  // helper proves to TS that the function and its argument come from the
  // same variant branch.
  const renderRead = (): React.ReactNode => {
    if (!display) return String(value);
    return props.variant === 'select'
      ? props.display!(props.value)
      : props.display!(props.value);
  };
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const selectRef = React.useRef<HTMLSelectElement | null>(null);

  React.useEffect(() => {
    if (!edit.editing) return;
    if (props.variant === 'text') {
      inputRef.current?.focus();
      inputRef.current?.select();
    } else {
      selectRef.current?.focus();
    }
  }, [edit.editing, props.variant]);

  if (disabled) {
    return (
      <span className={cn('inline-block', className)} title={disabledReason}>
        {renderRead()}
      </span>
    );
  }

  if (!edit.editing) {
    return (
      <button
        type="button"
        onClick={edit.startEdit}
        className={cn(
          'group inline-flex items-center gap-1 text-left',
          'cursor-pointer rounded transition-colors',
          'hover:underline hover:underline-offset-2 hover:decoration-dotted hover:decoration-gold/60',
          'focus:outline-none focus:ring-1 focus:ring-ochre dark:focus:ring-gold',
          edit.error && 'text-red-700 dark:text-red-300',
          className,
        )}
        title={edit.error ?? 'Nhấn để sửa'}
        aria-label={ariaLabel ? `${ariaLabel}: ${String(value)}. Nhấn để sửa.` : 'Nhấn để sửa'}
      >
        {renderRead()}
        {edit.error && (
          <>
            {/* Visual glyph */}
            <span className="ml-1 font-mono text-[10px] text-red-700 dark:text-red-300" aria-hidden>
              ⚠
            </span>
            {/* Screen-reader announcement carries the actual error string,
                not just the glyph. role=status + aria-live=polite lets SR
                users hear "Lưu thất bại: <reason>" without focus shift. */}
            <span className="sr-only" role="status" aria-live="polite">
              Lỗi: {edit.error}
            </span>
          </>
        )}
      </button>
    );
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      edit.cancel();
    } else if (e.key === 'Enter' && props.variant === 'text') {
      e.preventDefault();
      edit.save();
    }
  };

  if (props.variant === 'select') {
    return (
      <span className={cn('inline-flex items-center gap-1', className)}>
        <select
          ref={selectRef}
          value={edit.draft as string}
          disabled={edit.saving}
          onChange={(e) => {
            // `e.target.value` is always a string; safe to widen because
            // <option> values come from props.options where value: T extends string.
            const next = e.target.value as T;
            edit.setDraft(next);
            // Save immediately on select-change — matches native dropdown UX.
            // Pass `next` explicitly: setDraft hasn't flushed yet, so calling
            // save() bare would read the previous draft and persist it.
            edit.save(next);
          }}
          onBlur={() => {
            if (!edit.saving && edit.draft === value) edit.cancel();
          }}
          onKeyDown={onKey}
          aria-label={ariaLabel}
          className={cn(
            'rounded border border-gold/40 bg-card/80 px-2 py-0.5 text-sm text-foreground',
            'focus:border-gold focus:outline-none',
            edit.saving && 'opacity-50',
          )}
        >
          {props.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {edit.saving && <Loader2 className="h-3 w-3 animate-spin text-gold/70" aria-hidden />}
      </span>
    );
  }

  // text variant
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <input
        ref={inputRef}
        type={props.type ?? 'text'}
        value={edit.draft as string}
        disabled={edit.saving}
        placeholder={props.placeholder}
        onChange={(e) => edit.setDraft(e.target.value)}
        onBlur={() => {
          if (!edit.saving && edit.draft !== value) edit.save();
          else if (!edit.saving) edit.cancel();
        }}
        onKeyDown={onKey}
        aria-label={ariaLabel}
        className={cn(
          'w-full rounded border border-gold/40 bg-card/80 px-2 py-0.5 text-sm text-foreground',
          'focus:border-gold focus:outline-none',
          edit.saving && 'opacity-50',
        )}
      />
      {edit.saving && <Loader2 className="h-3 w-3 animate-spin text-gold/70" aria-hidden />}
    </span>
  );
}
