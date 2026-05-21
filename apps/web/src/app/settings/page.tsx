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
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

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
    <div className="min-h-screen bg-ink text-cream">
      <SiteNav />
      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-ink-radial opacity-80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-[-10%] h-[320px] w-[320px] rounded-full bg-gold/10 blur-3xl"
        />

        <section className="relative mx-auto max-w-6xl px-6 pt-12 pb-20 sm:pt-16">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-cream/55">
            <Link href="/" className="hover:text-gold">Trang chủ</Link>
            <span className="mx-1.5">/</span>
            <span className="text-cream/70">Cài đặt</span>
          </nav>

          <header className="mb-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
              Cài đặt
            </p>
            <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-cream sm:text-4xl">
              Cài đặt của <span className="bg-gold-gradient bg-clip-text text-transparent">bạn</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream/75">
              Tinh chỉnh cách hieu.asia hoạt động trên thiết bị này. Mọi thay đổi
              được lưu ngay vào trình duyệt; nếu bạn bật analytics opt-in,
              preference sẽ đồng bộ qua máy chủ.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
            <aside className="hidden lg:block">
              <nav
                aria-label="Mục cài đặt"
                className="sticky top-20 space-y-1 rounded-xl border border-cream/10 bg-ink/40 p-3 backdrop-blur-sm"
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
            <a className="text-gold underline-offset-4 hover:underline" href="mailto:support@hieu.asia">
              support@hieu.asia
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
