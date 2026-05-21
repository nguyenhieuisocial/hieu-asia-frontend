/**
 * /affiliate/assets — marketing assets download center.
 * Requires affiliate login (cookie). Server-side proxy injects share URL.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@hieu-asia/ui';
import { AssetCard, type ResolvedAsset } from '@/components/affiliate/AssetCard';

type Filter = 'all' | 'banner' | 'video' | 'text' | 'qr' | 'logo';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'banner', label: 'Banner' },
  { key: 'video', label: 'Video' },
  { key: 'text', label: 'Caption' },
  { key: 'qr', label: 'QR' },
  { key: 'logo', label: 'Logo' },
];

export default function AffiliateAssetsPage() {
  const [assets, setAssets] = React.useState<ResolvedAsset[] | null>(null);
  const [filter, setFilter] = React.useState<Filter>('all');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/affiliate/assets', { cache: 'no-store' })
      .then(async (r) => {
        if (r.status === 401) {
          setError('not_signed_in');
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        if (d.ok) setAssets(d.assets ?? []);
        else setError(d.error ?? 'Lỗi tải assets');
      })
      .catch((e) => setError(e.message));
  }, []);

  const filtered = React.useMemo(() => {
    if (!assets) return [];
    if (filter === 'all') return assets;
    return assets.filter((a) => a.type === filter);
  }, [assets, filter]);

  if (error === 'not_signed_in') {
    return (
      <main className="min-h-screen bg-ink px-4 py-12 text-center text-cream">
        <h1 className="mb-2 text-2xl font-bold">Cần đăng nhập affiliate</h1>
        <p className="mb-6 text-cream/60">
          Đăng nhập để xem và tải về banner, caption, QR code cá nhân.
        </p>
        <Link href="/affiliate/signup">
          <Button className="bg-gold text-ink hover:bg-gold/90">Đăng ký affiliate</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink px-4 py-10 text-cream">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Marketing Assets</h1>
          <p className="mt-2 text-sm text-cream/60">
            Banner, video, caption, QR — tất cả đã được cá nhân hoá với mã giới thiệu của bạn.
          </p>
        </header>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded px-3 py-1.5 text-sm ${
                filter === f.key
                  ? 'bg-gold text-ink'
                  : 'border border-cream/20 text-cream/70 hover:bg-cream/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {assets === null && !error ? (
          <p className="text-sm text-cream/50">Đang tải…</p>
        ) : error ? (
          <p className="text-sm text-red-300">{error}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <AssetCard key={a.id} asset={a} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
