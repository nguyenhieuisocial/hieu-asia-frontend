import * as React from 'react';
import { cn } from '../lib/utils';

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Optional helper to render tick labels. */
  ticks?: string[];
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { className, ticks, ...props },
  ref,
) {
  return (
    <div className="w-full">
      <input
        ref={ref}
        type="range"
        className={cn(
          'h-2 w-full cursor-pointer appearance-none rounded-full bg-gold/20 accent-gold',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
          className,
        )}
        {...props}
      />
      {ticks && ticks.length > 0 && (
        <div className="mt-2 flex justify-between text-xs text-cream/60">
          {ticks.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
});
