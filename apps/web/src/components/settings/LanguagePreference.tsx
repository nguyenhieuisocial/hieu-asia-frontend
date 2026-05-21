'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, toast } from '@hieu-asia/ui';
import type { DateFormat, Language, UserPreferences } from '@/lib/user-preferences';
import { PrefRow, SettingsSection } from './SettingsSection';

export interface LanguagePreferenceProps {
  prefs: UserPreferences;
  onChange: (patch: Partial<UserPreferences>) => void;
}

export function LanguagePreference({ prefs, onChange }: LanguagePreferenceProps) {
  function update<K extends keyof UserPreferences['locale']>(key: K, value: UserPreferences['locale'][K]) {
    onChange({ locale: { ...prefs.locale, [key]: value } });
    toast.success('Đã cập nhật ngôn ngữ & lịch');
  }

  return (
    <SettingsSection
      id="locale"
      title="Ngôn ngữ & Lịch"
      description="Ngôn ngữ giao diện, định dạng ngày và múi giờ."
    >
      <PrefRow
        label="Ngôn ngữ giao diện"
        description="English đang ở dạng beta — một số trang vẫn hiển thị tiếng Việt."
        control={
          <Select
            value={prefs.locale.language}
            onValueChange={(v) => update('language', v as Language)}
          >
            <SelectTrigger className="w-[160px]" aria-label="Ngôn ngữ">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vi">Tiếng Việt</SelectItem>
              <SelectItem value="en">English (beta)</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <PrefRow
        label="Định dạng ngày"
        description="Hiển thị dương lịch, âm lịch, hoặc cả hai."
        control={
          <Select
            value={prefs.locale.date_format}
            onValueChange={(v) => update('date_format', v as DateFormat)}
          >
            <SelectTrigger className="w-[200px]" aria-label="Định dạng ngày">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solar">Dương lịch</SelectItem>
              <SelectItem value="lunar">Âm lịch</SelectItem>
              <SelectItem value="both">Cả dương &amp; âm</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <PrefRow
        label="Múi giờ"
        description={`Đang dùng: ${prefs.locale.timezone}`}
        control={
          <Select
            value={prefs.locale.timezone}
            onValueChange={(v) => update('timezone', v)}
          >
            <SelectTrigger className="w-[220px]" aria-label="Múi giờ">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</SelectItem>
              <SelectItem value="Asia/Bangkok">Asia/Bangkok (GMT+7)</SelectItem>
              <SelectItem value="Asia/Singapore">Asia/Singapore (GMT+8)</SelectItem>
              <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
              <SelectItem value="UTC">UTC</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <PrefRow
        label="Đơn vị tiền tệ"
        description="VND (Việt Nam Đồng) — đơn vị duy nhất hỗ trợ hiện tại."
        control={
          <span className="rounded-md border border-cream/10 bg-ink/40 px-3 py-1 font-mono text-xs text-cream/70">
            VND
          </span>
        }
      />
    </SettingsSection>
  );
}
