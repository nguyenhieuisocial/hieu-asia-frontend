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
  /** Optional badge (e.g. <LiveBadge/>) shown next to the title. */
  badge?: React.ReactNode;
  /** Right-aligned action area (buttons, range pickers, …). */
  actions?: React.ReactNode;
  /** Optional icon on the left. */
  icon?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  icon,
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
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-cream">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="mt-1 max-w-3xl text-sm text-cream/65">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
