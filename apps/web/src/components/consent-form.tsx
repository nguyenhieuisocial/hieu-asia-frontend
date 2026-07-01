'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Checkbox } from '@hieu-asia/ui';
import { Check } from 'lucide-react';
import { logAuditEvent } from '@/lib/account-history';
import { track } from '@/lib/analytics';

const PURPOSES = [
  'Tạo báo cáo phân tích cá nhân hoá',
  'Duy trì phiên chat Mentor AI',
];

const schema = z.object({
  birth_data: z.literal(true, { errorMap: () => ({ message: 'Bạn cần đồng ý mục này để tạo lá số' }) }),
  improve_optin: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ConsentForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      birth_data: false as unknown as true,
      improve_optin: false,
    },
  });

  const values = watch();
  const allChecked = values.birth_data === true;

  const onSubmit = handleSubmit(async () => {
    const acceptedAt = new Date().toISOString();
    const purposes = [
      'personalized_reading',
      'mentor_chat',
      ...(values.improve_optin ? ['quality_improvement'] : []),
    ];

    // Persist consent state for next step (very small footprint, no PII)
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(
        'hieu.consent',
        JSON.stringify({ accepted: true, accepted_at: acceptedAt, version: 'v2.0', purposes }),
      );
    }

    // Record consent in Supabase audit_log via the secure same-origin route.
    // The actor is forced server-side (verified uid if signed in, else a
    // server-minted anon id), so we no longer pass a client-chosen user_id.
    try {
      await logAuditEvent({
        action: 'consent_accepted',
        audit_metadata: { boxes: 1, version: 'v2.0', purposes, accepted_at: acceptedAt },
      });
    } catch (e) {
      // Non-blocking — surface in console for diagnostics; user can still proceed.
      console.warn('audit log failed:', e);
    }

    track('consent_given', { purposes_count: purposes.length, improve_optin: !!values.improve_optin });

    router.push('/reading/new');
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h3 className="mb-3 font-heading text-base font-semibold text-foreground">
          Mục đích sử dụng dữ liệu
        </h3>
        <ul className="space-y-2.5">
          {PURPOSES.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-foreground/80">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-jade" aria-hidden="true" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Các quyền tuỳ chọn khác (palm, MBTI, Mentor history) sẽ hỏi sau, chỉ khi bạn dùng đến.
        </p>
      </div>

      <div className="rounded-md border border-gold/30 bg-card/40 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <Checkbox className="mt-1" {...register('birth_data')} />
          <span className="flex-1">
            <span className="block text-sm font-medium text-foreground">
              Tôi đồng ý cho hieu.asia xử lý ngày sinh + giờ sinh để tạo lá số
            </span>
            <span className="mt-1 block text-xs text-foreground/75">
              Theo Nghị định 356/2025/NĐ-CP (thay thế 13/2023). Mã hoá AES-256, không bán dữ liệu, có quyền rút lại bất cứ lúc nào tại{' '}
              <a href="/account" className="text-gold underline underline-offset-4 hover:opacity-80">trang Tài khoản</a>.
            </span>
          </span>
        </label>
      </div>

      <div className="rounded-md border border-gold/10 bg-card/30 p-3">
        <label className="flex cursor-pointer items-start gap-3">
          <Checkbox className="mt-1" {...register('improve_optin')} />
          <span className="text-sm text-foreground/80">
            Cho phép dùng dữ liệu ẨN DANH để cải thiện sản phẩm
            <span className="ml-1 text-xs text-muted-foreground">(tuỳ chọn — mặc định TẮT, không ảnh hưởng trải nghiệm)</span>
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-3 border-t border-gold/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Bạn có thể yêu cầu xoá toàn bộ dữ liệu cá nhân bất cứ lúc nào.
        </p>
        <Button type="submit" size="lg" disabled={!allChecked || isSubmitting}>
          Tiếp tục lập lá số
        </Button>
      </div>
    </form>
  );
}
