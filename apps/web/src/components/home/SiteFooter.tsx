'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail, MessageCircle, Facebook, Heart, ArrowRight } from 'lucide-react';

const PRODUCT_LINKS = [
  { href: '/reading', label: 'Phân tích lá số' },
  { href: '/onboarding?cta=mentor', label: 'AI Mentor' },
  { href: '/affiliate', label: 'Affiliate' },
];

const TOOLS_LINKS = [
  { href: '/tu-vi-hom-nay', label: 'Tử Vi hôm nay' },
  { href: '/lich-van-nien', label: 'Lịch Vạn Niên' },
  { href: '/hop-tuoi', label: 'Hợp tuổi' },
  { href: '/than-so-hoc', label: 'Thần Số Học' },
  { href: '/can-xuong', label: 'Cân Xương Đoán Số' },
  { href: '/thuoc-lo-ban', label: 'Thước Lỗ Ban' },
];

const RESOURCE_LINKS = [
  { href: '/learn', label: 'Học huyền học' },
  { href: '/features', label: 'Tính năng' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'Về chúng tôi' },
  { href: '/community', label: 'Cộng đồng' },
  { href: '/changelog', label: 'Changelog' },
];

const LEGAL_LINKS = [
  { href: '/legal', label: 'Pháp lý' },
  { href: '/privacy', label: 'Quyền riêng tư' },
  { href: '/terms', label: 'Điều khoản' },
  { href: '/account', label: 'Tài khoản & xoá dữ liệu' },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-gold/15 bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Sản phẩm */}
          <FooterCol title="Sản phẩm" links={PRODUCT_LINKS} className="md:col-span-2" />
          {/* Công cụ miễn phí */}
          <FooterCol title="Công cụ" links={TOOLS_LINKS} className="md:col-span-3" />
          {/* Tài nguyên */}
          <FooterCol title="Tài nguyên" links={RESOURCE_LINKS} className="md:col-span-2" />
          {/* Pháp lý */}
          <FooterCol title="Pháp lý" links={LEGAL_LINKS} className="md:col-span-2" />
          {/* Theo dõi + signup */}
          <div className="md:col-span-3">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-cream/90">
              Theo dõi
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-cream/65">
              Một bài viết ngắn mỗi tuần — cách dùng cổ học để ra quyết định
              tốt hơn. Không spam, huỷ bất cứ lúc nào.
            </p>
            <Link
              href="/community#newsletter"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-sm font-medium text-gold transition-colors hover:bg-gold/10"
            >
              Đăng ký newsletter
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <div className="mt-5 flex items-center gap-3">
              <SocialLink href="mailto:hi@hieu.asia" label="Email">
                <Mail className="h-4 w-4" aria-hidden="true" />
              </SocialLink>
              <SocialLink href="https://t.me/hieuasia_bot" label="Telegram bot">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </SocialLink>
              <SocialLink href="https://facebook.com/hieu.asia" label="Facebook">
                <Facebook className="h-4 w-4" aria-hidden="true" />
              </SocialLink>
            </div>
          </div>
        </div>

        {/* Brand strip + bottom row */}
        <div className="mt-14 border-t border-cream/5 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="font-heading text-base font-bold text-gold">
              hieu.asia · Hiểu mình. Quyết định mình.
            </Link>
            <p className="inline-flex items-center gap-1.5 text-xs text-cream/55">
              Made in HCM with
              <Heart className="h-3.5 w-3.5 fill-gold text-gold" aria-hidden="true" />
            </p>
          </div>
          <div className="mt-3 flex flex-col gap-2 text-xs text-cream/45 sm:flex-row sm:items-center sm:justify-between">
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
      <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-cream/90">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-cream/60 transition-colors hover:text-gold"
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
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cream/10 text-cream/65 transition-colors hover:border-gold/40 hover:text-gold"
    >
      {children}
    </Link>
  );
}
