'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { getWebApp } from '@/lib/telegram-init';
import { haptic } from '@/lib/telegram-haptic';

/**
 * Shows Telegram's native BackButton.
 *
 * - Default action: router.back().
 * - `onBack`: custom handler (overrides router.back).
 * - `confirmBeforeExit`: when true AND no `onBack`, show Telegram confirm
 *   dialog; if user confirms → WebApp.close(). Used at root pages (welcome,
 *   dashboard) where back means "exit the mini app".
 * - Outside Telegram, renders an inline fallback arrow so dev preview works.
 */
export interface TgBackButtonProps {
  onBack?: () => void;
  fallbackLabel?: string;
  confirmBeforeExit?: boolean;
  exitMessage?: string;
}

export function TgBackButton({
  onBack,
  fallbackLabel = 'Quay lại',
  confirmBeforeExit = false,
  exitMessage = 'Bạn có chắc muốn thoát?',
}: TgBackButtonProps) {
  const router = useRouter();
  const [isNative, setIsNative] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    let webAppRef: Awaited<ReturnType<typeof getWebApp>> | null = null;

    const handler = () => {
      void haptic('light');
      if (onBack) {
        onBack();
        return;
      }
      if (confirmBeforeExit && webAppRef) {
        webAppRef.showConfirm(exitMessage, (confirmed: boolean) => {
          if (confirmed) webAppRef?.close();
        });
        return;
      }
      router.back();
    };

    (async () => {
      const webApp = await getWebApp();
      if (cancelled) return;
      if (!webApp) {
        setIsNative(false);
        return;
      }
      webAppRef = webApp;
      setIsNative(true);
      webApp.BackButton.onClick(handler);
      webApp.BackButton.show();
    })();

    return () => {
      cancelled = true;
      void getWebApp().then((webApp) => {
        const bb = webApp?.BackButton;
        if (!bb) return;
        bb.offClick(handler);
        bb.hide();
      });
    };
  }, [onBack, router, confirmBeforeExit, exitMessage]);

  if (isNative !== false) return null;

  return (
    <button
      type="button"
      onClick={() => {
        if (onBack) onBack();
        else router.back();
      }}
      className="inline-flex items-center gap-1 text-sm text-cream/70 hover:text-gold"
    >
      ← {fallbackLabel}
    </button>
  );
}
