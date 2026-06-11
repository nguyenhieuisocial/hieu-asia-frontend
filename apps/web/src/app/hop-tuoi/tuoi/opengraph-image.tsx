// Kế thừa ảnh chia sẻ (OG) của cụm cha (/hop-tuoi). Trang /hop-tuoi/tuoi tự khai
// openGraph nên mất ảnh fallback. Re-export = dùng lại đúng thẻ của cụm.
export { default, alt, size, contentType } from '../opengraph-image';
