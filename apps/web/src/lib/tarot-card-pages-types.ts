// Shared between tarot-card-pages.ts (Major Arcana) and tarot-card-pages-minor.ts
// (Minor Arcana) so neither has to import the other — tarot-card-pages.ts
// previously declared this interface AND imported `MINOR_PAGES` from the minor
// file, which imported `type TarotCardPage` back: a type-only circular import
// GitNexus flags as a dependency cycle. Harmless at runtime (erased by TS), but
// easy to break; single source of truth here instead.
export interface TarotCardPage {
  slug: string;
  name: string; // tên tiếng Anh (người Việt tìm kiếm chủ yếu bằng tên này)
  name_vi: string;
  number: number; // Ẩn chính: 0–21 theo RWS · Ẩn phụ: 1–14 (Át → Vua) trong chất
  arcana?: 'major' | 'minor'; // mặc định (không khai) = major
  suit_vi?: string; // Ẩn phụ: Gậy · Cốc · Kiếm · Tiền
  keyUp: string[]; // từ khóa nghĩa xuôi
  keyRev: string[]; // từ khóa nghĩa ngược
  image: string; // hình ảnh biểu tượng trên lá (hệ RWS)
  symbols: string; // biểu tượng chính trên tranh RWS + nghĩa từng biểu tượng (mô tả bằng lời, không dùng hình có ©)
  storyArc: string; // vị trí lá trong mạch bài: Ẩn chính theo 3 chặng Hành trình Gã Khờ · Ẩn phụ theo cốt truyện số/vai court trong chất
  up: string; // nghĩa xuôi — đoạn văn
  rev: string; // nghĩa ngược — đoạn văn (khung "mặt trầm", không phải điềm xấu)
  love: string; // góc tình cảm – quan hệ
  work: string; // góc công việc – tiền bạc
  reflect: string[]; // câu hỏi tự soi
  ease?: string; // lời trấn an cho các lá hay bị hù dọa
}
