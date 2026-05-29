'use client';

import * as React from 'react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, toast } from '@hieu-asia/ui';
import type { UserPreferences, HoroscopeTime } from '@/lib/user-preferences';
import { PrefRow, SettingsSection } from './SettingsSection';

export interface NotificationPreferencesProps {
  prefs: UserPreferences;
  onChange: (patch: Partial<UserPreferences>) => void;
}

const HOROSCOPE_TIMES: { value: HoroscopeTime; label: string }[] = [
  { value: '06', label: '6h sáng' },
  { value: '07', label: '7h sáng' },
  { value: '08', label: '8h sáng' },
  { value: '22', label: '22h tối' },
];

export function NotificationPreferences({ prefs, onChange }: NotificationPreferencesProps) {
  function toggle(key: keyof UserPreferences['notifications'], value: boolean) {
    onChange({ notifications: { ...prefs.notifications, [key]: value } });
    toast.success('Đã cập nhật cài đặt thông báo');
  }

  return (
    <SettingsSection
      id="notifications"
      title="Thông báo"
      description="Quyết định cách hieu.asia liên lạc với bạn."
    >
      <PrefRow
        label="Tử Vi hằng ngày qua web push"
        description={
          <>
            Đăng ký push trên{' '}
            <Link href="/tu-vi-hom-nay" className="text-gold-700 underline">
              /tu-vi-hom-nay
            </Link>{' '}
            để kích hoạt.
          </>
        }
        control={
          <Switch
            checked={prefs.notifications.daily_push}
            onCheckedChange={(v) => toggle('daily_push', v)}
            aria-label="Push thông báo tử vi hằng ngày"
          />
        }
      />
      <PrefRow
        label="Telegram bot — tin nhắn hằng ngày"
        description="Yêu cầu đã liên kết Telegram (mục Tích hợp Telegram bên dưới)."
        control={
          <Switch
            checked={prefs.notifications.daily_telegram}
            onCheckedChange={(v) => toggle('daily_telegram', v)}
            aria-label="Telegram bot tin nhắn hằng ngày"
          />
        }
      />
      <PrefRow
        label="Email weekly digest"
        description="Tổng hợp tuần: tử vi, sự kiện lịch âm, bài đọc mới."
        control={
          <Switch
            checked={prefs.notifications.daily_email}
            onCheckedChange={(v) => toggle('daily_email', v)}
            aria-label="Email weekly digest"
          />
        }
      />
      <PrefRow
        label="Lịch âm — mùng 1, rằm, Tết"
        description="Nhắc các ngày âm lịch quan trọng."
        control={
          <Switch
            checked={prefs.notifications.lunar_reminder}
            onCheckedChange={(v) => toggle('lunar_reminder', v)}
            aria-label="Lịch âm reminder"
          />
        }
      />
      <PrefRow
        label="Thông báo khi bài đọc hoàn thành"
        description="Khi worker xử lý xong báo cáo dài (Tử Vi, Bát Tự, …)."
        control={
          <Switch
            checked={prefs.notifications.reading_complete}
            onCheckedChange={(v) => toggle('reading_complete', v)}
            aria-label="Thông báo khi bài đọc hoàn thành"
          />
        }
      />
      <PrefRow
        label="Giờ nhận tử vi hằng ngày"
        description="Mặc định 6h sáng."
        control={
          <Select
            value={prefs.notifications.horoscope_time}
            onValueChange={(v) => {
              onChange({
                notifications: { ...prefs.notifications, horoscope_time: v as HoroscopeTime },
              });
              toast.success('Đã đổi giờ tử vi');
            }}
          >
            <SelectTrigger className="w-[160px]" aria-label="Giờ nhận tử vi">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HOROSCOPE_TIMES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
    </SettingsSection>
  );
}
