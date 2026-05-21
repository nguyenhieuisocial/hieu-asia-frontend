'use client';

import * as React from 'react';
import Link from 'next/link';
import { getOrCreateAnonUserId } from '@hieu-asia/supabase';
import { DataExportSection } from '@/components/account/DataExportSection';
import { DeleteAccountSection } from '@/components/account/DeleteAccountSection';

export default function AccountPage() {
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setUserId(getOrCreateAnonUserId() || null);
  }, []);

  return (
    <main className="min-h-screen bg-ink text-cream">
      <header className="container mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/" className="font-heading text-xl font-semibold text-gold">
          hieu.asia
        </Link>
        <span className="font-mono text-xs uppercase tracking-widest text-cream/50">
          Tài khoản
        </span>
      </header>

      <section className="container mx-auto max-w-3xl px-6 pb-20 pt-6">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-semibold text-cream sm:text-4xl">
            Tài khoản của bạn
          </h1>
          <p className="mt-3 text-sm text-cream/70">
            Quyền của bạn theo{' '}
            <Link href="/privacy" className="text-gold underline">
              Nghị định 13/2023/NĐ-CP
            </Link>{' '}
            — truy cập, sao chép, và xóa dữ liệu cá nhân.
          </p>
          <p className="mt-2 font-mono text-xs text-cream/45">
            User ID: <span className="text-gold">{userId ?? '—'}</span>
          </p>
        </div>

        <div className="space-y-6">
          <DataExportSection userId={userId} />
          <DeleteAccountSection userId={userId} />
        </div>

        <div className="mt-10 text-xs text-cream/55">
          <p>
            Cần hỗ trợ?{' '}
            <a className="text-gold underline" href="mailto:privacy@hieu.asia">
              privacy@hieu.asia
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
