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
 *
 * NOTE: "Đổi role" / "Tạm khoá" / "Xoá" were removed — no backend mutation
 * routes exist (/api/admin/customers/:id is read-only), so those items
 * popped a confirm dialog then silently no-op'd. Re-add once mutation
 * endpoints land. (edit-role could map to /admin/users/set-plan if wired.)
 */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@hieu-asia/ui';
import { ExternalLink, MoreHorizontal } from 'lucide-react';
import type { Customer } from './types';

const ICON_VIEW = <ExternalLink className="h-3.5 w-3.5" aria-hidden />;
const ICON_MORE = <MoreHorizontal className="h-4 w-4" aria-hidden />;

export interface CustomerRowActionsProps {
  customer: Customer;
}

export function CustomerRowActions({ customer }: CustomerRowActionsProps) {
  const router = useRouter();

  const handleView = React.useCallback(() => {
    router.push(`/customers/${encodeURIComponent(customer.id)}`);
  }, [router, customer.id]);

  const stopRowClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onClick={stopRowClick}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-gold/10 hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ochre dark:focus-visible:ring-gold"
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
