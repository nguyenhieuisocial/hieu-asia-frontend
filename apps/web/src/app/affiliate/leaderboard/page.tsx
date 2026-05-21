/**
 * /affiliate/leaderboard — public ranking page.
 * Social proof + competition driver. Public, no auth required.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { Button, Card, CardContent, Skeleton, Tabs, TabsList, TabsTrigger } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { LeaderboardList, type LeaderboardEntry } from '@/components/affiliate/LeaderboardList';
import { safeJson } from '@/lib/safe-json';

type Period = 'monthly' | 'all_time';

export default function AffiliateLeaderboardPage() {
  const [period, setPeriod] = React.useState<Period>('monthly');
  const [entries, setEntries] = React.useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await fetch(`/api/affiliate/leaderboard?period=${period}&limit=20`, { cache: 'no-store' });
        const parsed = await safeJson<{ ok: boolean; leaderboard?: LeaderboardEntry[]; error?: string }>(res);
        if (!alive) return;
        if (!parsed.ok) {
          setError(`Phản hồi không hợp lệ (HTTP ${parsed.status})`);
        } else {
          const d = parsed.data;
          if (d.ok) setEntries(d.leaderboard ?? []);
          else setError(d.error ?? 'Không tải được bảng xếp hạng.');
        }
      } catch (e) {
        if (alive) setError((e as Error).message ?? 'Lỗi mạng.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [period]);

  return (
    <div className="min-h-screen bg-ink text-cream">
      <SiteNav />
      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-[-10%] h-[360px] w-[360px] rounded-full bg-gold/10 blur-3xl"
        />

        <section className="relative mx-auto max-w-3xl px-6 pt-12 pb-20 sm:pt-16">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-cream/55">
            <Link href="/" className="hover:text-gold">Trang chủ</Link>
            <span className="mx-1.5">/</span>
            <Link href="/affiliate" className="hover:text-gold">Affiliate</Link>
            <span className="mx-1.5">/</span>
            <span className="text-cream/70">Bảng xếp hạng</span>
          </nav>

          <header className="text-center">
            <div
              aria-hidden="true"
              className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/15 via-ink to-purple/20"
            >
              <Trophy className="h-5 w-5 text-gold" aria-hidden="true" />
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
              Affiliate · Ranking
            </p>
            <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-cream sm:text-4xl">
              Bảng xếp hạng{' '}
              <span className="bg-gold-gradient bg-clip-text text-transparent">
                affiliate
              </span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-cream/75 sm:text-base">
              Tên đã được làm mờ một phần để bảo vệ riêng tư. Top 3 nhận badge
              đặc biệt mỗi tháng và phần thưởng tier nâng cấp.
            </p>
          </header>

          <div className="mt-8 flex justify-center">
            <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
              <TabsList>
                <TabsTrigger value="monthly">30 ngày qua</TabsTrigger>
                <TabsTrigger value="all_time">Mọi thời gian</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="mt-8">
            {loading && (
              <div className="space-y-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-14 rounded-xl" />
                ))}
              </div>
            )}

            {!loading && error && (
              <Card className="border-rose-500/30 bg-rose-500/5">
                <CardContent className="px-6 py-10 text-center">
                  <p className="text-sm text-rose-200">{error}</p>
                </CardContent>
              </Card>
            )}

            {!loading && !error && entries.length === 0 && (
              <Card className="border-cream/10 bg-ink/40">
                <CardContent className="px-6 py-12 text-center">
                  <p className="font-heading text-base text-cream">Chưa có dữ liệu</p>
                  <p className="mt-2 text-sm text-cream/65">
                    Hãy là người đầu tiên xuất hiện trên bảng xếp hạng — đăng ký
                    affiliate và bắt đầu giới thiệu.
                  </p>
                </CardContent>
              </Card>
            )}

            {!loading && !error && entries.length > 0 && (
              <LeaderboardList entries={entries} period={period} />
            )}
          </div>

          <div className="mt-10 text-center">
            <Link href="/affiliate">
              <Button variant="ghost" className="border border-cream/20">
                Đăng ký affiliate
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
