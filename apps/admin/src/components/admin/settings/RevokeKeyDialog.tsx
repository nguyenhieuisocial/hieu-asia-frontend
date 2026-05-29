'use client';

/**
 * Wave 60.81.D — Revoke API key confirm Dialog.
 *
 * DELETE /api/admin/api-keys/[id] → audit_log row, key immediately
 * unusable. No grace period.
 */

import * as React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  toast,
} from '@hieu-asia/ui';
import { ShieldOff } from 'lucide-react';
import type { AdminApiKey } from './types';

const ICON_REVOKE = <ShieldOff className="h-3.5 w-3.5" aria-hidden />;

export interface RevokeKeyDialogProps {
  apiKey: AdminApiKey | null;
  onOpenChange: (open: boolean) => void;
  onRevoked?: () => void;
}

export function RevokeKeyDialog({
  apiKey,
  onOpenChange,
  onRevoked,
}: RevokeKeyDialogProps) {
  const [busy, setBusy] = React.useState(false);

  const handleCancel = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleConfirm = React.useCallback(async () => {
    if (!apiKey) return;
    setBusy(true);
    try {
      const r = await fetch(
        `/api/admin/api-keys/${encodeURIComponent(apiKey.id)}`,
        { method: 'DELETE' },
      );
      const data = await r.json().catch(() => ({}));
      if (r.ok && data?.ok !== false) {
        toast(`Đã revoke ${apiKey.name}`, {
          description: 'Mọi request dùng key này sẽ trả 401 từ giờ.',
        });
        onRevoked?.();
        onOpenChange(false);
      } else {
        toast('Không revoke được', {
          description: data?.error ?? `HTTP ${r.status}`,
        });
      }
    } catch (err) {
      toast('Lỗi revoke key', { description: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }, [apiKey, onOpenChange, onRevoked]);

  if (!apiKey) {
    return (
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogContent />
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revoke key {apiKey.name}?</DialogTitle>
          <DialogDescription>
            Key sẽ trở thành unusable ngay lập tức. Mọi background job dùng
            key này phải được update trước khi revoke.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5 rounded-md border border-gold/15 bg-card/60 p-3 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Tên</span>
            <span>{apiKey.name}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Prefix</span>
            <span className="font-mono text-xs">{apiKey.prefix}…</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Scopes</span>
            <span className="font-mono text-xs">
              {apiKey.scopes.join(', ') || '—'}
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={busy}>
            Huỷ
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={busy}
            className="bg-red-500/20 text-red-700 dark:text-red-200 hover:bg-red-500/30"
          >
            {ICON_REVOKE}
            <span className="ml-1.5">
              {busy ? 'Đang revoke…' : 'Revoke'}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
