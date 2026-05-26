import type { ReactNode } from 'react';

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <main className="bg-warm-dark-50 text-cream-50 min-h-screen">
      {children}
    </main>
  );
}
