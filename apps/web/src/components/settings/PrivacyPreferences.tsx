'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, Switch, toast } from '@hieu-asia/ui';
import type { UserPreferences } from '@/lib/user-preferences';
import { optInPostHog, optOutPostHog } from '@/lib/posthog';
import { PrefRow, SettingsSection } from './SettingsSection';

export interface PrivacyPreferencesProps {
  prefs: UserPreferences;
  onChange: (patch: Partial<UserPreferences>) => void;
}

export function PrivacyPreferences({ prefs, onChange }: PrivacyPreferencesProps) {
  function toggle(key: keyof UserPreferences['privacy'], value: boolean) {
    onChange({ privacy: { ...prefs.privacy, [key]: value } });
    if (key === 'analytics_opt_in') {
      if (value) optInPostHog();
      else optOutPostHog();
    }
    toast.success('Đã cập nhật quyền riêng tư');
  }

  function clearCookies() {
    if (typeof document === 'undefined') return;
    document.cookie.split(';').forEach((c) => {
      const name = c.split('=')[0]?.trim();
      if (!name) return;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
    toast.success('Đã xoá cookie không thiết yếu trên thiết bị này');
  }

  return (
    <SettingsSection
      id="privacy"
      title="Quyền riêng tư"
      description="Bạn kiểm soát dữ liệu của mình theo Nghị định 13/2023/NĐ-CP."
    >
      <PrefRow
        label="Analytics opt-in"
        description="Cho phép thu thập sự kiện ẩn danh để cải thiện sản phẩm."
        control={
          <Switch
            checked={prefs.privacy.analytics_opt_in}
            onCheckedChange={(v) => toggle('analytics_opt_in', v)}
            aria-label="Analytics opt-in"
          />
        }
      />
      <PrefRow
        label="Email marketing"
        description="Khuyến mãi, sự kiện, thử nghiệm sản phẩm mới."
        control={
          <Switch
            checked={prefs.privacy.marketing_email}
            onCheckedChange={(v) => toggle('marketing_email', v)}
            aria-label="Email marketing"
          />
        }
      />
      <PrefRow
        label="Gợi ý cá nhân hóa"
        description="Dùng lịch sử phiên đọc để gợi ý nội dung phù hợp."
        control={
          <Switch
            checked={prefs.privacy.personalized}
            onCheckedChange={(v) => toggle('personalized', v)}
            aria-label="Gợi ý cá nhân hóa"
          />
        }
      />
      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Xem chi tiết các loại dữ liệu hệ thống thu thập trong{' '}
          <Link href="/privacy" className="text-gold underline">
            chính sách bảo mật
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/privacy"
            className="inline-flex h-9 items-center justify-center rounded-md border border-gold/40 bg-transparent px-3 text-sm font-medium text-gold transition-colors hover:bg-gold/10"
          >
            Chính sách bảo mật
          </Link>
          <Button variant="outline" size="sm" onClick={clearCookies}>
            Xoá cookie
          </Button>
        </div>
      </div>
    </SettingsSection>
  );
}
