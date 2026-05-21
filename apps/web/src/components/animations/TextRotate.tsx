'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  words: string[];
  interval?: number;
  className?: string;
};

/**
 * TextRotate — fades between a list of words on a fixed interval.
 * Inline-block to keep baseline; min-width prevents layout jitter.
 */
export function TextRotate({ words, interval = 2200, className }: Props) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (words.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <span
      className={['relative inline-flex items-center justify-center', className]
        .filter(Boolean)
        .join(' ')}
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gold-gradient bg-clip-text text-transparent"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
