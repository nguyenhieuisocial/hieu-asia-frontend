'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, toast } from '@hieu-asia/ui';
import type { FontSize, ThemeMode, UserPreferences } from '@/lib/user-preferences';
import { PrefRow, SettingsSection } from './SettingsSection';

export interface ThemePreferenceProps {
  prefs: UserPreferences;
  onChange: (patch: Partial<UserPreferences>) => void;
}

export function ThemePreference({ prefs, onChange }: ThemePreferenceProps) {
  const { setTheme } = useTheme();

  function updateTheme<K extends keyof UserPreferences['theme']>(
    key: K,
    value: UserPreferences['theme'][K],
  ) {
    onChange({ theme: { ...prefs.theme, [key]: value } });
    if (key === 'mode') setTheme(value as ThemeMode);
    toast.success('Đã cập nhật giao diện');
  }

  return (
    <SettingsSection
      id="theme"
      title="Giao diện"
      description="Chế độ màu, kích thước chữ và các tùy chọn trợ năng."
    >
      <PrefRow
        label="Chế độ màu"
        description="Tối là mặc định — hợp tinh thần huyền học."
        control={
          <Select
            value={prefs.theme.mode}
            onValueChange={(v) => updateTheme('mode', v as ThemeMode)}
          >
            <SelectTrigger className="w-[180px]" aria-label="Chế độ màu">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Tối</SelectItem>
              <SelectItem value="light">Sáng</SelectItem>
              <SelectItem value="system">Theo hệ thống</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <PrefRow
        label="Giảm chuyển động"
        description="Tắt animation và transition cho người nhạy cảm với chuyển động."
        control={
          <Switch
            checked={prefs.theme.reduced_motion}
            onCheckedChange={(v) => updateTheme('reduced_motion', v)}
            aria-label="Giảm chuyển động"
          />
        }
      />
      <PrefRow
        label="Cỡ chữ"
        description="Áp dụng cho toàn site qua scale rem."
        control={
          <Select
            value={prefs.theme.font_size}
            onValueChange={(v) => updateTheme('font_size', v as FontSize)}
          >
            <SelectTrigger className="w-[160px]" aria-label="Cỡ chữ">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Tiêu chuẩn (16px)</SelectItem>
              <SelectItem value="large">Lớn (18px)</SelectItem>
              <SelectItem value="xl">Rất lớn (20px)</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <PrefRow
        label="Tương phản cao"
        description="Tăng viền và độ tương phản cho người khiếm thị nhẹ."
        control={
          <Switch
            checked={prefs.theme.high_contrast}
            onCheckedChange={(v) => updateTheme('high_contrast', v)}
            aria-label="Tương phản cao"
          />
        }
      />
    </SettingsSection>
  );
}
