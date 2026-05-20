import { z } from 'zod';

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
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng phải là YYYY-MM-DD'),
    unknown_birth_time: z.boolean().default(false),
    birth_time: z
      .string()
      .regex(/^\d{2}:\d{2}$/, 'Định dạng phải là HH:MM')
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
