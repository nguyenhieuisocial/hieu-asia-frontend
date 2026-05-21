'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, ChevronDown } from 'lucide-react';
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@hieu-asia/ui';
import { ThemeToggle } from '@/components/theme-toggle';

interface NavLink {
  href: string;
  label: string;
}

const LEARN_LINKS: readonly NavLink[] = [
  { href: '/methodology', label: 'Methodology tổng quan' },
  { href: '/methodology/tu-vi', label: 'Methodology Tử Vi' },
  { href: '/methodology/bat-tu', label: 'Methodology Bát Tự (beta)' },
  { href: '/methodology/model-card', label: 'AI Model Card' },
  { href: '/methodology/ai-safety', label: 'AI Safety Policy' },
  { href: '/methodology/algorithm-changelog', label: 'Algorithm changelog' },
  { href: '/learn/tu-vi', label: 'Tử Vi Đẩu Số' },
  { href: '/learn/bat-tu', label: 'Bát Tự Tứ Trụ' },
  { href: '/learn/than-so-hoc', label: 'Thần Số Học' },
  { href: '/learn/mbti', label: 'MBTI' },
  { href: '/learn/palm', label: 'Palm Reading' },
];

const TOOLS_LINKS: readonly NavLink[] = [
  { href: '/decisions', label: 'Decision Brief' },
  { href: '/decision-simulator', label: 'Decision Simulator' },
  { href: '/journal', label: 'Decision Journal' },
  { href: '/weekly-review', label: 'Weekly Review' },
  { href: '/ban-do', label: 'Bản đồ của bạn' },
  { href: '/monthly-planning', label: 'Monthly Planning' },
  { href: '/annual-planning', label: 'Annual Planning' },
  { href: '/timeline', label: 'Đại vận timeline' },
  { href: '/compatibility', label: 'Hợp đôi 2 lá số' },
  { href: '/career-fit', label: 'Career Fit' },
  { href: '/family-profiles', label: 'Family Profiles' },
  { href: '/affiliate/network', label: 'Affiliate · Mạng lưới' },
  { href: '/affiliate/commissions', label: 'Affiliate · Hoa hồng' },
  { href: '/tu-vi-hom-nay', label: 'Tử Vi hôm nay' },
  { href: '/lich-van-nien', label: 'Lịch Vạn Niên' },
  { href: '/hop-tuoi', label: 'Hợp tuổi (12 con giáp)' },
  { href: '/than-so-hoc', label: 'Thần Số Học' },
  { href: '/can-xuong', label: 'Cân Xương Đoán Số' },
  { href: '/thuoc-lo-ban', label: 'Thước Lỗ Ban' },
];

const PRIMARY_LINKS: readonly NavLink[] = [
  { href: '/lo-trinh', label: 'Lộ trình' },
  { href: '/features', label: 'Tính năng' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'Về chúng tôi' },
];

/**
 * Top navigation bar — fixed, glass background.
 * Desktop: inline links + Học dropdown.
 * Mobile: hamburger drawer (Sheet).
 */
export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-cream/5 bg-ink/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-heading text-lg font-bold text-gold sm:text-xl">
          hieu.asia
        </Link>

        <nav
          className="hidden items-center gap-7 md:flex"
          aria-label="Điều hướng chính"
        >
          {PRIMARY_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-cream/75 transition-colors hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
          <ToolsDropdown />
          <LearnDropdown />
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/account"
            className="hidden text-sm text-cream/75 transition-colors hover:text-gold sm:inline-flex sm:px-2"
          >
            Tài khoản
          </Link>
          <Link
            href="/signin"
            className="hidden text-sm text-cream/75 transition-colors hover:text-gold sm:inline-flex sm:px-2"
          >
            Đăng nhập
          </Link>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/onboarding/topic">Mở khóa lá số</Link>
          </Button>
          <MobileDrawer />
        </div>
      </div>
    </header>
  );
}

function ToolsDropdown() {
  return (
    <div className="group relative">
      <button
        type="button"
        className="inline-flex items-center gap-1 text-sm text-cream/75 transition-colors hover:text-gold"
        aria-haspopup="true"
      >
        Công cụ
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" aria-hidden="true" />
      </button>
      <div
        className="invisible absolute left-1/2 top-full z-50 mt-1 w-64 -translate-x-1/2 rounded-xl border border-cream/10 bg-ink/95 p-2 opacity-0 shadow-2xl backdrop-blur-md transition-all group-hover:visible group-hover:opacity-100"
        role="menu"
      >
        {TOOLS_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="block rounded-md px-3 py-2 text-sm text-cream/80 transition-colors hover:bg-gold/10 hover:text-gold"
            role="menuitem"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function LearnDropdown() {
  return (
    <div className="group relative">
      <button
        type="button"
        className="inline-flex items-center gap-1 text-sm text-cream/75 transition-colors hover:text-gold"
        aria-haspopup="true"
      >
        Học
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" aria-hidden="true" />
      </button>
      <div
        className="invisible absolute left-1/2 top-full z-50 mt-1 w-60 -translate-x-1/2 rounded-xl border border-cream/10 bg-ink/95 p-2 opacity-0 shadow-2xl backdrop-blur-md transition-all group-hover:visible group-hover:opacity-100"
        role="menu"
      >
        {LEARN_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="block rounded-md px-3 py-2 text-sm text-cream/80 transition-colors hover:bg-gold/10 hover:text-gold"
            role="menuitem"
          >
            {l.label}
          </Link>
        ))}
        <div className="my-1 h-px bg-cream/5" />
        <Link
          href="/learn"
          className="block rounded-md px-3 py-2 text-sm font-medium text-gold transition-colors hover:bg-gold/10"
          role="menuitem"
        >
          Tất cả bài học →
        </Link>
      </div>
    </div>
  );
}

function MobileDrawer() {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex h-11 w-11 items-center justify-center rounded-md text-cream/85 transition-colors hover:bg-gold/10 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold md:hidden"
        aria-label="Mở menu"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-72 border-cream/10 bg-ink text-cream">
        <SheetHeader>
          <SheetTitle className="font-heading text-gold">hieu.asia</SheetTitle>
        </SheetHeader>
        <nav
          className="mt-6 flex max-h-[calc(100vh-8rem)] flex-col gap-1 overflow-y-auto pb-6"
          aria-label="Điều hướng di động"
        >
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-2.5 text-sm text-cream/85 transition-colors hover:bg-gold/10 hover:text-gold"
          >
            Trang chủ
          </Link>
          {PRIMARY_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm text-cream/85 transition-colors hover:bg-gold/10 hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
          <div className="my-2 h-px bg-cream/5" />
          <p className="px-3 pb-1 font-mono text-[10px] uppercase tracking-[0.28em] text-gold/60">
            Công cụ
          </p>
          {TOOLS_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-cream/75 transition-colors hover:bg-gold/10 hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
          <div className="my-2 h-px bg-cream/5" />
          <p className="px-3 pb-1 font-mono text-[10px] uppercase tracking-[0.28em] text-gold/60">
            Học
          </p>
          {LEARN_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-cream/75 transition-colors hover:bg-gold/10 hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
          <div className="my-2 h-px bg-cream/5" />
          <Link
            href="/signin"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-2.5 text-sm text-cream/85 transition-colors hover:bg-gold/10 hover:text-gold"
          >
            Đăng nhập
          </Link>
          <Button asChild className="mt-2 w-full">
            <Link href="/onboarding/topic" onClick={() => setOpen(false)}>
              Mở khóa lá số
            </Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
