'use client';

/**
 * Cấp / thu hồi quyền đọc trả phí cho MỘT PHIÊN (per-session access override).
 *
 * Wraps setSessionAccess() → POST /admin/sessions/:id/access. This is the
 * operator's "help a stuck customer" lever: a customer who paid by manual SePay
 * (or hit a gate bug) can be unlocked for the specific reading without touching
 * money. ACCESS-ONLY:
 *   - grant  → writes the `session:unlocked:<id>` signal so the paid-reading
 *              gate accepts this one session.
 *   - revoke → deletes that signal.
 * No refund happens here — real SePay refunds are manual bank transfers on the
 * /sepay page. `reason` is recorded in the audit log only. Self-contained:
 * renders its own trigger button + dialog (mirrors SetPlanDialog).
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
  Label,
  Textarea,
  toast,
} from '@hieu-asia/ui';
import { setSessionAccess } from '@/lib/admin-api';

export function SessionAccessDialog({
  sessionId,
  action,
  triggerLabel,
  triggerClassName,
  onSuccess,
}: {
  sessionId: string;
  action: 'grant' | 'revoke';
  triggerLabel: string;
  triggerClassName?: string;
  /** Called after a successful mutation so the caller can refetch. */
  onSuccess?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState('');
  const [pending, setPending] = React.useState(false);

  const isGrant = action === 'grant';

  React.useEffect(() => {
    if (open) setReason('');
  }, [open]);

  const submit = React.useCallback(async () => {
    setPending(true);
    const res = await setSessionAccess(sessionId, {
      action,
      ...(reason.trim() ? { reason: reason.trim() } : {}),
    });
    setPending(false);
    if (res.ok) {
      toast.success(isGrant ? 'Đã cấp quyền đọc cho phiên này.' : 'Đã thu hồi quyền đọc.');
      setOpen(false);
      onSuccess?.();
    } else {
      toast.error(res.error ?? 'Thao tác thất bại.');
    }
  }, [sessionId, action, reason, isGrant, onSuccess]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          triggerClassName ??
          'shrink-0 rounded border border-gold/30 bg-gold/5 px-2 py-0.5 text-xs text-gold transition-colors hover:bg-gold/10'
        }
      >
        {triggerLabel}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isGrant ? 'Cấp quyền đọc trả phí cho phiên này?' : 'Thu hồi quyền đọc của phiên này?'}
            </DialogTitle>
            <DialogDescription>
              {isGrant
                ? 'Mở khoá bản đọc trả phí cho riêng phiên này (giúp khách bị kẹt). Đây chỉ là quyền truy cập — KHÔNG có tiền nào được chuyển. Hoàn tiền thật làm thủ công qua SePay ở trang /sepay.'
                : 'Gỡ quyền đọc trả phí của phiên này. Chỉ ảnh hưởng quyền truy cập — không liên quan tiền bạc.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="sa-reason">Lý do (tuỳ chọn — ghi vào nhật ký)</Label>
            <Textarea
              id="sa-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={isGrant ? 'vd: khách chuyển khoản tay đã xác nhận' : 'vd: cấp nhầm phiên'}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
              Huỷ
            </Button>
            <Button onClick={submit} disabled={pending}>
              {pending ? 'Đang lưu…' : isGrant ? 'Cấp quyền' : 'Thu hồi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
