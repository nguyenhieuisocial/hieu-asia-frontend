import type { Metadata } from 'next';

// Route retired (redirects to /affiliate/dashboard) — keep it out of the index.
export const metadata: Metadata = {
  title: 'Cộng tác viên hieu.asia',
  robots: { index: false, follow: false },
};

export default function L({ children }: { children: React.ReactNode }) {
  return children;
}
