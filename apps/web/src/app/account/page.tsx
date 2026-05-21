'use client';

import * as React from 'react';
import Link from 'next/link';
import { getOrCreateAnonUserId } from '@hieu-asia/supabase';
import { DataExportSection } from '@/components/account/DataExportSection';
import { DeleteAccountSection } from '@/components/account/DeleteAccountSection';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

export default function AccountPage() {
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setUserId(getOrCreateAnonUserId() || null);
  }, []);

  return (
    <div className="min-h-screen bg-ink text-cream">
      <SiteNav />
      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-[-10%] h-[360px] w-[360px] rounded-full bg-gold/10 blur-3xl"
        />

        <section className="relative mx-auto max-w-3xl px-6 pb-20 pt-12 sm:pt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Tài khoản
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-cream sm:text-4xl">
            Tài khoản của <span className="bg-gold-gradient bg-clip-text text-transparent">bạn</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream/75 sm:text-base">
            Quyền của bạn theo{' '}
            <Link href="/privacy" className="text-gold underline-offset-4 hover:underline">
              Nghị định 13/2023/NĐ-CP
            </Link>{' '}
            — truy cập, sao chép và xóa dữ liệu cá nhân.
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-md border border-cream/10 bg-ink/40 px-3 py-1.5 font-mono text-xs text-cream/55">
            User ID
            <span className="text-gold">{userId ?? '—'}</span>
          </p>

          <div className="mt-10 space-y-6">
            <DataExportSection userId={userId} />
            <DeleteAccountSection userId={userId} />
          </div>

          <div className="mt-10 rounded-xl border border-cream/10 bg-ink/40 p-4 text-xs text-cream/65">
            Cần hỗ trợ?{' '}
            <a className="text-gold underline-offset-4 hover:underline" href="mailto:privacy@hieu.asia">
              privacy@hieu.asia
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
