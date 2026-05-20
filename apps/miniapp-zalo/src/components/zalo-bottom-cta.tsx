import type { ReactNode } from 'react';
import { Button } from '@hieu-asia/ui';

interface Props {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
}

/**
 * Sticky bottom action bar — Zalo-native UX pattern. Always full-width,
 * respects iOS safe area.
 */
export function ZaloBottomCta({ onClick, disabled, loading, children }: Props) {
  return (
    <div className="zalo-safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-gold/15 bg-ink/95 px-4 py-3 backdrop-blur">
      <Button size="lg" className="w-full" disabled={disabled || loading} onClick={onClick}>
        {loading ? 'Đang xử lý…' : children}
      </Button>
    </div>
  );
}
