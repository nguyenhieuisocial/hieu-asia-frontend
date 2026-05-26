'use client';

/**
 * ConfirmActionDialog — shared confirm modal for /customers + /customers/[id].
 *
 * Wave 60.71.T2.customers. Replaces native `confirm()` with the brand-correct
 * Dialog primitive. Caller passes a ConfirmState and the dialog renders
 * action-specific copy from `ACTION_COPY`.
 *
 * `customer` is optional: the list page passes the full customer for the
 * breakdown (email + ID), the detail page just passes name + id since the
 * surrounding context already shows full profile.
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
import { ACTION_COPY, type ConfirmState } from './types';

export interface ConfirmActionDialogProps {
  state: ConfirmState | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ConfirmActionDialog({
  state,
  onOpenChange,
  onConfirm,
}: ConfirmActionDialogProps) {
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
  const copy = ACTION_COPY[state.action];
  const c = state.customer;
  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5 rounded-md border border-gold/15 bg-card/60 p-3 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Tên</span>
            <span>{c.display_name ?? '(không tên)'}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Email</span>
            <span className="font-mono text-xs">{c.email ?? '—'}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">ID</span>
            <span className="font-mono text-xs">{c.id}</span>
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
