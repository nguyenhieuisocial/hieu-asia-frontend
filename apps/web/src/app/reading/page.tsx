import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles, MessageCircle, LayoutDashboard } from 'lucide-react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

export const metadata: Metadata = {
  title: 'Lá số của bạn',
  description:
    'Bắt đầu lá số mới hoặc xem lại các báo cáo trước. Tử Vi · MBTI · Numerology · Palm.',
  alternates: { canonical: 'https://hieu.asia/reading' },
};

const METHOD_CARDS = [
  {
    method: 'tu-vi',
    name: 'Tử Vi Đẩu Số',
    blurb: 'Lá số 12 cung — sự nghiệp, tình cảm, tài lộc, sức khoẻ.',
    minutes: '4–6 phút',
  },
  {
    method: 'bat-tu',
    name: 'Bát Tự',
    blurb: 'Tứ trụ Can-Chi — vận trình theo Đại Hạn / Lưu Niên.',
    minutes: '3–5 phút',
  },
  {
    method: 'numerology',
    name: 'Thần Số Học',
    blurb: 'Pythagorean — đường đời, sứ mệnh, năm cá nhân.',
    minutes: '2–3 phút',
  },
  {
    method: 'palm',
    name: 'Palm Reading',
    blurb: 'Tải ảnh lòng bàn tay — phân tích đường tâm đạo / trí đạo.',
    minutes: '2–4 phút',
  },
] as const;

export default function ReadingHubPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <main className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <header className="mb-12 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-gold/80">
            Lá số của bạn
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold leading-tight sm:text-5xl">
            Bắt đầu một <span className="bg-gold-gradient bg-clip-text text-transparent">góc nhìn mới</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Chọn phương pháp luận, hoặc xem lại các báo cáo đã tạo. Mọi báo cáo
            được lưu vào tài khoản của bạn — có thể đọc lại bất cứ lúc nào.
          </p>
        </header>

        <section aria-labelledby="methods-heading" className="mb-16">
          <h2 id="methods-heading" className="sr-only">
            Chọn phương pháp
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {METHOD_CARDS.map((m) => (
              <Card key={m.method} className="group border-gold/15 bg-card/60 backdrop-blur-sm transition hover:border-gold/40">
                <CardHeader>
                  <Sparkles className="mb-2 h-5 w-5 text-gold/80" aria-hidden="true" />
                  <CardTitle className="text-lg">{m.name}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    {m.minutes}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{m.blurb}</p>
                  <Button asChild variant="outline" size="sm" className="w-full"><Link href={`/reading/new?method=${m.method}`}>
                    
                      Bắt đầu
                      <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    
                  </Link></Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
              href="/onboarding?cta=mentor"
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
    </div>
  );
}
