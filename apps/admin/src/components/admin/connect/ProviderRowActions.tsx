'use client';

/**
 * Wave 60.81.D — DropdownMenu row actions for /connect provider table.
 *
 * Mirrors CustomerRowActions pattern (Wave 60.71.T2): pre-renders Lucide
 * icons at module scope (RSC discipline, Wave 60.65.P0a) and stops row-click
 * propagation so opening the menu does not trigger row click (no row click
 * on /connect today but kept defensive for future).
 *
 * Actions vary by status:
 *   connected     → Reauth, View scopes, Disconnect (danger)
 *   disconnected  → Connect (opens ConnectProviderDialog)
 *   failed        → Reauth (primary), View error, Disconnect
 */

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@hieu-asia/ui';
import {
  Eye,
  MoreHorizontal,
  Plug,
  PlugZap,
  Unplug,
} from 'lucide-react';
import type { ConnectAction, ProviderRow } from './types';
import { PROVIDER_CATALOGUE } from './types';

const ICON_REAUTH = <PlugZap className="h-3.5 w-3.5" aria-hidden />;
const ICON_SCOPES = <Eye className="h-3.5 w-3.5" aria-hidden />;
const ICON_DISCONNECT = <Unplug className="h-3.5 w-3.5" aria-hidden />;
const ICON_CONNECT = <Plug className="h-3.5 w-3.5" aria-hidden />;
const ICON_MORE = <MoreHorizontal className="h-4 w-4" aria-hidden />;

export interface ProviderRowActionsProps {
  row: ProviderRow;
  onAction: (a: ConnectAction) => void;
}

export function ProviderRowActions({ row, onAction }: ProviderRowActionsProps) {
  const handleReauth = React.useCallback(() => {
    onAction({ kind: 'reauth', row });
  }, [onAction, row]);

  const handleScopes = React.useCallback(() => {
    onAction({ kind: 'scopes', row });
  }, [onAction, row]);

  const handleDisconnect = React.useCallback(() => {
    onAction({ kind: 'disconnect', row });
  }, [onAction, row]);

  const handleConnect = React.useCallback(() => {
    const entry = PROVIDER_CATALOGUE.find((p) => p.id === row.id);
    if (!entry) return;
    onAction({ kind: 'connect', provider: entry });
  }, [onAction, row.id]);

  const stopRowClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // Native (Cloudflare Workers AI) has no actions — surface a disabled
  // placeholder so the AdminTable column width stays consistent.
  if (row.category === 'native') {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/40">
        {ICON_MORE}
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onClick={stopRowClick}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-gold/10 hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ochre dark:focus-visible:ring-gold"
          aria-label={`Hành động ${row.name}`}
        >
          {ICON_MORE}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[12rem]">
        {row.status === 'disconnected' ? (
          <DropdownMenuItem onSelect={handleConnect}>
            {ICON_CONNECT}
            Kết nối
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem onSelect={handleReauth}>
              {ICON_REAUTH}
              Re-authorize
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleScopes}>
              {ICON_SCOPES}
              Xem scopes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleDisconnect}
              className="text-red-300 focus:bg-red-500/10 focus:text-red-200"
            >
              {ICON_DISCONNECT}
              Disconnect
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
