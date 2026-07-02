import type { Metadata } from 'next';

// SEO-FIX: noindex. /connect-telegram is a client-only account-linking action
// page (reads a single-use ?token after tapping "Kết nối" in @hieuasiabot) with
// no organic search value. Being a 'use client' page it cannot export metadata
// itself, so this layout applies the robots policy. Also stops it registering as
// an Ahrefs "orphan page" (it has, and needs, no incoming internal links).
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
