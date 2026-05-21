'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
} from 'lucide-react';
import { Button, Card, CardContent } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import {
  readJournalEntries,
  type JournalEntry,
  type JournalTopic,
} from '@/lib/journal-storage';

const TOPIC_LABEL: Record<JournalTopic, string> = {
  career: 'Sự nghiệp',
  relationship: 'Tình cảm',
  finance: 'Tài chính',
  family: 'Gia đình',
  general: 'Khác',
};

type FilterTab = 'all' | 'pending' | 'reviewed';

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Decision Journal',
      item: 'https://hieu.asia/journal',
    },
  ],
};

const dateFmt = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'Asia/Ho_Chi_Minh',
});

function formatDate(iso: string): string {
  try {
    return dateFmt.format(new Date(iso));
  } catch {
    return iso;
  }
}

function truncate(s: string, n = 120): string {
  if (s.length <= n) return s;
  return s.slice(0, n).trimEnd() + '…';
}

export default function JournalHubPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [filter, setFilter] = useState<FilterTab>('all');

  useEffect(() => {
    setEntries(readJournalEntries());
    setHydrated(true);
  }, []);

  const stats = useMemo(() => {
    const total = entries.length;
    const reviewed = entries.filter((e) => !!e.reviewedAt).length;
    return { total, reviewed, pending: total - reviewed };
  }, [entries]);

  const visible = useMemo(() => {
    if (filter === 'pending') return entries.filter((e) => !e.reviewedAt);
    if (filter === 'reviewed') return entries.filter((e) => !!e.reviewedAt);
    return entries;
  }, [entries, filter]);

  return (
    <main className="min-h-screen bg-ink text-cream">
      <SiteNav />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />

      <section className="mx-auto max-w-5xl px-6 pt-16 pb-20">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-cream/55">
          <Link href="/" className="hover:text-gold">
            Trang chủ
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-cream/70">Decision Journal</span>
        </nav>

        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-gold/80">
              Decision Journal
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              <span className="bg-gold-gradient bg-clip-text text-transparent">
                Decision Journal
              </span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-cream/75 sm:text-base">
              Ghi lại các quyết định của bạn — và review sau 7-30 ngày để hiểu
              mình tốt hơn. Lưu trên trình duyệt, không gửi server.
            </p>
          </div>
          <Link href="/journal/new" className="shrink-0">
            <Button className="min-w-[180px]">
              <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Quyết định mới
            </Button>
          </Link>
        </header>

        {hydrated && stats.total > 0 && (
          <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cream/70">
            <span>
              Tổng số quyết định:{' '}
              <strong className="font-medium text-cream">{stats.total}</strong>
            </span>
            <span aria-hidden="true" className="text-cream/30">
              •
            </span>
            <span>
              Đã review:{' '}
              <strong className="font-medium text-cream">{stats.reviewed}</strong>
            </span>
            <span aria-hidden="true" className="text-cream/30">
              •
            </span>
            <span>
              Chưa review:{' '}
              <strong className="font-medium text-cream">{stats.pending}</strong>
            </span>
          </div>
        )}

        {hydrated && stats.total > 0 && (
          <div
            role="tablist"
            aria-label="Lọc theo trạng thái"
            className="mb-6 inline-flex rounded-lg border border-cream/15 bg-ink/40 p-1"
          >
            {([
              { id: 'all', label: 'Tất cả' },
              { id: 'pending', label: 'Chưa review' },
              { id: 'reviewed', label: 'Đã review' },
            ] as const).map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={filter === t.id}
                onClick={() => setFilter(t.id)}
                className={[
                  'rounded-md px-4 py-1.5 text-xs font-medium transition',
                  filter === t.id
                    ? 'bg-gold/15 text-gold'
                    : 'text-cream/65 hover:text-cream',
                ].join(' ')}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {!hydrated && (
          <div
            className="rounded-lg border border-cream/10 bg-ink/40 p-8 text-sm text-cream/55"
            aria-busy="true"
          >
            Đang tải...
          </div>
        )}

        {hydrated && stats.total === 0 && (
          <Card className="border-gold/20 bg-ink/60">
            <CardContent className="flex flex-col items-center px-6 py-12 text-center">
              <BookOpen
                className="mb-4 h-10 w-10 text-gold/70"
                aria-hidden="true"
              />
              <h2 className="font-heading text-xl font-semibold">
                Chưa có quyết định nào được ghi
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/70">
                Bắt đầu bằng một quyết định bạn đang phân vân. 30 ngày sau, bạn
                có thể quay lại xem mình đã chọn vì lý do gì — và rút ra điều gì.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-gold/30 bg-gold/[0.06] px-3 py-1.5 text-xs text-gold/90">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Lưu trên trình duyệt của bạn — không gửi server
              </div>
              <Link href="/journal/new" className="mt-8">
                <Button>
                  Tạo quyết định đầu tiên
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {hydrated && stats.total > 0 && visible.length === 0 && (
          <div className="rounded-lg border border-cream/10 bg-ink/40 p-8 text-center text-sm text-cream/60">
            Không có quyết định nào trong nhóm này.
          </div>
        )}

        {hydrated && visible.length > 0 && (
          <ul className="grid gap-4">
            {visible.map((e) => {
              const reviewed = !!e.reviewedAt;
              return (
                <li key={e.id}>
                  <Link
                    href={`/journal/${e.id}`}
                    className="group block focus:outline-none"
                  >
                    <Card className="border-gold/15 bg-ink/60 transition group-hover:border-gold/40 group-focus:border-gold/50">
                      <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-gold">
                              {TOPIC_LABEL[e.topic]}
                            </span>
                            {reviewed ? (
                              <span className="inline-flex items-center gap-1 text-xs text-emerald-300/85">
                                <CheckCircle2
                                  className="h-3.5 w-3.5"
                                  aria-hidden="true"
                                />
                                Đã review {formatDate(e.reviewedAt as string)}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-cream/55">
                                <Circle
                                  className="h-3.5 w-3.5"
                                  aria-hidden="true"
                                />
                                Chưa review
                              </span>
                            )}
                          </div>
                          <h2 className="font-heading text-base font-semibold leading-snug text-cream">
                            {truncate(e.question, 140)}
                          </h2>
                          <p className="mt-1 text-xs text-cream/55">
                            Tạo ngày {formatDate(e.createdAt)}
                          </p>
                        </div>
                        <ArrowRight
                          className="hidden h-4 w-4 shrink-0 self-center text-cream/70 transition group-hover:translate-x-0.5 group-hover:text-gold sm:block"
                          aria-hidden="true"
                        />
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <section
          aria-labelledby="weekly-cta"
          className="mt-12 rounded-xl border border-gold/25 bg-gold/[0.04] p-6 sm:p-8"
        >
          <h2
            id="weekly-cta"
            className="font-heading text-lg font-semibold sm:text-xl"
          >
            Bạn có thể thử Weekly Review
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cream/75">
            Mỗi tuần dành 5 phút nhìn lại — chuyển từ &ldquo;cảm giác&rdquo;
            sang &ldquo;dữ kiện&rdquo;. Không bắt buộc, nhưng giúp bạn thấy
            mình rõ hơn theo thời gian.
          </p>
          <Link
            href="/weekly-review"
            className="mt-5 inline-flex items-center gap-2 rounded-md border border-gold/50 bg-ink/60 px-4 py-2 text-sm font-medium text-gold transition hover:bg-gold/10"
          >
            Mở Weekly Review
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
