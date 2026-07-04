import type { ReactNode } from 'react';

// Metadata for /affiliate lives in page.tsx (single source, includes the
// canonical OG image). This layout is a passthrough for the affiliate segment.
export default function AffiliateLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
