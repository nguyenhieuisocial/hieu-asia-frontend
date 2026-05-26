'use client';

/**
 * Wave 60.81.D — Dialog: pick a provider from the catalogue + start
 * OAuth flow (or seed API-key input for non-OAuth providers).
 *
 * Two-step flow:
 *   1. List of disconnected providers (radio-style buttons) → pick one
 *   2. Confirm → POST /api/admin/integrations/oauth/[vendor]/start
 *      → open auth_url in new tab → admin pastes code into a follow-up
 *      sheet on the provider row (existing exchange route).
 *
 * For non-OAuth providers (Anthropic / OpenAI / Resend / Sentry / etc.)
 * the dialog redirects the admin to /secrets with a toast — token
 * insertion lives there, /connect just orchestrates the catalogue.
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
  cn,
  toast,
} from '@hieu-asia/ui';
import { ExternalLink, Plug } from 'lucide-react';
import { PROVIDER_CATALOGUE, type ProviderCatalogueEntry } from './types';

const ICON_PLUG = <Plug className="h-3.5 w-3.5" aria-hidden />;
const ICON_EXT = <ExternalLink className="h-3 w-3" aria-hidden />;

export interface ConnectProviderDialogProps {
  open: boolean;
  /** Pre-selected provider (skips step 1 when set). */
  initial?: ProviderCatalogueEntry | null;
  /** Ids of already-connected providers to filter out of step 1. */
  connectedIds: Set<string>;
  onOpenChange: (open: boolean) => void;
  /** Refetch the providers query after a successful OAuth start. */
  onConnected?: () => void;
}

export function ConnectProviderDialog({
  open,
  initial,
  connectedIds,
  onOpenChange,
  onConnected,
}: ConnectProviderDialogProps) {
  const [picked, setPicked] = React.useState<ProviderCatalogueEntry | null>(
    initial ?? null,
  );
  const [busy, setBusy] = React.useState(false);

  // Reset when the dialog opens/closes.
  React.useEffect(() => {
    if (open) setPicked(initial ?? null);
  }, [open, initial]);

  const available = React.useMemo(
    () =>
      PROVIDER_CATALOGUE.filter(
        (p) => p.category !== 'native' && !connectedIds.has(p.id),
      ),
    [connectedIds],
  );

  const handleCancel = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleStart = React.useCallback(async () => {
    if (!picked) return;
    setBusy(true);
    try {
      if (picked.oauth) {
        const r = await fetch(
          `/api/admin/integrations/oauth/${picked.id}/start`,
          { method: 'POST' },
        );
        const data = await r.json();
        if (!data?.ok) {
          toast(`Không khởi tạo OAuth được: ${picked.name}`, {
            description: data?.error ?? `HTTP ${r.status}`,
          });
          return;
        }
        if (typeof data.auth_url === 'string') {
          window.open(data.auth_url, '_blank', 'noopener,noreferrer');
          toast(`Đã mở OAuth flow cho ${picked.name}`, {
            description:
              'Authorize ở tab mới → quay lại admin → paste code vào row provider để hoàn tất.',
          });
        }
        onConnected?.();
      } else {
        toast(`${picked.name}: dùng API key`, {
          description:
            'Vendor này không hỗ trợ OAuth web flow. Mở /secrets để paste key (Wave 60.62.T2).',
        });
      }
      onOpenChange(false);
    } catch (err) {
      toast('Lỗi khởi tạo flow', {
        description: (err as Error).message,
      });
    } finally {
      setBusy(false);
    }
  }, [picked, onOpenChange, onConnected]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kết nối provider mới</DialogTitle>
          <DialogDescription>
            Chọn vendor để bắt đầu OAuth flow (mở tab mới). Provider không hỗ
            trợ OAuth web sẽ được hướng dẫn paste API key ở /secrets.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[280px] overflow-y-auto rounded-md border border-gold/15 bg-card/60">
          {available.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Tất cả vendor đã được kết nối.
            </p>
          ) : (
            <ul className="divide-y divide-gold/10">
              {available.map((p) => {
                const isPicked = picked?.id === p.id;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setPicked(p)}
                      className={cn(
                        'flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors',
                        isPicked
                          ? 'bg-gold/[0.08] text-foreground'
                          : 'hover:bg-gold/[0.04]',
                      )}
                    >
                      <span
                        className={cn(
                          'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                          isPicked ? 'bg-gold' : 'bg-muted/40',
                        )}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5 font-medium">
                          {p.name}
                          {p.oauth && (
                            <span className="rounded border border-jade/30 bg-jade/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-jade-50">
                              OAuth
                            </span>
                          )}
                          {p.docUrl && (
                            <a
                              href={p.docUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-muted-foreground hover:text-gold"
                              aria-label={`Docs ${p.name}`}
                            >
                              {ICON_EXT}
                            </a>
                          )}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {p.hint}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Huỷ
          </Button>
          <Button onClick={handleStart} disabled={!picked || busy}>
            {ICON_PLUG}
            <span className="ml-1.5">
              {busy ? 'Đang khởi tạo…' : 'Bắt đầu'}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
