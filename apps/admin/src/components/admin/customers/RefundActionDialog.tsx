'use client';

/**
 * Duyệt / từ chối MỘT yêu cầu hoàn tiền đang ở trạng thái `requested`, ngay trên
 * tab Hoàn tiền của trang chi tiết khách hàng.
 *
 * Wraps the worker refund state machine:
 *   POST /admin/sepay/refund/:id/accept   (requested → approved)
 *   POST /admin/sepay/refund/:id/reject   (requested → rejected)
 *
 * GATING — đi qua /api/admin-proxy (KHÔNG phải /api/admin/customers), vì proxy
 * khoá `admin/sepay/refund*` ở mức OWNER. Viewer/admin gọi sẽ nhận 403. Mỗi
 * thao tác phải xác nhận trong dialog trước khi chạy — không có gì tự động.
 *
 * KHÔNG chuyển khoản: `accept` chỉ duyệt yêu cầu (đánh dấu approved). Việc bấm
 * "Đã hoàn tiền" (complete) sau khi đã chuyển khoản tay vẫn nằm ở trang /sepay —
 * đây chỉ là bước duyệt/từ chối, mirror đúng pattern SessionAccessDialog.
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
import { fmtVnd } from '@/lib/format';

interface RefundActionResponse {
  ok: boolean;
  error?: string;
}

export function RefundActionDialog({
  refundId,
  action,
  amountVnd,
  triggerLabel,
  triggerClassName,
  onSuccess,
}: {
  refundId: string;
  action: 'accept' | 'reject';
  /** Hiển thị số tiền trong dialog để operator xác nhận đúng lệnh. */
  amountVnd?: number | null;
  triggerLabel: string;
  triggerClassName?: string;
  /** Gọi sau khi mutate thành công để caller refetch. */
  onSuccess?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [note, setNote] = React.useState('');
  const [pending, setPending] = React.useState(false);

  const isApprove = action === 'accept';

  React.useEffect(() => {
    if (open) setNote('');
  }, [open]);

  const amountLabel = fmtVnd(amountVnd);

  const submit = React.useCallback(async () => {
    setPending(true);
    let res: RefundActionResponse;
    try {
      const r = await fetch(
        `/api/admin-proxy/admin/sepay/refund/${encodeURIComponent(refundId)}/${action}`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(note.trim() ? { note: note.trim() } : {}),
        },
      );
      const text = await r.text();
      try {
        res = JSON.parse(text) as RefundActionResponse;
      } catch {
        res = { ok: false, error: `Phản hồi không hợp lệ (status ${r.status})` };
      }
    } catch (e) {
      res = { ok: false, error: (e as Error)?.message ?? 'Lỗi mạng' };
    }
    setPending(false);
    if (res.ok) {
      toast.success(isApprove ? 'Đã duyệt yêu cầu hoàn tiền.' : 'Đã từ chối yêu cầu hoàn tiền.');
      setOpen(false);
      onSuccess?.();
    } else {
      toast.error(res.error ?? 'Thao tác thất bại.');
    }
  }, [refundId, action, note, isApprove, onSuccess]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          triggerClassName ??
          (isApprove
            ? 'shrink-0 rounded border border-jade/40 bg-jade/10 px-2 py-0.5 text-xs text-jade-700 transition-colors hover:bg-jade/20 dark:text-jade-50'
            : 'shrink-0 rounded border border-red-500/40 bg-red-500/10 px-2 py-0.5 text-xs text-red-700 transition-colors hover:bg-red-500/20 dark:text-red-300')
        }
      >
        {triggerLabel}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isApprove ? 'Duyệt yêu cầu hoàn tiền này?' : 'Từ chối yêu cầu hoàn tiền này?'}
            </DialogTitle>
            <DialogDescription>
              {isApprove ? (
                <>
                  Đánh dấu yêu cầu hoàn <strong>{amountLabel}</strong> là <strong>đã duyệt</strong>.
                  Đây CHỈ là bước duyệt — KHÔNG có tiền nào được chuyển. Việc chuyển khoản trả lại
                  cho khách làm thủ công, rồi bấm “Đã hoàn tiền” ở trang /sepay.
                </>
              ) : (
                <>
                  Từ chối yêu cầu hoàn <strong>{amountLabel}</strong>. Trạng thái chuyển sang{' '}
                  <strong>từ chối</strong>, không có tiền nào di chuyển.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="ra-note">Ghi chú (tuỳ chọn — ghi vào nhật ký hoàn tiền)</Label>
            <Textarea
              id="ra-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                isApprove ? 'vd: khách đủ điều kiện hoàn, đã liên hệ' : 'vd: ngoài chính sách hoàn'
              }
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
              Huỷ
            </Button>
            <Button
              variant={isApprove ? 'default' : 'outline'}
              onClick={submit}
              disabled={pending}
            >
              {pending ? 'Đang lưu…' : isApprove ? 'Duyệt' : 'Từ chối'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
