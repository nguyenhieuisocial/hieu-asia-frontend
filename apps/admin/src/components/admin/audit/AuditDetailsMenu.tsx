'use client';

/**
 * AuditDetailsMenu — per-row DropdownMenu trigger that reveals the raw
 * metadata JSON for an audit entry.
 *
 * Wave 60.71.T2.audit (vault 107 §5.7). Uses Wave 60.68 DropdownMenu
 * primitive (Radix). Replaces the inline `<code>` truncation that was prone
 * to clipping noisy multi-key payloads.
 *
 * Stops click propagation so the menu open does not trigger AdminTable
 * row-click — audit rows don't navigate yet, but the bubble-stop preserves
 * the option for a future detail panel without churning this component.
 */

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@hieu-asia/ui';
import { ChevronDown } from 'lucide-react';
import { prettyJson } from './format';

const ICON_CHEVRON = <ChevronDown className="h-3 w-3" aria-hidden />;

export interface AuditDetailsMenuProps {
  metadata: Record<string, unknown> | null | undefined;
}

export function AuditDetailsMenu({ metadata }: AuditDetailsMenuProps) {
  const hasData = metadata != null && Object.keys(metadata).length > 0;

  const stopRowClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  if (!hasData) {
    return <span className="text-muted-foreground">—</span>;
  }

  const keys = Object.keys(metadata);
  const summary = keys.length === 1 ? keys[0]! : `${keys.length} field`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onClick={stopRowClick}
          aria-label={`Mở metadata (${summary})`}
          className="inline-flex h-7 items-center gap-1 rounded-md border border-gold/20 bg-card/40 px-2 font-mono text-[11px] text-foreground/80 hover:border-gold/40 hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/40"
        >
          {summary}
          {ICON_CHEVRON}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[28rem] max-w-[90vw] p-0"
      >
        <DropdownMenuLabel className="border-b border-gold/15">
          metadata · {keys.length} field
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-0" />
        <pre className="max-h-72 overflow-auto bg-card/40 px-3 py-2 font-mono text-[11px] leading-relaxed text-foreground/85">
          {prettyJson(metadata)}
        </pre>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
