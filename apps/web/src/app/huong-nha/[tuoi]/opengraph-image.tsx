// Trang con [tuoi] phải tự khai OG image, nếu không Next KHÔNG kế thừa file OG
// của segment cha xuống đây → og:image = 0 (mất preview FB/Zalo). Re-export ảnh
// của cụm /huong-nha. (Bài học PR #220.)
export { default, alt, size, contentType } from '../opengraph-image';
