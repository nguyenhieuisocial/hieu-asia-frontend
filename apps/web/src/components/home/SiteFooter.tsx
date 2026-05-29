'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail, MessageCircle, Facebook, Heart, ArrowRight } from 'lucide-react';

interface FooterLink {
  href: string;
  label: string;
  /** B4 (design handoff) — free/paid badge for the "Tra cứu nhanh" lookup
   *  tools so visitors know which need a paid tier before clicking, instead
   *  of hitting a surprise paywall. Only set on COL_QUICK_LOOKUP items. */
  tag?: 'free' | 'premium';
}

/**
 * Mega-footer columns — Wave 62.10 per founder vault 138.
 * Previously SiteNav.tsx carried 26 sub-routes across 7 mega-menu sections —
 * crushing first-time-visitor scan-ability. We trimmed top nav to 6 primary
 * links and relocated the 11 tra-cứu-nhanh tools + product/learning/legal
 * reference shortcuts here. Footer is now the discovery surface for ad-hoc
 * tool lookups; top nav is the trust/conversion path.
 */

const COL_PRODUCT: readonly FooterLink[] = [
  { href: '/onboarding?intent=self', label: 'Lá số tử vi' },
  { href: '/onboarding?intent=decision', label: 'AI Mentor' },
  { href: '/sample-report', label: 'Báo cáo mẫu' },
  { href: '/cam-nang', label: 'Cẩm nang' },
  { href: '/pricing', label: 'Bảng giá' },
];

// B4 — free vs paid lookup tools (verified against route gating + vault 100
// §9 free-tools list + /pricing tier copy). All are free-to-use except
// /ban-do (Bản đồ sao = personalised weekly map, a Premium feature).
const COL_QUICK_LOOKUP: readonly FooterLink[] = [
  { href: '/tu-vi-2026', label: 'Tử Vi 2026', tag: 'free' },
  { href: '/tu-vi-hom-nay', label: 'Tử Vi hôm nay', tag: 'free' },
  { href: '/hop-tuoi', label: 'Hợp tuổi', tag: 'free' },
  { href: '/can-xuong', label: 'Cân Xương Đoán Số', tag: 'free' },
  { href: '/lich-van-nien', label: 'Lịch Vạn Niên', tag: 'free' },
  { href: '/bat-tu', label: 'Bát Tự', tag: 'free' },
  { href: '/mbti', label: 'MBTI', tag: 'free' },
  { href: '/than-so-hoc', label: 'Thần số học', tag: 'free' },
  { href: '/thuoc-lo-ban', label: 'Thước Lỗ Ban', tag: 'free' },
  { href: '/tinh-menh-cuc', label: 'Tuổi mệnh cục', tag: 'free' },
  { href: '/ban-do', label: 'Bản đồ sao', tag: 'premium' },
  { href: '/dai-van-hien-tai', label: 'Đại vận hiện tại', tag: 'free' },
];

const COL_DOCS: readonly FooterLink[] = [
  { href: '/methodology', label: 'Phương pháp' },
  { href: '/sample-report', label: 'Báo cáo mẫu' },
  { href: '/cam-nang', label: 'Cẩm nang' },
  { href: '/changelog', label: 'Changelog' },
  { href: '/learn', label: 'Learn' },
];

const COL_LEGAL: readonly FooterLink[] = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/privacy#nd-13-2023', label: 'NĐ 13/2023' },
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

        {/*
          Mega-footer 4-column grid — Wave 62.10.
          Mobile: stack vertically with gap-12 (~48px editorial gap).
          lg breakpoint: 4 equal columns with gap-12.
          Column 2 (Tra cứu nhanh) is wider on lg because of 11 tool routes —
          using col-span-2 on lg keeps it readable as a 2-column sublist while
          the other 3 columns stay single-line.
        */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          <FooterCol title="Sản phẩm" links={COL_PRODUCT} />
          <FooterCol
            title="Tra cứu nhanh"
            links={COL_QUICK_LOOKUP}
            className="lg:col-span-2"
            twoCol
          />
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
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
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
              {link.tag && (
                <span
                  className={`shrink-0 font-mono text-[9px] uppercase tracking-wider ${
                    link.tag === 'premium'
                      ? 'text-[hsl(var(--primary-cta))]'
                      : 'text-muted-foreground'
                  }`}
                >
                  {link.tag === 'premium' ? 'Premium' : 'Miễn phí'}
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
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
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
              {link.tag && (
                <span
                  className={`shrink-0 font-mono text-[9px] uppercase tracking-wider ${
                    link.tag === 'premium'
                      ? 'text-[hsl(var(--primary-cta))]'
                      : 'text-muted-foreground'
                  }`}
                >
                  {link.tag === 'premium' ? 'Premium' : 'Miễn phí'}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      {/* Newsletter mini-CTA — small per spec */}
      <Link
        href="/community#newsletter"
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
