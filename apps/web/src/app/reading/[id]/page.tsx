import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

const ID_REGEX = /^[A-Za-z0-9_-]{3,64}$/;

/**
 * Bare /reading/[id] — redirect to the canonical entry point of the flow.
 *
 * The canonical entry point is /processing: orchestration kicks off at
 * createReading() from birth data, and the old /upload + /survey steps are no
 * longer in the live flow (their palm/personality inputs aren't consumed by the
 * report pipeline). Sub-route pages read sessionStorage themselves.
 *
 * Invalid id → /reading?invalid=1 (the hub shows a soft hint).
 */
export default async function ReadingIdIndexPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!ID_REGEX.test(id)) redirect('/reading?invalid=1');
  redirect(`/reading/${id}/processing`);
}
