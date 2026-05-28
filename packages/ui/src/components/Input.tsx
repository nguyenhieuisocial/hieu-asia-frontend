import * as React from 'react';
import { cn } from '../lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = 'text', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        // Wave 60.97.1 — `min-h-11` on mobile (≥44px tap target per WCAG
        // 2.5.5 + Apple HIG), relaxed back to `sm:min-h-10` on tablet+
        // where pointer precision is higher. `touch-manipulation` removes
        // the iOS double-tap-zoom 300ms delay.
        'flex h-10 min-h-11 w-full rounded-md border border-gold/25 bg-card px-3 py-2 text-sm text-foreground touch-manipulation sm:min-h-10',
        'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
});
