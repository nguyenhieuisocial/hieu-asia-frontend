import * as React from 'react';
import { cn } from '../lib/utils';

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Animated placeholder for loading states. Uses Tailwind's built-in `animate-pulse`
 * so no extra plugin is required.
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-cream/10', className)}
      {...props}
    />
  );
}
