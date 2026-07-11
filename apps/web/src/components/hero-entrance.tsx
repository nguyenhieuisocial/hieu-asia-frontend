'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function HeroEntrance({ children }: { children: React.ReactNode }) {
  // Respect prefers-reduced-motion: the global CSS `*` reset can't neutralise a
  // JS-driven framer entrance (it sets transform/opacity per frame), so skip the
  // animation and render at the final state instead. (note 167 · T25)
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={reduce ? undefined : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
