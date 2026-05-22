/**
 * /affiliate/assets — marketing assets download center.
 * Requires affiliate login (cookie). Server-side proxy injects share URL.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { LockKeyhole } from 'lucide-react';
import { Button, Card, CardContent, Skeleton } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { AssetCard, type ResolvedAsset } from '@/components/affiliate/AssetCard';
import { AffiliateSubNav } from '@/components/affiliate/AffiliateSubNav';
import { safeJson } from '@/lib/safe-json';

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
    (async () => {
      try {
        const r = await fetch('/api/affiliate/assets', { cache: 'no-store' });
        if (r.status === 401) {
          setError('not_signed_in');
          return;
        }
        const parsed = await safeJson<{ ok: boolean; assets?: ResolvedAsset[]; error?: string }>(r);
        if (!parsed.ok) {
          setError(`Phản hồi không hợp lệ (HTTP ${parsed.status})`);
          return;
        }
        const d = parsed.data;
        if (d.ok) setAssets(d.assets ?? []);
        else setError(d.error ?? 'Lỗi tải assets');
      } catch (e) {
        setError((e as Error).message);
      }
    })();
  }, []);

  const filtered = React.useMemo(() => {
    if (!assets) return [];
    if (filter === 'all') return assets;
    return assets.filter((a) => a.type === filter);
  }, [assets, filter]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-ink-radial opacity-80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-[-8%] h-[320px] w-[320px] rounded-full bg-purple/15 blur-3xl"
        />

        <section className="relative mx-auto max-w-6xl px-6 pt-12 pb-20 sm:pt-16">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">Trang chủ</Link>
            <span className="mx-1.5">/</span>
            <Link href="/affiliate" className="hover:text-gold">Affiliate</Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Marketing assets</span>
          </nav>

          <AffiliateSubNav />

          {error === 'not_signed_in' ? (
            <Card className="border-border bg-card/40">
              <CardContent className="flex flex-col items-center px-6 py-16 text-center">
                <div
                  aria-hidden="true"
                  className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/15 via-background to-purple/20"
                >
                  <LockKeyhole className="h-5 w-5 text-gold" aria-hidden="true" />
                </div>
                <h1 className="font-heading text-2xl font-semibold text-foreground">
                  Cần đăng nhập affiliate
                </h1>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Đăng nhập để xem và tải về banner, caption, QR code đã được cá
                  nhân hoá với mã giới thiệu của bạn.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link href="/affiliate/signup">
                    <Button className="bg-gold text-ink hover:bg-gold/90">
                      Đăng ký affiliate
                    </Button>
                  </Link>
                  <Link href="/affiliate/dashboard">
                    <Button variant="outline">Đã có tài khoản</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <header>
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
                  Affiliate · Toolkit
                </p>
                <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                  Marketing{' '}
                  <span className="bg-gold-gradient bg-clip-text text-transparent">
                    Assets
                  </span>
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Banner, video, caption, QR — tất cả đã được cá nhân hoá với mã
                  giới thiệu của bạn. Sao chép một click, đăng ngay.
                </p>
              </header>

              <div className="mt-8 flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      filter === f.key
                        ? 'border-gold bg-gold text-ink'
                        : 'border-border bg-card/40 text-muted-foreground hover:border-gold/40 hover:text-foreground'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="mt-8">
                {assets === null && !error ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-56 rounded-xl" />
                    ))}
                  </div>
                ) : error ? (
                  <Card className="border-rose-500/30 bg-rose-500/5">
                    <CardContent className="px-6 py-8 text-center text-sm text-rose-200">
                      {error}
                    </CardContent>
                  </Card>
                ) : filtered.length === 0 ? (
                  <Card className="border-border bg-card/40">
                    <CardContent className="px-6 py-10 text-center text-sm text-muted-foreground">
                      Không có asset trong nhóm này.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((a) => (
                      <AssetCard key={a.id} asset={a} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
