/**
 * /affiliate/leaderboard — public ranking page.
 * Social proof + competition driver. Public, no auth required.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, Tabs, TabsList, TabsTrigger } from '@hieu-asia/ui';
import { LeaderboardList, type LeaderboardEntry } from '@/components/affiliate/LeaderboardList';

type Period = 'monthly' | 'all_time';

export default function AffiliateLeaderboardPage() {
  const [period, setPeriod] = React.useState<Period>('monthly');
  const [entries, setEntries] = React.useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/affiliate/leaderboard?period=${period}&limit=20`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d.ok) setEntries(d.leaderboard ?? []);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [period]);

  return (
    <main className="min-h-screen bg-ink px-4 py-10 text-cream">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold">Bảng xếp hạng affiliate</h1>
          <p className="mt-2 text-sm text-cream/60">
            Tên đã được làm mờ một phần để bảo vệ riêng tư. Top 3 nhận badge đặc biệt mỗi tháng.
          </p>
        </header>

        <div className="flex justify-center">
          <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <TabsList>
              <TabsTrigger value="monthly">30 ngày qua</TabsTrigger>
              <TabsTrigger value="all_time">Mọi thời gian</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <p className="text-center text-sm text-cream/50">Đang tải…</p>
        ) : (
          <LeaderboardList entries={entries} period={period} />
        )}

        <div className="text-center">
          <Link href="/affiliate">
            <Button variant="ghost" className="border border-cream/20">
              Đăng ký affiliate
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
