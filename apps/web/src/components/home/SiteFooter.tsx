'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail, MessageCircle, Facebook, Heart, ArrowRight } from 'lucide-react';

interface FooterLink {
  href: string;
  label: string;
  /** Optional Premium pill (only the exception is badged; free is the default
   *  so we don't repeat "Miễn phí" 20+ times). */
  tag?: 'premium';
}

/**
 * Mega-footer columns — 4 balanced columns. The 24-item "Tra cứu nhanh" tool
 * list was removed from the footer: tools now live on /cong-cu (which has
 * search), so the footer links there once instead of towering ~2400px tall on
 * mobile. Surfaces the previously-buried engagement layer (affiliate, cộng
 * đồng, hỗ trợ, app) under "Khám phá".
 */

const COL_PRODUCT: readonly FooterLink[] = [
  { href: '/onboarding?intent=self', label: 'Lá số tử vi' },
  { href: '/onboarding?intent=decision', label: 'AI Mentor' },
  { href: '/lo-trinh', label: 'Lộ trình cá nhân' },
  { href: '/cong-cu', label: 'Tất cả công cụ' },
  { href: '/features', label: 'Tính năng' },
  { href: '/sample-report', label: 'Báo cáo mẫu' },
  { href: '/bang-chung', label: 'Bằng Chứng' },
  { href: '/pricing', label: 'Bảng giá' },
];

// Khám phá / cộng đồng — đưa các mặt-tiền trước đây bị chôn ra footer.
const COL_COMMUNITY: readonly FooterLink[] = [
  { href: '/qua', label: 'Quà & mời bạn' },
  { href: '/community', label: 'Cộng đồng' },
  { href: '/hoi-dap', label: 'Trợ giúp & Hỏi đáp' },
  { href: 'https://t.me/hieuasiabot', label: 'Mở trên Telegram' },
];

const COL_DOCS: readonly FooterLink[] = [
  { href: '/about', label: 'Về chúng tôi' },
  { href: '/methodology', label: 'Phương pháp' },
  { href: '/cam-nang', label: 'Cẩm nang' },
  { href: '/learn', label: 'Learn' },
  { href: '/changelog', label: 'Changelog' },
];

const COL_LEGAL: readonly FooterLink[] = [
  { href: '/legal', label: 'Tổng quan pháp lý' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/privacy#nd-13-2023', label: 'Dữ liệu cá nhân' },
  { href: 'mailto:hi@hieu.asia', label: 'Liên hệ' },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-primary/15 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        {/* Final wayfinding CTA — vault 130 §14 terminus */}
        <div className="mb-14 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] to-transparent px-6 py-10 text-center sm:px-10 sm:py-12">
          <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Sẵn sàng hiểu bản đồ của bạn?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Lập lá số trong 60 giây — miễn phí, không cần thẻ.
          </p>
          <Link
            href="/onboarding"
            data-analytics-id="footer_final_cta"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-primary/90 sm:text-base"
          >
            Lập lá số miễn phí
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* 4 balanced columns. Mobile: 2 columns (short lists now ~4-5 items
            each → compact, no more ~2400px tower). lg: 4 equal columns. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <FooterCol title="Sản phẩm" links={COL_PRODUCT} />
          <FooterCol title="Khám phá" links={COL_COMMUNITY} />
          <FooterCol title="Tài liệu" links={COL_DOCS} />
          <FooterColLegal links={COL_LEGAL} year={year} />
        </div>

        {/* Brand strip + bottom row */}
        <div className="mt-14 border-t border-border pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Wave 60.97.1 — bottom brand link gets `min-h-11 py-2.5` so
                it hits 44px on mobile (was 24px). */}
            <Link
              href="/"
              className="inline-flex min-h-11 items-center py-2.5 font-heading text-base font-bold text-primary transition-colors hover:text-primary/80 active:text-primary/80 touch-manipulation"
            >
              hieu.asia · Hiểu mình. Quyết định mình.
            </Link>
            <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              Made in HCM with
              <Heart className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden="true" />
            </p>
          </div>
          <div className="mt-3 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} hieu.asia · Mọi quyền được bảo lưu.</p>
            <p>Kết quả mang tính tham khảo — không thay thế tư vấn y tế, pháp lý hay tài chính.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Mega-footer column — editorial spacing, day/night-mode aware.
 *
 * - Column heading: text-editorial-mono uppercase text-primary (gold) with
 *   6px ochre rule above (border-t-2 border-primary/30).
 * - Items: text-base text-muted-foreground, hover:text-foreground.
 * - 44px tap target on mobile preserved (Wave 60.97.1 a11y baseline).
 * - `twoCol` splits a long list into 2 sublists at sm+ — used for the 12-item
 *   Tra cứu nhanh column so it doesn't tower over its neighbors.
 */
function FooterCol({
  title,
  links,
  className,
  twoCol = false,
}: {
  title: string;
  links: readonly FooterLink[];
  className?: string;
  twoCol?: boolean;
}) {
  return (
    // Wave 62.05d — wrap in <nav aria-label> so each footer column is a
    // distinct navigation region for screen readers (/ultrareview pass 2 P1).
    <nav className={className} aria-label={title}>
      <div className="border-t-2 border-primary/30 pt-3">
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
          {title}
        </h3>
      </div>
      <ul
        className={
          twoCol
            ? 'mt-2 sm:mt-4 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-2.5'
            : 'mt-2 sm:mt-4 sm:space-y-2.5'
        }
      >
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="inline-flex min-h-11 w-full items-center gap-2 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground active:text-foreground touch-manipulation sm:min-h-0 sm:w-auto sm:py-0"
            >
              {link.label}
              {link.tag === 'premium' && (
                <span className="shrink-0 rounded-full border border-[hsl(var(--primary-cta))]/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[hsl(var(--primary-cta))]">
                  Premium
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Legal column — Wave 62.10. Same editorial frame as FooterCol but tail
 * includes social + newsletter mini-CTA per founder vault 138 spec.
 * Wave 62.05d — wrapped in <nav aria-label> for a11y per /ultrareview P1.
 */
function FooterColLegal({
  links,
  year: _year,
}: {
  links: readonly FooterLink[];
  year: number;
}) {
  return (
    <nav aria-label="Pháp lý">
      <div className="border-t-2 border-primary/30 pt-3">
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
          Pháp lý
        </h3>
      </div>
      <ul className="mt-2 sm:mt-4 sm:space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="inline-flex min-h-11 w-full items-center gap-2 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground active:text-foreground touch-manipulation sm:min-h-0 sm:w-auto sm:py-0"
            >
              {link.label}
              {link.tag === 'premium' && (
                <span className="shrink-0 rounded-full border border-[hsl(var(--primary-cta))]/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[hsl(var(--primary-cta))]">
                  Premium
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      {/* Newsletter mini-CTA — small per spec. SEO-FIX: point to the dedicated
          /newsletter hub (was /community#newsletter, which left /newsletter with
          zero incoming internal links → Ahrefs "orphan page"). The footer link
          is global, so every page now links to /newsletter. */}
      <Link
        href="/newsletter"
        className="mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3.5 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10 active:bg-primary/15 touch-manipulation"
      >
        Newsletter
        <ArrowRight className="h-3 w-3" aria-hidden="true" />
      </Link>
      <div className="mt-4 flex items-center gap-3">
        <SocialLink href="mailto:hi@hieu.asia" label="Email">
          <Mail className="h-4 w-4" aria-hidden="true" />
        </SocialLink>
        <SocialLink href="https://t.me/hieuasiabot" label="Telegram bot">
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
        </SocialLink>
        <SocialLink href="https://facebook.com/hieu.asia" label="Facebook">
          <Facebook className="h-4 w-4" aria-hidden="true" />
        </SocialLink>
      </div>
    </nav>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const isExternal = href.startsWith('http');
  return (
    <Link
      href={href}
      aria-label={label}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary sm:h-9 sm:w-9"
    >
      {children}
    </Link>
  );
}
