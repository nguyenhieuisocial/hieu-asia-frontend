'use client';

import * as React from 'react';

type Props = {
  words: string[];
  interval?: number;
  className?: string;
};

/**
 * TextRotate — fades between a list of words on a fixed interval.
 *
 * ALL words are rendered into the DOM (stacked in one grid cell, only the active
 * one visible). This is deliberate: Google Translate translates DOM text once at
 * load, so by keeping every word present it can translate them ALL — the
 * rotation then cycles through already-translated words. (The old version
 * rendered only the current word and swapped it via JS, so every rotated word
 * appeared untranslated under Google Translate.)
 *
 * Stacking in a single grid cell also sizes the slot to the widest word → no
 * layout jitter. Respects prefers-reduced-motion (no rotation, first word only).
 */
export function TextRotate({ words, interval = 2200, className }: Props) {
  const [index, setIndex] = React.useState(0);
  const [reduce, setReduce] = React.useState(false);

  React.useEffect(() => {
    setReduce(
      typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
  }, []);

  React.useEffect(() => {
    if (reduce || words.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [reduce, words.length, interval]);

  return (
    <span
      className={['relative inline-grid align-bottom', className].filter(Boolean).join(' ')}
      aria-live="polite"
    >
      {words.map((w, i) => (
        <span
          key={w}
          aria-hidden={i !== index}
          className="bg-gold-gradient bg-clip-text text-transparent"
          style={{
            gridArea: '1 / 1',
            opacity: i === index ? 1 : 0,
            transform: i === index ? 'translateY(0)' : 'translateY(0.18em)',
            transition: reduce ? 'none' : 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
            pointerEvents: i === index ? 'auto' : 'none',
          }}
        >
          {w}
        </span>
      ))}
    </span>
  );
}
