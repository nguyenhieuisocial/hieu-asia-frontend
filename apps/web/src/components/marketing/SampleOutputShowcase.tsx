'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Sparkles, Calendar, MessageSquareQuote, ListChecks, ArrowRight } from 'lucide-react';

/**
 * Wave 60.95.c P1-6 — SampleOutputShowcase (vault 130 §III P1-6).
 *
 * R6 finding (ChatGPT external review §3.2): "Trang chủ có link Báo cáo mẫu
 * trong nav, nhưng nội dung trang chủ chưa làm rõ output mẫu. Với sản phẩm
 * AI/astrology, user cần thấy trước chất lượng insight TRƯỚC khi gặp pricing."
 *
 * This block sits BEFORE PricingTierV2 on the homepage. 4 illustrative cards
 * show 4 representative chunks of a real report (Mệnh — Đại vận — Mentor —
 * Kế hoạch 30 ngày). All sample text is hand-written Vietnamese, NOT live
 * data — cards carry an aria-label hint "(minh hoạ)" to make the demo nature
 * explicit. Footer CTA pair points primary → /onboarding and secondary →
 * /sample-report (full 12-cung + Mentor + 30-60-90 plan).
 *
 * Brand tokens (Wave 60.56 P1 — vault 108 Option E):
 *   bg-background / text-cream-{50,300,500} / text-gold / text-gold-soft
 *   font-marketing-display / Instrument Serif italic for sample year numerals
 *   rounded-card-editorial / max-w-marketing
 *
 * Wave 60.95.j P2-#19 — converted to `'use client'` to apply scale-up reveal
 * (0.95 → 1 + opacity) on the 4 cards. Distinguishes the "showcase" surface
 * grammar from the opacity-only stat blocks (BigNumberRow) and slide-from-left
 * testimonial (PullQuote). IntersectionObserver gates the reveal once at 25%
 * visibility; CSS handles the transition (0 KB JS runtime delta — no Motion).
 */
type SampleCard = {
  id: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  body: React.ReactNode;
  footer?: React.ReactNode;
};

const CARDS: SampleCard[] = [
  {
    id: 'cung-menh',
    icon: <Sparkles className="size-5 text-gold" strokeWidth={1.5} aria-hidden />,
    eyebrow: 'CUNG MỆNH',
    title: 'Sao chủ và khí chất nền',
    body: (
      <p>
        “Mệnh tại{' '}
        <em className="font-marketing-display italic text-gold-soft">Dần</em>{' '}
        có Tử Vi đồng cung Thiên Phủ — khí chất ổn định, giữ chữ tín, hợp vai
        trò chuyên gia. Khi căng thẳng, bạn dễ rút vào nội tâm thay vì bộc lộ.”
      </p>
    ),
    footer: (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-[0.18em] text-gold/80">
        <span aria-hidden>·</span> Có nút “Vì sao?” mở evidence
      </span>
    ),
  },
  {
    id: 'dai-van',
    icon: <Calendar className="size-5 text-gold" strokeWidth={1.5} aria-hidden />,
    eyebrow: 'ĐẠI VẬN HIỆN TẠI',
    title: 'Dòng chảy 10 năm',
    body: (
      <p>
        “Đại vận{' '}
        <em className="font-marketing-display italic text-gold-soft">28–37</em>{' '}
        tuổi đi qua cung Tham Lang Hoá Quyền — giai đoạn xây nền chuyên môn,
        không vội chuyển ngành. Quý 1 năm 2026 cần thận trọng với quyết định
        nóng.”
      </p>
    ),
    footer: (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-[0.18em] text-gold/80">
        <span aria-hidden>·</span> Có timeline lưu niên năm
      </span>
    ),
  },
  {
    id: 'mentor',
    icon: <MessageSquareQuote className="size-5 text-gold" strokeWidth={1.5} aria-hidden />,
    eyebrow: 'AI MENTOR',
    title: 'Đối thoại có ngữ cảnh',
    body: (
      <div className="space-y-2.5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
            Bạn hỏi
          </p>
          <p className="text-muted-foreground text-[13px] leading-relaxed">
            Có nên mở rộng chi nhánh ngay bây giờ không?
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-gold/80">
            Mentor
          </p>
          <p className="text-muted-foreground text-[13px] leading-relaxed">
            Trước khi trả lời, runway tài chính của bạn còn bao tháng? Lá số
            cho thấy chủ đề năm nay là “củng cố trước khi mở rộng”…
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'plan-30',
    icon: <ListChecks className="size-5 text-gold" strokeWidth={1.5} aria-hidden />,
    eyebrow: 'KẾ HOẠCH 30 NGÀY',
    title: 'Bước hành động cụ thể',
    body: (
      <ul className="space-y-1.5 text-[13px] leading-relaxed text-muted-foreground">
        <li className="flex gap-2">
          <span className="text-gold/85" aria-hidden>→</span>
          <span>Mở quỹ dự phòng đến 3 tháng chi tiêu.</span>
        </li>
        <li className="flex gap-2">
          <span className="text-gold/85" aria-hidden>→</span>
          <span>Liệt kê 3 việc bạn làm tốt nhất — yêu cầu mở rộng 2 trong đó.</span>
        </li>
        <li className="flex gap-2">
          <span className="text-gold/85" aria-hidden>→</span>
          <span>Đặt 1 cuộc nói chuyện với người cùng ngành 2 cấp trên bạn.</span>
        </li>
      </ul>
    ),
  },
];

export function SampleOutputShowcase() {
  // Wave 60.95.j P2-#19 — gate scale-up reveal on first in-view via single
  // IntersectionObserver at the grid level (cheaper than 4 observers). Cards
  // stagger via inline `transitionDelay` so the eye reads left-to-right.
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = gridRef.current;
    if (!node || inView) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [inView]);

  return (
    <section
      aria-label="Báo cáo mẫu (minh hoạ)"
      className="bg-background py-16 md:py-20"
    >
      <div className="mx-auto max-w-marketing px-6 lg:px-12">
        {/* Header */}
        <div className="mx-auto max-w-marketing-tight text-center">
          <p className="mb-4 font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
            — BẠN SẼ NHẬN ĐƯỢC GÌ
          </p>
          <h2 className="text-balance font-sans text-section-display font-bold tracking-tight leading-tight text-foreground">
            Báo cáo{' '}
            <em className="italic text-gold-soft">cá nhân hoá</em> theo từng
            câu hỏi của bạn
            <span className="text-gold-dot">.</span>
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Bốn trích đoạn dưới đây minh hoạ một báo cáo thật trả về điều gì —
            không phải dữ liệu của bạn, là persona giả định.
          </p>
        </div>

        {/* Cards — scale-up reveal (vault 130 §III P2-#19). */}
        <div ref={gridRef} className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, i) => (
            <article
              key={c.id}
              data-in-view={inView ? 'true' : 'false'}
              style={{ transitionDelay: `${i * 80}ms` }}
              className="group relative flex scale-95 flex-col rounded-card-editorial border border-border bg-muted/40 p-6 opacity-0 transition-[opacity,transform,border-color] duration-[600ms] ease-editorial hover:border-gold/40 data-[in-view=true]:scale-100 data-[in-view=true]:opacity-100"
            >
              <div className="mb-3 flex items-center gap-2">
                {c.icon}
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
                  {c.eyebrow}
                </p>
              </div>
              <h3 className="mb-3 font-sans text-lg font-semibold leading-snug text-foreground">
                {c.title}
              </h3>
              <div className="flex-1 text-[14px] leading-relaxed text-muted-foreground">
                {c.body}
              </div>
              {c.footer && <div className="mt-4">{c.footer}</div>}
            </article>
          ))}
        </div>

        {/* Footer CTA pair */}
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 font-sans text-sm font-semibold text-ink transition-colors duration-200 hover:bg-gold-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-warm-dark-50"
          >
            Lập lá số miễn phí
          </Link>
          <Link
            href="/sample-report"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-gold/40 px-6 py-3 font-sans text-sm font-medium text-foreground transition-colors duration-200 hover:border-gold hover:bg-gold/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-warm-dark-50"
          >
            Xem báo cáo mẫu đầy đủ
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground/70">
          Persona demo · không phải dữ liệu thật
        </p>
      </div>
    </section>
  );
}
