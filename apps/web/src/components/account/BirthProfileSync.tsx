'use client';

/**
 * BirthProfileSync — nối "hồ sơ ngày sinh dùng chung" với TÀI KHOẢN.
 *
 * Không render gì. Mount 1 lần ở layout gốc.
 *
 * ⚠️ RANH GIỚI QUYỀN RIÊNG TƯ (đọc kỹ trước khi sửa):
 *   Component này **KHÔNG làm gì cả** khi chưa đăng nhập — không fetch, không
 *   gửi byte nào. Đó là điều giữ đúng cam kết "tính ngay trong trình duyệt" trên
 *   các trang tra cứu miễn phí. Mọi thay đổi ở đây phải soi lại:
 *     • `lib/birth-profile.ts` (khối ghi chú ranh giới)
 *     • câu Hỏi–Đáp ở `app/tra-cuu-tuoi/page.tsx`
 *     • `/privacy` (mục dữ liệu thu thập)
 *   Lệch một trong ba = nói sai với khách.
 *
 * Vòng đời:
 *   1. Đăng nhập xong → hoà giải máy ↔ tài khoản đúng MỘT lần (bản mới hơn thắng).
 *   2. Sau đó, mỗi lần hồ sơ đổi (CustomEvent `hieu:birth-profile-change`) →
 *      đẩy lên tài khoản, có gom nhịp (debounce) để gõ liên tục không spam API.
 */

import * as React from 'react';
import { useAuth } from '@/hooks/use-auth';
import {
  BIRTH_PROFILE_EVENT,
  pushBirthProfileToAccount,
  reconcileBirthProfileWithAccount,
  type BirthProfile,
} from '@/lib/birth-profile';

const PUSH_DEBOUNCE_MS = 1200;

export function BirthProfileSync() {
  const { user, loading } = useAuth();
  const userId = user?.id ?? null;
  const reconciledFor = React.useRef<string | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // (1) Hoà giải một lần cho mỗi tài khoản.
  React.useEffect(() => {
    if (loading || !userId) return;
    if (reconciledFor.current === userId) return;
    reconciledFor.current = userId;
    void reconcileBirthProfileWithAccount();
  }, [loading, userId]);

  // (2) Hồ sơ đổi → đẩy lên (chỉ khi đã đăng nhập).
  React.useEffect(() => {
    if (!userId) return;
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<BirthProfile>).detail;
      if (!detail || typeof detail !== 'object') return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void pushBirthProfileToAccount(detail), PUSH_DEBOUNCE_MS);
    };
    window.addEventListener(BIRTH_PROFILE_EVENT, onChange);
    return () => {
      window.removeEventListener(BIRTH_PROFILE_EVENT, onChange);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [userId]);

  return null;
}
