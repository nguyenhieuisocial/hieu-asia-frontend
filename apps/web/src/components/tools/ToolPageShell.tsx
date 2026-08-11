import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { RevealOnScroll } from '@/components/motion/RevealOnScroll';

export interface ToolPageShellProps {
  eyebrow: string;
  title: React.ReactNode;
  description: React.ReactNode;
  icon?: React.ReactNode;
  /** When set, renders a small breadcrumb row under the hero. */
  breadcrumb?: { label: string; href?: string }[];
  /** Optional CTA row in the hero, e.g. quick action buttons. */
  heroAction?: React.ReactNode;
  /** Khi set, render khối nội dung bên phải hero trong lưới 2 cột ở desktop (lg+).
   *  Mặc định undefined → hero giữ layout 1 cột như cũ (mọi trang khác không đổi). */
  heroAside?: React.ReactNode;
  /** Khi set, render khối "Công cụ liên quan" (tra RELATED_TOOLS theo route) ở cuối trang. */
  relatedSlug?: string;
  /** Page content below the hero. */
  children: React.ReactNode;
}

/**
 * Shell dùng chung cho 76 trang công cụ (đối chiếu `patterns/tool-page.html`
 * đã duyệt trên claude.ai/design).
 *
 * Layout: SiteNav (fixed) → breadcrumb + hero (eyebrow/H1/mô tả) → children
 * trong khung căn giữa max-w → SiteFooter.
 *
 * 11/08/2026 — nền PHẲNG tuyệt đối, không glow/gradient/blur (đã gỡ 3 lớp hào
 * quang trước đó). Đổi màu/hình khối qua đợt trước không tự cuốn theo được vì
 * đây là JSX của shell, không phải token CSS.
 */
export function ToolPageShell({
  eyebrow,
  title,
  description,
  icon,
  breadcrumb,
  heroAction,
  heroAside,
  relatedSlug,
  children,
}: ToolPageShellProps) {
  // Tách phần hero (icon + chữ) ra biến để đường-MẶC-ĐỊNH (không heroAside)
  // render DOM y hệt trước — 64 trang khác dùng shell không đổi gì.
  const heroInner = (
    <>
      {icon && (
        <div
          aria-hidden="true"
          // 11/08/2026 — bỏ gradient gold→purple + shadow phát sáng, cùng lý do
          // với 3 lớp glow ở nền `<main>` phía dưới: khớp `.input-card` phẳng
          // (nền = --bg, chỉ viền) của tool-page.html đã duyệt, không glow.
          className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-card text-3xl sm:flex"
        >
          {icon}
        </div>
      )}
      <div className="flex-1">
        {/* 2026-06-22 UX review: eyebrow về token (0.12em, khớp marketing; was
            0.32em ~3x drift) · H1 dùng serif biên-tập editorial-h2 (khớp brand
            "Như giấy cũ" mà marketing/home đang dùng; was font-heading sans). */}
        <p className="font-mono text-eyebrow uppercase text-primary">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-editorial-display text-editorial-h2 font-normal text-foreground">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
        {heroAction && <div className="mt-6">{heroAction}</div>}
      </div>
    </>
  );
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <main id="main-content" className="relative pt-16">
        {/* 11/08/2026 — Giai đoạn 2 design refresh, khuôn trang công cụ.
         * Gỡ 3 lớp hào quang (ink-radial + 2 đốm blur gold/purple) từng phủ
         * ~1.200 trang công cụ. Đối chiếu `design-system/patterns/tool-page.html`
         * đã duyệt: nền PHẲNG tuyệt đối, không glow/gradient/blur ở bất kỳ
         * đâu — chỉ hairline border phân vùng. Trang công cụ trước đây mang
         * đúng ngôn ngữ "mềm, phát sáng" mà đợt màu/hình khối vừa gỡ khỏi
         * nút/thẻ; còn sót lại ở đây vì đây là lớp NỀN của shell, không phải
         * token màu/bo góc nên không tự cuốn theo hai đợt trước.
         * `overflow-hidden` cũng gỡ theo — chỉ tồn tại để cắt viền 3 lớp
         * glow tràn ra ngoài khung; không còn glow thì không còn lý do giữ. */}

        <section className="relative">
          <div className="mx-auto max-w-6xl px-6 pt-6 pb-8 sm:pt-8 sm:pb-12">
            {breadcrumb && breadcrumb.length > 0 && (
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  {breadcrumb.map((b, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      {b.href ? (
                        <Link href={b.href} className="transition-colors hover:text-primary">
                          {b.label}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">{b.label}</span>
                      )}
                      {i < breadcrumb.length - 1 && (
                        <ChevronRight className="h-3 w-3 text-foreground/30" aria-hidden="true" />
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {heroAside ? (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-12">
                <div className="flex items-start gap-5">{heroInner}</div>
                <div className="hidden lg:block">{heroAside}</div>
              </div>
            ) : (
              <div className="flex items-start gap-5">{heroInner}</div>
            )}
          </div>
        </section>

        <div className="relative mx-auto max-w-6xl px-6 pb-20 sm:pb-24">
          {children}
          {relatedSlug && (
            <RevealOnScroll>
              <div className="rv-up mt-12 border-t border-border pt-6">
                <RelatedTools current={relatedSlug} />
              </div>
            </RevealOnScroll>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

/**
 * Convenience: gold-gradient inline accent for titles.
 * Use inside `title` prop, e.g. `<>Lịch <Gold>Vạn Niên</Gold></>`.
 */
export function GoldAccent({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gold-gradient bg-clip-text text-transparent">{children}</span>
  );
}
