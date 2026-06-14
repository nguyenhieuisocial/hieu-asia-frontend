'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Input,
  Label,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Slider,
  Switch,
  toast,
} from '@hieu-asia/ui';
import { Info } from 'lucide-react';
import {
  birthDataSchema,
  birthDateIssueMessage,
  validateBirthDate,
  VN_PROVINCES,
  type BirthDataValues,
} from '@/lib/birth-data-schema';
import { createReading, getOrCreateAnonUserId, type BirthData } from '@hieu-asia/supabase';
import { logAuditEvent } from '@/lib/account-history';
import { track } from '@/lib/analytics';

const CONFIDENCE_LABELS = ['Đoán', 'Không chắc', 'Tương đối', 'Khá chắc', 'Chính xác'];

/**
 * Saved chart profile key — written by `/account → MyChartTab` and by this
 * form on successful submit. Wave 55 BUG-B: read it on mount so users who
 * already entered birth data don't have to re-type at `/reading/new`.
 *
 * Same key + shape are consumed by `/decisions/new` (see `readBirthInputs`)
 * — keep changes in sync if the schema evolves.
 */
const CHART_PROFILE_KEY = 'hieu:chart:profile:v1';

type Gender = BirthDataValues['gender'];
const GENDERS: readonly Gender[] = ['nam', 'nữ', 'khác', 'không nói'];

interface SavedChartDefaults {
  display_name: string;
  birth_date: string;
  birth_time: string;
  unknown_birth_time: boolean;
  birth_place: string;
  gender?: Gender;
}

/**
 * Read the saved chart profile from localStorage and map it onto the
 * `BirthDataValues` shape used by this form. Returns null if nothing
 * usable is stored (no birth_date — the only field the form requires
 * before any other interaction can occur).
 */
function readSavedDefaults(): SavedChartDefaults | null {
  if (typeof window === 'undefined') return null;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(CHART_PROFILE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
  const birth_date = typeof obj.birth_date === 'string' ? obj.birth_date : '';
  if (!birth_date) return null;
  const display_name = typeof obj.full_name === 'string' ? obj.full_name : '';
  const birth_time = typeof obj.birth_time === 'string' ? obj.birth_time : '';
  const birth_place = typeof obj.birth_place === 'string' ? obj.birth_place : '';
  const rawGender = typeof obj.gender === 'string' ? obj.gender : '';
  const gender = (GENDERS as readonly string[]).includes(rawGender)
    ? (rawGender as Gender)
    : undefined;
  return {
    display_name,
    birth_date,
    birth_time,
    unknown_birth_time: !birth_time,
    birth_place,
    gender,
  };
}

function buildBirthData(values: BirthDataValues): BirthData {
  let birthTime = values.unknown_birth_time ? null : values.birth_time || null;
  if (birthTime && birthTime.length > 5) {
    birthTime = birthTime.slice(0, 5); // Slice "HH:MM:SS" -> "HH:MM"
  }
  return {
    birth_date: values.birth_date,
    birth_time: birthTime,
    birth_place: values.birth_place,
    gender: values.gender ?? null,
    display_name: values.display_name || null,
    calendar: values.calendar,
    timezone: 'Asia/Ho_Chi_Minh',
    time_confidence: values.unknown_birth_time ? 1 : values.time_confidence,
  };
}

export function BirthDataForm() {
  const router = useRouter();
  const [consented, setConsented] = React.useState(false);
  const [improveOptIn, setImproveOptIn] = React.useState(false);
  const [prefilled, setPrefilled] = React.useState(false);
  const [consentError, setConsentError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasConsent = window.sessionStorage.getItem('hieu.consent');
      const hasWizard = window.localStorage.getItem('hieu:onboarding:v2');
      if (hasConsent || hasWizard) {
        setConsented(true);
        if (hasConsent) {
          try {
            const parsed = JSON.parse(hasConsent);
            if (parsed.purposes?.includes('quality_improvement')) {
              setImproveOptIn(true);
            }
          } catch {}
        } else if (hasWizard) {
          try {
            const parsed = JSON.parse(hasWizard);
            if (parsed.consent?.training) {
              setImproveOptIn(true);
            }
          } catch {}
        }
      }
    }
  }, []);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BirthDataValues>({
    resolver: zodResolver(birthDataSchema),
    // Wave 60.95.i P2 — `onTouched` keeps the first hint at blur but then
    // re-validates on each keystroke so errors clear the moment the user
    // fixes them (was `onBlur`, which waited for the next blur).
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      display_name: '',
      birth_date: '',
      birth_time: '',
      unknown_birth_time: false,
      birth_place: '',
      gender: undefined,
      calendar: 'duong',
      time_confidence: 3,
    },
  });

  // Wave 55 BUG-B: pre-fill from saved chart profile (set by /account →
  // MyChartTab) so returning users don't re-enter name/dob/time/gender.
  // Only the common fields are seeded — calendar + time_confidence keep
  // their schema defaults. We guard with a one-shot ref so HMR / strict
  // mode double-mounts don't overwrite user edits.
  const hydratedRef = React.useRef(false);
  React.useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const saved = readSavedDefaults();
    if (!saved) return;
    reset({
      display_name: saved.display_name,
      birth_date: saved.birth_date,
      birth_time: saved.birth_time,
      unknown_birth_time: saved.unknown_birth_time,
      birth_place: saved.birth_place,
      gender: saved.gender,
      calendar: 'duong',
      time_confidence: 3,
    });
    setPrefilled(true);
  }, [reset]);

  const unknownTime = watch('unknown_birth_time');
  const birthTime = watch('birth_time');
  const birthDateRaw = watch('birth_date');
  const calendar = watch('calendar');
  const showConfidence = !unknownTime && birthTime && birthTime.length > 0;

  // Wave 60.95.i P2 — live (debounced ~300ms) sanity check on birth_date.
  // Surfaces issues *before* blur so users catch typos (e.g. 1899, Feb 30,
  // tomorrow's date) as they finish typing. The same rules run again at
  // submit-time inside the Zod schema, so this is purely UX sugar.
  const [liveDateIssue, setLiveDateIssue] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!birthDateRaw) {
      setLiveDateIssue(null);
      return;
    }
    const t = setTimeout(() => {
      const issue = validateBirthDate(birthDateRaw);
      // Hide the "format" issue while typing — `<input type="date">` only
      // emits well-formed strings anyway, and intermediate states would
      // flash noise. Real errors (future, leap-day, year<1900) still show.
      setLiveDateIssue(issue && issue.code !== 'format' ? birthDateIssueMessage(issue) : null);
    }, 300);
    return () => clearTimeout(t);
  }, [birthDateRaw]);

  const onSubmit = handleSubmit(async (values) => {
    if (!consented) {
      setConsentError('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật để tiếp tục.');
      const consentCard = document.getElementById('consent-container');
      if (consentCard) {
        consentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setConsentError(null);
    const consentTimestamp = new Date().toISOString();
    const userId = getOrCreateAnonUserId();

    const purposes = [
      'personalized_reading',
      'mentor_chat',
      ...(improveOptIn ? ['quality_improvement'] : []),
    ];

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(
        'hieu.consent',
        JSON.stringify({ accepted: true, accepted_at: consentTimestamp, version: 'v2.0', purposes }),
      );
    }

    try {
      // Actor forced server-side by /api/audit/log; no client user_id sent.
      await logAuditEvent({
        action: 'consent_accepted',
        audit_metadata: { boxes: 1, version: 'v2.0', purposes, accepted_at: consentTimestamp },
      });
    } catch (e) {
      console.warn('audit log failed:', e);
    }

    track('consent_given', { purposes_count: purposes.length, improve_optin: !!improveOptIn });

    let res: Awaited<ReturnType<typeof createReading>>;
    try {
      res = await createReading(userId, buildBirthData(values));
    } catch (err) {
      // #295 HIEU-ASIA-WORKER-5 — when the user navigates away before
      // createReading resolves, Next.js cancels the in-flight fetch and the
      // promise rejects with an AbortError. That's intentional — swallow it
      // so it doesn't bubble to window.onunhandledrejection / Sentry.
      if ((err as Error)?.name === 'AbortError') return;
      toast.error('Có lỗi xảy ra khi khởi tạo lá số. Vui lòng kiểm tra kết nối và thử lại.');
      throw err;
    }
    // Wave 60.77 — secondary metric for PostHog experiment 373562
    // (upsell banner). Fired once per reading-session row creation, after
    // the Edge function returns a session_id.
    track('reading_session_created', {
      session_id: res.session_id,
      source: 'onboarding',
    });

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(
        'hieu.reading.session',
        JSON.stringify({
          task_id: res.task_id,
          session_id: res.session_id,
          status: 'queued',
          consent_timestamp: consentTimestamp,
          consent_version: 'v2.0',
        }),
      );
      // Wave 30 W-D — persist birth inputs to the chart-hydration key so
      // /decisions/new and /account → MyChartTab can cast a chart without
      // asking the user again. Shape matches `ChartProfile` in MyChartTab.
      try {
        window.localStorage.setItem(
          'hieu:chart:profile:v1',
          JSON.stringify({
            full_name: values.display_name || '',
            gender: values.gender ?? '',
            birth_date: values.birth_date,
            birth_time: values.unknown_birth_time ? '' : values.birth_time || '',
            birth_place: values.birth_place,
            updated_at: consentTimestamp,
          }),
        );
      } catch {
        /* quota — best effort */
      }
    }
    // Skip the palm-upload + personality-survey steps: orchestration already
    // kicked off at createReading() using birth data, and those two inputs are
    // NOT consumed by the report pipeline — collecting them was pure friction
    // (and implied an analysis that doesn't happen). Go straight to processing.
    // (/upload + /survey pages remain in the repo for a future wire-through.)
    router.push(`/reading/${res.session_id}/processing`);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      {Object.keys(errors).length > 0 && (
        <div className="rounded-md border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
          <p className="font-semibold mb-2">Vui lòng kiểm tra lại các thông tin sau:</p>
          <ul className="list-disc list-inside space-y-1">
            {errors.display_name && <li>Họ tên: {errors.display_name.message}</li>}
            {errors.birth_date && <li>Ngày sinh: {errors.birth_date.message}</li>}
            {errors.birth_time && <li>Giờ sinh: {errors.birth_time.message}</li>}
            {errors.birth_place && <li>Nơi sinh: {errors.birth_place.message}</li>}
            {errors.gender && <li>Giới tính: {errors.gender.message}</li>}
          </ul>
        </div>
      )}

      {prefilled && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-md border border-gold/30 bg-gold/5 p-3 text-xs text-foreground/85"
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
          <p className="leading-relaxed">
            Đã dùng thông tin từ trang{' '}
            <Link href="/account/chart" className="text-gold underline hover:text-gold/80">
              Tài khoản
            </Link>{' '}
            — sửa nếu cần.
          </p>
        </div>
      )}

      {/* Display name */}
      <Field
        id="display_name"
        label="Họ tên / biệt danh"
        hint="Tùy chọn. Hiển thị trong báo cáo và phiên Mentor."
        error={errors.display_name?.message}
      >
        {(ariaProps) => (
          <Input
            placeholder="VD: Anh Hiếu"
            maxLength={100}
            {...ariaProps}
            {...register('display_name')}
          />
        )}
      </Field>

      {/* Birth date */}
      <Field id="birth_date" label="Ngày sinh" required error={errors.birth_date?.message}>
        {(ariaProps) => (
          <>
            <Input
              type="date"
              min="1900-01-01"
              max={new Date().toISOString().slice(0, 10)}
              {...ariaProps}
              {...register('birth_date')}
            />
            {/* Wave 60.95.i P2 — live (debounced 300ms) sanity warning.
                Suppressed when react-hook-form already has a `birth_date`
                error so we don't double-print the same message. */}
            {!errors.birth_date && liveDateIssue && (
              <p
                id="birth_date-live"
                role="alert"
                aria-live="polite"
                className="text-xs text-gold-700"
              >
                {liveDateIssue}
              </p>
            )}
          </>
        )}
      </Field>

      {/* Birth time + unknown toggle */}
      <div className="space-y-3">
        <Field
          id="birth_time"
          label="Giờ sinh"
          hint="Càng chính xác càng tốt — quan trọng cho luận giải vận hạn."
          error={errors.birth_time?.message}
        >
          {(ariaProps) => (
            <>
              <Input
                type="time"
                disabled={unknownTime}
                {...ariaProps}
                {...register('birth_time')}
              />
              {/* Wave 60.95.i P2 — timezone clarification once the user
                  enters a time. Subtle (muted) — never an error. */}
              {!unknownTime && birthTime && birthTime.length > 0 && (
                <p
                  className="text-xs text-muted-foreground"
                  aria-live="polite"
                >
                  Giờ địa phương nơi sinh — không phải giờ hiện tại của bạn.
                </p>
              )}
            </>
          )}
        </Field>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground/80">
          <Checkbox
            {...register('unknown_birth_time', {
              onChange: (e) => {
                if (e.target.checked) setValue('birth_time', '');
              },
            })}
          />
          <span>Không nhớ giờ sinh</span>
        </label>
      </div>

      {/* Time confidence — only when time entered */}
      {showConfidence && (
        <Field
          id="time_confidence"
          label="Mức độ chắc chắn về giờ sinh"
          hint="1 = đoán mò, 5 = chắc chắn từ giấy khai sinh"
        >
          {(ariaProps) => (
            <Controller
              control={control}
              name="time_confidence"
              render={({ field }) => (
                <div>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    ticks={CONFIDENCE_LABELS}
                    aria-labelledby={ariaProps['aria-labelledby']}
                    aria-describedby={ariaProps['aria-describedby']}
                  />
                </div>
              )}
            />
          )}
        </Field>
      )}

      {/* Birth place */}
      <Field id="birth_place" label="Nơi sinh" required error={errors.birth_place?.message}>
        {(ariaProps) => (
          <>
            <Input
              list="vn-provinces"
              placeholder="VD: Hà Nội"
              autoComplete="off"
              {...ariaProps}
              {...register('birth_place')}
            />
            <datalist id="vn-provinces">
              {VN_PROVINCES.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </>
        )}
      </Field>

      {/* Gender */}
      <Field id="gender" label="Giới tính" required error={errors.gender?.message}>
        {(ariaProps) => (
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <RadioGroup
                name="gender"
                value={field.value}
                onValueChange={field.onChange}
                className="grid-cols-2 sm:grid-cols-4"
                aria-labelledby={ariaProps['aria-labelledby']}
                aria-describedby={ariaProps['aria-describedby']}
                aria-required={ariaProps['aria-required']}
                aria-invalid={ariaProps['aria-invalid']}
              >
                {(['nam', 'nữ', 'khác', 'không nói'] as const).map((g) => (
                  <label
                    key={g}
                    className="flex cursor-pointer items-center gap-2 rounded-md border border-gold/15 bg-card/40 px-3 py-2 text-sm capitalize text-foreground/90 hover:border-gold/30 has-[:checked]:border-gold has-[:checked]:bg-gold/10"
                  >
                    <RadioGroupItem value={g} />
                    <span>{g}</span>
                  </label>
                ))}
              </RadioGroup>
            )}
          />
        )}
      </Field>

      {/* Calendar toggle */}
      <Field
        id="calendar"
        label="Loại lịch"
        hint="Mặc định dương lịch. Bật nếu bạn nhập ngày âm."
      >
        {(ariaProps) => (
          <Controller
            control={control}
            name="calendar"
            render={({ field }) => (
              <div
                className="flex items-center gap-3 text-sm text-foreground/80"
                aria-labelledby={ariaProps['aria-labelledby']}
                aria-describedby={ariaProps['aria-describedby']}
              >
                <span className={field.value === 'duong' ? 'text-gold' : ''}>Dương lịch</span>
                <Switch
                  checked={field.value === 'am'}
                  onCheckedChange={(checked) => field.onChange(checked ? 'am' : 'duong')}
                  aria-label="Chuyển đổi giữa dương lịch và âm lịch"
                />
                <span className={field.value === 'am' ? 'text-gold' : ''}>Âm lịch</span>
              </div>
            )}
          />
        )}
      </Field>

      {/* Wave 60.95.i P2 — lunar→solar consistency hint. Subtle (not an
          error) so users picking âm lịch know the chart engine will still
          do the right thing. */}
      {calendar === 'am' && (
        <p className="text-xs text-muted-foreground" role="status" aria-live="polite">
          Sẽ tự động chuyển sang dương lịch khi tính lá số.
        </p>
      )}

      {/* Hint banner */}
      <div className="flex items-start gap-3 rounded-md border border-jade/30 bg-jade/10 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-jade" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-foreground/80">
          Nếu không chắc giờ sinh, hệ thống sẽ đánh dấu độ tin cậy thấp hơn ở phần luận giải vận hạn.
          Bạn vẫn nhận được phân tích tính cách và khuyến nghị hành động đầy đủ.
        </p>
      </div>

      {/* Dynamic Consent Box (Decree 13/2023/NĐ-CP Compliant & CRO Optimized) */}
      <div
        id="consent-container"
        className={`space-y-4 rounded-xl border p-5 backdrop-blur-sm transition-all duration-300 ${
          consentError
            ? 'border-red-500 bg-red-500/5 shadow-md animate-pulse'
            : 'border-gold/20 bg-gold/5 hover:border-gold/30 hover:shadow-md'
        }`}
      >
        <h4 className="font-heading text-sm font-semibold text-gold tracking-wide">
          Quyền riêng tư & Bảo mật dữ liệu
        </h4>
        
        <div className="space-y-3.5">
          {/* Required Consent Checkbox */}
          <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground/85">
            <Checkbox
              checked={consented}
              onChange={(e) => {
                const isChecked = (e.target as HTMLInputElement).checked;
                setConsented(isChecked);
                if (isChecked) setConsentError(null);
              }}
              aria-required="true"
              className="mt-1 border-gold/40 data-[state=checked]:bg-gold data-[state=checked]:text-ink"
            />
            <span className="leading-relaxed">
              Tôi đồng ý cho hieu.asia xử lý ngày sinh, giờ sinh, nơi sinh và thông tin đi kèm để thiết lập lá số và phân tích bản thân của tôi theo{' '}
              <span className="font-medium text-foreground">Nghị định 13/2023/NĐ-CP</span>. Tôi cũng đồng ý với{' '}
              <Link
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline underline-offset-4 hover:text-gold/80"
              >
                Điều khoản dịch vụ
              </Link>{' '}
              và{' '}
              <Link
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline underline-offset-4 hover:text-gold/80"
              >
                Chính sách bảo mật
              </Link>
              . <span className="text-muted-foreground text-xs">(Dữ liệu được mã hoá AES-256, không bán/chia sẻ, dễ dàng rút lại bất kỳ lúc nào tại trang Tài khoản)</span>.
            </span>
          </label>

          {/* Optional Product Improvement Checkbox */}
          <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground/85 border-t border-gold/10 pt-3.5">
            <Checkbox
              checked={improveOptIn}
              onChange={(e) => setImproveOptIn((e.target as HTMLInputElement).checked)}
              className="mt-1 border-gold/20 data-[state=checked]:bg-gold data-[state=checked]:text-ink"
            />
            <span className="leading-relaxed text-foreground/75">
              Cho phép sử dụng dữ liệu{' '}
              <span className="font-medium text-foreground">ẩn danh</span> để cải thiện prompt và chất lượng phân tích của Mentor AI.{' '}
              <span className="text-muted-foreground text-xs">(Tùy chọn — mặc định tắt, không ảnh hưởng tới kết quả của bạn)</span>.
            </span>
          </label>
        </div>
        {consentError && (
          <p className="text-xs font-semibold text-red-400 mt-2" role="alert">
            {consentError}
          </p>
        )}
      </div>

      <div className="flex justify-end border-t border-gold/15 pt-6">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          onClick={() => {
            if (Object.keys(errors).length > 0) {
              toast.error('Vui lòng kiểm tra và điền đầy đủ thông tin bắt buộc.');
            }
          }}
        >
          {isSubmitting ? 'Đang xử lý...' : 'Tiếp tục'}
        </Button>
      </div>
    </form>
  );
}

interface FieldAriaProps {
  id: string;
  'aria-labelledby': string;
  'aria-describedby': string | undefined;
  'aria-required': true | undefined;
  'aria-invalid': true | undefined;
}

function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: (ariaProps: FieldAriaProps) => React.ReactNode;
}) {
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') ||
    undefined;

  const ariaProps: FieldAriaProps = {
    id,
    'aria-labelledby': labelId,
    'aria-describedby': describedBy,
    'aria-required': required ? true : undefined,
    'aria-invalid': error ? true : undefined,
  };

  return (
    <div className="space-y-2">
      <Label id={labelId} htmlFor={id}>
        {label}
        {required && (
          <>
            <span className="ml-1 text-gold" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(bắt buộc)</span>
          </>
        )}
      </Label>
      {children(ariaProps)}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-400/90">
          {error}
        </p>
      )}
    </div>
  );
}
