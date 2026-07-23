import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { defaultLocale, isLocale, type Locale } from './config';

/**
 * Locale cho next-intl — CHỐT TĨNH CÓ CHỦ ĐÍCH.
 *
 * ⚠️ ĐỌC HẾT TRƯỚC KHI BẬT LẠI RESOLVER ĐỘNG ⚠️
 *
 * `getRequestConfig` chạy khi render MỌI trang. Nếu nó gọi `cookies()` hoặc
 * `headers()`, Next.js đánh dấu TOÀN BỘ trang là dynamic. Hệ quả đo được trên
 * production ngày 2026-07-21:
 *   - Vercel gắn `private, no-cache, no-store` cho mọi response →
 *     `x-vercel-cache: MISS` 100%, KHÔNG có cache CDN, kể cả trang 404.
 *   - Mỗi lượt xem render lại từ đầu tại serverless function ở Mỹ (iad1) trong
 *     khi người dùng ở Việt Nam.
 *   - Next chuyển sang STREAMING METADATA: `description` / `canonical` / `og:*`
 *     rơi xuống ~424KB trong body thay vì nằm trong `<head>` (đo thật: head kết
 *     thúc ở byte 251.274, description ở 423.806). Scraper Zalo/Facebook/
 *     Telegram chỉ đọc phần đầu tài liệu → share link mất ảnh và mô tả, đúng
 *     các kênh người Việt dùng nhiều nhất.
 *   - Hoá đơn Vercel cao hơn vì không request nào được cache.
 *   - Số đo: 248 route dynamic / 45 static khi resolver đọc cookie.
 *
 * Cái giá đó đang trả cho một tính năng KHÔNG NƠI NÀO DÙNG (kiểm 2026-07-21):
 *   - 0 file gọi `useTranslations` / `getTranslations`
 *   - Không có component đổi ngôn ngữ nào; `localeLabels` chỉ được nhắc trong
 *     chính file config định nghĩa nó
 *   - `messages/vi.json` mới có 34 key (bản nháp)
 * ⇒ Chốt tĩnh không mất gì: không có bản dịch nào đang dùng, và người dùng
 *   cũng không có cách nào đổi ngôn ngữ.
 *
 * KHI NÀO BẬT LẠI: chỉ khi i18n THẬT SỰ được dùng (có switcher + có
 * `useTranslations` trong component). Lúc đó ĐỪNG chỉ đổi lại thành
 * `resolveLocale()` — làm vậy là kéo nguyên vẹn cái giá trên quay lại. Cách
 * đúng là static rendering của next-intl: route có tiền tố locale +
 * `generateStaticParams` + `setRequestLocale`, để mỗi ngôn ngữ vẫn prerender
 * tĩnh được.
 */
export default getRequestConfig(async () => {
  const locale = defaultLocale;
  const messages = (await import(`./messages/${locale}.json`)).default;
  return { locale, messages };
});

/**
 * Resolver theo request — GIỮ LẠI CÓ CHỦ ĐÍCH, hiện KHÔNG gọi khi render.
 * Thứ tự: cookie `NEXT_LOCALE` → `Accept-Language` → defaultLocale.
 *
 * ⚠️ Gọi hàm này trong đường render sẽ làm mọi trang dynamic trở lại. Nếu cần
 * locale động, đọc ở MIDDLEWARE (vốn đã chạy cho mọi request) rồi rewrite sang
 * route có tiền tố locale — middleware không làm trang dynamic.
 */
export async function resolveLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;

  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') ?? '';
  const preferred = acceptLanguage.split(',')[0]?.split('-')[0]?.trim().toLowerCase();
  if (preferred && isLocale(preferred)) return preferred;

  return defaultLocale;
}
