'use client';

import * as React from 'react';
import { getWebApp } from '@/lib/telegram-init';
import { haptic } from '@/lib/telegram-haptic';

/**
 * Renders into Telegram's native MainButton (bottom bar inside the WebApp).
 * Outside Telegram (dev browser), falls back to a fixed sticky button.
 */
export interface TgMainButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  /** Haptic feedback kind on press. Default "medium". */
  haptic?: Parameters<typeof haptic>[0];
}

export function TgMainButton({ text, onClick, disabled, loading, haptic: hapticKind = 'medium' }: TgMainButtonProps) {
  const handlerRef = React.useRef<() => void>(() => undefined);
  const [isNative, setIsNative] = React.useState<boolean | null>(null);

  // Keep handler ref fresh — MainButton.onClick captures.
  React.useEffect(() => {
    handlerRef.current = () => {
      if (disabled || loading) return;
      void haptic(hapticKind);
      onClick();
    };
  }, [onClick, disabled, loading, hapticKind]);

  React.useEffect(() => {
    let cancelled = false;
    const wrappedClick = () => handlerRef.current();

    (async () => {
      const webApp = await getWebApp();
      if (cancelled) return;
      if (!webApp) {
        setIsNative(false);
        return;
      }
      setIsNative(true);
      const mb = webApp.MainButton;
      mb.setText(text);
      if (loading) mb.showProgress(false);
      else mb.hideProgress();
      if (disabled) mb.disable();
      else mb.enable();
      mb.onClick(wrappedClick);
      mb.show();
    })();

    return () => {
      cancelled = true;
      void getWebApp().then((webApp) => {
        const mb = webApp?.MainButton;
        if (!mb) return;
        mb.offClick(wrappedClick);
        mb.hide();
      });
    };
  }, [text, disabled, loading]);

  // Dev fallback only — Telegram renders the real button itself.
  if (isNative === true) return null;

  return (
    <div className="pointer-events-none sticky inset-x-0 bottom-0 z-30 px-4 pb-4 pt-2">
      <button
        type="button"
        onClick={() => {
          if (disabled || loading) return;
          void haptic(hapticKind);
          onClick();
        }}
        disabled={disabled || loading}
        className="pointer-events-auto w-full rounded-md bg-gold py-3 text-sm font-medium text-ink shadow-lg disabled:opacity-50"
      >
        {loading ? 'Đang xử lý…' : text}
      </button>
    </div>
  );
}
