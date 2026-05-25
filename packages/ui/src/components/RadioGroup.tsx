'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange: (value: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function RadioGroup({
  name,
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: RadioGroupProps) {
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const handle = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  return (
    <RadioGroupContext.Provider value={{ name, value: current, onChange: handle }}>
      <div role="radiogroup" className={cn('grid gap-2', className)} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export interface RadioGroupItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'name'> {
  value: string;
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  function RadioGroupItem({ value, className, ...props }, ref) {
    const ctx = React.useContext(RadioGroupContext);
    if (!ctx) throw new Error('RadioGroupItem must be used inside RadioGroup');

    return (
      <input
        ref={ref}
        type="radio"
        name={ctx.name}
        value={value}
        checked={ctx.value === value}
        onChange={() => ctx.onChange(value)}
        className={cn(
          'h-4 w-4 shrink-0 cursor-pointer border border-gold/40 bg-card accent-gold',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);
