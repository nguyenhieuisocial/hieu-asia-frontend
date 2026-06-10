// Kế thừa ảnh chia sẻ (OG) của cụm cha. Next KHÔNG tự áp metadata-image của cha
// xuống route [slug] một khi trang con tự khai openGraph → trang con trước đây
// không có og:image (mất preview FB/Zalo). Re-export = dùng lại đúng thẻ của
// cụm, không trùng lặp nội dung. Mẫu giống xem-ngay/sao-han đã chạy.
export { default, alt, size, contentType } from '../opengraph-image';
