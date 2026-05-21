'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@hieu-asia/ui';

export interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}

/**
 * Centered placeholder for zero-data states. Optional icon, title, description,
 * and a single primary CTA (either link or button).
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-16 text-center',
        className,
      )}
    >
      {icon && (
        <div className="mb-4 text-gold/60 [&>svg]:h-12 [&>svg]:w-12">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-cream">{title}</h3>
      {description && (
        <p className="mb-6 max-w-md text-sm text-cream/60">{description}</p>
      )}
      {action &&
        (action.href ? (
          <Link
            href={action.href}
            className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-ink hover:bg-gold/90"
          >
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-ink hover:bg-gold/90"
          >
            {action.label}
          </button>
        ))}
    </div>
  );
}
