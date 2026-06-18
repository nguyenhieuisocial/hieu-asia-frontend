'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, ChevronDown, LogOut, UserCircle2 } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import { getStreak } from '@/lib/daily-checkin';
import { QUICK_LOOKUP } from '@/lib/catalog/tools';

interface NavLink {
  href: string;
  label: string;
}

/**
 * In-app streak reminder (Hướng 2 follow-up): the free, no-push version of the
 * "don't break your chain" nudge. True only when the user is signed in, has a
 * live streak to protect (current > 0), and hasn't checked in today. Fails safe
 * to false (signed out / endpoint down) so the nav is unchanged for everyone
 * else. One lightweight KV read per page load, authed-only.
 */
function useCheckinNudge(isAuthed: boolean): boolean {
  const [needsCheckin, setNeedsCheckin] = React.useState(false);
  React.useEffect(() => {
    if (!isAuthed) {
      setNeedsCheckin(false);
      return;
    }
    let alive = true;
    getStreak()
      .then((s) => {
        if (alive) setNeedsCheckin(!!s && s.current > 0 && !s.checkedInToday);
      })
      .catch(() => {
        if (alive) setNeedsCheckin(false);
      });
    return () => {
      alive = false;
    };
  }, [isAuthed]);
  return needsCheckin;
}

/** Tiny gold "unchecked streak today" indicator. Decorative; callers add a label. */
function NudgeDot({ className }: { className?: string }) {
  return <span aria-hidden className={cn('h-1.5 w-1.5 rounded-full bg-gold', className)} />;
}

/**
 * Top-level nav links — Wave 62.10 simplification per founder vault 138.
 *
 * "Menu chính gánh 26 trang con. Tinh lọc menu top — đẩy tra cứu nhanh xuống
 * mega-footer." Previous Wave 60.95.a collapsed 30+ to 5 + Công cụ mega-menu
 * still left 26 tool routes in primary nav. Now: 6 cốt lõi only. All 11
 * tra-cứu-nhanh tools + learning + methodology sub-routes live in SiteFooter
 * mega-footer where they belong as reference shortcuts, not primary surfaces.
 */
const PRIMARY_LINKS: readonly NavLink[] = [
  // "Lá số" trỏ thẳng công cụ lá số THẬT (client-side, không form-wall) —
  // Phase 1 front-door. Mentor vẫn vào /onboarding cho luồng đối thoại.
  { href: '/la-so-bat-tu', label: 'Lá số' },
  { href: '/onboarding?intent=decision', label: 'Mentor' },
  { href: '/cong-cu', label: 'Công cụ' },
  { href: '/methodology', label: 'Phương pháp' },
  { href: '/pricing', label: 'Giá' },
  { href: '/about', label: 'Về chúng tôi' },
];

/**
 * Wave 64.13 — Công cụ + Học shown ONLY in the mobile drawer (collapsible).
 * Desktop nav stays trimmed to PRIMARY_LINKS (Wave 62.10 "Như giấy cũ"); the
 * mega-footer remains the desktop discovery surface. This gives MOBILE users
 * in-menu access to the 12 lookup tools + learning topics instead of having to
 * scroll to the footer. Mirrors SiteFooter COL_QUICK_LOOKUP + learn topics.
 */
// Tra cứu nhanh — từ catalog (lib/catalog/tools), khớp 1-1 với footer (hết trùng lặp).
const MOBILE_TOOLS: readonly NavLink[] = QUICK_LOOKUP.map(({ href, label }) => ({ href, label }));

const MOBILE_LEARN: readonly NavLink[] = [
  { href: '/learn', label: 'Tất cả bài học' },
  { href: '/learn/tu-vi', label: 'Tử Vi' },
  { href: '/learn/bat-tu', label: 'Bát Tự' },
  { href: '/learn/than-so-hoc', label: 'Thần Số Học' },
  { href: '/learn/mbti', label: 'MBTI' },
  { href: '/learn/big-five', label: 'Big Five' },
  { href: '/learn/palm', label: 'Tướng tay' },
];

/**
 * Top navigation bar — fixed, glass background.
 * Desktop: 5 inline links (Lá số / Mentor / Phương pháp / Giá / Về chúng tôi).
 * Mobile: hamburger drawer (Sheet).
 */
export function SiteNav() {
  const { user, loading } = useAuth();
  const isAuthed = !!user && !loading;
  const needsCheckin = useCheckinNudge(isAuthed);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-card/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          aria-label="hieu.asia · Trang chủ"
          // Wave 60.97.1 — `inline-flex min-h-11` lifts the brand link to
          // 44px tap target (was 28px). Logo is the universal "back home"
          // affordance on mobile; needs reliable hit area.
          className="inline-flex min-h-11 items-center font-heading text-lg font-bold text-primary transition-colors hover:text-primary/80 sm:text-xl touch-manipulation"
        >
          hieu.asia
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Điều hướng chính"
        >
          {PRIMARY_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthed ? (
            <AuthedMenu user={user} needsCheckin={needsCheckin} />
          ) : (
            <>
              {/* While loading, hide both buttons to avoid flicker (returning user briefly sees "Đăng nhập"). */}
              {!loading && (
                <Link
                  href="/signin"
                  className="hidden text-sm text-muted-foreground transition-colors hover:text-primary sm:inline-flex sm:px-2"
                >
                  Đăng nhập
                </Link>
              )}
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href="/onboarding/topic">Mở khóa lá số</Link>
              </Button>
            </>
          )}
          <MobileDrawer
            isAuthed={isAuthed}
            userEmail={user?.email ?? null}
            needsCheckin={needsCheckin}
          />
        </div>
      </div>
    </header>
  );
}

/**
 * Authed user menu (desktop) — shows email + Dashboard + Sign-out.
 * Wave 36: replace static "Đăng nhập" link so logged-in users see session state.
 * Wave 38.1: click-toggle (not hover) — fixes touch devices + click-instead-of-hover users.
 * Wave 60.69: DropdownMenu primitive adoption (vault 109 §4.4) replaces the
 * manual `useState` + click-outside + Esc + role="menu" wiring. Radix gives
 * us roving-focus a11y + portal rendering + ESC dismiss for free.
 */
function AuthedMenu({
  user,
  needsCheckin,
}: {
  user: { email?: string };
  needsCheckin: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [open, setOpen] = React.useState(false);

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

  return (
    <div className="hidden sm:block">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="relative inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-foreground/85 transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <span className="relative">
              <UserCircle2 className="h-4 w-4" aria-hidden="true" />
              {needsCheckin && <NudgeDot className="absolute -right-1 -top-1 ring-2 ring-card" />}
            </span>
            <span className="max-w-[120px] truncate">{user.email ?? 'Tài khoản'}</span>
            {needsCheckin && <span className="sr-only">— chưa điểm danh hôm nay</span>}
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 transition-transform',
                open && 'rotate-180',
              )}
              aria-hidden="true"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link href="/account">Tài khoản</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/reading">Lá số của bạn</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/operating-manual">Sổ tay cá nhân</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account#streak" className="flex items-center justify-between gap-2">
              <span>Điểm danh</span>
              {needsCheckin && <NudgeDot />}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-primary/85">Cộng tác viên</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href="/affiliate/network">Mạng lưới</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/affiliate/commissions">Hoa hồng</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              if (!pending) void onSignOut();
            }}
            disabled={pending}
            className="text-foreground/85 focus:bg-rose-500/10 focus:text-rose-300"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            {pending ? 'Đang thoát…' : 'Đăng xuất'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/** Wave 64.13 — collapsible link group for the mobile drawer (native <details>). */
function DrawerGroup({
  title,
  links,
  onNavigate,
}: {
  title: string;
  links: readonly NavLink[];
  onNavigate: () => void;
}) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-2.5 text-sm text-foreground/85 transition-colors hover:bg-primary/10 hover:text-primary [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown
          className="h-4 w-4 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="mb-1 flex flex-col gap-0.5 pl-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            className="rounded-md px-3 py-2 text-sm text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </details>
  );
}

function MobileDrawer({
  isAuthed,
  userEmail,
  needsCheckin,
}: {
  isAuthed: boolean;
  userEmail: string | null;
  needsCheckin: boolean;
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
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground/85 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
        aria-label={needsCheckin ? 'Mở menu — chưa điểm danh hôm nay' : 'Mở menu'}
      >
        <Menu className="h-5 w-5" />
        {needsCheckin && <NudgeDot className="absolute right-2 top-2 ring-2 ring-card" />}
      </SheetTrigger>
      <SheetContent side="right" className="w-72 border-border bg-background text-foreground">
        <SheetHeader>
          <SheetTitle className="font-heading text-primary">hieu.asia</SheetTitle>
        </SheetHeader>
        <nav
          className="mt-6 flex max-h-[calc(100vh-8rem)] flex-col gap-1 overflow-y-auto pb-6"
          aria-label="Điều hướng di động"
        >
          {isAuthed && userEmail && (
            <div className="mb-2 rounded-md border border-primary/15 bg-primary/5 px-3 py-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary/85">
                Đã đăng nhập
              </p>
              <p className="mt-0.5 truncate text-xs text-foreground/85">{userEmail}</p>
            </div>
          )}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-2.5 text-sm text-foreground/85 transition-colors hover:bg-primary/10 hover:text-primary"
          >
            Trang chủ
          </Link>
          {isAuthed && (
            <>
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-foreground/85 transition-colors hover:bg-primary/10 hover:text-primary"
              >
                Tài khoản
              </Link>
              <Link
                href="/reading"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-foreground/85 transition-colors hover:bg-primary/10 hover:text-primary"
              >
                Lá số của bạn
              </Link>
              <Link
                href="/account/operating-manual"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-foreground/85 transition-colors hover:bg-primary/10 hover:text-primary"
              >
                Sổ tay cá nhân
              </Link>
              <Link
                href="/account#streak"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm text-foreground/85 transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <span>Điểm danh</span>
                {needsCheckin && <NudgeDot />}
              </Link>
            </>
          )}
          {PRIMARY_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm text-foreground/85 transition-colors hover:bg-primary/10 hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
          <div className="my-2 h-px bg-muted/5" />
          <DrawerGroup
            title="Công cụ tra cứu"
            links={MOBILE_TOOLS}
            onNavigate={() => setOpen(false)}
          />
          <DrawerGroup
            title="Học"
            links={MOBILE_LEARN}
            onNavigate={() => setOpen(false)}
          />
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
              className="rounded-md px-3 py-2.5 text-sm text-foreground/85 transition-colors hover:bg-primary/10 hover:text-primary"
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
