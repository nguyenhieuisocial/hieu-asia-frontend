// Lộ trình học gợi ý cho khu /learn.
//
// 5 lộ trình phủ ĐÚNG 18 chủ đề, mỗi chủ đề thuộc đúng MỘT lộ trình — nhờ vậy
// "bài trước / bài tiếp theo" của một chủ đề là đơn trị (không phải đoán người
// học đang đi lộ trình nào). Ràng buộc này có test canh (paths.test.ts); thêm
// chủ đề mới thì phải xếp nó vào một lộ trình, test đỏ nếu quên.
//
// Thứ tự bài trong mỗi lộ trình là thứ tự SƯ PHẠM (dễ → khó, nền → nâng cao),
// không phải thứ tự phổ biến. Giọng tagline giữ đúng định vị trung thực của
// /learn: tâm lý học ≠ huyền học, đọc để phản tư chứ không phán định.

export interface LearnPath {
  /** id ổn định (dùng cho analytics + key React). */
  id: string;
  /** tên hiển thị. */
  name: string;
  /** một câu định vị trung thực cho lộ trình. */
  tagline: string;
  /** slug các chủ đề /learn theo thứ tự học. */
  slugs: readonly string[];
}

export const LEARN_PATHS: readonly LearnPath[] = [
  {
    id: 'tam-ly-hien-dai',
    name: 'Tâm lý hiện đại',
    tagline:
      'Bốn mô hình bảng hỏi: bắt đầu từ MBTI quen thuộc, đối chiếu Big Five chuẩn học thuật, rồi DISC và Enneagram.',
    slugs: ['mbti', 'big-five', 'disc', 'enneagram'],
  },
  {
    id: 'dong-phuong-can-ban',
    name: 'Đông phương căn bản',
    tagline:
      'Từ 12 con giáp quen thuộc tới lá số Tử Vi — nền can chi, ngũ hành xây dần từng bài.',
    slugs: ['con-giap', 'hop-tuoi', 'bat-tu', 'tu-vi', 'sao-han'],
  },
  {
    id: 'ung-dung-doi-song',
    name: 'Ứng dụng đời sống',
    tagline: 'Phần "dùng được ngay" của ngũ hành: xem hướng, chọn ngày, đặt tên.',
    slugs: ['phong-thuy', 'trach-cat', 'dat-ten-ngu-hanh'],
  },
  {
    id: 'soi-chieu-phan-tu',
    name: 'Soi chiếu & phản tư',
    tagline:
      'Công cụ đặt câu hỏi cho chính mình — đọc để phản tư, không phải để tiên tri.',
    slugs: ['than-so-hoc', 'chiem-tinh', 'tarot', 'kinh-dich'],
  },
  {
    id: 'tuong-hoc-dan-gian',
    name: 'Tướng học dân gian',
    tagline: 'Chỉ tay và cân xương — đọc như tập tục quan sát lâu đời, biết rõ giới hạn.',
    slugs: ['palm', 'can-xuong'],
  },
];

export interface TopicPathPosition {
  path: LearnPath;
  /** vị trí 0-based của chủ đề trong lộ trình. */
  index: number;
  prevSlug: string | null;
  nextSlug: string | null;
}

// Map slug → vị trí, dựng một lần lúc load module (18 phần tử, không đáng kể).
const POSITION_BY_SLUG: ReadonlyMap<string, TopicPathPosition> = new Map(
  LEARN_PATHS.flatMap((path) =>
    path.slugs.map((slug, index) => [
      slug,
      {
        path,
        index,
        prevSlug: path.slugs[index - 1] ?? null,
        nextSlug: path.slugs[index + 1] ?? null,
      } satisfies TopicPathPosition,
    ]),
  ),
);

/** Vị trí của một chủ đề trong lộ trình của nó; null nếu slug lạ. */
export function pathForTopic(slug: string): TopicPathPosition | null {
  return POSITION_BY_SLUG.get(slug) ?? null;
}
