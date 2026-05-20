'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Checkbox } from '@hieu-asia/ui';
import { Check } from 'lucide-react';
import { getOrCreateAnonUserId, logAudit } from '@hieu-asia/supabase';

const CONSENT_ITEMS = [
  {
    id: 'birth_data',
    label: 'Ngày giờ sinh',
    desc: 'Dùng để dựng lá số và mốc thời gian luận giải vận hạn.',
  },
  {
    id: 'palm_image',
    label: 'Ảnh bàn tay (palmistry)',
    desc: 'Hệ thống Vision AI phân tích đường chỉ tay làm tham chiếu thêm.',
  },
  {
    id: 'survey',
    label: 'Câu trả lời khảo sát tính cách',
    desc: 'Đối chiếu hành vi thực tế với mô hình Tử Vi và Tâm lý học.',
  },
  {
    id: 'context',
    label: 'Bối cảnh nghề nghiệp và mối quan tâm cá nhân',
    desc: 'Để cá nhân hóa khuyến nghị 30-60-90 ngày sát thực tế.',
  },
] as const;

const PURPOSES = [
  { title: 'Tạo báo cáo phân tích cá nhân hóa', required: true },
  { title: 'Duy trì phiên chat Mentor AI', required: true },
  { title: 'Cải thiện chất lượng dịch vụ (tùy chọn)', required: false },
];

const schema = z.object({
  birth_data: z.literal(true, { errorMap: () => ({ message: 'Bạn cần đồng ý mục này' }) }),
  palm_image: z.literal(true, { errorMap: () => ({ message: 'Bạn cần đồng ý mục này' }) }),
  survey: z.literal(true, { errorMap: () => ({ message: 'Bạn cần đồng ý mục này' }) }),
  context: z.literal(true, { errorMap: () => ({ message: 'Bạn cần đồng ý mục này' }) }),
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
      palm_image: false as unknown as true,
      survey: false as unknown as true,
      context: false as unknown as true,
      improve_optin: false,
    },
  });

  const values = watch();
  const allChecked =
    values.birth_data === true &&
    values.palm_image === true &&
    values.survey === true &&
    values.context === true;

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
        JSON.stringify({ accepted: true, accepted_at: acceptedAt, version: 'v1.0', purposes }),
      );
    }

    // Generate / reuse anonymous user id and record consent in Supabase audit_log.
    const userId = getOrCreateAnonUserId();
    try {
      await logAudit({
        user_id: userId,
        action: 'consent_accepted',
        audit_metadata: { boxes: 4, version: 'v1.0', purposes, accepted_at: acceptedAt },
      });
    } catch (e) {
      // Non-blocking — surface in console for diagnostics; user can still proceed.
      console.warn('audit log failed:', e);
    }

    router.push('/reading/new');
  });

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div>
        <h3 className="mb-3 font-heading text-base font-semibold text-cream">
          Tôi đồng ý cho hệ thống xử lý
        </h3>
        <ul className="space-y-3">
          {CONSENT_ITEMS.map((item) => (
            <li
              key={item.id}
              className="rounded-md border border-gold/15 bg-ink/40 p-4 transition-colors hover:border-gold/30"
            >
              <label className="flex cursor-pointer items-start gap-3">
                <Checkbox className="mt-1" {...register(item.id)} />
                <span className="flex-1">
                  <span className="block text-sm font-medium text-cream">{item.label}</span>
                  <span className="mt-1 block text-xs text-cream/60">{item.desc}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 font-heading text-base font-semibold text-cream">Mục đích</h3>
        <ul className="space-y-2.5">
          {PURPOSES.slice(0, 2).map((p) => (
            <li key={p.title} className="flex items-start gap-2 text-sm text-cream/80">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-jade" aria-hidden="true" />
              <span>{p.title}</span>
            </li>
          ))}
          <li className="rounded-md border border-gold/10 bg-ink/30 p-3">
            <label className="flex cursor-pointer items-start gap-3">
              <Checkbox className="mt-1" {...register('improve_optin')} />
              <span className="text-sm text-cream/80">
                Cải thiện chất lượng dịch vụ
                <span className="ml-1 text-xs text-cream/50">(tùy chọn — bạn có thể bỏ chọn)</span>
              </span>
            </label>
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-3 border-t border-gold/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-cream/55">
          Bạn có thể yêu cầu xóa toàn bộ dữ liệu cá nhân bất cứ lúc nào.
        </p>
        <Button type="submit" size="lg" disabled={!allChecked || isSubmitting}>
          Tiếp tục
        </Button>
      </div>
    </form>
  );
}
