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
} from '@hieu-asia/ui';
import { Info } from 'lucide-react';
import { birthDataSchema, VN_PROVINCES, type BirthDataValues } from '@/lib/birth-data-schema';
import { createReading, getOrCreateAnonUserId, type BirthData } from '@hieu-asia/supabase';

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
  return {
    birth_date: values.birth_date,
    birth_time: values.unknown_birth_time ? null : values.birth_time || null,
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
  const [prefilled, setPrefilled] = React.useState(false);
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
    mode: 'onBlur',
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
  const showConfidence = !unknownTime && birthTime && birthTime.length > 0;

  const onSubmit = handleSubmit(async (values) => {
    if (!consented) return;
    const consentTimestamp = new Date().toISOString();
    const userId = getOrCreateAnonUserId();
    const res = await createReading(userId, buildBirthData(values));
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(
        'hieu.reading.session',
        JSON.stringify({
          task_id: res.task_id,
          session_id: res.session_id,
          status: 'queued',
          consent_timestamp: consentTimestamp,
          consent_version: 'v1.0',
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
    router.push(`/reading/${res.session_id}/upload`);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      {prefilled && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-md border border-gold/30 bg-gold/5 p-3 text-xs text-foreground/85"
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
          <p className="leading-relaxed">
            Đã dùng thông tin từ trang{' '}
            <Link href="/account?tab=chart" className="text-gold underline hover:text-gold/80">
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
          <Input type="date" {...ariaProps} {...register('birth_date')} />
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
            <Input
              type="time"
              disabled={unknownTime}
              {...ariaProps}
              {...register('birth_time')}
            />
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

      {/* Hint banner */}
      <div className="flex items-start gap-3 rounded-md border border-jade/30 bg-jade/10 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-jade" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-foreground/80">
          Nếu không chắc giờ sinh, hệ thống sẽ đánh dấu độ tin cậy thấp hơn ở phần luận giải vận hạn.
          Bạn vẫn nhận được phân tích tính cách và khuyến nghị hành động đầy đủ.
        </p>
      </div>

      {/* Consent — required before submit */}
      <div className="rounded-md border border-gold/20 bg-card/40 p-4">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground/85">
          <Checkbox
            checked={consented}
            onChange={(e) => setConsented((e.target as HTMLInputElement).checked)}
            required
            aria-required="true"
          />
          <span className="leading-relaxed">
            Tôi đồng ý với{' '}
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline hover:text-gold/80"
            >
              Chính sách bảo mật
            </Link>{' '}
            và{' '}
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline hover:text-gold/80"
            >
              Điều khoản dịch vụ
            </Link>
            . Tôi hiểu rằng báo cáo có tính chất tham khảo, không thay thế tư vấn chuyên môn.
          </span>
        </label>
      </div>

      <div className="flex justify-end border-t border-gold/15 pt-6">
        <Button type="submit" size="lg" disabled={isSubmitting || !consented}>
          {isSubmitting ? 'Đang xử lý...' : 'Tiếp theo'}
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
