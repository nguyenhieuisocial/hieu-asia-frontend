'use client';

/**
 * /onboarding-wizard — Wave 58 mandatory onboarding (4 steps).
 *
 * See README.md in this folder for the integration TODOs (most importantly
 * the /auth/callback redirect that gates first reading on completion).
 *
 * Steps:
 *   1. Full name + gender
 *   2. Birth date (year/month/day) + optional birth hour
 *   3. Phone (+84) + Zalo opt-in
 *   4. Granular marketing consent
 *
 * On success: PATCH hieu_asia.users via /api/onboarding/complete, PostHog
 * identify, then redirect to ?next= or /reading/new.
 */

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
} from '@hieu-asia/ui';
import { useAuth } from '@/hooks/use-auth';
import { getSupabaseAuth } from '@/lib/auth-client';
import { getPostHog } from '@/lib/posthog';

type Gender = 'M' | 'F' | 'NB';

interface WizardState {
  // Step 1
  full_name: string;
  gender: Gender | '';
  // Step 2
  birth_year: string;
  birth_month: string;
  birth_day: string;
  birth_hour: string;
  birth_hour_unknown: boolean;
  // Step 3
  phone: string;
  sms_anniversary: boolean;
  zalo_optin: boolean;
  // Step 4
  email_tips: boolean;
  meta_retargeting: boolean;
  google_retargeting: boolean;
  zalo_oa_broadcast: boolean;
}

const INITIAL: WizardState = {
  full_name: '',
  gender: '',
  birth_year: '',
  birth_month: '',
  birth_day: '',
  birth_hour: '',
  birth_hour_unknown: false,
  phone: '',
  sms_anniversary: true,
  zalo_optin: true,
  email_tips: true,
  meta_retargeting: false,
  google_retargeting: false,
  zalo_oa_broadcast: true,
};

const TOTAL_STEPS = 4;

export default function OnboardingWizardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [step, setStep] = React.useState(1);
  const [state, setState] = React.useState<WizardState>(INITIAL);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  // Gate: must be signed in. Bounce to /signin?next=/onboarding-wizard.
  React.useEffect(() => {
    if (!authLoading && !user) {
      const next = encodeURIComponent('/onboarding-wizard');
      router.replace(`/signin?next=${next}`);
    }
  }, [authLoading, user, router]);

  function update<K extends keyof WizardState>(key: K, value: WizardState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function validateStep(s: number): string | null {
    if (s === 1) {
      if (!state.full_name.trim()) return 'Vui lòng nhập họ tên.';
      if (!state.gender) return 'Vui lòng chọn giới tính.';
      return null;
    }
    if (s === 2) {
      const y = Number(state.birth_year);
      const m = Number(state.birth_month);
      const d = Number(state.birth_day);
      if (!Number.isInteger(y) || y < 1900 || y > 2100) {
        return 'Năm sinh phải từ 1900-2100.';
      }
      if (!Number.isInteger(m) || m < 1 || m > 12) {
        return 'Tháng sinh phải từ 1-12.';
      }
      if (!Number.isInteger(d) || d < 1 || d > 31) {
        return 'Ngày sinh phải từ 1-31.';
      }
      if (!state.birth_hour_unknown) {
        const h = Number(state.birth_hour);
        if (!Number.isInteger(h) || h < 0 || h > 23) {
          return 'Giờ sinh phải từ 0-23, hoặc đánh dấu "Tôi không nhớ giờ sinh".';
        }
      }
      return null;
    }
    if (s === 3) {
      // phone is optional
      if (state.phone.trim() && !/^(\+84|0)\d{9}$/.test(state.phone.trim())) {
        return 'Số điện thoại phải đúng định dạng Việt Nam (+84XXXXXXXXX hoặc 0XXXXXXXXX).';
      }
      return null;
    }
    return null;
  }

  function onNext() {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }

  function onBack() {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  }

  async function onSubmit() {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setSubmitting(true);

    const supabase = getSupabaseAuth();
    const sessionRes = supabase ? await supabase.auth.getSession() : null;
    const token = sessionRes?.data.session?.access_token;
    if (!token) {
      setSubmitting(false);
      setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      return;
    }

    const payload = {
      full_name: state.full_name.trim(),
      gender: state.gender as Gender,
      birth_year: Number(state.birth_year),
      birth_month: Number(state.birth_month),
      birth_day: Number(state.birth_day),
      birth_hour: state.birth_hour_unknown ? null : Number(state.birth_hour),
      phone: state.phone.trim() || null,
      consent_flags: {
        sms_anniversary: state.sms_anniversary,
        zalo_optin: state.zalo_optin,
        email_tips: state.email_tips,
        meta_retargeting: state.meta_retargeting,
        google_retargeting: state.google_retargeting,
        zalo_oa_broadcast: state.zalo_oa_broadcast,
      },
    };

    try {
      const res = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !body.ok) {
        setSubmitting(false);
        setError(body.error || `Lỗi máy chủ (HTTP ${res.status}).`);
        return;
      }
    } catch (e) {
      setSubmitting(false);
      setError(e instanceof Error ? e.message : 'Lỗi mạng — vui lòng thử lại.');
      return;
    }

    // PostHog identify with onboarding-derived props.
    try {
      const ph = getPostHog();
      if (ph && user) {
        ph.identify(user.id, {
          full_name: payload.full_name,
          gender: payload.gender,
          birth_year: payload.birth_year,
          has_phone: payload.phone !== null,
          has_marketing_consent_email: payload.consent_flags.email_tips,
          has_marketing_consent_meta: payload.consent_flags.meta_retargeting,
          has_marketing_consent_google: payload.consent_flags.google_retargeting,
          has_marketing_consent_zalo: payload.consent_flags.zalo_oa_broadcast,
        });
      }
    } catch {
      /* ignore — analytics is best-effort */
    }

    const nextParam = searchParams.get('next');
    const dest = nextParam && nextParam.startsWith('/') ? nextParam : '/reading/new';
    router.replace(dest);
  }

  // Loading / unauthenticated placeholder.
  if (authLoading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p role="status" aria-live="polite" className="font-heading text-gold">
          Đang chuẩn bị…
        </p>
      </main>
    );
  }

  return (
    <main className="relative isolate flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(184,146,61,0.15)_0%,_transparent_55%)]"
      />
      <Card className="w-full max-w-xl border-gold/20 bg-card/80 backdrop-blur">
        <CardHeader>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Bước {step} / {TOTAL_STEPS}
          </p>
          <CardTitle className="font-heading text-2xl">
            <span className="bg-gold-gradient bg-clip-text text-transparent">
              Hoàn tất hồ sơ
            </span>{' '}
            của bạn
          </CardTitle>
          <div
            className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border"
            aria-hidden="true"
          >
            <div
              className="h-full bg-gold transition-all"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {step === 1 && (
            <>
              <div className="space-y-1">
                <Label htmlFor="full_name">Họ và tên</Label>
                <Input
                  id="full_name"
                  required
                  autoFocus
                  value={state.full_name}
                  onChange={(e) => update('full_name', e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="min-h-[44px]"
                  maxLength={120}
                />
              </div>

              <div className="space-y-2">
                <Label>Giới tính</Label>
                <RadioGroup
                  name="gender"
                  value={state.gender}
                  onValueChange={(v) => update('gender', v as Gender)}
                  className="flex gap-4"
                >
                  <label className="flex cursor-pointer items-center gap-2">
                    <RadioGroupItem value="M" id="g-m" />
                    <span>Nam</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <RadioGroupItem value="F" id="g-f" />
                    <span>Nữ</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <RadioGroupItem value="NB" id="g-nb" />
                    <span>Khác / Không xác định</span>
                  </label>
                </RadioGroup>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="birth_year">Năm</Label>
                  <Input
                    id="birth_year"
                    type="number"
                    inputMode="numeric"
                    min={1900}
                    max={2100}
                    value={state.birth_year}
                    onChange={(e) => update('birth_year', e.target.value)}
                    placeholder="1990"
                    className="min-h-[44px]"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="birth_month">Tháng</Label>
                  <Input
                    id="birth_month"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={12}
                    value={state.birth_month}
                    onChange={(e) => update('birth_month', e.target.value)}
                    placeholder="6"
                    className="min-h-[44px]"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="birth_day">Ngày</Label>
                  <Input
                    id="birth_day"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={31}
                    value={state.birth_day}
                    onChange={(e) => update('birth_day', e.target.value)}
                    placeholder="15"
                    className="min-h-[44px]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="birth_hour">Giờ sinh (0-23)</Label>
                <Input
                  id="birth_hour"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={23}
                  value={state.birth_hour}
                  onChange={(e) => update('birth_hour', e.target.value)}
                  placeholder="14"
                  disabled={state.birth_hour_unknown}
                  className="min-h-[44px]"
                />
                <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    checked={state.birth_hour_unknown}
                    onChange={(e) => {
                      const v = e.target.checked;
                      update('birth_hour_unknown', v);
                      if (v) update('birth_hour', '');
                    }}
                  />
                  <span>Tôi không nhớ giờ sinh</span>
                </label>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-1">
                <Label htmlFor="phone">Số điện thoại (tùy chọn)</Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  value={state.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+84901234567 hoặc 0901234567"
                  className="min-h-[44px]"
                />
              </div>
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <Checkbox
                  checked={state.sms_anniversary}
                  onChange={(e) => update('sms_anniversary', e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  Để hieu.asia nhắc lịch lưu niên qua SMS (chỉ vài tin/năm,
                  hoàn toàn miễn phí — có thể tắt bất cứ lúc nào).
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <Checkbox
                  checked={state.zalo_optin}
                  onChange={(e) => update('zalo_optin', e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  Cho phép hieu.asia liên hệ qua Zalo khi có tin tức quan trọng
                  về lá số của bạn.
                </span>
              </label>
            </>
          )}

          {step === 4 && (
            <>
              <p className="text-sm text-muted-foreground">
                Chọn các kênh hieu.asia có thể gửi nội dung. Bạn có thể chỉnh
                lại bất cứ lúc nào trong{' '}
                <span className="text-gold">Cài đặt → Quyền riêng tư</span>.
              </p>
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <Checkbox
                  checked={state.email_tips}
                  onChange={(e) => update('email_tips', e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  Email mẹo & nội dung hữu ích (1-2 lần/tuần).
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <Checkbox
                  checked={state.meta_retargeting}
                  onChange={(e) => update('meta_retargeting', e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  Quảng cáo cá nhân hoá trên Facebook / Instagram (Meta).
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <Checkbox
                  checked={state.google_retargeting}
                  onChange={(e) => update('google_retargeting', e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  Quảng cáo cá nhân hoá trên Google (Search / YouTube).
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <Checkbox
                  checked={state.zalo_oa_broadcast}
                  onChange={(e) => update('zalo_oa_broadcast', e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  Nhận tin broadcast từ Zalo OA hieu.asia.
                </span>
              </label>
            </>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-md border border-rose-500/40 bg-rose-950/30 p-3 text-sm text-rose-200"
            >
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={step === 1 || submitting}
            >
              Quay lại
            </Button>
            {step < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={onNext}
                disabled={submitting}
                className="bg-gold text-ink hover:bg-gold/90"
              >
                Tiếp tục
              </Button>
            ) : (
              <Button
                type="button"
                onClick={onSubmit}
                disabled={submitting}
                className="bg-gold text-ink hover:bg-gold/90"
              >
                {submitting ? 'Đang lưu…' : 'Hoàn tất'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
