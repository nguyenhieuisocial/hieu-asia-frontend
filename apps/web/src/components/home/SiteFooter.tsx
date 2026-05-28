'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail, MessageCircle, Facebook, Heart, ArrowRight } from 'lucide-react';

const PRODUCT_LINKS = [
  { href: '/reading', label: 'Phân tích lá số' },
  { href: '/onboarding?cta=mentor', label: 'AI Mentor' },
  { href: '/features', label: 'Tính năng' },
  { href: '/pricing', label: 'Giá' },
];

const LEARN_LINKS = [
  { href: '/learn', label: 'Học huyền học' },
  { href: '/tu-vi-hom-nay', label: 'Tử Vi hôm nay' },
  { href: '/lich-van-nien', label: 'Lịch Vạn Niên' },
  { href: '/hop-tuoi', label: 'Hợp tuổi' },
  { href: '/than-so-hoc', label: 'Thần Số Học' },
  { href: '/can-xuong', label: 'Cân Xương Đoán Số' },
  { href: '/thuoc-lo-ban', label: 'Thước Lỗ Ban' },
];

const LEGAL_LINKS = [
  { href: '/about', label: 'Về chúng tôi' },
  { href: '/community', label: 'Cộng đồng' },
  { href: '/changelog', label: 'Nhật ký thay đổi' },
  { href: '/affiliate', label: 'Cộng tác viên' },
  { href: '/legal', label: 'Pháp lý' },
  { href: '/privacy', label: 'Quyền riêng tư' },
  { href: '/terms', label: 'Điều khoản' },
  { href: '/account', label: 'Tài khoản & xoá dữ liệu' },
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
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primarypx-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-primary/90 sm:text-base"
          >
            Lập lá số miễn phí
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-12">
          {/* Sản phẩm — core user-product links */}
          <FooterCol title="Sản phẩm" links={PRODUCT_LINKS} className="md:col-span-3" />
          {/* Học — Tài nguyên + learning-related tools */}
          <FooterCol title="Học" links={LEARN_LINKS} className="md:col-span-3" />
          {/* Pháp lý & Công ty — legal + about/community/changelog/partner */}
          <FooterCol title="Pháp lý & Công ty" links={LEGAL_LINKS} className="md:col-span-3" />
          {/* Theo dõi — newsletter + social (non-nav block) */}
          <div className="md:col-span-3">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground/90">
              Theo dõi
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Một bài viết ngắn mỗi tuần — cách dùng cổ học để ra quyết định
              tốt hơn. Không spam, huỷ bất cứ lúc nào.
            </p>
            {/* Wave 60.97.1 — `min-h-11 touch-manipulation` so the newsletter
                link in the footer "Theo dõi" column hits 44px on mobile. */}
            <Link
              href="/community#newsletter"
              className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 active:bg-primary/15 touch-manipulation"
            >
              Đăng ký newsletter
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <div className="mt-5 flex items-center gap-3">
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
          </div>
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

function FooterCol({
  title,
  links,
  className,
}: {
  title: string;
  links: { href: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground/90">
        {title}
      </h3>
      {/*
        Wave 60.97.1 — Footer link rows ship at h:18 (text-sm only) which
        fails WCAG 2.5.5 (44px) on mobile. Replace `space-y-2.5` text rows
        with a vertical column where each <Link> has `inline-flex min-h-11
        py-2.5` — full-width tap target + visual line-height unchanged. The
        `active:text-primary` state surfaces touch feedback on iOS/Android.
      */}
      <ul className="mt-2 sm:mt-4 sm:space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-11 w-full items-center py-2.5 text-sm text-muted-foreground transition-colors hover:text-primary active:text-primary touch-manipulation sm:min-h-0 sm:w-auto sm:py-0"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
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
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary sm:h-9 sm:w-9"
    >
      {children}
    </Link>
  );
}
