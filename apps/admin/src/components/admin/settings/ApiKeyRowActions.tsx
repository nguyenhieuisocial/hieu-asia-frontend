'use client';

/**
 * Wave 60.81.D — DropdownMenu row actions for API keys table.
 *
 * Pre-renders icons at module scope (Wave 60.65.P0a RSC discipline).
 * Stops row-click propagation (defensive — table has no onRowClick today).
 */

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  toast,
} from '@hieu-asia/ui';
import { Copy, MoreHorizontal, ShieldOff } from 'lucide-react';
import type { AdminApiKey } from './types';

const ICON_COPY = <Copy className="h-3.5 w-3.5" aria-hidden />;
const ICON_REVOKE = <ShieldOff className="h-3.5 w-3.5" aria-hidden />;
const ICON_MORE = <MoreHorizontal className="h-4 w-4" aria-hidden />;

export interface ApiKeyRowActionsProps {
  apiKey: AdminApiKey;
  onRevoke: (apiKey: AdminApiKey) => void;
}

export function ApiKeyRowActions({ apiKey, onRevoke }: ApiKeyRowActionsProps) {
  const handleCopyId = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(apiKey.id);
      toast('Đã copy key ID');
    } catch {
      toast('Không copy được — clipboard không available.');
    }
  }, [apiKey.id]);

  const handleRevoke = React.useCallback(() => {
    onRevoke(apiKey);
  }, [onRevoke, apiKey]);

  const stopRowClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const revoked = !!apiKey.revoked_at;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onClick={stopRowClick}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-gold/10 hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ochre dark:focus-visible:ring-gold"
          aria-label={`Hành động ${apiKey.name}`}
        >
          {ICON_MORE}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        <DropdownMenuItem onSelect={handleCopyId}>
          {ICON_COPY}
          Copy ID
        </DropdownMenuItem>
        {!revoked && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleRevoke}
              className="text-red-700 dark:text-red-300 focus:bg-red-500/10 focus:text-red-700 dark:focus:text-red-200"
            >
              {ICON_REVOKE}
              Revoke
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
