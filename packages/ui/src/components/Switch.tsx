'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

/**
 * Wave 60.34b — A11y fix. The previous implementation nested a
 * hidden `<input type="checkbox">` inside the `<button role="switch">`.
 * Axe-core flagged it as `nested-interactive` (sub-agent Playwright
 * repro on /onboarding via BirthDataForm). The hidden input was
 * unnecessary: a `<button role="switch" aria-checked>` is a valid
 * ARIA pattern on its own — screen readers + keyboard work without
 * a backing checkbox (matches Radix / shadcn `Switch` convention).
 *
 * Breaking change: ref type changed `HTMLInputElement` → `HTMLButtonElement`.
 * No callers in apps/web or apps/admin use `ref` on `<Switch>` (verified
 * via grep) so the type bump is safe today. If form submission ever
 * needs the value, render a sibling `<input type="hidden" name=... value=...>`
 * outside the button (kept hidden = non-interactive = axe-safe).
 */
export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick' | 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { className, checked, defaultChecked, onCheckedChange, disabled, ...props },
  ref,
) {
  const [internal, setInternal] = React.useState<boolean>(Boolean(defaultChecked));
  const isControlled = checked !== undefined;
  const isOn = isControlled ? Boolean(checked) : internal;

  const toggle = () => {
    if (disabled) return;
    const next = !isOn;
    if (!isControlled) setInternal(next);
    onCheckedChange?.(next);
  };

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={isOn}
      disabled={disabled}
      onClick={toggle}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-gold/30 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
        'disabled:cursor-not-allowed disabled:opacity-50',
        isOn ? 'bg-gold' : 'bg-card',
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-cream shadow-sm transition-transform',
          isOn ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  );
});
