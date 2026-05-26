'use client';

/**
 * Wave 60.81.D — Generate API key Dialog.
 *
 * Two phases:
 *   1. Form: name + scopes checklist + expiry date
 *   2. Result: show key ONCE (server returns the cleartext value only here);
 *      admin can copy, then dismiss → key is hashed server-side, audit_log
 *      row is written.
 *
 * RSC discipline: pre-rendered icons, no inline arrow handlers on Buttons.
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
  Input,
  Label,
  cn,
  toast,
} from '@hieu-asia/ui';
import { AlertTriangle, Copy, KeyRound } from 'lucide-react';
import { SCOPE_OPTIONS, type ScopeId } from './types';

const ICON_KEY = <KeyRound className="h-3.5 w-3.5" aria-hidden />;
const ICON_COPY = <Copy className="h-3.5 w-3.5" aria-hidden />;
const ICON_WARN = (
  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
);

export interface GenerateApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

interface GenerateResp {
  ok?: boolean;
  api_key?: { id: string; key: string };
  error?: string;
}

export function GenerateApiKeyDialog({
  open,
  onOpenChange,
  onCreated,
}: GenerateApiKeyDialogProps) {
  const [name, setName] = React.useState('');
  const [scopes, setScopes] = React.useState<Set<ScopeId>>(
    () => new Set(['admin:read']),
  );
  const [expires, setExpires] = React.useState<string>(''); // YYYY-MM-DD
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState<{ id: string; key: string } | null>(
    null,
  );

  // Reset whenever the dialog opens fresh.
  React.useEffect(() => {
    if (open) {
      setName('');
      setScopes(new Set(['admin:read']));
      setExpires('');
      setResult(null);
    }
  }, [open]);

  const handleNameChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value),
    [],
  );

  const handleExpiresChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setExpires(e.target.value),
    [],
  );

  const handleScopeToggle = React.useCallback((id: ScopeId) => {
    setScopes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSubmit = React.useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast('Cần đặt tên cho key', {
        description: 'Đặt tên rõ để dễ identify ở audit log.',
      });
      return;
    }
    if (scopes.size === 0) {
      toast('Chọn ít nhất 1 scope', {
        description: 'Key trắng không thể authenticate.',
      });
      return;
    }
    setBusy(true);
    try {
      const r = await fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmed,
          scopes: Array.from(scopes),
          expires_at: expires || null,
        }),
      });
      const data = (await r.json()) as GenerateResp;
      if (r.ok && data.ok && data.api_key) {
        setResult(data.api_key);
        onCreated?.();
      } else {
        toast('Không tạo được key', {
          description: data?.error ?? `HTTP ${r.status}`,
        });
      }
    } catch (err) {
      toast('Lỗi tạo key', { description: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }, [name, scopes, expires, onCreated]);

  const handleCopyKey = React.useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.key);
      toast('Đã copy key', { description: 'Lưu key vào secret manager ngay.' });
    } catch {
      toast('Không copy được — clipboard không available.');
    }
  }, [result]);

  const handleDismiss = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        {result ? (
          <>
            <DialogHeader>
              <DialogTitle>Đã tạo key — copy ngay</DialogTitle>
              <DialogDescription>
                Đây là lần duy nhất bạn thấy giá trị key. Sau khi đóng dialog
                này, server chỉ giữ hash.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
              {ICON_WARN}
              <div className="space-y-1 text-xs text-foreground/85">
                <p>
                  Copy ngay vào secret manager (1Password, Bitwarden…) — không
                  có cách recover sau khi đóng dialog.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                API key
              </Label>
              <code className="block break-all rounded-md border border-gold/20 bg-card/80 px-3 py-2 font-mono text-xs text-foreground">
                {result.key}
              </code>
              <p className="font-mono text-[11px] text-muted-foreground">
                Key ID: {result.id}
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCopyKey}>
                {ICON_COPY}
                <span className="ml-1.5">Copy</span>
              </Button>
              <Button onClick={handleDismiss}>Đã lưu — đóng</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Tạo API key mới</DialogTitle>
              <DialogDescription>
                Key dùng cho admin API. Audit log sẽ ghi cả việc tạo + mọi
                request từ key.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="apikey-name" className="text-xs uppercase tracking-wider text-muted-foreground">
                  Tên key
                </Label>
                <Input
                  id="apikey-name"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="ví dụ: ci-pipeline-prod"
                  disabled={busy}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Scopes
                </Label>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {SCOPE_OPTIONS.map((opt) => {
                    const checked = scopes.has(opt.id);
                    return (
                      <ScopeCheckbox
                        key={opt.id}
                        id={opt.id}
                        label={opt.label}
                        checked={checked}
                        disabled={busy}
                        onToggle={handleScopeToggle}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="apikey-expires" className="text-xs uppercase tracking-wider text-muted-foreground">
                  Hết hạn (tuỳ chọn)
                </Label>
                <Input
                  id="apikey-expires"
                  type="date"
                  value={expires}
                  onChange={handleExpiresChange}
                  disabled={busy}
                />
                <p className="text-[11px] text-muted-foreground">
                  Để trống = không hết hạn. Khuyến nghị rotate 90d.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleDismiss} disabled={busy}>
                Huỷ
              </Button>
              <Button onClick={handleSubmit} disabled={busy}>
                {ICON_KEY}
                <span className="ml-1.5">
                  {busy ? 'Đang tạo…' : 'Tạo key'}
                </span>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface ScopeCheckboxProps {
  id: ScopeId;
  label: string;
  checked: boolean;
  disabled: boolean;
  onToggle: (id: ScopeId) => void;
}

function ScopeCheckbox({
  id,
  label,
  checked,
  disabled,
  onToggle,
}: ScopeCheckboxProps) {
  const handleChange = React.useCallback(() => {
    onToggle(id);
  }, [onToggle, id]);

  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
        checked
          ? 'border-gold/40 bg-gold/[0.06] text-foreground'
          : 'border-gold/15 bg-card/40 text-foreground/80 hover:border-gold/30',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="mt-0.5 h-3.5 w-3.5 cursor-pointer rounded border-gold/30 bg-card text-gold focus:ring-1 focus:ring-gold/50"
      />
      <span className="min-w-0">
        <code className="block font-mono text-[11px] text-foreground/85">
          {id}
        </code>
        <span className="block text-[11px] text-muted-foreground">{label}</span>
      </span>
    </label>
  );
}
