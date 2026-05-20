'use client';

import * as React from 'react';
import { Button } from '@hieu-asia/ui';

export interface DataDeletionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export function DataDeletionDialog({
  open,
  onClose,
  onConfirm,
}: DataDeletionDialogProps) {
  const [confirmText, setConfirmText] = React.useState('');
  const [pending, setPending] = React.useState(false);

  if (!open) return null;

  const canConfirm = confirmText.trim().toUpperCase() === 'XOÁ';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-gold/30 bg-ink p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-3 font-heading text-xl text-gold">
          Xác nhận xoá dữ liệu
        </h2>
        <p className="mb-4 text-sm text-cream/80">
          Hành động này không thể hoàn tác. Tất cả báo cáo và lịch sử chat sẽ bị
          xoá vĩnh viễn.
        </p>
        <label className="block">
          <span className="text-xs text-cream/70">
            Gõ <code className="rounded bg-ink/80 px-1 text-gold">XOÁ</code> để
            xác nhận
          </span>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="mt-1 w-full rounded-md border border-gold/20 bg-ink/60 px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none"
            autoFocus
          />
        </label>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={pending}>
            Huỷ
          </Button>
          <Button
            disabled={!canConfirm || pending}
            onClick={async () => {
              setPending(true);
              try {
                await onConfirm();
              } finally {
                setPending(false);
              }
            }}
            className="bg-red-500/80 text-cream hover:bg-red-500"
          >
            {pending ? 'Đang xoá…' : 'Xoá vĩnh viễn'}
          </Button>
        </div>
      </div>
    </div>
  );
}
