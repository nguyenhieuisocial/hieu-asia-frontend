/**
 * /changelog — public release notes.
 *
 * Static content (no MDX dependency) listing the major milestones from V1.0
 * onward. Kept in-source so it ships at build time and is fully crawlable.
 * Copy is user-facing (benefit-first) — no internal component/tooling jargon.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    'Lộ trình sản phẩm hieu.asia trong năm 2026. Tử Vi · Bát Tự · MBTI · Big Five · Xem Tướng · AI Mentor.',
  alternates: { canonical: 'https://hieu.asia/changelog' },
  openGraph: {
    title: 'Changelog',
    description: 'Lộ trình sản phẩm và tính năng đã ra mắt.',
    url: 'https://hieu.asia/changelog',
    type: 'website',
    images: OG_DEFAULT_IMAGES,
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
    version: 'V3.1',
    date: 'Tháng 7, 2026',
    title: 'Bộ ra quyết định & công cụ theo dịp',
    tag: 'feature',
    bullets: [
      'Bộ công cụ ra quyết định: mô phỏng lựa chọn, nhật ký, đánh giá tuần, hợp đôi, hợp nghề và kế hoạch năm/tháng',
      'So sánh nhiều lăng kính về bạn trong cùng một màn hình',
      'Công cụ theo dịp: xem ngày & tuổi cho cưới hỏi, làm nhà, khai trương, đặt tên — kèm Tử Vi 2027',
      'Điểm danh nhận quà, mời bạn nhận voucher, và tra cứu nhanh qua Telegram',
    ],
  },
  {
    version: 'V3.0',
    date: 'Tháng 6, 2026',
    title: 'Thêm nhiều lăng kính mới',
    tag: 'major',
    bullets: [
      'Hai lăng kính tâm lý mới: DISC và Enneagram, kèm bản đọc bằng AI',
      'Tarot (trải 1 & 3 lá) và Gieo quẻ Kinh Dịch cho một câu hỏi cụ thể',
      'Chiêm tinh phương Tây: Bản đồ sao và Cung hoàng đạo',
    ],
  },
  {
    version: 'V2.4',
    date: 'Tháng 5, 2026',
    title: 'Cộng đồng & bản tin',
    tag: 'polish',
    bullets: [
      'Trang Cộng đồng, trang cập nhật sản phẩm công khai và đăng ký nhận bản tin',
      'Trải nghiệm mượt hơn khi cuộn và chuyển trang',
    ],
  },
  {
    version: 'V2.3',
    date: 'Tháng 4, 2026',
    title: 'Trang chủ mới & bộ công cụ miễn phí',
    tag: 'major',
    bullets: [
      'Trang chủ dựng lại; thêm công cụ tra cứu miễn phí: Tử Vi hôm nay, Lịch Vạn Niên, Hợp tuổi, Thần Số, Cân Xương, Thước Lỗ Ban',
      'Thêm câu chuyện người dùng và mục hỏi–đáp',
    ],
  },
  {
    version: 'V2.0',
    date: 'Tháng 3, 2026',
    title: 'Đăng nhập không mật khẩu & giới thiệu bạn bè',
    tag: 'major',
    bullets: [
      'Đăng nhập bằng liên kết gửi qua email — không cần mật khẩu',
      'Chương trình giới thiệu bạn bè nhận hoa hồng, và bộ nhận diện thương hiệu mới',
    ],
  },
  {
    version: 'V1.5',
    date: 'Tháng 2, 2026',
    title: 'Khu vực Học',
    tag: 'feature',
    bullets: [
      'Bài học trực quan cho Tử Vi, Bát Tự, MBTI, Xem Tướng và Thần Số',
      'Giải thích cách hieu.asia biến dữ liệu của bạn thành gợi ý có thể hành động',
    ],
  },
];

const TAG_LABELS: Record<NonNullable<ReleaseEntry['tag']>, { label: string; cls: string }> = {
  major: { label: 'Major', cls: 'border-gold/40 bg-gold/10 text-gold-700' },
  feature: { label: 'Tính năng', cls: 'border-purple/40 bg-purple/10 text-purple-700 dark:text-purple-50' },
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
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold-700 sm:text-xs">
              Changelog · lộ trình minh bạch
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              Chúng tôi đã{' '}
              <span className="bg-gold-gradient bg-clip-text text-transparent">xây gì</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Lộ trình từ ngày đầu — không tô hồng. Bạn thấy được cả những thay
              đổi nhỏ và những bước nhảy lớn.
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
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
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
              Email cho chúng tôi hoặc theo dõi bản tin để cùng định hình
              hieu.asia. Bạn không chỉ là người dùng — bạn là đồng tác giả.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/community#newsletter">
                  Đăng ký bản tin
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="mailto:hi@hieu.asia">Email đội ngũ</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
