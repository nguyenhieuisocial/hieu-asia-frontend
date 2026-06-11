// Kế thừa ảnh chia sẻ (OG) của cụm cha (/so-sanh). Trang so sánh /so-sanh/[cap]
// tự khai openGraph nên mất ảnh fallback. Re-export = dùng lại đúng thẻ của cụm.
export { default, alt, size, contentType } from '../opengraph-image';
