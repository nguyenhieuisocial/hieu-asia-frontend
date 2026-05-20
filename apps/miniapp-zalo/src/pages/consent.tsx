import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Checkbox, Label } from '@hieu-asia/ui';
import { ZaloHeader } from '../components/zalo-header';
import { ZaloBottomCta } from '../components/zalo-bottom-cta';

const PURPOSES = [
  { id: 'birth', label: 'Ngày giờ sinh', required: true },
  { id: 'palm', label: 'Ảnh bàn tay', required: true },
  { id: 'survey', label: 'Câu trả lời khảo sát', required: true },
  { id: 'context', label: 'Bối cảnh nghề nghiệp / mối quan tâm', required: false },
];

export function ConsentPage() {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState<Record<string, boolean>>({
    birth: true,
    palm: true,
    survey: true,
    context: false,
  });

  const allRequiredOk = PURPOSES.filter((p) => p.required).every((p) => accepted[p.id]);

  const onContinue = () => {
    const payload = {
      accepted: true as const,
      accepted_at: new Date().toISOString(),
      version: 'v1.0',
      purposes: PURPOSES.filter((p) => accepted[p.id]).map((p) => p.id),
    };
    window.sessionStorage.setItem('hieu.consent', JSON.stringify(payload));
    navigate('/reading/new');
  };

  return (
    <main className="min-h-screen bg-ink-radial pb-24">
      <ZaloHeader title="Trước khi bắt đầu" step="Bước 1 / 4" backTo="/" />
      <section className="px-4 pt-5">
        <Card>
          <CardHeader>
            <CardTitle>Đồng ý xử lý dữ liệu</CardTitle>
            <CardDescription>
              Hệ thống xử lý các dữ liệu sau để tạo báo cáo cá nhân hóa. Bạn có thể rút lại đồng ý
              bất cứ lúc nào trong phần Cài đặt.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {PURPOSES.map((p) => (
              <label
                key={p.id}
                htmlFor={`consent-${p.id}`}
                className="flex items-start gap-3 rounded-md border border-gold/10 bg-ink/40 p-3"
              >
                <Checkbox
                  id={`consent-${p.id}`}
                  checked={accepted[p.id] ?? false}
                  onChange={(e) =>
                    setAccepted((prev) => ({ ...prev, [p.id]: e.target.checked }))
                  }
                />
                <div>
                  <Label htmlFor={`consent-${p.id}`} className="text-sm text-cream">
                    {p.label}
                  </Label>
                  {p.required ? (
                    <p className="text-[11px] text-gold/70">Bắt buộc</p>
                  ) : (
                    <p className="text-[11px] text-cream/45">Tuỳ chọn</p>
                  )}
                </div>
              </label>
            ))}
          </CardContent>
        </Card>
      </section>

      <ZaloBottomCta onClick={onContinue} disabled={!allRequiredOk}>
        Đồng ý &amp; Tiếp tục
      </ZaloBottomCta>
    </main>
  );
}
