import type { Metadata } from 'next';

// TODO(founder): /onboarding-wizard chỉ render shell — cân nhắc xoá nếu route đã chết (Wave 58 in-flight).
// Wave 64 — page.tsx is a client component (`'use client'`) so it cannot export
// metadata; this layout carries the noindex policy instead.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function OnboardingWizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
