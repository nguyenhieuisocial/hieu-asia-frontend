import * as React from 'react';
import { cn } from '@hieu-asia/ui';

export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  delta?: { value: string; direction: 'up' | 'down' | 'flat' };
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, hint, delta, icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gold/15 bg-card/50 p-5 backdrop-blur-sm transition-colors hover:border-gold/30',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
        {icon && <span className="text-gold/70">{icon}</span>}
      </div>
      <p className="mt-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">{value}</p>
      <div className="mt-1 flex items-center gap-2 text-xs">
        {delta && (
          <span
            className={cn(
              'rounded px-1.5 py-0.5 font-mono',
              delta.direction === 'up' && 'bg-jade/15 text-jade-700 dark:text-jade-50',
              delta.direction === 'down' && 'bg-red-500/15 text-red-700 dark:text-red-300',
              delta.direction === 'flat' && 'bg-muted/30 text-muted-foreground',
            )}
          >
            {delta.direction === 'up' && '↑ '}
            {delta.direction === 'down' && '↓ '}
            {delta.value}
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
