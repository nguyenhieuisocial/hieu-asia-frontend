'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
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
      type="button"
      role="switch"
      aria-checked={isOn}
      disabled={disabled}
      onClick={toggle}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-gold/30 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
        'disabled:cursor-not-allowed disabled:opacity-50',
        isOn ? 'bg-gold' : 'bg-ink/60',
        className,
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-cream shadow-sm transition-transform',
          isOn ? 'translate-x-6' : 'translate-x-1',
        )}
      />
      <input ref={ref} type="checkbox" className="sr-only" checked={isOn} readOnly {...props} />
    </button>
  );
});
