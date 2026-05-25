'use client';

import * as React from 'react';
import Link from 'next/link';
import { BookOpen, ChevronRight } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { readJournalEntries, readWeeklyReviews } from '@/lib/journal-storage';
import { buildOperatingManual } from '@/lib/operating-manual';
import { fetchUserMe } from '@/lib/user-me';
import { ExpertModeToggle } from './ExpertModeToggle';

interface QuickStat {
  label: string;
  value: string | number;
  hint?: string;
}

interface RecentActivity {
  id: string;
  label: string;
  ts: string;
  href?: string;
}

interface OverviewData {
  chartCount: number;
  decisionCount: number;
  weeklyCount: number;
  tier: string;
  activity: RecentActivity[];
}

const TIER_LABEL: Record<string, string> = {
  free: 'Free',
  standard: 'Standard',
  premium: 'Premium',
  lifetime: 'Lifetime',
};

function relTime(iso: string): string {
  try {
    const d = new Date(iso);
    const diffMs = Date.now() - d.getTime();
    const m = Math.round(diffMs / 60_000);
    if (m < 1) return 'vừa xong';
    if (m < 60) return `${m} phút trước`;
    const h = Math.round(m / 60);
    if (h < 24) return `${h} giờ trước`;
    const day = Math.round(h / 24);
    if (day < 30) return `${day} ngày trước`;
    return d.toLocaleDateString('vi-VN');
  } catch {
    return iso;
  }
}

function loadOverviewLocal(): Pick<OverviewData, 'chartCount' | 'decisionCount' | 'weeklyCount' | 'activity'> {
  if (typeof window === 'undefined') {
    return { chartCount: 0, decisionCount: 0, weeklyCount: 0, activity: [] };
  }
  let decisionCount = 0;
  const activity: RecentActivity[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k) continue;
      if (k.startsWith('hieu:decisions:') && !k.endsWith(':checked')) {
        decisionCount++;
        try {
          const raw = window.localStorage.getItem(k);
          if (!raw) continue;
          const rec = JSON.parse(raw) as { id?: string; question?: string; createdAt?: string };
          if (rec.id && rec.createdAt) {
            activity.push({
              id: 'd-' + rec.id,
              label: 'Decision: ' + (rec.question?.slice(0, 60) ?? rec.id),
              ts: rec.createdAt,
              href: `/decisions/${rec.id}`,
            });
          }
        } catch {
          /* ignore */
        }
      }
    }
  } catch {
    /* ignore */
  }

  const journal = readJournalEntries();
  for (const e of journal.slice(0, 5)) {
    activity.push({
      id: 'j-' + e.id,
      label: 'Journal: ' + e.question.slice(0, 60),
      ts: e.createdAt,
      href: `/journal/${e.id}`,
    });
  }

  const weekly = readWeeklyReviews();
  for (const w of weekly.slice(0, 3)) {
    activity.push({
      id: 'w-' + w.id,
      label: 'Weekly review · tuần ' + w.weekStart,
      ts: w.createdAt,
    });
  }

  // Sort activity DESC by ts, cap 5
  activity.sort((a, b) => (a.ts < b.ts ? 1 : -1));

  return {
    chartCount: 0, // Filled from API in parent
    decisionCount,
    weeklyCount: weekly.length,
    activity: activity.slice(0, 5),
  };
}

export interface OverviewTabProps {
  user: User;
  onNavigate: (
    tab:
      | 'chart'
      | 'decisions'
      | 'manual'
      | 'mentor'
      | 'payments'
      | 'affiliate'
      | 'privacy',
  ) => void;
}

export function OverviewTab({ user, onNavigate }: OverviewTabProps) {
  const [data, setData] = React.useState<OverviewData>({
    chartCount: 0,
    decisionCount: 0,
    weeklyCount: 0,
    tier: 'free',
    activity: [],
  });
  const [manualState, setManualState] = React.useState<
    { ready: true; filled: number; total: number } | { ready: false } | null
  >(null);

  React.useEffect(() => {
    const local = loadOverviewLocal();
    setData((prev) => ({ ...prev, ...local }));

    const m = buildOperatingManual();
    if (m) {
      setManualState({ ready: true, filled: m.filledCount, total: m.totalCount });
    } else {
      setManualState({ ready: false });
    }

    // Best-effort: tier from shared, deduped /api/user/me cache (BUG-009).
    fetchUserMe()
      .then((j) => {
        if (j && typeof j.membership_tier === 'string') {
          setData((prev) => ({ ...prev, tier: j.membership_tier }));
        }
      })
      .catch(() => {
        /* best-effort */
      });
  }, []);

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email ??
    'bạn';

  // Wave 52-C — chốt VN cho mọi sub-label (trước đây mix EN/VN:
  // "Saved chart" cạnh "Brief đã tạo" cạnh "Tuần đã review").
  const stats: QuickStat[] = [
    { label: 'Lá số đã lập', value: data.chartCount, hint: 'Lá số đã lưu' },
    { label: 'Quyết định', value: data.decisionCount, hint: 'Brief đã tạo' },
    { label: 'Tuần đã nhìn lại', value: data.weeklyCount, hint: 'Số lần ôn lại tuần' },
    { label: 'Tier hiện tại', value: TIER_LABEL[data.tier] ?? data.tier },
  ];

  return (
    <div
      role="tabpanel"
      id="panel-overview"
      aria-labelledby="tab-overview"
      className="space-y-6"
    >
      <div>
        <h2 className="font-heading text-2xl text-foreground sm:text-3xl">
          Chào, <span className="text-gold">{displayName}</span>
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tổng quan tài khoản và hoạt động gần đây.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card/40 p-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-2 font-heading text-2xl text-foreground">{s.value}</p>
            {s.hint && (
              <p className="mt-1 text-[11px] text-foreground/40">{s.hint}</p>
            )}
          </div>
        ))}
      </div>

      {manualState?.ready && (
        <button
          type="button"
          onClick={() => onNavigate('manual')}
          className="group flex w-full items-center gap-4 rounded-xl border border-gold/30 bg-gold/[0.06] p-4 text-left transition hover:border-gold/60 hover:bg-gold/[0.10]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-card/60">
            <BookOpen className="h-5 w-5 text-gold" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-heading text-base text-foreground">
              Sổ tay cá nhân sẵn sàng ({manualState.filled}/{manualState.total} mục)
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Một trang tổng hợp về bạn — in được, xuất Markdown được.
            </span>
          </span>
          <ChevronRight
            className="h-5 w-5 shrink-0 text-gold/70 transition group-hover:translate-x-0.5"
            aria-hidden
          />
        </button>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hành động nhanh</CardTitle>
          <CardDescription>Tiếp tục công việc của bạn ngay.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild={false}>
            <Link href="/onboarding/topic">Lập lá số mới</Link>
          </Button>
          <Button variant="outline" asChild={false}>
            <Link href="/decisions/new">Decision Brief mới</Link>
          </Button>
          <Button variant="outline" asChild={false}>
            <Link href="/journal/new">Weekly review</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cài đặt hiển thị</CardTitle>
          <CardDescription>
            Điều chỉnh cách luận giải hiển thị cho bạn trên các trang đọc.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpertModeToggle />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hoạt động gần đây</CardTitle>
          <CardDescription>5 thao tác mới nhất trên tài khoản.</CardDescription>
        </CardHeader>
        <CardContent>
          {data.activity.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Chưa có hoạt động. Bắt đầu bằng cách{' '}
              <button
                type="button"
                onClick={() => onNavigate('chart')}
                className="text-gold underline underline-offset-4 hover:opacity-80"
              >
                lập lá số
              </button>
              .
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {data.activity.map((a) => {
                const inner = (
                  <>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-foreground/90">{a.label}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{relTime(a.ts)}</p>
                    </div>
                    {a.href && (
                      <ChevronRight
                        className="h-4 w-4 shrink-0 text-foreground/40"
                        aria-hidden
                      />
                    )}
                  </>
                );
                return (
                  <li key={a.id} className="py-3">
                    {a.href ? (
                      <Link
                        href={a.href}
                        className="flex items-center gap-3 hover:text-gold"
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
