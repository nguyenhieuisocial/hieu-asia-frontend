'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { getWebApp } from '@/lib/telegram-init';
import { haptic } from '@/lib/telegram-haptic';

/**
 * Shows Telegram's native BackButton. Default action = router.back().
 *
 * Outside Telegram, this renders an inline back arrow in the header so dev
 * preview is still usable.
 */
export interface TgBackButtonProps {
  onBack?: () => void;
  fallbackLabel?: string;
}

export function TgBackButton({ onBack, fallbackLabel = 'Quay lại' }: TgBackButtonProps) {
  const router = useRouter();
  const [isNative, setIsNative] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const handler = () => {
      void haptic('light');
      if (onBack) onBack();
      else router.back();
    };

    (async () => {
      const webApp = await getWebApp();
      if (cancelled) return;
      if (!webApp) {
        setIsNative(false);
        return;
      }
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
  }, [onBack, router]);

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
