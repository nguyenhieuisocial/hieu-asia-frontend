'use client';

/**
 * Reusable page header with title + description + optional right-aligned actions.
 * Used on every admin page for consistent typography & spacing.
 */

import * as React from 'react';
import { cn } from '@hieu-asia/ui';

export interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Optional eyebrow row ABOVE the title (context label, status badges, …).
   *  Used by detail pages (/customers/[id], /sessions/[id]). */
  eyebrow?: React.ReactNode;
  /** Optional badge (e.g. <LiveBadge/>) shown next to the title. */
  badge?: React.ReactNode;
  /** Right-aligned action area (buttons, range pickers, …). */
  actions?: React.ReactNode;
  /** Optional icon on the left. */
  icon?: React.ReactNode;
  /** Optional meta row UNDER the description (id chips, copy buttons, …). */
  meta?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  badge,
  actions,
  icon,
  meta,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-4', className)}>
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <div className="mt-1 rounded-md border border-gold/20 bg-gradient-to-br from-gold/15 to-gold/0 p-2 text-gold">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          {eyebrow && <div className="mb-2 flex flex-wrap items-center gap-2">{eyebrow}</div>}
          <div className="flex items-center gap-2">
            <h1 className="min-w-0 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>
          )}
          {meta && <div className="mt-1 flex flex-wrap items-center gap-2">{meta}</div>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
