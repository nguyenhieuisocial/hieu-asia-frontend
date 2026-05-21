'use client';

import * as React from 'react';
import Link from 'next/link';
import { SettingsSection } from './SettingsSection';

export interface AccountSectionProps {
  userId: string | null;
}

export function AccountSection({ userId }: AccountSectionProps) {
  const memberSince = React.useMemo(() => {
    if (typeof window === 'undefined') return null;
    const stored = window.localStorage.getItem('hieu.user.created_at');
    if (stored) return stored;
    const now = new Date().toISOString();
    window.localStorage.setItem('hieu.user.created_at', now);
    return now;
  }, []);

  const formattedDate = React.useMemo(() => {
    if (!memberSince) return '—';
    try {
      return new Date(memberSince).toLocaleDateString('vi-VN', { dateStyle: 'long' });
    } catch {
      return memberSince;
    }
  }, [memberSince]);

  const isAnon = !userId || userId.startsWith('anon_') || userId.startsWith('web-');

  return (
    <SettingsSection
      id="account"
      title="Tài khoản"
      description="Thông tin định danh và liên kết tới các tác vụ quản lý tài khoản."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="User ID" value={<span className="font-mono text-xs text-gold">{userId ?? '—'}</span>} />
        <Field
          label="Loại tài khoản"
          value={
            <span className="inline-flex items-center rounded-md border border-cream/15 bg-ink/40 px-2 py-1 text-xs font-medium text-cream/85">
              {isAnon ? 'Anonymous (chưa đăng ký)' : 'Đã đăng ký'}
            </span>
          }
        />
        <Field label="Email" value={<span className="text-cream/70">{isAnon ? 'Chưa liên kết' : '—'}</span>} />
        <Field label="Thành viên từ" value={<span className="text-cream/85">{formattedDate}</span>} />
        <Field
          label="Gói dịch vụ"
          value={
            <span className="inline-flex items-center rounded-md bg-cream/10 px-2 py-1 text-xs font-semibold text-cream">
              Free
            </span>
          }
        />
      </div>

      <div className="border-t border-cream/5 pt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-cream/70">
          Quản lý tài khoản
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <span className="text-cream/55">Đổi mật khẩu:</span>{' '}
            <span className="text-cream/55">Sắp ra mắt (sau khi bật email auth).</span>
          </li>
          <li>
            <Link href="/account" className="text-gold underline">
              Tải xuống dữ liệu cá nhân (GDPR export)
            </Link>
          </li>
          <li>
            <Link href="/account" className="text-rose-300 underline">
              Xóa tài khoản &amp; toàn bộ dữ liệu
            </Link>
          </li>
        </ul>
      </div>
    </SettingsSection>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-cream/5 bg-ink/30 px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-cream/40">{label}</div>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}
