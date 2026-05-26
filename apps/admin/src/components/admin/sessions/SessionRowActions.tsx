'use client';

/**
 * SessionRowActions — per-row DropdownMenu for /sessions list.
 *
 * Wave 60.71.T2.sessions (vault 107 §5.6). Mirrors CustomerRowActions (Wave
 * 60.71.T2.customers) pattern: pre-rendered Lucide icons at module scope
 * (Wave 60.65.P0a), stops propagation so opening menu does not trigger
 * AdminTable row-click (which routes to /sessions/:id detail).
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
import { Eye, MoreVertical, RotateCcw, Trash2 } from 'lucide-react';

const ICON_VIEW = <Eye className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />;
const ICON_RERUN = <RotateCcw className="h-3.5 w-3.5 text-gold" aria-hidden />;
const ICON_TRASH = <Trash2 className="h-3.5 w-3.5" aria-hidden />;
const ICON_MORE = <MoreVertical className="h-4 w-4" aria-hidden />;

export interface SessionRowActionsProps {
  sessionId: string;
  onReOrchestrate: (id: string) => void;
  onDelete: (id: string) => void;
  reOrchPending: boolean;
}

export function SessionRowActions({
  sessionId,
  onReOrchestrate,
  onDelete,
  reOrchPending,
}: SessionRowActionsProps) {
  const router = useRouter();

  const handleView = React.useCallback(() => {
    router.push(`/sessions/${encodeURIComponent(sessionId)}`);
  }, [router, sessionId]);

  const handleReRun = React.useCallback(() => {
    onReOrchestrate(sessionId);
  }, [onReOrchestrate, sessionId]);

  const handleDelete = React.useCallback(() => {
    onDelete(sessionId);
  }, [onDelete, sessionId]);

  const stopRowClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onClick={stopRowClick}
          aria-label={`Mở menu thao tác cho ${sessionId}`}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-gold/10 hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/40"
        >
          {ICON_MORE}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onSelect={handleView}>
          {ICON_VIEW}
          Xem chi tiết
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={reOrchPending}
          onSelect={handleReRun}
        >
          {ICON_RERUN}
          Re-run pipeline
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={handleDelete}
          className="text-red-300 focus:bg-red-500/10 focus:text-red-200"
        >
          {ICON_TRASH}
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
