'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, ConsentCheckboxList, type ConsentItem } from '@hieu-asia/ui';
import { TgMainButton } from '@/components/tg-main-button';
import { TgBackButton } from '@/components/tg-back-button';
import { getOrCreateAnonUserId, logAudit } from '@hieu-asia/supabase';

const REQUIRED_ITEMS: ConsentItem[] = [
  {
    id: 'birth_data',
    label: 'Ngày giờ sinh',
    purpose: 'Dữ liệu duy nhất bắt buộc để dựng lá số. Bạn có thể xoá tài khoản bất cứ lúc nào.',
    required: true,
  },
];

const OPTIONAL_ITEMS: ConsentItem[] = [
  { id: 'palm_image', label: 'Ảnh bàn tay (tuỳ chọn)', purpose: 'Vision AI phân tích đường chỉ tay. Ảnh tự xoá sau 7 ngày.' },
  { id: 'survey', label: 'Câu trả lời khảo sát MBTI (tuỳ chọn)', purpose: 'Đối chiếu MBTI với lá số để chỉ ra điểm trùng và điểm lệch.' },
  { id: 'context', label: 'Bối cảnh nghề nghiệp (tuỳ chọn)', purpose: 'Cá nhân hoá khuyến nghị 30-60-90 ngày.' },
];

export default function ConsentPage() {
  const router = useRouter();
  const [checked, setChecked] = React.useState<Record<string, boolean>>({ birth_data: true });
  // Mandatory item is pre-checked + disabled (see ConsentCheckboxList `required`),
  // so the submit button only depends on it being truthy.
  const canSubmit = checked.birth_data === true;

  const onSubmit = async () => {
    if (!canSubmit) return;
    const acceptedAt = new Date().toISOString();
    const purposes = ['personalized_reading'];
    if (checked.palm_image) purposes.push('palm_image');
    if (checked.survey) purposes.push('mbti_survey');
    if (checked.context) purposes.push('career_context');
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(
        'hieu.consent',
        JSON.stringify({ accepted: true, accepted_at: acceptedAt, version: 'v2.0', purposes }),
      );
    }
    const userId = getOrCreateAnonUserId();
    try {
      await logAudit({
        user_id: userId,
        action: 'consent_accepted',
        audit_metadata: { version: 'v2.0', purposes, accepted_at: acceptedAt, surface: 'miniapp-telegram' },
      });
    } catch (e) {
      console.warn('audit log failed:', e);
    }
    router.push('/reading/new');
  };

  return (
    <main className="min-h-screen px-4 pb-32 pt-3">
      <TgBackButton />

      <div className="mx-auto max-w-md pt-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold/80">Bước 1 / 4</p>
        <h1 className="mt-1 font-heading text-xl font-semibold text-cream">Bạn cho phép xử lý gì?</h1>
        <p className="mt-2 text-sm text-cream/70">
          hieu.asia tách rõ dữ liệu bắt buộc và tuỳ chọn. Bạn có thể đổi lựa chọn bất cứ lúc nào.
        </p>

        <Card className="mt-5">
          <CardHeader>
            <CardTitle className="text-base">Bắt buộc</CardTitle>
            <CardDescription>Dữ liệu duy nhất bắt buộc để tạo lá số.</CardDescription>
          </CardHeader>
          <CardContent>
            <ConsentCheckboxList items={REQUIRED_ITEMS} onChange={(s) => setChecked((p) => ({ ...p, ...s }))} />
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Tuỳ chọn</CardTitle>
            <CardDescription>Bật để mở thêm tính năng. Mặc định tắt.</CardDescription>
          </CardHeader>
          <CardContent>
            <ConsentCheckboxList items={OPTIONAL_ITEMS} onChange={(s) => setChecked((p) => ({ ...p, ...s }))} />
          </CardContent>
        </Card>
      </div>

      <TgMainButton text="Tiếp tục" onClick={onSubmit} disabled={!canSubmit} />
    </main>
  );
}
