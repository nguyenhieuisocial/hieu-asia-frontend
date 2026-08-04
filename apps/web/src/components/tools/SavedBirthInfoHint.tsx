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
      {/*
        Kiểm 04/08/2026: câu cũ ghi "không gửi đi đâu" — SAI với người đã đăng nhập.
        lib/birth-profile.ts đồng bộ hồ sơ này lên tài khoản qua /api/user/preferences,
        và /privacy + /tra-cuu-tuoi đều đã nói đúng điều đó. Component này không biết
        trạng thái đăng nhập nên câu chữ phải đúng cho CẢ HAI trường hợp — đừng rút
        gọn lại thành "không gửi đi đâu".
      */}
      Đã tự điền từ thông tin bạn nhập trước (lưu trên máy này; nếu bạn đã đăng nhập thì cũng được
      lưu vào tài khoản).{' '}
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
