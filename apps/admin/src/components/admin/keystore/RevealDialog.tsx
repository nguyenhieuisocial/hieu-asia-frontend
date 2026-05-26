'use client';

/**
 * RevealDialog — shows plaintext token with copy button + 30s auto-hide
 * (Wave 60.81.A.v2 — vault 107 §5.6 compliance flow).
 *
 * Lifecycle:
 *   1. Operator clicks Reveal in DropdownMenu → opens confirm Dialog.
 *   2. On Confirm, page calls revealVaultEntry() which writes audit_log
 *      backend-side (action=keystore.reveal, admin, IP) and returns the
 *      plaintext token.
 *   3. Token shown in this Dialog body with copy button.
 *   4. After 30s, Dialog auto-closes and the token is wiped from state.
 *
 * Token is held in a local ref so React DevTools / memory inspection has
 * a narrower window. We deliberately do NOT store it in localStorage or
 * any persisted query cache.
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
  toast,
} from '@hieu-asia/ui';
import { Copy } from 'lucide-react';

export interface RevealDialogProps {
  open: boolean;
  keyName: string;
  token: string | null;
  onClose: () => void;
}

const AUTO_HIDE_MS = 30_000;

export function RevealDialog({ open, keyName, token, onClose }: RevealDialogProps) {
  const [remaining, setRemaining] = React.useState(AUTO_HIDE_MS / 1000);

  // Reset countdown each time a fresh token is shown.
  React.useEffect(() => {
    if (!open || !token) return;
    setRemaining(AUTO_HIDE_MS / 1000);
    const hideAt = Date.now() + AUTO_HIDE_MS;
    const tick = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((hideAt - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) {
        window.clearInterval(tick);
        onClose();
      }
    }, 1000);
    return () => window.clearInterval(tick);
  }, [open, token, onClose]);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!next) onClose();
    },
    [onClose],
  );

  const handleCopy = React.useCallback(async () => {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      toast('Đã copy token', {
        description: 'Dán ngay vào nơi cần dùng. Token sẽ tự ẩn sau 30 giây.',
      });
    } catch {
      toast('Không copy được', {
        description: 'Trình duyệt từ chối clipboard. Chọn thủ công và Ctrl+C.',
      });
    }
  }, [token]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Plaintext token</DialogTitle>
          <DialogDescription>
            Audit log đã ghi nhận hành động này. Token sẽ tự ẩn sau {remaining}s.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 rounded-md border border-gold/15 bg-card/60 p-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {keyName}
          </div>
          <div className="break-all font-mono text-sm text-foreground/90">
            {token ?? '—'}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          <Button onClick={handleCopy} disabled={!token}>
            <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Copy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
