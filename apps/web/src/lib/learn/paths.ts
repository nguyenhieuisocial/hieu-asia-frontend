// Lộ trình học gợi ý cho khu /learn.
//
// Các lộ trình phủ ĐÚNG tập LEARN_TOPICS, mỗi chủ đề thuộc đúng MỘT lộ trình — nhờ vậy
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
    slugs: ['than-so-hoc', 'cung-hoang-dao', 'chiem-tinh', 'tarot', 'kinh-dich'],
  },
  {
    id: 'tuong-hoc-dan-gian',
    name: 'Tướng học dân gian',
    tagline: 'Chỉ tay và cân xương — đọc như tập tục quan sát lâu đời, biết rõ giới hạn.',
    slugs: ['palm', 'can-xuong'],
  },
  // Hai lộ trình dưới ra đời cùng đợt 1 của chương trình "mỗi công cụ một bài
  // Học riêng": trước đó cả cụm ngày–giờ và cụm xem tuổi việc lớn đều không có
  // bài nào của riêng mình, người đọc bấm "Học" từ 5 công cụ khác nhau đều rơi
  // vào cùng một bài Trạch Cát.
  {
    id: 'ngay-gio-tot-xau',
    name: 'Ngày giờ tốt xấu',
    tagline:
      'Hiểu cuốn lịch trước đã: lịch âm dương chạy thế nào, rồi mới tới giờ đẹp và ngày kiêng.',
    slugs: ['lich-am-duong', 'gio-hoang-dao', 'ngay-kieng-ky'],
  },
  {
    id: 'xem-tuoi-viec-lon',
    name: 'Xem tuổi việc lớn',
    tagline:
      'Ba hạn tuổi hay bị hỏi nhất khi cưới hỏi và làm nhà — biết cách tính để bớt sợ, không phải để sợ thêm.',
    slugs: ['kim-lau', 'tam-tai', 'hoang-oc'],
  },
  // Đợt 2. `bat-trach` chuyển từ "Ứng dụng đời sống" sang đây: khi đã có đủ 5 bài
  // chuyên sâu thì Bát Trạch là bài MỞ ĐẦU đúng nghĩa của cụm (phải biết cung phi
  // trước mới đọc được du niên), còn "Ứng dụng đời sống" quay về đúng vai giới thiệu.
  {
    id: 'phong-thuy-chuyen-sau',
    name: 'Phong thuỷ chuyên sâu',
    tagline:
      'Từ cung phi của bạn tới tinh bàn của ngôi nhà — bốn lớp phong thuỷ hay bị gộp làm một, tách ra cho rõ.',
    slugs: ['bat-trach', 'du-nien', 'huyen-khong-phi-tinh', 'thuoc-lo-ban', 'ngu-hanh-mau-sac'],
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
