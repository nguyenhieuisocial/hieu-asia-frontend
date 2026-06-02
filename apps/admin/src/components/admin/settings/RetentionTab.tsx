'use client';

/**
 * Wave 60.81.D — Audit log retention tab for /settings.
 *
 * Dropdown to pick retention window. Apply opens a confirm Dialog
 * because shortening retention is irreversible (rows beyond the new
 * window get vacuum'd by worker job).
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  toast,
} from '@hieu-asia/ui';
import { AlertTriangle, ChevronDown, Clock, Save } from 'lucide-react';
import { ErrorBlock } from '@/components/admin/error-block';
import type { RetentionDays } from './types';

const ICON_CLOCK = <Clock className="h-4 w-4 text-gold" aria-hidden />;
const ICON_CHEV = <ChevronDown className="h-3 w-3 text-muted-foreground" aria-hidden />;
const ICON_SAVE = <Save className="h-3.5 w-3.5" aria-hidden />;
const ICON_WARN = (
  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
);

const OPTIONS: Array<{ value: RetentionDays; label: string; hint: string }> = [
  { value: 30, label: '30 ngày', hint: 'tối thiểu compliance' },
  { value: 90, label: '90 ngày', hint: 'khuyến nghị' },
  { value: 365, label: '365 ngày', hint: '1 năm full audit' },
  { value: 0, label: 'Mãi mãi', hint: 'storage cost cao' },
];

interface RetentionResp {
  ok?: boolean;
  retention_days?: RetentionDays;
  error?: string;
  note?: string;
}

async function fetchRetention(): Promise<RetentionResp> {
  const r = await fetch('/api/admin/settings/retention', { cache: 'no-store' });
  if (r.status === 404) {
    return { ok: false, note: 'Retention endpoint chưa wire — UI editable.' };
  }
  const text = await r.text();
  try {
    return JSON.parse(text) as RetentionResp;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${r.status})` };
  }
}

export function RetentionTab() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'settings', 'retention'],
    queryFn: fetchRetention,
  });

  const [picked, setPicked] = React.useState<RetentionDays>(90);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  // Sync picked with server response.
  React.useEffect(() => {
    if (data?.retention_days != null) setPicked(data.retention_days);
  }, [data?.retention_days]);

  const current = data?.retention_days ?? 90;
  const pickedLabel =
    OPTIONS.find((o) => o.value === picked)?.label ?? `${picked}d`;
  const dirty = picked !== current;
  const shortening = dirty && picked !== 0 && (current === 0 || picked < current);

  const handlePick = React.useCallback((v: string) => {
    setPicked(Number(v) as RetentionDays);
  }, []);

  const handleApplyClick = React.useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const handleConfirmChange = React.useCallback((open: boolean) => {
    if (!open) setConfirmOpen(false);
  }, []);

  const handleConfirmApply = React.useCallback(async () => {
    setBusy(true);
    try {
      const r = await fetch('/api/admin/settings/retention', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ retention_days: picked }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d?.ok !== false) {
        toast('Đã cập nhật retention', {
          description: 'audit_log đã ghi nhận thay đổi.',
        });
        setConfirmOpen(false);
        refetch();
      } else {
        toast('Không cập nhật được', {
          description: d?.error ?? `HTTP ${r.status}`,
        });
      }
    } catch (err) {
      toast('Lỗi update retention', { description: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }, [picked, refetch]);

  const showError = !!error;
  const errorMsg = (error as Error | undefined)?.message;

  return (
    <div className="space-y-4">
      {showError && (
        <ErrorBlock
          compact
          message={errorMsg ?? 'Không tải được retention.'}
          onRetry={() => refetch()}
        />
      )}
      {data?.note && !showError && (
        <div className="rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-muted-foreground">
          {data.note}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {ICON_CLOCK}
            Audit log retention
          </CardTitle>
          <CardDescription>
            Bao lâu thì worker vacuum audit_log rows. Compliance tối thiểu 30
            ngày. Khuyến nghị 90 ngày.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                disabled={isLoading || busy}
                className="inline-flex h-10 items-center gap-1.5 rounded-md border border-gold/20 bg-card/60 px-3 text-sm text-foreground hover:border-gold/50 disabled:opacity-50"
                aria-label="Chọn retention"
              >
                <span>{pickedLabel}</span>
                {ICON_CHEV}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[14rem]">
              <DropdownMenuLabel>Retention window</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={String(picked)}
                onValueChange={handlePick}
              >
                {OPTIONS.map((o) => (
                  <DropdownMenuRadioItem key={o.value} value={String(o.value)}>
                    <span className="flex flex-col gap-0.5">
                      <span>{o.label}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {o.hint}
                      </span>
                    </span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <p className="text-xs text-muted-foreground">
            Hiện tại:{' '}
            <code className="font-mono text-foreground/85">
              {current === 0 ? 'forever' : `${current} ngày`}
            </code>
            .
          </p>

          <div className="flex justify-end">
            <Button
              onClick={handleApplyClick}
              disabled={!dirty || busy || isLoading}
            >
              {ICON_SAVE}
              <span className="ml-1.5">Áp dụng</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={handleConfirmChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Áp dụng retention {pickedLabel}?</DialogTitle>
            <DialogDescription>
              Worker job sẽ chạy vacuum trong 24h tới. audit_log row sẽ được
              ghi.
            </DialogDescription>
          </DialogHeader>
          {shortening && (
            <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
              {ICON_WARN}
              <div className="space-y-1 text-xs text-foreground/85">
                <p>
                  Đang rút ngắn retention. Rows cũ hơn{' '}
                  <code className="font-mono">{picked}d</code> sẽ bị xoá vĩnh
                  viễn — không recover được.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={busy}
            >
              Huỷ
            </Button>
            <Button
              onClick={handleConfirmApply}
              disabled={busy}
              className={
                shortening
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-100 hover:bg-amber-500/30'
                  : undefined
              }
            >
              {busy ? 'Đang áp dụng…' : 'Áp dụng'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
