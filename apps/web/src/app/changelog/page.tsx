/**
 * /changelog — public release notes.
 *
 * Static content (no MDX dependency) listing the major milestones from V1.0
 * onward. Kept in-source so it ships at build time and is fully crawlable.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

export const metadata: Metadata = {
  title: 'Changelog — hieu.asia',
  description:
    'Lộ trình sản phẩm hieu.asia từ V1.0 đến hiện tại. Tử Vi · MBTI · Palm Reading · Mentor AI.',
  alternates: { canonical: 'https://hieu.asia/changelog' },
  openGraph: {
    title: 'Changelog hieu.asia',
    description: 'Lộ trình sản phẩm và tính năng đã ra mắt.',
    url: 'https://hieu.asia/changelog',
    type: 'website',
  },
};

interface ReleaseEntry {
  version: string;
  date: string;
  title: string;
  tag?: 'major' | 'feature' | 'polish' | 'infra';
  bullets: string[];
}

const RELEASES: readonly ReleaseEntry[] = [
  {
    version: 'Wave 2',
    date: 'Tháng 5, 2026',
    title: 'Polish công cộng — Community, Changelog, Newsletter',
    tag: 'polish',
    bullets: [
      'Trang Cộng đồng & Changelog công khai',
      'Newsletter signup wire-up qua /api/email/subscribe',
      'Polish 6 trang flow (signin, reading, processing, unlock, settings) với SiteNav + SiteFooter nhất quán',
      'Vanity URL redirects (/learn/numerology → /learn/than-so-hoc, /palm → /learn/palm)',
      'Reveal-on-scroll cho các section dài, smooth scroll cho anchor links',
    ],
  },
  {
    version: 'V2.3',
    date: 'Tháng 4, 2026',
    title: 'UI/UX polish sweep — Premium tools + Free Tools',
    tag: 'major',
    bullets: [
      'HeroV3 với gold gradient ornaments + WhyChoose trên homepage',
      '6 công cụ miễn phí (Tử Vi hôm nay, Lịch Vạn Niên, Hợp tuổi, Thần Số Học, Cân Xương, Thước Lỗ Ban)',
      'StoryTestimonials + FaqAccordion thay cho các block landing cũ',
      'SiteNav với dropdown Công cụ + Học, SiteFooter restructured 5 cột',
      'PostHog taxonomy chuẩn, Web Vitals tracking, survey trong-app',
    ],
  },
  {
    version: 'V2.2',
    date: 'Tháng 3, 2026',
    title: 'Admin overhaul + LLM spend dashboard',
    tag: 'feature',
    bullets: [
      'Trang quản trị mới (admin) với Secrets Manager',
      'Bảng theo dõi chi phí LLM theo provider + model',
      'Public site /tu-vi-hom-nay, /lich-van-nien, /hop-tuoi đã ổn định',
    ],
  },
  {
    version: 'V2.0',
    date: 'Tháng 2, 2026',
    title: 'Magic-link auth + Supabase + Affiliate V1.5',
    tag: 'major',
    bullets: [
      'Đăng nhập bằng magic-link qua Supabase Auth (không cần mật khẩu)',
      'Trang /signin và /auth/callback hoàn chỉnh',
      'Affiliate V1.5: leaderboard, đường link /r/[code], assets cho người giới thiệu',
      'Trang /brand showcase + Logo system SVG',
    ],
  },
  {
    version: 'V1.5',
    date: 'Tháng 1, 2026',
    title: 'Learn hub — infographic giáo dục',
    tag: 'feature',
    bullets: [
      '5 bài học infographic: Tử Vi 12 cung, Bát Tự, MBTI, Palm, Numerology',
      'Phương pháp EOSIDIN 7 bước giải thích cách hieu.asia chuyển dữ liệu thành insight',
      'Trust carousel ở footer',
    ],
  },
  {
    version: 'V1.4',
    date: 'Tháng 12, 2025',
    title: 'Analytics + SEO + Settings',
    tag: 'infra',
    bullets: [
      'Plausible + PostHog wired song song, funnel events',
      'Lighthouse + SEO P0/P1: titles, metadata, JSON-LD, h1, preconnect',
      'Trang /settings: notifications, locale, theme, privacy, account, telegram',
    ],
  },
  {
    version: 'V1.0',
    date: 'Tháng 10, 2025',
    title: 'Ra mắt công khai',
    tag: 'major',
    bullets: [
      'Lá số Tử Vi 12 cung với 114 sao theo Bắc phái',
      'Bát Tự Tứ Trụ + Thần Số Học Pythagorean + MBTI',
      'Palm Reading qua upload ảnh + AI vision',
      'Mentor AI có ngữ cảnh — đối thoại, không scripted',
      'Báo cáo Cẩm Nang Cuộc Đời với 9 section markdown',
    ],
  },
];

const TAG_LABELS: Record<NonNullable<ReleaseEntry['tag']>, { label: string; cls: string }> = {
  major: { label: 'Major', cls: 'border-gold/40 bg-gold/10 text-gold' },
  feature: { label: 'Tính năng', cls: 'border-purple/40 bg-purple/10 text-purple-200' },
  polish: { label: 'Polish', cls: 'border-jade/40 bg-jade/10 text-emerald-200' },
  infra: { label: 'Hạ tầng', cls: 'border-border bg-muted/5 text-muted-foreground' },
};

export default function ChangelogPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-background text-foreground pt-16">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-background">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_rgba(184,146,61,0.18)_0%,_transparent_55%)]"
          />
          <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
              Changelog · lộ trình minh bạch
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              Chúng tôi đã{' '}
              <span className="bg-gold-gradient bg-clip-text text-transparent">xây gì</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Lộ trình từ ngày đầu — không marketing tô hồng. Bạn thấy được cả
              những thay đổi nhỏ và những bước nhảy lớn.
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="relative bg-background pb-20">
          <div className="mx-auto max-w-3xl px-6">
            <ol className="relative border-l border-gold/20">
              {RELEASES.map((r) => {
                const tag = r.tag ? TAG_LABELS[r.tag] : null;
                return (
                  <li key={r.version} className="ml-6 mb-12 last:mb-0">
                    <span className="absolute -left-2.5 flex h-5 w-5 items-center justify-center rounded-full border border-gold/60 bg-background">
                      <Sparkles className="h-2.5 w-2.5 text-gold" aria-hidden="true" />
                    </span>
                    <div className="flex flex-wrap items-baseline gap-3">
                      <span className="font-heading text-xl font-semibold text-foreground">
                        {r.version}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                        {r.date}
                      </span>
                      {tag && (
                        <span
                          className={[
                            'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider',
                            tag.cls,
                          ].join(' ')}
                        >
                          {tag.label}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 font-heading text-lg text-foreground/95">{r.title}</h2>
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                      {r.bullets.map((b) => (
                        <li key={b} className="flex gap-2.5 leading-relaxed">
                          <span aria-hidden="true" className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-gold/70" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-background py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Có ý tưởng cho phiên bản tiếp theo?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              Email cho chúng tôi hoặc theo dõi newsletter để cùng định hình
              hieu.asia. Bạn không phải user — bạn là đồng tác giả.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/community#newsletter">
                <Button>
                  Đăng ký newsletter
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="mailto:hi@hieu.asia">
                <Button variant="outline">Email đội ngũ</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
