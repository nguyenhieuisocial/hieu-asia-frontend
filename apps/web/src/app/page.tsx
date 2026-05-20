import Link from 'next/link';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { CalendarDays, ScanLine, ClipboardList, Sparkles, ShieldCheck, Trash2, Info, Lock } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LaSoSvg } from '@/components/la-so-svg';
import { HeroEntrance } from '@/components/hero-entrance';

const STEPS = [
  { step: '1', title: 'Nhập ngày sinh', desc: 'Thông tin cơ bản và bối cảnh hiện tại.', Icon: CalendarDays },
  { step: '2', title: 'Chụp ảnh bàn tay', desc: 'Hướng dẫn trực quan, không cần ứng dụng riêng.', Icon: ScanLine },
  { step: '3', title: 'Khảo sát ngắn', desc: '12–20 câu để hiểu cách bạn quyết định.', Icon: ClipboardList },
  { step: '4', title: 'Báo cáo + Mentor AI', desc: '9 góc nhìn + chat cố vấn AI 24/7.', Icon: Sparkles },
];

const TRUST = [
  { title: 'Không định mệnh hóa', desc: 'Báo cáo định hướng hành động, không phán quyết số phận.', Icon: Info },
  { title: 'Dữ liệu được bảo mật', desc: 'Mã hoá khi lưu trữ, không bán cho bên thứ ba.', Icon: Lock },
  { title: 'Có thể xóa dữ liệu', desc: 'Bạn kiểm soát mọi thông tin cá nhân của mình.', Icon: Trash2 },
  { title: 'Kết quả tham khảo', desc: 'Tổng hợp tri thức cổ điển + AI hiện đại.', Icon: ShieldCheck },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ink text-cream">
      <header className="container mx-auto flex items-center justify-between px-6 py-5">
        <span className="font-heading text-xl font-semibold text-gold">hieu.asia</span>
        <ThemeToggle />
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-ink-radial" aria-hidden="true" />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-60"
          aria-hidden="true"
        >
          <LaSoSvg className="h-full w-full" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-purple/20 to-transparent" aria-hidden="true" />

        <div className="container mx-auto px-6 py-20 lg:py-28">
          <HeroEntrance>
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-gold/80">
                Premium AI insight platform
              </p>
              <h1 className="font-heading text-4xl font-semibold leading-tight text-cream sm:text-5xl lg:text-6xl">
                Cẩm Nang Cuộc Đời <span className="bg-gold-gradient bg-clip-text text-transparent">AI</span>
              </h1>
              <p className="mt-6 text-base text-cream/80 sm:text-lg lg:text-xl">
                Phân tích tính cách, vận hạn, sự nghiệp và chiến lược hành động cá nhân hóa từ
                <span className="text-gold"> Tử Vi</span> +{' '}
                <span className="text-gold">Tâm lý</span> + <span className="text-gold">Vision AI</span>.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/onboarding" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    Bắt đầu luận giải
                  </Button>
                </Link>
                <Link href="/demo" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Xem demo báo cáo
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-xs text-cream/50">
                Không định mệnh hóa · Dữ liệu được mã hoá · Kết quả mang tính tham khảo
              </p>
            </div>
          </HeroEntrance>
        </div>
      </section>

      {/* 4-step explainer */}
      <section className="container mx-auto px-6 py-16 lg:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-semibold text-cream sm:text-3xl">
            Bốn bước, một báo cáo cá nhân hóa
          </h2>
          <p className="mt-3 text-sm text-cream/70 sm:text-base">
            Quy trình rõ ràng. Bạn biết hệ thống dùng dữ liệu nào, vì mục đích gì.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ step, title, desc, Icon }) => (
            <Card key={step} className="border-gold/15 transition-colors hover:border-gold/35">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md border border-gold/25 bg-gold/5">
                  <Icon className="h-5 w-5 text-gold" aria-hidden="true" />
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-gold/70">Bước {step}</span>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust block */}
      <section className="container mx-auto px-6 py-16 lg:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-semibold text-cream sm:text-3xl">Cam kết với bạn</h2>
          <p className="mt-3 text-sm text-cream/70 sm:text-base">
            Chúng tôi đặt minh bạch và quyền kiểm soát của bạn lên trên trải nghiệm "wow".
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map(({ title, desc, Icon }) => (
            <div
              key={title}
              className="rounded-lg border border-gold/15 bg-ink/40 p-5 backdrop-blur-sm transition-colors hover:border-gold/30"
            >
              <Icon className="mb-3 h-5 w-5 text-jade" aria-hidden="true" />
              <h3 className="font-heading text-base font-semibold text-cream">{title}</h3>
              <p className="mt-1.5 text-sm text-cream/70">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-6 py-20">
        <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-purple-700/40 via-ink to-ink p-10 text-center lg:p-16">
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-30" aria-hidden="true">
            <LaSoSvg className="absolute -right-20 -top-20 h-96 w-96" />
          </div>
          <h2 className="font-heading text-3xl font-semibold text-cream sm:text-4xl">
            Sẵn sàng khám phá chính mình?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-cream/70 sm:text-base">
            Mất khoảng 5 phút để hoàn tất khảo sát. Báo cáo của bạn sẽ sẵn sàng ngay sau đó.
          </p>
          <div className="mt-8">
            <Link href="/onboarding">
              <Button size="lg">Bắt đầu ngay</Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="container mx-auto px-6 py-10 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} hieu.asia · Premium AI insight platform · Kết quả mang tính tham khảo
      </footer>
    </main>
  );
}
