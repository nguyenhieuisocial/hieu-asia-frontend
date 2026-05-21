import * as React from 'react';
import Link from 'next/link';
import { Mail, MessageCircle, Facebook } from 'lucide-react';

const PRODUCT_LINKS = [
  { href: '/reading?focus=tuvi', label: 'Tử Vi' },
  { href: '/reading?focus=mbti', label: 'MBTI' },
  { href: '/reading?focus=palm', label: 'Palm Reading' },
  { href: '/reading?focus=mentor', label: 'AI Mentor' },
];

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Quyền riêng tư' },
  { href: '/terms', label: 'Điều khoản' },
  { href: '/account', label: 'Tài khoản & xoá dữ liệu' },
];

const COMPANY_LINKS = [
  { href: '#features', label: 'Tính năng' },
  { href: '#how', label: 'Cách hoạt động' },
  { href: '/learn', label: 'Học huyền học' },
  { href: '#pricing', label: 'Bảng giá' },
  { href: '#faq', label: 'FAQ' },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-gold/15 bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="font-heading text-xl font-bold text-gold">hieu.asia</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/65">
              Cẩm nang cuộc đời AI — Tử Vi, MBTI, Palm Reading và Mentor cá nhân hóa cho
              người Việt hiện đại.
            </p>
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

          <FooterCol title="Sản phẩm" links={PRODUCT_LINKS} className="md:col-span-3" />
          <FooterCol title="Pháp lý" links={LEGAL_LINKS} className="md:col-span-2" />
          <FooterCol title="Về chúng tôi" links={COMPANY_LINKS} className="md:col-span-3" />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-cream/5 pt-6 text-xs text-cream/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} hieu.asia · Made in Vietnam</p>
          <p>Kết quả mang tính tham khảo · Không định mệnh hóa</p>
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
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/10 text-cream/65 transition-colors hover:border-gold/40 hover:text-gold sm:h-9 sm:w-9"
    >
      {children}
    </Link>
  );
}
