import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

const ID_REGEX = /^[A-Za-z0-9_-]{3,64}$/;

/**
 * Bare /reading/[id] — redirect to the canonical entry point of the flow.
 *
 * Phase-1 has no server-side session state (sessions live in sessionStorage),
 * so the safe default is /upload — the first step. If the user is further
 * along, sub-route pages will pick that up from sessionStorage themselves.
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
  redirect(`/reading/${id}/upload`);
}
