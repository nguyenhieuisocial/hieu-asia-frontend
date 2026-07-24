// Kế thừa ảnh chia sẻ (OG) của cụm cha. Next KHÔNG tự áp metadata-image của cha
// xuống route con một khi trang con tự khai openGraph → trang con sẽ mất
// og:image (hỏng preview FB/Zalo). Re-export = dùng lại đúng thẻ của cụm.
export { default, alt, size, contentType } from '../opengraph-image';
