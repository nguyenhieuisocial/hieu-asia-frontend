'use client';

/**
 * Client wrapper that lazy-loads the heavy, below-the-fold, interaction-only
 * MentorSampleInteractive demo (~27KB, renders no SSR/SEO text).
 *
 * Hydration: a `mounted` gate renders the SAME `<Placeholder>` `<section>` on
 * the SERVER and the FIRST client render, then swaps to the `ssr:false` dynamic
 * only AFTER mount. Without this, Next 15 / React 19 emit an empty `<template>`
 * placeholder for `ssr:false` on the server, which mismatches the client
 * `<section>` → hydration error #418 (the whole homepage tree then re-renders
 * client-side). The 27KB chunk still loads only on the client (lazy preserved),
 * and the placeholder reserves height to avoid layout shift.
 */

import * as React from 'react';
import dynamic from 'next/dynamic';

function Placeholder(): React.JSX.Element {
  return (
    <section aria-hidden className="bg-muted/50 py-12 md:py-14">
      <div className="mx-auto max-w-marketing px-6 lg:px-12">
        <div className="mx-auto min-h-[520px] max-w-marketing-tight" />
      </div>
    </section>
  );
}

const MentorSampleInteractive = dynamic(
  () => import('./MentorSampleInteractive').then((m) => m.MentorSampleInteractive),
  { ssr: false, loading: () => <Placeholder /> },
);

export function MentorSampleLazy(): React.JSX.Element {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  // Server + first client render = identical placeholder → no #418. The dynamic
  // (ssr:false) only mounts after hydration, so its <template> never reaches SSR.
  if (!mounted) return <Placeholder />;
  return <MentorSampleInteractive />;
}
