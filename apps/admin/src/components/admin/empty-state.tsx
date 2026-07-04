'use client';

/**
 * Illustrated empty-state. Used when a table/list has zero rows.
 *
 * We avoid raster art and ship a small inline SVG with a gold/purple sparkle
 * motif that matches the brand. The illustration prop accepts a custom node
 * so each page can override (e.g. specific icons for sessions vs cost).
 */

import * as React from 'react';
import { cn } from '@hieu-asia/ui';
import { Sparkles } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description?: React.ReactNode;
  /** Optional illustration node. Defaults to a Sparkles glyph. */
  illustration?: React.ReactNode;
  /** Primary CTA element (e.g. <Button> or <Link>). */
  action?: React.ReactNode;
  /** Secondary, smaller. */
  secondaryAction?: React.ReactNode;
  /** Compact variant for in-card / drawer sections: no illustration, tighter
   *  padding. Default (false) keeps the full illustrated block. */
  compact?: boolean;
  className?: string;
}

function DefaultIllustration() {
  return (
    <div className="relative mx-auto h-20 w-20" aria-hidden>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/20 via-purple/15 to-jade/15 blur-xl" />
      <div className="relative flex h-full w-full items-center justify-center rounded-full border border-gold/30 bg-card/60 backdrop-blur-sm">
        <Sparkles className="h-9 w-9 text-gold/70" />
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  illustration,
  action,
  secondaryAction,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact
          ? 'gap-1.5 rounded-lg border border-dashed border-gold/15 bg-card/40 px-4 py-6'
          : 'gap-4 rounded-xl border border-dashed border-gold/20 bg-card/50 px-6 py-12',
        className,
      )}
    >
      {!compact && (illustration ?? <DefaultIllustration />)}
      <div className="max-w-md space-y-1.5">
        <h3
          className={cn(
            'font-heading font-semibold text-foreground',
            compact ? 'text-sm' : 'text-lg',
          )}
        >
          {title}
        </h3>
        {description && (
          <p className={cn('text-muted-foreground', compact ? 'text-xs' : 'text-sm')}>
            {description}
          </p>
        )}
      </div>
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
