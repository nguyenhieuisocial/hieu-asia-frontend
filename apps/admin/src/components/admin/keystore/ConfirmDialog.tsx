'use client';

/**
 * ConfirmDialog — shared confirm modal for keystore Reveal/Rotate/Delete
 * (Wave 60.81.A.v2). Mirrors ConfirmActionDialog from /customers.
 *
 * Caller passes the VaultConfirmState; copy is action-driven from
 * VAULT_ACTION_COPY (./types.ts).
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
import { VAULT_ACTION_COPY, type VaultConfirmState } from './types';
import { vendorLabel } from '@/lib/keystore-api';

export interface ConfirmDialogProps {
  state: VaultConfirmState | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  state,
  onOpenChange,
  onConfirm,
}: ConfirmDialogProps) {
  const handleCancel = React.useCallback(
    () => onOpenChange(false),
    [onOpenChange],
  );

  if (!state) {
    // Keep Dialog mounted so animations don't flicker.
    return (
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogContent />
      </Dialog>
    );
  }
  const copy = VAULT_ACTION_COPY[state.action];
  const e = state.entry;
  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5 rounded-md border border-gold/15 bg-card/60 p-3 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Vendor</span>
            <span>{vendorLabel(e.vendor)}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Key</span>
            <span className="font-mono text-xs">{e.key_name}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">ID</span>
            <span className="font-mono text-xs">{e.id}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Huỷ
          </Button>
          <Button
            onClick={onConfirm}
            className={
              copy.danger
                ? 'bg-red-500/20 text-red-200 hover:bg-red-500/30'
                : undefined
            }
          >
            {copy.cta}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
