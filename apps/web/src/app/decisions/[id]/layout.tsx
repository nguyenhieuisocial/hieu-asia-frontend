import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

const ID_REGEX = /^[A-Za-z0-9_-]{3,64}$/;

/**
 * Guards /decisions/[id]/* — invalid slugs bounce back to /decisions
 * before any client code runs. Defence against link-spam / XSS via param.
 */
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!ID_REGEX.test(id)) redirect('/decisions');
  return children;
}
