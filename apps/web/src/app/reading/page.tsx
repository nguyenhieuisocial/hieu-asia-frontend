import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Plus, MessageCircle, LayoutDashboard } from 'lucide-react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { Fab } from '@/components/product/Fab';
import { LENSES } from '@/lib/catalog/lenses';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

export const metadata: Metadata = {
  title: 'Lá số của bạn — năm lăng kính, một bức tranh',
  description:
    'Một lá số từ ngày giờ sinh, đọc qua năm lăng kính — Tử Vi, Bát Tự, MBTI, Big Five, Xem Tướng — rồi AI hợp nhất thành một bức tranh để bạn tự quyết.',
  alternates: { canonical: 'https://hieu.asia/reading' },
  openGraph: {
    title: 'Lá số của bạn — một lá số, năm lăng kính · hieu.asia',
    description:
      'Một lá số, năm lăng kính (Tử Vi · Bát Tự · MBTI · Big Five · Xem Tướng), AI hợp nhất thành một bức tranh bạn dùng được để tự quyết.',
    url: 'https://hieu.asia/reading',
    type: 'website',
    images: OG_DEFAULT_IMAGES,
  },
};

export default function ReadingHubPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <main className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <header className="mb-12 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold/80">
            Lá số của bạn
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold leading-tight sm:text-5xl">
            Một lá số,{' '}
            <span className="bg-gold-gradient bg-clip-text text-transparent">năm lăng kính</span>,
            một bức tranh
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Không phải chọn một phương pháp. Từ ngày giờ sinh của bạn, hệ thống lập
            một lá số rồi đọc nó qua năm lăng kính — cổ học và tâm lý học. AI hợp nhất
            cả năm lớp thành một bức tranh bạn dùng được để tự quyết.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/onboarding">
                Lập lá số của bạn
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </header>

        <section aria-labelledby="lenses-heading" className="mb-16">
          <h2
            id="lenses-heading"
            className="font-heading text-2xl font-semibold sm:text-3xl"
          >
            Năm lăng kính trong lá số của bạn
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Mỗi lăng kính nhìn bạn từ một phía. Bạn nhận được cả năm trong cùng một lá
            số — không cần chọn, không cần lập lại.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LENSES.map((lens) => (
              <Card
                key={lens.slug}
                className="group flex flex-col border-gold/15 bg-card/60 backdrop-blur-sm transition hover:border-gold/40"
              >
                <CardHeader>
                  <p className="mb-1 font-mono text-xs uppercase tracking-[0.12em] text-gold/80">
                    {lens.eyebrow}
                  </p>
                  <CardTitle className="text-lg">{lens.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {lens.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <p className="text-sm leading-relaxed text-muted-foreground">{lens.full}</p>
                  <Link
                    href={lens.href}
                    className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 self-start text-sm font-medium text-gold transition-colors hover:text-gold-400"
                  >
                    {lens.cta}
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            <span className="text-gold">→</span> AI đọc cả năm lăng kính rồi hợp nhất thành{' '}
            <span className="text-foreground">một lời khuyên thực tế</span>, có thể hành động —
            lưu vào tài khoản để đọc lại bất cứ lúc nào.
          </p>
        </section>

        <section aria-labelledby="more-actions" className="border-t border-border pt-12">
          <h2 id="more-actions" className="font-heading text-2xl font-semibold">
            Hoặc làm gì khác?
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              href="/account"
              className="group flex items-start gap-4 rounded-lg border border-border bg-card/40 p-5 transition hover:border-gold/30 hover:bg-card/60"
            >
              <LayoutDashboard className="h-6 w-6 shrink-0 text-gold/80" aria-hidden="true" />
              <div className="flex-1">
                <div className="font-heading text-base font-semibold">Trang quản lý báo cáo</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Xem lịch sử lá số, theo dõi mentor sessions, quản lý gói.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              href="/mentor"
              className="group flex items-start gap-4 rounded-lg border border-border bg-card/40 p-5 transition hover:border-gold/30 hover:bg-card/60"
            >
              <MessageCircle className="h-6 w-6 shrink-0 text-gold/80" aria-hidden="true" />
              <div className="flex-1">
                <div className="font-heading text-base font-semibold">Trò chuyện cùng AI Mentor</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Không cần báo cáo — hỏi trực tiếp về quyết định bạn đang đứng trước.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* Wave 60.68 — Material 3 Extended FAB. Primary persistent action on
          the reading hub: "Lá số mới" → onboarding flow. Mounted as a sibling
          of <main>; respects safe-area-inset-bottom on iPhone home indicator. */}
      <Fab
        href="/onboarding"
        label="Lá số mới"
        trackId="fab_reading_new"
        icon={<Plus className="h-5 w-5" aria-hidden="true" />}
      />
    </div>
  );
}
