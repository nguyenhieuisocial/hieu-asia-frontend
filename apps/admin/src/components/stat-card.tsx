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
        'rounded-lg border border-gold/15 bg-ink/50 p-5 backdrop-blur-sm transition-colors hover:border-gold/30',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-cream/55">{label}</p>
        {icon && <span className="text-gold/70">{icon}</span>}
      </div>
      <p className="mt-2 font-heading text-3xl font-semibold text-cream">{value}</p>
      <div className="mt-1 flex items-center gap-2 text-xs">
        {delta && (
          <span
            className={cn(
              'rounded px-1.5 py-0.5 font-mono',
              delta.direction === 'up' && 'bg-jade/15 text-jade-50',
              delta.direction === 'down' && 'bg-red-500/15 text-red-300',
              delta.direction === 'flat' && 'bg-cream/5 text-cream/60',
            )}
          >
            {delta.direction === 'up' && '↑ '}
            {delta.direction === 'down' && '↓ '}
            {delta.value}
          </span>
        )}
        {hint && <span className="text-cream/55">{hint}</span>}
      </div>
    </div>
  );
}
