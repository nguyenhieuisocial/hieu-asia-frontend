'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, ChevronDown, LogOut, UserCircle2 } from 'lucide-react';
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  cn,
} from '@hieu-asia/ui';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from '@/lib/auth-client';

interface NavLink {
  href: string;
  label: string;
}

interface NavSection {
  title: string;
  items: readonly NavLink[];
}

/** Học dropdown — 2 sections (Phương pháp luận + Khái niệm) — Wave 52. */
const LEARN_SECTIONS: readonly NavSection[] = [
  {
    title: 'Phương pháp luận',
    items: [
      { href: '/methodology', label: 'Phương pháp luận' },
      { href: '/methodology/tu-vi', label: 'Phương pháp Tử Vi' },
      { href: '/methodology/bat-tu', label: 'Phương pháp Bát Tự (beta)' },
      { href: '/methodology/model-card', label: 'AI Model Card' },
      { href: '/methodology/ai-safety', label: 'AI Safety Policy' },
      { href: '/methodology/algorithm-changelog', label: 'Lịch sử thuật toán' },
    ],
  },
  {
    title: 'Khái niệm nền tảng',
    items: [
      { href: '/learn/tu-vi', label: 'Tử Vi Đẩu Số' },
      { href: '/learn/bat-tu', label: 'Bát Tự Tứ Trụ' },
      { href: '/learn/than-so-hoc', label: 'Thần Số Học' },
      { href: '/learn/mbti', label: 'MBTI' },
      { href: '/learn/palm', label: 'Palm Reading' },
    ],
  },
];

/**
 * Công cụ mega-menu — 4 columns — Wave 52.
 * Affiliate items removed (relocated to authed account dropdown).
 */
const TOOLS_SECTIONS: readonly NavSection[] = [
  {
    title: 'Quyết định',
    items: [
      { href: '/decisions', label: 'Quyết định (Hub)' },
      { href: '/decision-simulator', label: 'Decision Simulator' },
      { href: '/journal', label: 'Decision Journal' },
      { href: '/weekly-review', label: 'Weekly Review' },
    ],
  },
  {
    title: 'Lá số & Báo cáo',
    items: [
      { href: '/ban-do', label: 'Bản đồ của bạn' },
      { href: '/sample-report', label: 'Báo cáo mẫu' },
      { href: '/compatibility', label: 'Hợp đôi 2 lá số' },
      { href: '/family-profiles', label: 'Family Profiles' },
      { href: '/career-fit', label: 'Career Fit' },
    ],
  },
  {
    title: 'Kế hoạch & Đại vận',
    items: [
      { href: '/monthly-planning', label: 'Monthly Planning' },
      { href: '/annual-planning', label: 'Annual Planning' },
      { href: '/timeline', label: 'Đại vận timeline' },
      { href: '/dai-van-hien-tai', label: 'Đại vận hiện tại' },
    ],
  },
  {
    title: 'Tra cứu nhanh',
    items: [
      { href: '/tu-vi-hom-nay', label: 'Tử Vi hôm nay' },
      { href: '/tu-vi-2026', label: 'Tử Vi 2026' },
      { href: '/tu-vi-nghe-nghiep', label: 'Tử Vi · Nghề nghiệp' },
      { href: '/tu-vi-tinh-yeu', label: 'Tử Vi · Tình yêu' },
      { href: '/tu-vi-tai-chinh', label: 'Tử Vi · Tài chính' },
      { href: '/lich-van-nien', label: 'Lịch Vạn Niên' },
      { href: '/hop-tuoi', label: 'Hợp tuổi' },
      { href: '/than-so-hoc', label: 'Thần Số Học' },
      { href: '/tinh-menh-cuc', label: 'Tính Mệnh Cục' },
      { href: '/can-xuong', label: 'Cân Xương Đoán Số' },
      { href: '/thuoc-lo-ban', label: 'Thước Lỗ Ban' },
    ],
  },
];

/** Flattened for mobile drawer rendering. */
const TOOLS_LINKS_FLAT: readonly NavLink[] = TOOLS_SECTIONS.flatMap((s) => s.items);
const LEARN_LINKS_FLAT: readonly NavLink[] = LEARN_SECTIONS.flatMap((s) => s.items);

/**
 * Top-level nav links — Wave 52-A renamed "Pricing" → "Giá" to keep all 4
 * primary entries in Vietnamese. Round-2 audit found the lone English word
 * in an otherwise Vietnamese nav was jarring to VN-locale users.
 */
const PRIMARY_LINKS: readonly NavLink[] = [
  { href: '/lo-trinh', label: 'Lộ trình' },
  { href: '/features', label: 'Tính năng' },
  { href: '/pricing', label: 'Giá' },
  { href: '/about', label: 'Về chúng tôi' },
];

/**
 * Top navigation bar — fixed, glass background.
 * Desktop: inline links + Học dropdown.
 * Mobile: hamburger drawer (Sheet).
 */
export function SiteNav() {
  const { user, loading } = useAuth();
  const isAuthed = !!user && !loading;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-card/70 backdrop-blur-md">
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
              className="text-sm text-muted-foreground transition-colors hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
          <ToolsMegaMenu />
          <LearnDropdown />
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthed ? (
            <AuthedMenu user={user} />
          ) : (
            <>
              {/* While loading, hide both buttons to avoid flicker (returning user briefly sees "Đăng nhập"). */}
              {!loading && (
                <Link
                  href="/signin"
                  className="hidden text-sm text-muted-foreground transition-colors hover:text-gold sm:inline-flex sm:px-2"
                >
                  Đăng nhập
                </Link>
              )}
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href="/onboarding/topic">Mở khóa lá số</Link>
              </Button>
            </>
          )}
          <MobileDrawer isAuthed={isAuthed} userEmail={user?.email ?? null} />
        </div>
      </div>
    </header>
  );
}

/**
 * Authed user menu (desktop) — shows email + Dashboard + Sign-out.
 * Wave 36: replace static "Đăng nhập" link so logged-in users see session state.
 * Wave 38.1: click-toggle (not hover) — fixes touch devices + click-instead-of-hover users.
 */
function AuthedMenu({ user }: { user: { email?: string } }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Close on outside click + Esc.
  React.useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  async function onSignOut() {
    setPending(true);
    try {
      await signOut();
      router.replace('/');
      router.refresh();
    } finally {
      setPending(false);
      setOpen(false);
    }
  }

  // BUG-011 (Wave 52, /ultrareview follow-up): same panel-id + aria-controls
  // pattern Agent B applied to SectionedDropdown — keeps account menu a11y
  // consistent with Tools / Learn dropdowns.
  const panelId = 'menu-account';

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-foreground/85 transition-colors hover:bg-gold/10 hover:text-gold"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <UserCircle2 className="h-4 w-4" aria-hidden="true" />
        <span className="max-w-[120px] truncate">{user.email ?? 'Tài khoản'}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>
      <div
        id={panelId}
        className={cn(
          'absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border border-border bg-card/95 p-1.5 shadow-2xl backdrop-blur-md',
          !open && 'hidden',
        )}
        role="menu"
        aria-hidden={!open}
      >
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm text-foreground/85 transition-colors hover:bg-gold/10 hover:text-gold"
            role="menuitem"
          >
            Tài khoản
          </Link>
          <Link
            href="/reading"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm text-foreground/85 transition-colors hover:bg-gold/10 hover:text-gold"
            role="menuitem"
          >
            Lá số của bạn
          </Link>
          <div className="my-1 h-px bg-muted/5" />
          <p className="px-3 py-1 font-mono text-[9px] uppercase tracking-[0.24em] text-gold/60">
            Affiliate
          </p>
          <Link
            href="/affiliate/network"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm text-foreground/85 transition-colors hover:bg-gold/10 hover:text-gold"
            role="menuitem"
          >
            Mạng lưới
          </Link>
          <Link
            href="/affiliate/commissions"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm text-foreground/85 transition-colors hover:bg-gold/10 hover:text-gold"
            role="menuitem"
          >
            Hoa hồng
          </Link>
          <div className="my-1 h-px bg-muted/5" />
          <button
            type="button"
            onClick={onSignOut}
            disabled={pending}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-foreground/85 transition-colors hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-50"
            role="menuitem"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            {pending ? 'Đang thoát…' : 'Đăng xuất'}
          </button>
      </div>
    </div>
  );
}

/**
 * Sectioned mega-menu dropdown (Wave 52).
 * Renders sections as columns on desktop, stacked on small screens.
 * - aria-controls links trigger ↔ panel
 * - aria-hidden on panel when closed (extra screen-reader safety)
 */
function SectionedDropdown({
  label,
  sections,
  panelId,
  panelWidthClass,
  alignClass = 'left-1/2 -translate-x-1/2',
  footer,
}: {
  label: string;
  sections: readonly NavSection[];
  panelId: string;
  panelWidthClass: string;
  alignClass?: string;
  footer?: { href: string; label: string };
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-gold"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
      >
        {label}
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>
      <div
        id={panelId}
        role="menu"
        aria-hidden={!open}
        className={cn(
          'absolute top-full z-50 mt-1 rounded-xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur-md',
          alignClass,
          panelWidthClass,
          open ? 'block' : 'hidden',
        )}
      >
        <div
          className={cn(
            'grid gap-x-6 gap-y-4',
            sections.length >= 4
              ? 'sm:grid-cols-2 lg:grid-cols-4'
              : sections.length === 2
                ? 'sm:grid-cols-2'
                : 'grid-cols-1',
          )}
        >
          {sections.map((section) => (
            <div key={section.title} className="min-w-0">
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-gold/70">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-gold/10 hover:text-gold"
                      role="menuitem"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {footer && (
          <>
            <div className="my-3 h-px bg-muted/5" />
            <Link
              href={footer.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-2 py-1.5 text-sm font-medium text-gold transition-colors hover:bg-gold/10"
              role="menuitem"
            >
              {footer.label}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function ToolsMegaMenu() {
  return (
    <SectionedDropdown
      label="Công cụ"
      sections={TOOLS_SECTIONS}
      panelId="menu-tools"
      panelWidthClass="w-[min(92vw,860px)]"
      alignClass="right-0 sm:left-1/2 sm:-translate-x-1/2"
    />
  );
}

function LearnDropdown() {
  return (
    <SectionedDropdown
      label="Học"
      sections={LEARN_SECTIONS}
      panelId="menu-learn"
      panelWidthClass="w-[min(92vw,520px)]"
      footer={{ href: '/learn', label: 'Tất cả bài học →' }}
    />
  );
}

function MobileDrawer({
  isAuthed,
  userEmail,
}: {
  isAuthed: boolean;
  userEmail: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [signOutPending, setSignOutPending] = React.useState(false);

  async function onSignOut() {
    setSignOutPending(true);
    try {
      await signOut();
      setOpen(false);
      router.replace('/');
      router.refresh();
    } finally {
      setSignOutPending(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground/85 transition-colors hover:bg-gold/10 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold md:hidden"
        aria-label="Mở menu"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-72 border-border bg-background text-foreground">
        <SheetHeader>
          <SheetTitle className="font-heading text-gold">hieu.asia</SheetTitle>
        </SheetHeader>
        <nav
          className="mt-6 flex max-h-[calc(100vh-8rem)] flex-col gap-1 overflow-y-auto pb-6"
          aria-label="Điều hướng di động"
        >
          {isAuthed && userEmail && (
            <div className="mb-2 rounded-md border border-gold/15 bg-gold/5 px-3 py-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-gold/60">
                Đã đăng nhập
              </p>
              <p className="mt-0.5 truncate text-xs text-foreground/85">{userEmail}</p>
            </div>
          )}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-2.5 text-sm text-foreground/85 transition-colors hover:bg-gold/10 hover:text-gold"
          >
            Trang chủ
          </Link>
          {isAuthed && (
            <>
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-foreground/85 transition-colors hover:bg-gold/10 hover:text-gold"
              >
                Tài khoản
              </Link>
              <Link
                href="/reading"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-foreground/85 transition-colors hover:bg-gold/10 hover:text-gold"
              >
                Lá số của bạn
              </Link>
            </>
          )}
          {PRIMARY_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm text-foreground/85 transition-colors hover:bg-gold/10 hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
          <div className="my-2 h-px bg-muted/5" />
          <p className="px-3 pb-1 font-mono text-[10px] uppercase tracking-[0.28em] text-gold/60">
            Công cụ
          </p>
          {TOOLS_LINKS_FLAT.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-gold/10 hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
          <div className="my-2 h-px bg-muted/5" />
          <p className="px-3 pb-1 font-mono text-[10px] uppercase tracking-[0.28em] text-gold/60">
            Học
          </p>
          {LEARN_LINKS_FLAT.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-gold/10 hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
          <div className="my-2 h-px bg-muted/5" />
          {isAuthed ? (
            <button
              type="button"
              onClick={onSignOut}
              disabled={signOutPending}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm text-foreground/85 transition-colors hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-50"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              {signOutPending ? 'Đang thoát…' : 'Đăng xuất'}
            </button>
          ) : (
            <Link
              href="/signin"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm text-foreground/85 transition-colors hover:bg-gold/10 hover:text-gold"
            >
              Đăng nhập
            </Link>
          )}
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
