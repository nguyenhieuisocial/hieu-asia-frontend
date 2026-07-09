'use client';

import { clearBirthProfile } from '@/lib/birth-profile';

/**
 * Dòng nhắc nhỏ khi một công cụ tự điền sẵn từ hồ sơ ngày sinh đã lưu — để khách
 * hiểu VÌ SAO ô đã có sẵn + có nút "Xoá" (minh bạch quyền riêng tư). Hiện chỉ khi
 * `show` = true (công cụ thực sự đã tự điền từ hồ sơ).
 */
export function SavedBirthInfoHint({
  show,
  onClear,
}: {
  show: boolean;
  onClear?: () => void;
}) {
  if (!show) return null;
  return (
    <p className="text-xs leading-relaxed text-muted-foreground">
      Đã tự điền từ thông tin bạn nhập trước (lưu trên máy này, không gửi đi đâu).{' '}
      <button
        type="button"
        onClick={() => {
          clearBirthProfile();
          onClear?.();
        }}
        className="text-gold underline underline-offset-2 hover:text-gold/80"
      >
        Xoá
      </button>
    </p>
  );
}
