'use client';

/**
 * Liên hệ khách — gửi email giao dịch cho một khách hàng qua các template Resend
 * có sẵn của worker (POST /admin/email/send).
 *
 * GIỚI HẠN QUAN TRỌNG (đã verify với backend): endpoint /admin/email/send KHÔNG
 * nhận tiêu đề / nội dung tự do. Nó chỉ render MỘT trong số các template cố định
 * trong worker (src/email/templates.ts) và chỉ nhận { template, to, args }. Vì
 * vậy hộp thoại này là BỘ CHỌN TEMPLATE, không phải trình soạn email tự do. Ba
 * template hữu ích nhất cho việc chăm sóc khách được expose ở đây:
 *   - readingComplete : báo bài đọc đã sẵn sàng (kèm link xem)
 *   - welcome         : lời chào / mời quay lại (kèm link đăng nhập)
 *   - dailyHoroscope  : ô `summary` cho phép nhập một đoạn nội dung tự do nhất
 *
 * Tự chứa: tự render trigger Button + Dialog (giống SetPlanDialog). Khi khách
 * không có email (user chỉ dùng Telegram) → trigger bị vô hiệu hoá kèm ghi chú.
 */

import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
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
  Textarea,
  toast,
} from '@hieu-asia/ui';
import { Mail } from 'lucide-react';
import { sendAdminEmail, type AdminEmailTemplate } from '@/lib/admin-api';

const PUBLIC_WEB_URL = process.env.NEXT_PUBLIC_WEB_URL ?? 'https://hieu.asia';

type TemplateId = AdminEmailTemplate['template'];

const TEMPLATE_LABEL: Record<TemplateId, string> = {
  readingComplete: 'Báo bài đọc đã sẵn sàng',
  welcome: 'Lời chào / mời quay lại',
  dailyHoroscope: 'Tử vi ngày (đoạn tự do)',
};

const TEMPLATE_HINT: Record<TemplateId, string> = {
  readingComplete: 'Nhắc khách bài đọc đã xong và gửi link xem. Hợp khi sửa xong một phiên lỗi.',
  welcome: 'Lời chào ấm áp + link đăng nhập. Hợp để mời khách cũ quay lại.',
  dailyHoroscope: 'Khung tử vi ngày — ô “Nội dung” cho phép viết một đoạn tự do nhất.',
};

const TEMPLATE_ORDER: TemplateId[] = ['readingComplete', 'welcome', 'dailyHoroscope'];

function todayVi(): string {
  return new Date().toLocaleDateString('vi-VN');
}

export function ContactCustomerDialog({
  email,
  /** Link tới phiên/bài đọc, dùng prefill cho template readingComplete. */
  viewUrl,
  triggerLabel = 'Liên hệ khách',
  triggerVariant = 'outline',
}: {
  /** Email khách. Rỗng/null = khách không có email → trigger vô hiệu hoá. */
  email?: string | null;
  viewUrl?: string;
  triggerLabel?: string;
  triggerVariant?: React.ComponentProps<typeof Button>['variant'];
}) {
  const hasEmail = !!(email && email.includes('@'));
  const [open, setOpen] = React.useState(false);
  const [template, setTemplate] = React.useState<TemplateId>('readingComplete');

  // Per-template arg fields. Kept flat; only the relevant ones are read on send.
  const [readingType, setReadingType] = React.useState('Tử Vi · Bát Tự');
  const [link, setLink] = React.useState(viewUrl ?? `${PUBLIC_WEB_URL}/`);
  const [zodiac, setZodiac] = React.useState('');
  const [summary, setSummary] = React.useState('');

  // Reset to sensible defaults each open.
  React.useEffect(() => {
    if (open) {
      setTemplate('readingComplete');
      setReadingType('Tử Vi · Bát Tự');
      setLink(viewUrl ?? `${PUBLIC_WEB_URL}/`);
      setZodiac('');
      setSummary('');
    }
  }, [open, viewUrl]);

  const mut = useMutation({
    mutationFn: async () => {
      if (!hasEmail) throw new Error('Khách không có email');
      let payload: AdminEmailTemplate;
      if (template === 'readingComplete') {
        payload = { template, args: { readingType: readingType.trim(), viewUrl: link.trim() } };
      } else if (template === 'welcome') {
        payload = { template, args: { signinUrl: link.trim() } };
      } else {
        payload = {
          template,
          args: {
            zodiac: zodiac.trim(),
            date: todayVi(),
            summary: summary.trim(),
            fullUrl: link.trim(),
          },
        };
      }
      const res = await sendAdminEmail(email!, payload);
      if (!res.ok) throw new Error(res.error ?? 'Gửi thất bại');
      return res;
    },
    onSuccess: () => {
      toast.success('Đã gửi email cho khách', { description: email ?? undefined });
      setOpen(false);
    },
    onError: (e) =>
      toast.error('Gửi email thất bại', { description: (e as Error).message }),
  });

  // Validation per template (only the fields that template uses).
  const valid =
    hasEmail &&
    (template === 'readingComplete'
      ? readingType.trim().length > 0 && link.trim().length > 0
      : template === 'welcome'
        ? link.trim().length > 0
        : zodiac.trim().length > 0 && summary.trim().length > 0 && link.trim().length > 0);

  return (
    <>
      <Button
        variant={triggerVariant}
        size="sm"
        onClick={() => setOpen(true)}
        disabled={!hasEmail}
        title={
          hasEmail
            ? 'Gửi email cho khách qua template có sẵn'
            : 'Khách này không có email (vd: chỉ dùng Telegram) — không gửi được'
        }
      >
        <Mail className="mr-1.5 h-3.5 w-3.5" aria-hidden />
        {triggerLabel}
      </Button>

      <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Liên hệ khách qua email</DialogTitle>
            <DialogDescription>
              Gửi email cho <span className="font-mono text-gold">{email}</span> bằng một template
              có sẵn. Lưu ý: hệ thống chỉ hỗ trợ các template cố định bên dưới — không soạn email
              tiêu đề / nội dung hoàn toàn tự do.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Loại email</Label>
              <div className="flex flex-wrap gap-2">
                {TEMPLATE_ORDER.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTemplate(t)}
                    className={
                      template === t
                        ? 'rounded-md border border-gold bg-gold/10 px-3 py-1.5 text-sm text-gold'
                        : 'rounded-md border border-gold/20 px-3 py-1.5 text-sm text-muted-foreground hover:border-gold/40'
                    }
                  >
                    {TEMPLATE_LABEL[t]}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{TEMPLATE_HINT[template]}</p>
            </div>

            {template === 'readingComplete' && (
              <div className="space-y-2">
                <Label htmlFor="cc-reading-type">Tên bài đọc</Label>
                <Input
                  id="cc-reading-type"
                  value={readingType}
                  onChange={(e) => setReadingType(e.target.value)}
                  placeholder="vd: Tử Vi · Bát Tự"
                  maxLength={80}
                />
              </div>
            )}

            {template === 'dailyHoroscope' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cc-zodiac">Cung / con giáp</Label>
                  <Input
                    id="cc-zodiac"
                    value={zodiac}
                    onChange={(e) => setZodiac(e.target.value)}
                    placeholder="vd: Tuổi Dần"
                    maxLength={40}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cc-summary">Nội dung</Label>
                  <Textarea
                    id="cc-summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Đoạn nội dung muốn gửi tới khách…"
                    maxLength={1000}
                    rows={4}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="cc-link">
                {template === 'welcome' ? 'Link đăng nhập' : 'Link đính kèm'}
              </Label>
              <Input
                id="cc-link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder={`${PUBLIC_WEB_URL}/…`}
                className="font-mono text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={mut.isPending}>
              Hủy
            </Button>
            <Button onClick={() => mut.mutate()} disabled={!valid || mut.isPending}>
              {mut.isPending ? 'Đang gửi…' : 'Gửi email'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
