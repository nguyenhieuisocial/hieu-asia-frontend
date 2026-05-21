/**
 * /unlock/[session_id] — server component.
 *
 * Validates the `tier` query param and renders <PaymentClient />, which
 * creates the intent + polls status. Server-side validation guards against
 * arbitrary tier values reaching the payment intent proxy.
 */

import Link from 'next/link';
import { PaymentClient } from './PaymentClient';

type Tier = 'premium' | 'subscription_monthly' | 'subscription_yearly';

const VALID_TIERS: ReadonlySet<Tier> = new Set([
  'premium',
  'subscription_monthly',
  'subscription_yearly',
]);

function parseTier(value: string | string[] | undefined): Tier | null {
  if (typeof value !== 'string') return null;
  return VALID_TIERS.has(value as Tier) ? (value as Tier) : null;
}

interface UnlockPageProps {
  params: Promise<{ session_id: string }>;
  searchParams: Promise<{ tier?: string | string[] }>;
}

export default async function UnlockPage({
  params,
  searchParams,
}: UnlockPageProps) {
  const { session_id } = await params;
  const sp = await searchParams;
  const tier = parseTier(sp.tier);

  if (!tier) {
    return (
      <main className="container mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-heading text-2xl text-cream">
          Thiếu thông tin gói thanh toán
        </h1>
        <p className="mt-3 text-sm text-cream/70">
          Vui lòng chọn gói tại trang định giá để tiếp tục.
        </p>
        <Link
          href={`/pricing?session=${encodeURIComponent(session_id)}`}
          className="mt-6 inline-block rounded-md border border-gold/40 px-4 py-2 text-sm text-gold hover:bg-gold/10"
        >
          Xem các gói →
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-6 flex items-center justify-between">
        <Link
          href={`/pricing?session=${encodeURIComponent(session_id)}`}
          className="text-sm text-cream/60 hover:text-gold"
        >
          ← Đổi gói
        </Link>
        <span className="font-heading text-lg text-gold">hieu.asia</span>
      </header>

      <PaymentClient sessionId={session_id} tier={tier} />
    </main>
  );
}
