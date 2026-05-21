'use client';

import * as React from 'react';
import { Button, Switch, toast } from '@hieu-asia/ui';
import { PrefRow, SettingsSection } from './SettingsSection';

const LS_TG_USER = 'hieu.telegram.username';
const LS_TG_MINIAPP = 'hieu.telegram.miniapp_enabled';

export function TelegramIntegration() {
  const [tgUser, setTgUser] = React.useState<string | null>(null);
  const [miniAppEnabled, setMiniAppEnabled] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    setTgUser(window.localStorage.getItem(LS_TG_USER));
    setMiniAppEnabled(window.localStorage.getItem(LS_TG_MINIAPP) === '1');
  }, []);

  function handleLinkBot() {
    const botUrl = process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL ?? 'https://t.me/hieuasia_bot';
    window.open(botUrl, '_blank', 'noopener,noreferrer');
    toast.info('Mở Telegram', {
      description: 'Bấm /start trong bot rồi quay lại đây để hoàn tất liên kết.',
    });
  }

  function handleUnlink() {
    window.localStorage.removeItem(LS_TG_USER);
    setTgUser(null);
    toast.success('Đã hủy liên kết Telegram trên thiết bị này');
  }

  function handleMiniAppToggle(v: boolean) {
    setMiniAppEnabled(v);
    if (v) window.localStorage.setItem(LS_TG_MINIAPP, '1');
    else window.localStorage.removeItem(LS_TG_MINIAPP);
    toast.success(v ? 'Đã bật Mini App' : 'Đã tắt Mini App');
  }

  return (
    <SettingsSection
      id="telegram"
      title="Tích hợp Telegram"
      description="Liên kết bot và Mini App để nhận tử vi & dùng nhanh trong Telegram."
    >
      <PrefRow
        label="Tài khoản Telegram"
        description={tgUser ? `Đã liên kết: @${tgUser}` : 'Chưa liên kết'}
        control={
          tgUser ? (
            <Button variant="outline" size="sm" onClick={handleUnlink}>
              Hủy liên kết
            </Button>
          ) : (
            <Button size="sm" onClick={handleLinkBot}>
              Mở Telegram bot
            </Button>
          )
        }
      />
      <PrefRow
        label="Mini App access"
        description="Cho phép Mini App đọc preference & lịch sử phiên đọc."
        control={
          <Switch
            checked={miniAppEnabled}
            onCheckedChange={handleMiniAppToggle}
            aria-label="Mini App access"
          />
        }
      />
    </SettingsSection>
  );
}
