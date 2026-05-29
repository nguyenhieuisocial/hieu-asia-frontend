'use client';

import * as React from 'react';
import { Button } from '@hieu-asia/ui';
import { Lock } from 'lucide-react';

export function BulkBar({
  count,
  pending,
  onSuspend,
  onClear,
}: {
  count: number;
  pending: boolean;
  onSuspend: () => void;
  onClear: () => void;
}) {
  if (count === 0) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 lg:left-[calc(50%+8rem)]">
      <div className="flex items-center gap-2 rounded-full border border-gold/40 bg-card/95 px-3 py-2 shadow-2xl backdrop-blur">
        <span className="px-2 font-mono text-xs text-gold">{count} đã chọn</span>
        <Button
          size="sm"
          onClick={onSuspend}
          disabled={pending}
          className="bg-amber-500/90 text-ink hover:bg-amber-500"
        >
          <Lock className="mr-1.5 h-3.5 w-3.5" />
          Tạm khoá {count} user
        </Button>
        <Button size="sm" variant="ghost" onClick={onClear}>
          Bỏ chọn
        </Button>
      </div>
    </div>
  );
}

export function BulkSuspendConfirm({
  count,
  pending,
  onClose,
  onConfirm,
}: {
  count: number;
  pending: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !pending) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, pending]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 px-4"
      onClick={pending ? undefined : onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-amber-500/30 bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-heading text-xl text-foreground">Tạm khoá {count} user?</h2>
        <p className="mt-3 text-sm text-foreground/85">
          Sẽ đổi role thành <b className="text-foreground">viewer</b> (chỉ đọc) cho{' '}
          <b className="text-foreground">{count} user</b>. User vẫn đăng nhập được nhưng không thao tác
          được. Owner không bị ảnh hưởng.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {count} request PATCH chạy tuần tự. Bulk endpoint server-side sẽ có ở Sprint 3.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={pending}>
            Hủy
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            disabled={pending}
            className="bg-amber-500/90 text-ink hover:bg-amber-500"
          >
            {pending ? 'Đang xử lý…' : `Tạm khoá ${count} user`}
          </Button>
        </div>
      </div>
    </div>
  );
}
