'use client';

/**
 * CustomerRowActions — per-row DropdownMenu for /customers list.
 *
 * Wave 60.71.T2.customers (vault 107 §5.5). Wraps Wave 60.68 DropdownMenu
 * primitive. Pre-renders Lucide icons at module scope (Wave 60.65.P0a) so
 * the configuration cannot leak a Component ref across an RSC boundary.
 *
 * Trigger button stops propagation so opening the menu does not also
 * trigger the AdminTable row-click handler (which routes to /detail).
 */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@hieu-asia/ui';
import {
  ExternalLink,
  MoreHorizontal,
  Pencil,
  ShieldOff,
  Trash2,
} from 'lucide-react';
import type { ConfirmState, Customer } from './types';

const ICON_VIEW = <ExternalLink className="h-3.5 w-3.5" aria-hidden />;
const ICON_PENCIL = <Pencil className="h-3.5 w-3.5" aria-hidden />;
const ICON_SUSPEND = <ShieldOff className="h-3.5 w-3.5" aria-hidden />;
const ICON_TRASH = <Trash2 className="h-3.5 w-3.5" aria-hidden />;
const ICON_MORE = <MoreHorizontal className="h-4 w-4" aria-hidden />;

export interface CustomerRowActionsProps {
  customer: Customer;
  onAction: (state: ConfirmState) => void;
}

export function CustomerRowActions({ customer, onAction }: CustomerRowActionsProps) {
  const router = useRouter();

  const handleView = React.useCallback(() => {
    router.push(`/customers/${encodeURIComponent(customer.id)}`);
  }, [router, customer.id]);

  const handleEdit = React.useCallback(() => {
    onAction({ action: 'edit-role', customer });
  }, [onAction, customer]);

  const handleSuspend = React.useCallback(() => {
    onAction({ action: 'suspend', customer });
  }, [onAction, customer]);

  const handleDelete = React.useCallback(() => {
    onAction({ action: 'delete', customer });
  }, [onAction, customer]);

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
        <DropdownMenuItem onSelect={handleView}>
          {ICON_VIEW}
          Xem chi tiết
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleEdit}>
          {ICON_PENCIL}
          Đổi role
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleSuspend}>
          {ICON_SUSPEND}
          Tạm khoá
        </DropdownMenuItem>
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
