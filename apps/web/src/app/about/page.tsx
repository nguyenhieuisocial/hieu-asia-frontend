import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageCircle, Cpu, Lock, BookOpen, Heart } from 'lucide-react';
import { Button } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

export const metadata: Metadata = {
  title: 'Về chúng tôi — hieu.asia',
  description:
    'hieu.asia là người bạn đồng hành cho mỗi quyết định quan trọng — tri thức cổ học Việt Nam, AI hiện đại, văn phong calm, không định mệnh hoá.',
  alternates: { canonical: 'https://hieu.asia/about' },
  openGraph: {
    title: 'Về chúng tôi — hieu.asia',
    description:
      'Sứ mệnh, công nghệ, đạo đức và đội ngũ phía sau hieu.asia.',
    url: 'https://hieu.asia/about',
    type: 'website',
  },
};

const TECH_STACK: readonly { label: string; desc: string }[] = [
  { label: 'Cloudflare Workers', desc: 'Edge runtime ở 300+ thành phố, phản hồi dưới 1s.' },
  { label: 'Next.js 15 + React 19', desc: 'App Router, Server Components, streaming.' },
  { label: 'Supabase Postgres', desc: 'Database mã hoá AES-256, row-level security.' },
  { label: 'Claude (Anthropic)', desc: 'Mentor AI đối thoại có ngữ cảnh, không scripted.' },
];

const ETHICS: readonly { Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>; title: string; desc: string }[] = [
  {
    Icon: Lock,
    title: 'Riêng tư là mặc định',
    desc: 'Dữ liệu mã hoá lúc lưu và lúc truyền. Không bán cho bên thứ ba. Không dùng để huấn luyện mô hình. Bạn có quyền xoá bất cứ lúc nào.',
  },
  {
    Icon: BookOpen,
    title: 'Không định mệnh hoá',
    desc: 'hieu.asia không tuyên bố dự đoán tương lai, không doạ vận hạn, không bán bùa giải. Cổ học là khung tự nhận thức, không phải bản án.',
  },
  {
    Icon: Heart,
    title: 'Không thay thế chuyên gia',
    desc: 'Kết quả mang tính tham khảo. Quyết định y tế, pháp lý, tài chính cần chuyên gia phù hợp — hieu.asia là một góc nhìn, không phải lời khuyên thay thế.',
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-ink text-cream pt-16">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-ink">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_rgba(59,39,84,0.4)_0%,_transparent_55%)]"
          />
          <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
              Về chúng tôi
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight text-cream sm:text-5xl lg:text-6xl">
              Về{' '}
              <span className="bg-gold-gradient bg-clip-text text-transparent">hieu.asia</span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-cream/80 sm:text-lg">
              Một sản phẩm Việt Nam, xây cho người Việt — và bất cứ ai muốn hiểu
              mình rõ hơn để ra quyết định tốt hơn.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="relative bg-ink py-16 sm:py-20">
          <div className="mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-2">
            <article className="rounded-2xl border border-cream/10 bg-ink/40 p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/70">
                Sứ mệnh
              </p>
              <h2 className="mt-3 font-heading text-2xl font-bold text-cream">
                Hiểu mình. Quyết định mình.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-cream/75 sm:text-base">
                Mỗi khi bạn đứng trước một quyết định quan trọng, hieu.asia cho
                bạn một góc nhìn sâu hơn — bằng tri thức cổ học Việt Nam, được AI
                giải mã rõ ràng, và để bạn tự chọn con đường.
              </p>
            </article>
            <article className="rounded-2xl border border-cream/10 bg-ink/40 p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/70">
                Tầm nhìn
              </p>
              <h2 className="mt-3 font-heading text-2xl font-bold text-cream">
                Cẩm nang AI cho người Việt hiện đại.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-cream/75 sm:text-base">
                Một nơi mà cổ học không bị thương mại hoá rẻ tiền, không doạ vận
                hạn, không bán bùa — chỉ có tri thức được trình bày rõ ràng để
                bạn có thêm một góc nhìn cho cuộc đời mình.
              </p>
            </article>
          </div>
        </section>

        {/* Founder note */}
        <section className="relative bg-ink py-16">
          <div className="mx-auto max-w-3xl px-6">
            <div
              className="rounded-2xl border border-gold/20 p-8 sm:p-10"
              style={{ backgroundColor: 'rgba(20, 20, 26, 0.5)' }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/70">
                Lời từ người sáng lập
              </p>
              <blockquote className="mt-4 text-base leading-relaxed text-cream/85 sm:text-lg">
                Tôi xây hieu.asia vì tôi tin cổ học Việt Nam đáng được trình bày
                bằng ngôn ngữ của thời đại này — không huyễn hoặc, không thương
                mại hoá rẻ tiền. Mỗi người trong chúng ta đều có quyền hiểu chính
                mình rõ hơn, và quyền tự chọn con đường mình đi.
              </blockquote>
              <p className="mt-6 font-heading text-sm font-semibold text-gold">
                — Founder, hieu.asia
              </p>
              <p className="mt-1 text-xs text-cream/55">
                Tên chính thức và profile sẽ được cập nhật khi sản phẩm ra mắt
                công khai.
              </p>
            </div>
          </div>
        </section>

        {/* Tech stack */}
        <section className="relative bg-ink py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex items-start gap-3">
              <Cpu className="mt-1 h-5 w-5 text-gold" aria-hidden={true} />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/70">
                  Công nghệ
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-cream sm:text-3xl">
                  Edge architecture — nhanh, rẻ, bảo mật
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream/75 sm:text-base">
                  Chúng tôi tự hào về hạ tầng. Toàn bộ ứng dụng chạy trên edge
                  runtime của Cloudflare — phản hồi gần như tức thì ở bất kỳ đâu
                  trên thế giới, đồng thời chi phí vận hành thấp nên giá đến tay
                  bạn cũng hợp lý.
                </p>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TECH_STACK.map((t) => (
                <div
                  key={t.label}
                  className="rounded-xl border border-cream/10 bg-ink/40 p-5"
                >
                  <p className="font-heading text-sm font-semibold text-cream">
                    {t.label}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-cream/65">
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ethics */}
        <section className="relative bg-ink py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/70">
                Quyền riêng tư & đạo đức
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-cream sm:text-3xl">
                Ba cam kết, không thoả hiệp
              </h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {ETHICS.map(({ Icon, title, desc }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-cream/10 bg-ink/40 p-6"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-gold/5">
                    <Icon className="h-4.5 w-4.5 text-gold" aria-hidden={true} />
                  </div>
                  <h3 className="mt-4 font-heading text-base font-semibold text-cream">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/70">
                    {desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="relative bg-ink py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-heading text-2xl font-bold text-cream sm:text-3xl">
              Liên hệ với chúng tôi
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-cream/70">
              Phản hồi, hợp tác, hay chỉ đơn giản là một câu hỏi — chúng tôi
              đọc tất cả email.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="mailto:hi@hieu.asia">
                <Button size="lg" className="min-w-[200px]">
                  <Mail className="mr-1.5 h-4 w-4" aria-hidden={true} />
                  hi@hieu.asia
                </Button>
              </Link>
              <Link href="https://t.me/hieuasia_bot">
                <Button size="lg" variant="outline" className="min-w-[200px]">
                  <MessageCircle className="mr-1.5 h-4 w-4" aria-hidden={true} />
                  Telegram bot
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
