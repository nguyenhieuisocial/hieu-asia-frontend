'use client';

import * as React from 'react';
import Link from 'next/link';
import { getOrCreateAnonUserId } from '@hieu-asia/supabase';
import { usePreferences } from '@/lib/user-preferences';
import { NotificationPreferences } from '@/components/settings/NotificationPreferences';
import { LanguagePreference } from '@/components/settings/LanguagePreference';
import { ThemePreference } from '@/components/settings/ThemePreference';
import { PrivacyPreferences } from '@/components/settings/PrivacyPreferences';
import { AccountSection } from '@/components/settings/AccountSection';
import { TelegramIntegration } from '@/components/settings/TelegramIntegration';

const SECTIONS: { id: string; label: string }[] = [
  { id: 'notifications', label: 'Thông báo' },
  { id: 'locale', label: 'Ngôn ngữ & Lịch' },
  { id: 'theme', label: 'Giao diện' },
  { id: 'privacy', label: 'Quyền riêng tư' },
  { id: 'account', label: 'Tài khoản' },
  { id: 'telegram', label: 'Tích hợp Telegram' },
];

export default function SettingsPage() {
  const [userId, setUserId] = React.useState<string | null>(null);
  const [activeSection, setActiveSection] = React.useState<string>('notifications');

  React.useEffect(() => {
    setUserId(getOrCreateAnonUserId() || null);
  }, []);

  const { prefs, update, hydrated } = usePreferences(userId);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        // Pick the one closest to the top of viewport.
        const top = visible.reduce((a, b) =>
          (a.boundingClientRect.top ?? 0) < (b.boundingClientRect.top ?? 0) ? a : b,
        );
        if (top.target.id) setActiveSection(top.target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [hydrated]);

  return (
    <main className="min-h-screen bg-ink text-cream">
      <header className="container mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/" className="font-heading text-xl font-semibold text-gold">
          hieu.asia
        </Link>
        <span className="font-mono text-xs uppercase tracking-widest text-cream/50">
          Cài đặt
        </span>
      </header>

      <section className="container mx-auto max-w-6xl px-6 pb-20 pt-6">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-semibold text-cream sm:text-4xl">
            Cài đặt của bạn
          </h1>
          <p className="mt-3 text-sm text-cream/70">
            Tinh chỉnh cách hieu.asia hoạt động trên thiết bị này. Mọi thay đổi được lưu
            ngay vào trình duyệt; nếu bạn bật analytics opt-in, preference sẽ đồng bộ qua máy chủ.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
          {/* Sticky sidebar nav — desktop */}
          <aside className="hidden lg:block">
            <nav
              aria-label="Mục cài đặt"
              className="sticky top-6 space-y-1 rounded-xl border border-cream/10 bg-ink/40 p-3"
            >
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                    activeSection === s.id
                      ? 'bg-gold/15 text-gold'
                      : 'text-cream/75 hover:bg-cream/5 hover:text-cream'
                  }`}
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Mobile section jump — horizontal scroll */}
          <nav
            aria-label="Mục cài đặt (mobile)"
            className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 lg:hidden"
          >
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  activeSection === s.id
                    ? 'border-gold bg-gold/15 text-gold'
                    : 'border-cream/15 text-cream/75'
                }`}
              >
                {s.label}
              </a>
            ))}
          </nav>

          <div className="space-y-6">
            {hydrated ? (
              <>
                <NotificationPreferences prefs={prefs} onChange={update} />
                <LanguagePreference prefs={prefs} onChange={update} />
                <ThemePreference prefs={prefs} onChange={update} />
                <PrivacyPreferences prefs={prefs} onChange={update} />
                <AccountSection userId={userId} />
                <TelegramIntegration />
              </>
            ) : (
              <div className="rounded-xl border border-cream/10 bg-ink/40 p-8 text-sm text-cream/55">
                Đang tải cài đặt…
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 text-xs text-cream/45">
          Cần hỗ trợ?{' '}
          <a className="text-gold underline" href="mailto:support@hieu.asia">
            support@hieu.asia
          </a>
        </div>
      </section>
    </main>
  );
}
