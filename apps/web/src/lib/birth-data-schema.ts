import { z } from 'zod';

/**
 * Wave 60.95.i P2 — date sanity helpers shared with the inline form-field
 * validator. Kept here so the schema (submit-time) and the live UI hint
 * (onChange-time) apply identical rules.
 */
export const MIN_BIRTH_YEAR = 1900;

/**
 * Parse "YYYY-MM-DD" and return null when the calendar date is impossible
 * (Feb 30, Apr 31, …). Native `Date` quietly rolls over, so we re-stringify
 * and compare to catch silent overflows.
 */
export function parseBirthDate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const [, yStr, moStr, dStr] = m;
  const y = Number(yStr);
  const mo = Number(moStr);
  const d = Number(dStr);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  // UTC to avoid DST drift in the round-trip check.
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== mo - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }
  return dt;
}

export type BirthDateIssue =
  | { code: 'format' }
  | { code: 'invalid_calendar_date' }
  | { code: 'year_too_old'; min: number }
  | { code: 'year_in_future' }
  | { code: 'date_in_future' };

/**
 * Pure validator reused by the live onChange hint in birth-data-form.tsx.
 * Returns null when the date is OK, or an issue code the UI translates.
 */
export function validateBirthDate(value: string): BirthDateIssue | null {
  if (!value) return null; // empty handled by `min(1)` at submit-time
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return { code: 'format' };
  const year = Number(m[1]);
  const today = new Date();
  if (year < MIN_BIRTH_YEAR) {
    return { code: 'year_too_old', min: MIN_BIRTH_YEAR };
  }
  if (year > today.getFullYear()) {
    return { code: 'year_in_future' };
  }
  const parsed = parseBirthDate(value);
  if (!parsed) return { code: 'invalid_calendar_date' };
  // Compare YYYY-MM-DD strings so we ignore the local time component.
  const todayIso = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  )
    .toISOString()
    .slice(0, 10);
  if (parsed.toISOString().slice(0, 10) > todayIso) {
    return { code: 'date_in_future' };
  }
  return null;
}

/**
 * Vietnamese-language renderer for `BirthDateIssue`. Centralised so the
 * inline hint and the Zod resolver emit the same copy.
 */
export function birthDateIssueMessage(issue: BirthDateIssue): string {
  switch (issue.code) {
    case 'format':
      return 'Định dạng phải là YYYY-MM-DD';
    case 'invalid_calendar_date':
      return 'Ngày không tồn tại trong lịch (kiểm tra lại số ngày/tháng)';
    case 'year_too_old':
      return `Năm sinh phải từ ${issue.min} trở đi`;
    case 'year_in_future':
    case 'date_in_future':
      return 'Ngày sinh không thể ở tương lai';
  }
}

/**
 * Zod schema cho Birth Data Form (Screen 3).
 * Khi submit, mapping → `UserContext` (backend Pydantic) tại điểm gọi API.
 *
 * Source of truth: `packages/types/src/api.ts#UserContext`.
 */
export const birthDataSchema = z
  .object({
    display_name: z
      .string()
      .trim()
      .max(100, 'Tối đa 100 ký tự')
      .optional()
      .or(z.literal('')),
    birth_date: z
      .string()
      .min(1, 'Vui lòng nhập ngày sinh')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng phải là YYYY-MM-DD')
      .superRefine((value, ctx) => {
        // Wave 60.95.i P2 — surface the same sanity errors at submit-time
        // that the inline hint shows on change/blur. Skips when the regex
        // above already failed (its message is more actionable).
        const issue = validateBirthDate(value);
        if (issue && issue.code !== 'format') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: birthDateIssueMessage(issue),
          });
        }
      }),
    unknown_birth_time: z.boolean().default(false),
    birth_time: z
      .string()
      .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Định dạng phải là HH:MM')
      .optional()
      .or(z.literal('')),
    birth_place: z
      .string()
      .trim()
      .min(2, 'Vui lòng nhập nơi sinh')
      .max(120, 'Tối đa 120 ký tự'),
    gender: z.enum(['nam', 'nữ', 'khác', 'không nói'], {
      errorMap: () => ({ message: 'Vui lòng chọn' }),
    }),
    calendar: z.enum(['duong', 'am']).default('duong'),
    time_confidence: z.number().int().min(1).max(5).default(3),
  })
  .refine(
    (data) => data.unknown_birth_time || (data.birth_time && data.birth_time.length > 0),
    {
      message: 'Nhập giờ sinh hoặc chọn "Không nhớ giờ sinh"',
      path: ['birth_time'],
    },
  );

export type BirthDataValues = z.infer<typeof birthDataSchema>;

/** Provinces gợi ý cho input nơi sinh (V1 — datalist). */
export const VN_PROVINCES = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Huế',
  'Nha Trang',
  'Vũng Tàu',
  'Đà Lạt',
  'Quy Nhơn',
  'Buôn Ma Thuột',
  'Vinh',
  'Thanh Hóa',
  'Biên Hòa',
  'Bình Dương',
];
