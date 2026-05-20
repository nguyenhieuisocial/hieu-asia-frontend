'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, ConsentCheckboxList, type ConsentItem } from '@hieu-asia/ui';
import { TgMainButton } from '@/components/tg-main-button';
import { TgBackButton } from '@/components/tg-back-button';

const ITEMS: ConsentItem[] = [
  { id: 'birth_data', label: 'Ngày giờ sinh', purpose: 'Dựng lá số + mốc luận giải vận hạn.' },
  { id: 'palm_image', label: 'Ảnh bàn tay', purpose: 'Vision AI phân tích đường chỉ tay.' },
  { id: 'survey', label: 'Câu trả lời khảo sát', purpose: 'Hiểu cách bạn quyết định và phản ứng.' },
  { id: 'context', label: 'Bối cảnh nghề nghiệp', purpose: 'Cá nhân hoá khuyến nghị 30-60-90 ngày.' },
];

export default function ConsentPage() {
  const router = useRouter();
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const allChecked = ITEMS.every((i) => checked[i.id]);

  const onSubmit = () => {
    if (!allChecked) return;
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(
        'hieu.consent',
        JSON.stringify({
          accepted: true,
          accepted_at: new Date().toISOString(),
          version: 'v1.0',
          purposes: ['personalized_reading', 'mentor_chat'],
        }),
      );
    }
    router.push('/reading/new');
  };

  return (
    <main className="min-h-screen px-4 pb-32 pt-3">
      <TgBackButton />

      <div className="mx-auto max-w-md pt-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold/80">Bước 1 / 4</p>
        <h1 className="mt-1 font-heading text-xl font-semibold text-cream">Đồng ý xử lý dữ liệu</h1>
        <p className="mt-2 text-sm text-cream/70">
          Vui lòng xem từng mục và đồng ý. Bạn có quyền rút lại bất cứ lúc nào.
        </p>

        <Card className="mt-5">
          <CardHeader>
            <CardTitle className="text-base">Hệ thống sẽ xử lý</CardTitle>
            <CardDescription>Mã hoá khi lưu, không bán cho bên thứ ba.</CardDescription>
          </CardHeader>
          <CardContent>
            <ConsentCheckboxList items={ITEMS} onChange={setChecked} />
          </CardContent>
        </Card>
      </div>

      <TgMainButton text="Tiếp tục" onClick={onSubmit} disabled={!allChecked} />
    </main>
  );
}
