/**
 * /brand — Brand system showcase page cho hieu.asia.
 *
 * Server component (mostly), với từng section đánh anchor ID phục vụ TOC.
 * Một số subcomponent có 'use client' (ColorPalette dùng clipboard), an toàn
 * khi nhúng trong server page.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Palette,
  Type,
  Ruler,
  Sparkles,
  Camera,
  LayoutGrid,
  MessagesSquare,
  Download,
  Box,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { Logo, Wordmark, SymbolMark, Lockup } from '@/components/brand/Logo';
import { LogoApplicationBoard } from '@/components/brand/LogoApplicationBoard';
import { ColorPalette } from '@/components/brand/ColorPalette';
import { TypographyShowcase } from '@/components/brand/TypographyShowcase';
import { SpacingDemo } from '@/components/brand/SpacingDemo';
import { IconShowcase } from '@/components/brand/IconShowcase';
import { PhotoDirection } from '@/components/brand/PhotoDirection';
import { SiteNav } from '@/components/home/SiteNav';

export const metadata: Metadata = {
  title: 'Brand System',
  description:
    'Hệ thống nhận diện hieu.asia — logo, màu, typography, spacing, icon, photo direction, ứng dụng và giọng nói thương hiệu.',
  alternates: { canonical: 'https://hieu.asia/brand' },
  // SEO-FIX: noindex. This is an internal brand/design-system reference page
  // with no organic search intent; leaving it indexed-but-unlinked made it an
  // Ahrefs "orphan page". follow:true so it still passes link equity onward.
  robots: { index: false, follow: true },
};

const TOC = [
  { id: 'logo', label: 'Logo system', Icon: Box },
  { id: 'colors', label: 'Màu sắc', Icon: Palette },
  { id: 'typography', label: 'Typography', Icon: Type },
  { id: 'spacing', label: 'Spacing', Icon: Ruler },
  { id: 'icons', label: 'Icons', Icon: Sparkles },
  { id: 'photo', label: 'Photo direction', Icon: Camera },
  { id: 'application', label: 'Ứng dụng logo', Icon: LayoutGrid },
  { id: 'voice', label: 'Voice & tone', Icon: MessagesSquare },
  { id: 'download', label: 'Tải tài nguyên', Icon: Download },
];

const VOICE_DO = [
  'Đồng cảm, không phán xét. "Bạn đang phải đối mặt với…"',
  'Cụ thể, có hành động. "Tuần này hãy thử…"',
  'Khiêm tốn về độ chắc chắn. "Theo lá số, có thiên hướng…"',
  'Tôn trọng người đọc là người trưởng thành.',
  'Dùng từ Hán Việt khi cần độ chính xác cổ điển — kèm chú thích.',
];

const VOICE_DONT = [
  'Định mệnh hoá. "Bạn sẽ giàu/nghèo vào năm…"',
  'Cảnh báo dọa nạt. "Coi chừng tai họa lớn…"',
  'Quảng cáo giật gân. "Khám phá bí mật vũ trụ!!!"',
  'Lạm dụng emoji bùa chú · biểu cảm thái quá.',
  'Dùng tiếng Anh không cần thiết khi tiếng Việt đủ rõ.',
];

export default function BrandPage() {
  return (
    <>
      <SiteNav />
      <div className="min-h-screen bg-background pt-16 text-foreground">
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-gold/10 bg-background">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_rgba(184,146,61,0.10)_0%,_transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(184,146,61,0.18)_0%,_transparent_55%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 [background-image:linear-gradient(rgba(184,146,61,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(184,146,61,0.5)_1px,transparent_1px)] [background-size:48px_48px] opacity-[0.06] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="font-mono text-xs uppercase tracking-[0.32em] text-gold-700">
            Brand System v1
          </div>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Hệ thống nhận diện <span className="text-gold-700">hieu.asia</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/85">
            Tài liệu sống — mọi designer, marketer và LLM dùng cho hieu.asia
            đều bắt đầu từ đây. Logo, màu, typography, ứng dụng và giọng nói.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Lockup size={64} />
          </div>
        </div>
      </section>

      {/* MAIN GRID */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
          {/* TOC */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1" aria-label="Mục lục">
              <div className="px-3 pb-2 font-mono text-[12px] uppercase tracking-[0.3em] text-gold-700">
                Mục lục
              </div>
              {TOC.map(({ id, label, Icon }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-foreground/85 transition hover:bg-gold/10 hover:text-foreground"
                >
                  <Icon className="h-4 w-4 text-gold" strokeWidth={1.5} aria-hidden="true" />
                  <span>{label}</span>
                </a>
              ))}
              <div className="mt-6 px-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-gold"
                >
                  ← Về trang chủ
                </Link>
              </div>
            </nav>
          </aside>

          {/* SECTIONS */}
          <main className="min-w-0 space-y-20">
            {/* LOGO */}
            <Section id="logo" title="Logo system" eyebrow="01">
              <p className="text-muted-foreground">
                Ba dạng: <strong className="text-foreground">wordmark</strong> (đầy đủ
                tên),<strong className="text-foreground"> symbol mark</strong> (chữ H, dùng
                favicon / app icon),
                <strong className="text-foreground"> lockup</strong> (kết hợp).
                Mỗi dạng có 4 variant: gold gradient (mặc định), dark (cream trên nền tối), light (đen trên nền sáng), mono (1 màu, dùng cho in 1 màu hoặc dark theme).
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <LogoSwatch label="Wordmark · gold (default)" bg="dark">
                  <Wordmark variant="gold" size={56} />
                </LogoSwatch>
                <LogoSwatch label="Wordmark · dark" bg="dark">
                  <Wordmark variant="dark" size={56} />
                </LogoSwatch>
                <LogoSwatch label="Wordmark · light" bg="light">
                  <Wordmark variant="light" size={56} />
                </LogoSwatch>
                <LogoSwatch label="Wordmark · mono" bg="dark">
                  <span className="text-foreground/90">
                    <Wordmark variant="mono" size={56} />
                  </span>
                </LogoSwatch>
              </div>

              <h3 className="mt-12 font-heading text-lg font-semibold text-foreground">
                Symbol mark (chữ H)
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                <LogoSwatch label="64 px" bg="dark">
                  <SymbolMark size={64} />
                </LogoSwatch>
                <LogoSwatch label="128 px" bg="dark">
                  <SymbolMark size={128} />
                </LogoSwatch>
                <LogoSwatch label="Light variant" bg="light">
                  <SymbolMark variant="light" size={96} />
                </LogoSwatch>
                <LogoSwatch label="Mono variant" bg="dark">
                  <span className="text-foreground/90">
                    <SymbolMark variant="mono" size={96} />
                  </span>
                </LogoSwatch>
              </div>

              <h3 className="mt-12 font-heading text-lg font-semibold text-foreground">
                Lockup (symbol + wordmark)
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <LogoSwatch label="Lockup · gold" bg="dark">
                  <Lockup size={56} />
                </LogoSwatch>
                <LogoSwatch label="Lockup · light" bg="light">
                  <Lockup variant="light" size={56} />
                </LogoSwatch>
              </div>

              <h3 className="mt-12 font-heading text-lg font-semibold text-foreground">
                Clear space &amp; min size
              </h3>
              <ClearSpaceGuide />
            </Section>

            {/* COLORS */}
            <Section id="colors" title="Màu sắc" eyebrow="02">
              <p className="text-muted-foreground">
                Click vào ô màu để copy mã hex. Mỗi tier đặt tên Tailwind tương
                ứng — dùng trực tiếp class <code className="rounded bg-gold/10 px-1 font-mono text-xs text-gold-700">bg-gold-500</code>.
              </p>
              <div className="mt-8">
                <ColorPalette />
              </div>
            </Section>

            {/* TYPOGRAPHY */}
            <Section id="typography" title="Typography" eyebrow="03">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Be Vietnam Pro</strong> cho cả heading
                lẫn body (tối ưu diacritic tiếng Việt; phân cấp bằng độ đậm).
                <strong className="text-foreground"> Newsreader</strong> cho tiêu đề editorial lớn (serif). Nhãn nhỏ cũng dùng Be Vietnam Pro (đã bỏ JetBrains Mono).
              </p>
              <div className="mt-8">
                <TypographyShowcase />
              </div>
            </Section>

            {/* SPACING */}
            <Section id="spacing" title="Spacing" eyebrow="04">
              <div className="mt-4">
                <SpacingDemo />
              </div>
            </Section>

            {/* ICONS */}
            <Section id="icons" title="Icons" eyebrow="05">
              <IconShowcase />
            </Section>

            {/* PHOTO */}
            <Section id="photo" title="Photo direction" eyebrow="06">
              <p className="text-muted-foreground">
                Hieu.asia không dùng ảnh cosplay thầy bói hay bùa chú rẻ tiền.
                Tông cinematic, ánh sáng tự nhiên, subject nhỏ trong không
                gian lớn.
              </p>
              <div className="mt-8">
                <PhotoDirection />
              </div>
            </Section>

            {/* APPLICATION */}
            <Section id="application" title="Ứng dụng logo (12 ngữ cảnh)" eyebrow="07">
              <p className="text-muted-foreground">
                Mỗi card là CSS mockup — kiểm tra logo hoạt động ra sao trên
                các bề mặt khác nhau: digital, vật lý, social, presentation.
              </p>
              <div className="mt-8">
                <LogoApplicationBoard />
              </div>
            </Section>

            {/* VOICE & TONE */}
            <Section id="voice" title="Voice &amp; tone" eyebrow="08">
              <p className="text-muted-foreground">
                Tự hiểu mình. Quyết định tốt hơn. Giọng đồng cảm, không định
                mệnh hoá, không doạ nạt, không quảng cáo giật gân.
              </p>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <Card className="border-jade/30 bg-jade-900/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-jade-50">
                      <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                      Nên làm
                    </CardTitle>
                    <CardDescription className="text-jade-50/70">
                      Giọng đồng cảm, có hành động
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-foreground/85">
                      {VOICE_DO.map((line) => (
                        <li key={line} className="flex gap-2">
                          <span className="text-jade-50">·</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-red-900/40 bg-red-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-200">
                      <XCircle className="h-5 w-5" aria-hidden="true" />
                      Tránh
                    </CardTitle>
                    <CardDescription className="text-red-200/70">
                      Cấm định mệnh hoá, dọa nạt
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-foreground/85">
                      {VOICE_DONT.map((line) => (
                        <li key={line} className="flex gap-2">
                          <span className="text-red-300">·</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Khẩu hiệu (taglines)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-foreground/85">
                    <li>
                      <span className="font-heading text-xl font-semibold text-gold-700">
                        Tự hiểu mình. Quyết định tốt hơn.
                      </span>
                      <div className="text-xs text-muted-foreground">Tagline chính</div>
                    </li>
                    <li>
                      <span className="font-heading text-lg font-semibold text-foreground">
                        Người bạn đồng hành huyền học hiện đại
                      </span>
                      <div className="text-xs text-muted-foreground">Mô tả ngắn</div>
                    </li>
                    <li>
                      <span className="font-mono text-sm uppercase tracking-[0.3em] text-gold-700">
                        AI Personal Insight Platform
                      </span>
                      <div className="text-xs text-muted-foreground">Eyebrow tiếng Anh</div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Section>

            {/* DOWNLOAD */}
            <Section id="download" title="Tải tài nguyên" eyebrow="09">
              <p className="text-muted-foreground">
                Các đường link bên dưới sẽ trỏ tới bundle thực khi có. Hiện tại
                copy logo bằng cách inspect SVG trên trang này hoặc copy hex từ
                section màu.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                <DownloadItem
                  title="Logo SVG kit"
                  hint="Wordmark · Symbol · Lockup — tất cả variant"
                />
                <DownloadItem title="Color tokens" hint="JSON + Tailwind preset" />
                <DownloadItem title="Font files" hint="Be Vietnam Pro · Newsreader" />
                <DownloadItem title="Icon set" hint="Lucide subset · 24 icons" />
                <DownloadItem title="OG image template" hint="1200×630 · Figma" />
                <DownloadItem title="Brand book PDF" hint="Toàn bộ guideline · 20 trang" />
              </div>
              <div className="mt-8 rounded-lg border border-gold/15 bg-card/40 p-5 text-sm text-muted-foreground">
                Liên hệ <a className="text-gold-700 underline" href="mailto:brand@hieu.asia">brand@hieu.asia</a> nếu cần file gốc hoặc đặt request tuỳ biến.
              </div>
            </Section>
          </main>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gold/10 bg-card/80 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center">
          <Logo kind="wordmark" size={36} />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} hieu.asia — Brand System v1
          </p>
          <Link href="/" className="text-xs text-muted-foreground hover:text-gold">
            ← Về trang chủ
          </Link>
        </div>
      </footer>
      </div>
    </>
  );
}

// -------------------- Helpers --------------------

function Section({
  id,
  title,
  eyebrow,
  children,
}: {
  id: string;
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="font-mono text-[13px] uppercase tracking-[0.32em] text-gold-700">
        {eyebrow}
      </div>
      <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function LogoSwatch({
  label,
  bg,
  children,
}: {
  label: string;
  bg: 'dark' | 'light';
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex h-44 flex-col rounded-lg border ${
        bg === 'dark' ? 'border-gold/15 bg-background' : 'border-gold/20 bg-muted'
      }`}
    >
      <div className="flex flex-1 items-center justify-center px-4">{children}</div>
      <div
        className={`border-t px-4 py-2 text-[13px] ${
          bg === 'dark' ? 'border-gold/10 text-muted-foreground' : 'border-gold/15 text-foreground/60'
        }`}
      >
        {label}
      </div>
    </div>
  );
}

function ClearSpaceGuide() {
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-gold/15 bg-card/40 p-6">
        <div className="font-heading text-sm font-semibold text-foreground">
          Clear space
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Không để text / element nào trong khoảng = ½ chiều cao chữ "h".
        </p>
        <div className="mt-5 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-[-18px] border border-dashed border-gold/40" />
            <Wordmark size={36} />
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-gold/15 bg-card/40 p-6">
        <div className="font-heading text-sm font-semibold text-foreground">
          Min size
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Symbol mark ≥ 16 px · Wordmark ≥ 80 px ngang · Lockup ≥ 120 px ngang.
        </p>
        <div className="mt-5 flex items-end gap-6">
          <div className="flex flex-col items-center gap-2">
            <SymbolMark size={16} />
            <span className="font-mono text-[12px] text-muted-foreground">16 px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Wordmark size={20} />
            <span className="font-mono text-[12px] text-muted-foreground">80 px W</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Lockup size={30} />
            <span className="font-mono text-[12px] text-muted-foreground">120 px W</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DownloadItem({ title, hint }: { title: string; hint: string }) {
  return (
    <div
      aria-disabled="true"
      className="group flex items-start justify-between gap-3 rounded-lg border border-gold/15 bg-card/40 p-4 opacity-90"
    >
      <div>
        <div className="font-heading text-sm font-semibold text-foreground">{title}</div>
        <div className="mt-1 text-[13px] text-muted-foreground">{hint}</div>
      </div>
      <ArrowUpRight className="h-4 w-4 text-gold/60" aria-hidden="true" />
    </div>
  );
}
