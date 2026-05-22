import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Checkbox, Label } from '@hieu-asia/ui';
import { Check } from 'lucide-react';
import { getUserInfo } from 'zmp-sdk/apis';
import { ZaloHeader } from '../components/zalo-header';
import { ZaloBottomCta } from '../components/zalo-bottom-cta';

// NĐ 13/2023 audit endpoint — same Supabase Edge Function as miniapp-telegram.
// Failures are non-blocking: consent UX continues regardless.
async function logConsentAudit(payload: {
  user_id: string;
  audit_metadata: Record<string, unknown>;
}): Promise<void> {
  const url = (import.meta.env.VITE_EDGE_FN_URL as string | undefined)?.replace(/\/$/, '');
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !anon) return; // env not wired in this build — skip silently
  await fetch(`${url}/audit-log`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anon,
      Authorization: `Bearer ${anon}`,
    },
    body: JSON.stringify({
      user_id: payload.user_id,
      action: 'consent_accepted',
      audit_metadata: payload.audit_metadata,
    }),
  });
}

// Wave 16 standard: 1 mandatory (birth_data) + 1 optional (improve_optin).
// Palm / khảo sát quyền sẽ hỏi sau, chỉ khi user dùng đến.
const USE_CASES = [
  'Tạo báo cáo phân tích cá nhân hoá',
  'Duy trì phiên chat Mentor AI',
];

export function ConsentPage() {
  const navigate = useNavigate();
  const [birthData, setBirthData] = useState(false);
  const [improveOptin, setImproveOptin] = useState(false);

  const onContinue = async () => {
    const acceptedAt = new Date().toISOString();
    const optionalPurposes = improveOptin ? ['quality_improvement'] : [];
    const purposes = ['personalized_reading', 'mentor_chat', ...optionalPurposes];
    window.sessionStorage.setItem(
      'hieu.consent',
      JSON.stringify({ accepted: true, accepted_at: acceptedAt, version: 'v2.0', purposes }),
    );
    try {
      let zaloUserId = '';
      try {
        const info = await getUserInfo({ avatarType: 'normal' });
        zaloUserId = info.userInfo?.id ?? '';
      } catch {
        // Outside official Zalo client (dev / unauthorized) — log anonymously.
      }
      await logConsentAudit({
        user_id: zaloUserId,
        audit_metadata: {
          source: 'zalo-miniapp',
          surface: 'miniapp-zalo',
          version: 'v2.0',
          purposes,
          mandatory_purposes: ['birth_data'],
          optional_purposes: optionalPurposes,
          zalo_user_id: zaloUserId,
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          timestamp_iso: acceptedAt,
        },
      });
    } catch (e) {
      console.warn('[consent] audit log failed:', e);
    }
    navigate('/reading/new');
  };

  return (
    <main className="min-h-screen bg-ink-radial pb-24">
      <ZaloHeader title="Trước khi bắt đầu" step="Bước 1 / 4" backTo="/" />
      <section className="space-y-4 px-4 pt-5">
        <Card>
          <CardHeader>
            <CardTitle>Mục đích sử dụng dữ liệu</CardTitle>
            <CardDescription>
              Bạn có thể rút lại đồng ý bất cứ lúc nào trong phần Tài khoản.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {USE_CASES.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-cream/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-jade" aria-hidden="true" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] leading-relaxed text-cream/55">
              Các quyền tuỳ chọn khác (ảnh bàn tay, khảo sát, lịch sử Mentor) sẽ hỏi sau, chỉ khi
              bạn dùng đến.
            </p>
          </CardContent>
        </Card>

        <label
          htmlFor="consent-birth"
          className="flex items-start gap-3 rounded-md border border-gold/30 bg-ink/40 p-4"
        >
          <Checkbox
            id="consent-birth"
            checked={birthData}
            onChange={(e) => setBirthData(e.target.checked)}
          />
          <div className="flex-1">
            <Label htmlFor="consent-birth" className="text-sm font-medium text-cream">
              Tôi đồng ý cho hieu.asia xử lý ngày sinh + giờ sinh để tạo lá số
            </Label>
            <p className="mt-1 text-[11px] text-cream/75">
              Theo Nghị định 13/2023/NĐ-CP. Mã hoá AES-256, không bán dữ liệu, có quyền rút lại bất
              cứ lúc nào.
            </p>
          </div>
        </label>

        <label
          htmlFor="consent-improve"
          className="flex items-start gap-3 rounded-md border border-gold/10 bg-ink/30 p-3"
        >
          <Checkbox
            id="consent-improve"
            checked={improveOptin}
            onChange={(e) => setImproveOptin(e.target.checked)}
          />
          <span className="text-sm text-cream/80">
            Cho phép dùng dữ liệu ẨN DANH để cải thiện sản phẩm
            <span className="ml-1 text-[11px] text-cream/55">
              (tuỳ chọn — mặc định TẮT, không ảnh hưởng trải nghiệm)
            </span>
          </span>
        </label>

        <p className="px-1 text-[11px] text-cream/50">
          Bạn có thể yêu cầu xoá toàn bộ dữ liệu cá nhân bất cứ lúc nào.
        </p>
      </section>

      <ZaloBottomCta onClick={onContinue} disabled={!birthData}>
        Đồng ý &amp; Tiếp tục
      </ZaloBottomCta>
    </main>
  );
}
