'use client';

/**
 * Đăng ký service worker cho MỌI người dùng, không chỉ người bật thông báo.
 *
 * VÌ SAO TỒN TẠI: trước đây `/sw.js` chỉ được đăng ký bên trong
 * `components/daily/SubscribePush.tsx`, tức đúng lúc người dùng bấm "bật tử vi
 * mỗi sáng". Ai cài app mà không bật push thì KHÔNG có service worker nào chạy
 * ⇒ mọi thứ SW làm (offline fallback, cache asset) không tới được phần lớn
 * người dùng. Việc xin quyền push vẫn nằm nguyên ở `SubscribePush` — đó là
 * hành động phải do người dùng chủ động bấm; còn việc ĐĂNG KÝ SW thì không cần
 * xin phép ai nên tách ra đây.
 *
 * `SubscribePush` vẫn tự gọi `register()` lần nữa: đăng ký lại cùng một URL +
 * scope là idempotent (trình duyệt trả về registration đang có), nên hai chỗ
 * cùng gọi là an toàn — và giữ nó ở đó thì luồng bật push vẫn đúng kể cả khi
 * component này chưa kịp chạy.
 *
 * CHỈ CHẠY Ở PRODUCTION: ở dev, SW cache asset sẽ phục vụ bản cũ sau mỗi lần
 * sửa code, tạo ra loại bug "sửa rồi mà không thấy đổi" cực tốn thời gian.
 */

import * as React from 'react';

export function ServiceWorkerRegistrar() {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

    // Đợi `load` để không giành băng thông với lần render đầu. Nếu trang đã
    // load xong trước khi effect chạy (điều hướng client-side), gọi thẳng.
    const dangKy = () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
        // Nuốt lỗi có chủ đích: SW là lớp tăng cường. Chặn đăng ký (chế độ
        // riêng tư, chính sách doanh nghiệp, storage đầy) KHÔNG được phép làm
        // hỏng trang. Không có gì để người dùng làm nên cũng không báo gì.
      });
    };

    if (document.readyState === 'complete') {
      dangKy();
      return;
    }

    window.addEventListener('load', dangKy, { once: true });
    return () => window.removeEventListener('load', dangKy);
  }, []);

  return null;
}
