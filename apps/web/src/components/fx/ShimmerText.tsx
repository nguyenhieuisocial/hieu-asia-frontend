import * as React from 'react';

/**
 * ShimmerText — a slow gold "light sweep" travelling across the text.
 *
 * Uses the shared `.fx-shimmer` class (gradient + keyframe defined once in
 * globals.css) so NO per-instance `<style>` is injected — keeps heading
 * textContent clean (important for the LCP <h1>) and avoids invalid `<style>`
 * nesting inside phrasing elements. Inherits font/size from where it's used.
 * Under prefers-reduced-motion it renders as a solid ochre/gold gradient with
 * no sweep. Decorative shine only — keep real meaning in surrounding copy.
 */
export function ShimmerText({
  children,
  className = '',
  as: Tag = 'span',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'span' | 'strong' | 'em';
}): React.JSX.Element {
  return <Tag className={`fx-shimmer ${className}`.trim()}>{children}</Tag>;
}
