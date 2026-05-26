import type { Metadata } from 'next';
import * as React from 'react';
import Link from 'next/link';
import { GitCommit, Calendar, ChevronRight, Cpu } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

export const metadata: Metadata = {
  title: 'Algorithm changelog',
  description:
    'Lịch sử các thay đổi tới engine an sao, lịch âm, tính đại vận và luận giải tại hieu.asia — theo dõi tính chính xác của thuật toán huyền học.',
  alternates: {
    canonical: 'https://hieu.asia/methodology/algorithm-changelog',
  },
  openGraph: {
    title: 'Algorithm changelog',
    description:
      'Mỗi thay đổi tới thuật toán an sao, lịch âm và luận giải — ghi lại tại đây.',
    url: 'https://hieu.asia/methodology/algorithm-changelog',
    type: 'article',
  },
};

const CHANGELOG: {
  version: string;
  date: string;
  changes: { type: 'fix' | 'feat' | 'note'; description: string }[];
}[] = [
  {
    version: '1.3.2',
    date: '2026-05-22',
    changes: [
      {
        type: 'fix',
        description:
          'Sửa cách tính Can Chi cho năm 2026: thư viện upstream ship typo "Bình" thay vì "Bính" tại CAN index 2; engine normalize ở wrapper layer. Áp dụng cho /tools/lich-van-nien, /tools/lunar-v2, /daily/horoscope.',
      },
      {
        type: 'fix',
        description:
          'Đổi /tools/lich-van-nien/today dùng Intl.DateTimeFormat với timezone Asia/Ho_Chi_Minh, fix bug giữa 0h–7h UTC trả ngày hôm qua cho VN visitors.',
      },
      {
        type: 'feat',
        description:
          'Mở rộng /tu-vi/sao/[star] với 10 phụ tinh: Tả Phụ, Hữu Bật, Văn Xương, Văn Khúc, Khôi Việt, Lộc Tồn, Kình Đà, Hỏa Linh, Hoá Lộc, Hoá Kỵ.',
      },
      {
        type: 'note',
        description:
          'Không thay đổi cách an chính tinh hoặc cách tính đại vận.',
      },
    ],
  },
  {
    version: '1.3.1',
    date: '2026-05-18',
    changes: [
      {
        type: 'feat',
        description:
          'Thêm validation 400 cho /tools/tuvi-v2 khi thiếu birthDate/birthTime/gender.',
      },
      {
        type: 'note',
        description:
          'Engine iztro được tách thành Worker riêng (hieu-asia-iztro) để giảm cold-start bundle.',
      },
    ],
  },
  {
    version: '1.3.0',
    date: '2026-04-30',
    changes: [
      {
        type: 'feat',
        description:
          'Tử Vi v2: hỗ trợ 12 cung + 14 chính tinh + đại vận đầy đủ; lưu niên theo Can Chi năm.',
      },
      {
        type: 'feat',
        description: 'Bát Tự engine: 4 trụ + thập thần + lá số ngũ hành.',
      },
    ],
  },
  {
    version: '1.2.0',
    date: '2026-03-15',
    changes: [
      {
        type: 'feat',
        description:
          'Daily horoscope 12 con giáp — cron 6h sáng ICT, cache KV 36h.',
      },
      { type: 'feat', description: 'Lịch Vạn Niên engine deterministic.' },
    ],
  },
  {
    version: '1.1.0',
    date: '2026-02-20',
    changes: [
      {
        type: 'feat',
        description:
          'Thần Số Học (cách tính số sinh + số tên Pythagorean).',
      },
      {
        type: 'feat',
        description: 'MBTI 4 dimension theo Myers-Briggs official short form.',
      },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-01-15',
    changes: [
      {
        type: 'note',
        description:
          'Khởi tạo hệ thống. Tử Vi 12 cung mức cơ bản. AI Mentor v1.',
      },
    ],
  },
];

const TODAY_ISO = '2026-05-22';

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Phương pháp luận',
      item: 'https://hieu.asia/methodology',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Algorithm changelog',
      item: 'https://hieu.asia/methodology/algorithm-changelog',
    },
  ],
};

const ARTICLE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Algorithm changelog · hieu.asia',
  description:
    'Lịch sử các thay đổi tới engine an sao, lịch âm và luận giải tại hieu.asia.',
  inLanguage: 'vi-VN',
  datePublished: '2026-01-15',
  dateModified: TODAY_ISO,
  author: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
  publisher: {
    '@type': 'Organization',
    name: 'hieu.asia',
    url: 'https://hieu.asia',
  },
};

const TYPE_STYLE: Record<
  'fix' | 'feat' | 'note',
  { label: string; className: string }
> = {
  fix: {
    label: 'fix',
    className: 'border-amber-700/40 bg-amber-900/20 text-amber-200',
  },
  feat: {
    label: 'feat',
    className: 'border-jade/40 bg-jade/15 text-jade-300',
  },
  note: {
    label: 'note',
    className: 'border-border bg-muted/5 text-muted-foreground',
  },
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function AlgorithmChangelogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSONLD) }}
      />
      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />

        <section className="relative mx-auto max-w-3xl px-6 pb-12 pt-12 sm:pt-16">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">
              Trang chủ
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/methodology" className="hover:text-gold">
              Phương pháp luận
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Algorithm changelog</span>
          </nav>

          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Methodology · Algorithm changelog
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Algorithm changelog — Phiên bản engine huyền học
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Mỗi thay đổi tới thuật toán an sao, tính lịch hoặc luận giải đều ghi tại
            đây. Khác với "changelog sản phẩm" (mô tả tính năng UI), bảng này theo dõi
            tính chính xác của engine.
          </p>

          <div className="mt-8 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/5 px-3 py-1 text-gold/90">
              <Cpu className="h-3.5 w-3.5" aria-hidden /> Engine versions
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1 text-muted-foreground">
              <GitCommit className="h-3.5 w-3.5" aria-hidden />{' '}
              {CHANGELOG.length} bản phát hành
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" aria-hidden /> Cập nhật{' '}
              {formatDate(TODAY_ISO)}
            </span>
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl space-y-5 px-6 pb-20">
          {CHANGELOG.map((release) => (
            <React.Fragment key={release.version}>
              {/* BUG-031 (Wave 54): sr-only h2 per release — CardTitle is <h3>. */}
              <h2 className="sr-only">
                Engine v{release.version} — {formatDate(release.date)}
              </h2>
            <Card
              id={`v${release.version}`}
              className="border-border bg-card/40"
            >
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-mono text-xs text-gold">
                    <GitCommit className="h-3.5 w-3.5" aria-hidden /> v
                    {release.version}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" aria-hidden />{' '}
                    {formatDate(release.date)}
                  </span>
                </div>
                <CardTitle className="mt-2 font-heading text-lg text-foreground sm:text-xl">
                  Engine v{release.version}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {release.changes.length} thay đổi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2">
                  {release.changes.map((c, i) => {
                    const style = TYPE_STYLE[c.type];
                    return (
                      <li
                        key={i}
                        className="flex flex-col gap-2 rounded-lg border border-border bg-card/60 p-3 sm:flex-row sm:items-start"
                      >
                        <span
                          className={`inline-flex w-fit shrink-0 items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${style.className}`}
                        >
                          {style.label}
                        </span>
                        <p className="text-sm leading-relaxed text-foreground/80">
                          {c.description}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
            </React.Fragment>
          ))}

          {/* CTA */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/methodology/tu-vi"
              className="group rounded-xl border border-border bg-card/40 p-5 transition hover:border-gold/40"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
                Đọc thêm
              </p>
              <h3 className="mt-2 font-heading text-lg text-foreground">
                Xem methodology Tử Vi
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Trường phái Bắc phái, cách an sao, đại vận, lưu niên — và lằn ranh engine
                vs AI.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-gold group-hover:underline">
                /methodology/tu-vi <ChevronRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
            <a
              href="mailto:engineering@hieu.asia"
              className="group rounded-xl border border-amber-700/40 bg-amber-900/15 p-5 transition hover:border-amber-500/60"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-amber-200/80">
                Báo lỗi
              </p>
              <h3 className="mt-2 font-heading text-lg text-foreground">
                Báo cáo lỗi engine
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Nếu bạn phát hiện lá số sai ngày/giờ/sao, hoặc luận giải mâu thuẫn với
                bản gốc — gửi cho team engineering.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-amber-200 group-hover:underline">
                engineering@hieu.asia{' '}
                <ChevronRight className="h-4 w-4" aria-hidden />
              </span>
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
