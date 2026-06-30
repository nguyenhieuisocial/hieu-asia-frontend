'use client';

import * as React from 'react';

/**
 * ShimmerText — a slow gold "light sweep" travelling across the text.
 *
 * CSS background-clip:text gradient animation. Inherits font/size from the
 * element it's used in. Under prefers-reduced-motion it renders as a solid
 * ochre/gold gradient with no sweep. Decorative shine only — keep real
 * meaning in surrounding copy.
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
  const id = React.useId().replace(/[:]/g, '');
  return (
    <Tag className={className} style={{ position: 'relative', display: 'inline-block' }}>
      <style>{`
        @keyframes shimmer-${id}{ 0%{background-position:-150% 0} 100%{background-position:250% 0} }
        .shm-${id}{
          background:linear-gradient(100deg,#A47532 0%,#A47532 38%,#F5E1AA 50%,#A47532 62%,#A47532 100%);
          background-size:250% 100%;
          -webkit-background-clip:text;background-clip:text;
          -webkit-text-fill-color:transparent;color:transparent;
          animation:shimmer-${id} 4.5s linear infinite;
        }
        @media (prefers-reduced-motion: reduce){
          .shm-${id}{animation:none;background:linear-gradient(100deg,#A47532,#D4A261);background-clip:text;-webkit-background-clip:text;}
        }
      `}</style>
      <span className={`shm-${id}`}>{children}</span>
    </Tag>
  );
}
