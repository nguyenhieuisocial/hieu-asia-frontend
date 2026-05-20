'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';

export function Topbar({ adminEmail }: { adminEmail: string }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  const onLogout = async () => {
    setPending(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gold/15 bg-ink/80 px-4 py-3 backdrop-blur-md lg:px-8">
      <div className="pl-12 lg:pl-0">
        <span className="font-mono text-xs uppercase tracking-widest text-cream/60">
          Operations console
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="hidden items-center gap-2 rounded-md border border-gold/15 bg-ink/40 px-3 py-1.5 text-xs text-cream/75 sm:flex">
          <span aria-hidden className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 font-heading text-[10px] text-gold">
            {adminEmail.charAt(0).toUpperCase()}
          </span>
          <span className="hidden sm:inline">{adminEmail}</span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          disabled={pending}
          className="rounded-md border border-gold/20 px-3 py-1.5 text-xs text-cream/85 hover:border-gold hover:text-gold disabled:opacity-50"
        >
          {pending ? 'Đang thoát…' : 'Đăng xuất'}
        </button>
      </div>
    </header>
  );
}
