'use client';

/**
 * RowActions — per-row DropdownMenu for /admin/keystore (Wave 60.81.A.v2).
 *
 * Mirrors components/admin/customers/CustomerRowActions.tsx pattern (Wave
 * 60.71.T2.customers). Icons pre-rendered at module scope per Wave 60.65.P0a
 * RSC discipline; trigger stops propagation so opening the menu does not
 * also fire row-click.
 */

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@hieu-asia/ui';
import { Eye, MoreHorizontal, RotateCw, Trash2 } from 'lucide-react';
import type { VaultEntry } from '@/lib/keystore-api';
import type { VaultConfirmState } from './types';

const ICON_REVEAL = <Eye className="h-3.5 w-3.5" aria-hidden />;
const ICON_ROTATE = <RotateCw className="h-3.5 w-3.5" aria-hidden />;
const ICON_TRASH = <Trash2 className="h-3.5 w-3.5" aria-hidden />;
const ICON_MORE = <MoreHorizontal className="h-4 w-4" aria-hidden />;

export interface RowActionsProps {
  entry: VaultEntry;
  onAction: (state: VaultConfirmState) => void;
}

export function RowActions({ entry, onAction }: RowActionsProps) {
  const handleReveal = React.useCallback(() => {
    onAction({ action: 'reveal', entry });
  }, [onAction, entry]);

  const handleRotate = React.useCallback(() => {
    onAction({ action: 'rotate', entry });
  }, [onAction, entry]);

  const handleDelete = React.useCallback(() => {
    onAction({ action: 'delete', entry });
  }, [onAction, entry]);

  const stopRowClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onClick={stopRowClick}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-gold/10 hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/40"
          aria-label="Hành động"
        >
          {ICON_MORE}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        <DropdownMenuItem onSelect={handleReveal}>
          {ICON_REVEAL}
          Hiện token
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleRotate}>
          {ICON_ROTATE}
          Xoay key
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={handleDelete}
          className="text-red-300 focus:bg-red-500/10 focus:text-red-200"
        >
          {ICON_TRASH}
          Xoá
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
