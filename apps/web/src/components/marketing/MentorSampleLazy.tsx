'use client';

/**
 * Client wrapper that lazy-loads the heavy, below-the-fold, interaction-only
 * MentorSampleInteractive demo (~27KB, renders no SSR/SEO text). `ssr: false`
 * with `next/dynamic` is only allowed inside a Client Component, so this thin
 * wrapper exists to be imported by the (server) homepage. The placeholder
 * mirrors the section band + reserves height to avoid layout shift on mount.
 */

import dynamic from 'next/dynamic';

const MentorSampleInteractive = dynamic(
  () =>
    import('./MentorSampleInteractive').then((m) => m.MentorSampleInteractive),
  {
    ssr: false,
    loading: () => (
      <section aria-hidden className="bg-muted/50 py-12 md:py-14">
        <div className="mx-auto max-w-marketing px-6 lg:px-12">
          <div className="mx-auto min-h-[520px] max-w-marketing-tight" />
        </div>
      </section>
    ),
  },
);

export function MentorSampleLazy() {
  return <MentorSampleInteractive />;
}
