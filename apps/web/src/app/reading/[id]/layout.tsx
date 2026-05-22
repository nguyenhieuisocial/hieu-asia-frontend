import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

const ID_REGEX = /^[A-Za-z0-9_-]{3,64}$/;

/**
 * Guards every /reading/[id]/* route. Invalid id → hub with a soft hint.
 * Children stay client components; layout runs on the server first.
 */
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!ID_REGEX.test(id)) redirect('/reading?invalid=1');
  return children;
}
