/**
 * /community — placeholder hub for community channels + newsletter signup.
 *
 * Wave 2 polish: announces direction (Telegram channel, weekly digest, study
 * circles) without overpromising features that don't exist yet.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, Mail, BookOpen, Users, Sparkles, FileText } from 'lucide-react';
import { Button } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Cộng đồng',
  description:
    'Theo dõi hieu.asia trên Telegram, đăng ký newsletter hàng tuần và tham gia các vòng học huyền học thực hành.',
  alternates: { canonical: 'https://hieu.asia/community' },
  openGraph: {
    title: 'Cộng đồng',
    description:
      'Nhận một bài viết ngắn mỗi tuần — cách dùng cổ học để ra quyết định tốt hơn.',
    url: 'https://hieu.asia/community',
    type: 'website',
  },
};

const CHANNELS = [
  {
    href: 'https://t.me/hieuasiabot',
    label: 'Telegram bot',
    desc: 'Bot Tử Vi hôm nay, mentor mini, và thông báo sản phẩm.',
    icon: MessageCircle,
    cta: 'Mở trong Telegram',
    external: true,
    status: 'live' as const,
  },
  {
    href: 'mailto:hi@hieu.asia',
    label: 'Email cá nhân',
    desc: 'Phản hồi sản phẩm, gợi ý, hoặc một câu hỏi sâu — đội ngũ trả lời mỗi tuần.',
    icon: Mail,
    cta: 'Viết cho chúng tôi',
    external: true,
    status: 'live' as const,
  },
  {
    href: '/learn',
    label: 'Học huyền học',
    desc: 'Bài viết nền tảng: 12 cung Tử Vi, 4 trụ Bát Tự, 16 nhóm MBTI, đường chỉ tay.',
    icon: BookOpen,
    cta: 'Vào thư viện',
    external: false,
    status: 'live' as const,
  },
  {
    href: '#newsletter',
    label: 'Newsletter hàng tuần',
    desc: 'Một bài ngắn mỗi tuần — không spam, không bán hàng. Huỷ bất cứ lúc nào.',
    icon: Sparkles,
    cta: 'Cuộn xuống đăng ký',
    external: false,
    status: 'live' as const,
  },
  {
    href: '/community/cases',
    label: 'Case studies',
    desc: '6 quyết định thực tế từ người dùng — ẩn danh hoá, kèm methodology pages liên quan.',
    icon: FileText,
    cta: 'Đọc 6 case',
    external: false,
    status: 'live' as const,
  },
  {
    href: '#',
    label: 'Vòng học thực hành',
    desc: 'Khoá 4 tuần cùng cohort: lập lá số, đối thoại với Mentor, ra một quyết định.',
    icon: Users,
    cta: 'Sắp ra mắt',
    external: false,
    status: 'soon' as const,
  },
];

export default function CommunityPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-background text-foreground pt-16">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-background">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_rgba(59,39,84,0.4)_0%,_transparent_55%)]"
          />
          <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-24">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
              Cộng đồng
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              Học cùng nhau,{' '}
              <span className="bg-gold-gradient bg-clip-text text-transparent">
                quyết định một mình
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              hieu.asia còn nhỏ — và đó là điểm mạnh. Bạn không nói với một bộ máy,
              bạn nói với một nhóm người thực sự quan tâm bạn đọc gì, hiểu gì, và
              quyết định ra sao.
            </p>
          </div>
        </section>

        {/* Channels grid */}
        <section className="relative bg-background pb-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CHANNELS.map((c) => (
                <ChannelCard key={c.label} channel={c} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter signup */}
        <NewsletterSignup id="newsletter" />

        {/* Brand promise reminder */}
        <section className="bg-background py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80">
              Lời hứa
            </p>
            <p className="mt-4 font-heading text-2xl leading-relaxed text-foreground sm:text-3xl">
              &ldquo;Không định mệnh hoá. Không hù doạ.
              <br className="hidden sm:block" />
              Không bán dữ liệu của bạn.&rdquo;
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Đó là tiêu chuẩn cho mọi thứ chúng tôi viết và xây.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/about">
                <Button variant="outline" size="sm">
                  Về đội ngũ
                </Button>
              </Link>
              <Link href="/changelog">
                <Button variant="ghost" size="sm">
                  Lộ trình sản phẩm
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function ChannelCard({
  channel,
}: {
  channel: (typeof CHANNELS)[number];
}) {
  const Icon = channel.icon;
  const isSoon = channel.status === 'soon';
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    isSoon ? (
      <div
        aria-disabled
        className="relative flex h-full flex-col rounded-2xl border border-border bg-card/40 p-6 opacity-70"
      >
        {children}
      </div>
    ) : (
      <Link
        href={channel.href}
        target={channel.external ? '_blank' : undefined}
        rel={channel.external ? 'noopener noreferrer' : undefined}
        className="group relative flex h-full flex-col rounded-2xl border border-border bg-card/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_0_40px_-12px_rgba(184,146,61,0.4)]"
      >
        {children}
      </Link>
    );
  return (
    <Wrapper>
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/25 bg-gradient-to-br from-gold/15 via-background to-purple/20">
          <Icon className="h-5 w-5 text-gold" aria-hidden="true" />
        </div>
        {isSoon && (
          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-gold/70">
            Sắp ra mắt
          </span>
        )}
      </div>
      <h2 className="mt-5 font-heading text-lg font-semibold text-foreground">
        {channel.label}
      </h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {channel.desc}
      </p>
      <p
        className={[
          'mt-5 text-sm font-medium',
          isSoon ? 'text-foreground/40' : 'text-gold/90 group-hover:text-gold',
        ].join(' ')}
      >
        {channel.cta} →
      </p>
    </Wrapper>
  );
}
