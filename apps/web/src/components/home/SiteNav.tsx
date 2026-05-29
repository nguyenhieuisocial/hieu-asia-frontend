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

interface NavLink {
  href: string;
  label: string;
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
  { href: '/onboarding', label: 'Lá số' },
  { href: '/onboarding', label: 'Mentor' },
  { href: '/methodology', label: 'Phương pháp' },
  { href: '/pricing', label: 'Giá' },
  { href: '/about', label: 'Về chúng tôi' },
];

/**
 * Top navigation bar — fixed, glass background.
 * Desktop: 5 inline links (Lá số / Mentor / Phương pháp / Giá / Về chúng tôi).
 * Mobile: hamburger drawer (Sheet).
 */
export function SiteNav() {
  const { user, loading } = useAuth();
  const isAuthed = !!user && !loading;

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
            <AuthedMenu user={user} />
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
 * Wave 60.69: DropdownMenu primitive adoption (vault 109 §4.4) replaces the
 * manual `useState` + click-outside + Esc + role="menu" wiring. Radix gives
 * us roving-focus a11y + portal rendering + ESC dismiss for free.
 */
function AuthedMenu({ user }: { user: { email?: string } }) {
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
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-foreground/85 transition-colors hover:bg-primary/10 hover:text-primary"
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
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link href="/account">Tài khoản</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/reading">Lá số của bạn</Link>
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
        className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground/85 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
        aria-label="Mở menu"
      >
        <Menu className="h-5 w-5" />
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
