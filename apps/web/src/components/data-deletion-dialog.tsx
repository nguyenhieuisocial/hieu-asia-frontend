'use client';

import * as React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@hieu-asia/ui';

export interface DataDeletionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

/**
 * Wave 64.6 (audit 2026-05-29): migrated from a hand-rolled `<div role="dialog">`
 * (no focus-trap, no Esc-to-close, no aria-labelledby) to the Radix-backed Dialog
 * primitive so this DESTRUCTIVE confirm is keyboard-accessible (focus trap + Esc +
 * aria wiring handled by Radix). Delete logic (type "XOÁ", pending guard, onConfirm)
 * is unchanged.
 */
export function DataDeletionDialog({
  open,
  onClose,
  onConfirm,
}: DataDeletionDialogProps) {
  const [confirmText, setConfirmText] = React.useState('');
  const [pending, setPending] = React.useState(false);

  const canConfirm = confirmText.trim().toUpperCase() === 'XOÁ';

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Don't allow dismiss (Esc / backdrop) mid-delete.
        if (!next && !pending) onClose();
      }}
    >
      <DialogContent
        hideClose
        className="max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto"
      >
        <DialogTitle className="text-gold">Xác nhận xoá dữ liệu</DialogTitle>
        <DialogDescription className="text-foreground/80">
          Hành động này không thể hoàn tác. Tất cả báo cáo và lịch sử chat sẽ bị
          xoá vĩnh viễn.
        </DialogDescription>
        <label className="block">
          <span className="text-xs text-muted-foreground">
            Gõ <code className="rounded bg-card/80 px-1 text-gold">XOÁ</code> để
            xác nhận
          </span>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="mt-1 w-full rounded-md border border-gold/20 bg-card/60 px-3 py-2 text-sm text-foreground focus:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            autoFocus
          />
        </label>
        <div className="mt-2 flex justify-end gap-2">
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
            className="bg-red-500/80 text-foreground hover:bg-red-500"
          >
            {pending ? 'Đang xoá…' : 'Xoá vĩnh viễn'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
