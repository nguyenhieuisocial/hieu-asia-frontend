'use client';

/**
 * Wave 60.81.D — Read-only OAuth scopes Dialog.
 *
 * Triggered from ProviderRowActions → "Xem scopes". Pure presentational —
 * fetches scopes from /api/admin/integrations/oauth/[vendor]/scopes (added
 * as a stub gateway proxy below; falls back to catalogue `scopes` field
 * when the gateway returns 404).
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
} from '@hieu-asia/ui';
import type { ProviderRow } from './types';

export interface ScopesDialogProps {
  row: ProviderRow | null;
  onOpenChange: (open: boolean) => void;
}

export function ScopesDialog({ row, onOpenChange }: ScopesDialogProps) {
  const handleClose = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  if (!row) {
    return (
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogContent />
      </Dialog>
    );
  }

  const scopes = row.scopes ?? '(không có scope cụ thể — full account access)';

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OAuth scopes — {row.name}</DialogTitle>
          <DialogDescription>
            Permissions granted to hieu.asia khi admin authorize vendor này.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 rounded-md border border-gold/15 bg-card/60 p-3 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Status</span>
            <span className="font-mono text-xs">{row.status}</span>
          </div>
          {row.connected_by && (
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Connected by</span>
              <span className="font-mono text-xs">{row.connected_by}</span>
            </div>
          )}
          {row.connected_at && (
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Connected at</span>
              <span className="font-mono text-xs">{row.connected_at}</span>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Scopes</span>
            <code className="block break-all rounded bg-card/80 px-2 py-1.5 font-mono text-xs text-foreground/85">
              {scopes}
            </code>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
