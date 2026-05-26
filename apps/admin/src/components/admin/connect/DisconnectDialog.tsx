'use client';

/**
 * Wave 60.81.D — Disconnect confirm Dialog for /connect.
 *
 * Renders a warning about downstream data-sync impact + calls the
 * disconnect endpoint (DELETE /api/admin/integrations/keys/[vendor]
 * for AI providers, custom routes for OAuth integrations).
 *
 * audit_log write happens at the gateway (vault 107 §5.7).
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
import { AlertTriangle } from 'lucide-react';
import type { ProviderRow } from './types';

const ICON_WARN = (
  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
);

export interface DisconnectDialogProps {
  row: ProviderRow | null;
  onOpenChange: (open: boolean) => void;
  onConfirmed?: () => void;
}

export function DisconnectDialog({
  row,
  onOpenChange,
  onConfirmed,
}: DisconnectDialogProps) {
  const [busy, setBusy] = React.useState(false);

  const handleCancel = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleConfirm = React.useCallback(async () => {
    if (!row) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/integrations/keys/${row.id}`, {
        method: 'DELETE',
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data?.ok !== false) {
        toast(`Đã disconnect ${row.name}`, {
          description:
            'Token đã bị revoke. audit_log đã ghi nhận hành động này.',
        });
        onConfirmed?.();
        onOpenChange(false);
      } else {
        toast(`Không disconnect được ${row.name}`, {
          description: data?.error ?? `HTTP ${r.status}`,
        });
      }
    } catch (err) {
      toast(`Lỗi disconnect ${row.name}`, {
        description: (err as Error).message,
      });
    } finally {
      setBusy(false);
    }
  }, [row, onOpenChange, onConfirmed]);

  if (!row) {
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
          <DialogTitle>Disconnect {row.name}?</DialogTitle>
          <DialogDescription>
            Token sẽ bị revoke vĩnh viễn — mọi background job dùng vendor này
            sẽ dừng cho đến khi reconnect.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
          {ICON_WARN}
          <div className="space-y-1 text-xs text-foreground/85">
            <p>
              Dữ liệu sync (analytics, traces, payments webhooks) sẽ ngừng
              cho đến khi vendor được kết nối lại.
            </p>
            {row.last_used && (
              <p className="font-mono text-[11px] text-muted-foreground">
                Lần dùng cuối: {row.last_used}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={busy}>
            Huỷ
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={busy}
            className="bg-red-500/20 text-red-200 hover:bg-red-500/30"
          >
            {busy ? 'Đang disconnect…' : 'Disconnect'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
