/**
 * Thư viện DIỄN GIẢI — Nợ Nghiệp (Karmic Debt) & Bài Học Nghiệp (Karmic Lessons).
 *
 * Engine ở worker (`tools/than-so-hoc.ts`) ĐÃ tính sẵn:
 *  - `karmic_debt?: number` — 1 trong 4 số 13/14/16/19, lấy từ Đường đời HOẶC
 *    Vận mệnh (lp.debt ?? ex.debt). Chỉ là CON SỐ, chưa có nghĩa.
 *  - `karmic_lessons: number[]` — các chữ số 1-9 KHÔNG xuất hiện trong tên (theo
 *    bảng Pythagoras). Chỉ là CON SỐ, chưa có nghĩa.
 *
 * File này chỉ THÊM phần diễn giải tĩnh, deterministic — KHÔNG tính toán lại,
 * KHÔNG gọi AI. Mỗi giá trị tra theo đúng con số engine trả về.
 *
 * Chuẩn tham chiếu: Pythagorean / Decoz numerology canon
 *  - Hans Decoz, "Numerology: Key to Your Inner Self"; decoz.com (karmic debt
 *    13/14/16/19; karmic lessons = chữ số thiếu trong tên).
 *  - Juno Jordan, "Numerology: The Romance in Your Name" (bảng chữ→số, bài học
 *    do chữ số thiếu).
 *
 * Brand "không bói mù": khung diễn giải là BÀI HỌC CẦN HỌC / xu hướng để rèn
 * giũa — KHÔNG phải "số phận xấu", KHÔNG phán định mệnh. Mỗi mục nói rõ "điều
 * cần học" và "cách đi tới".
 */

export interface KarmicDebtMeaning {
  /** Con số nợ nghiệp: 13 | 14 | 16 | 19. */
  number: 13 | 14 | 16 | 19;
  /** Tiêu đề ngắn cho con số. */
  title: string;
  /** Chủ đề / gốc rễ của bài học (đóng khung "bài học", không phán xấu). */
  theme: string;
  /** Hướng trưởng thành — cách chuyển hóa con số này thành sức mạnh. */
  growth: string;
}

export interface KarmicLessonMeaning {
  /** Chữ số bài học: 1-9 (chữ số thiếu trong tên). */
  number: number;
  /** Bài học cốt lõi cần học. */
  lesson: string;
  /** Cách rèn luyện / tiếp cận để hoàn thiện bài học. */
  how: string;
}

/**
 * 4 Nợ Nghiệp (Karmic Debt) — 13 / 14 / 16 / 19.
 * Theo Decoz: mỗi số phản ánh một bài học còn dang dở cần được hoàn thiện ở
 * kiếp này thông qua nỗ lực có ý thức — không phải một bản án.
 */
export const KARMIC_DEBT: Record<13 | 14 | 16 | 19, KarmicDebtMeaning> = {
  13: {
    number: 13,
    title: 'Nợ nghiệp 13 — Bài học về Lao động',
    theme:
      'Đây là bài học cần học, không phải điềm xấu. Số 13 gợi xu hướng từng tìm đường tắt, ngại bền bỉ hoặc né tránh việc khó. Vì vậy nỗ lực đôi khi chưa cho kết quả tương xứng và dễ nản khi gặp trở ngại.',
    growth:
      'Trưởng thành bằng cách xây nền móng qua LAO ĐỘNG kỷ luật, kiên trì và đều đặn. Chia mục tiêu lớn thành bước nhỏ, làm tới nơi tới chốn thay vì bỏ dở. Trật tự, tập trung và sự bền bỉ chính là chìa khóa biến số 13 thành sức mạnh dựng xây.',
  },
  14: {
    number: 14,
    title: 'Nợ nghiệp 14 — Bài học về Điều độ',
    theme:
      'Đây là bài học cần học, không phải điềm xấu. Số 14 gợi xu hướng từng lạm dụng tự do — buông thả, sa đà vào hưởng thụ giác quan hoặc thay đổi liên tục mà thiếu cam kết. Cuộc sống dễ có nhiều biến động bất ngờ.',
    growth:
      'Trưởng thành bằng cách học ĐIỀU ĐỘ, tập trung và linh hoạt mà không thái quá. Đón nhận thay đổi như cơ hội rèn sự thích nghi, đồng thời giữ kỷ luật với bản thân (ăn uống, công việc, các thú vui). Tự do đi cùng trách nhiệm sẽ giúp bạn vững vàng giữa đổi thay.',
  },
  16: {
    number: 16,
    title: 'Nợ nghiệp 16 — Bài học về Khiêm nhường',
    theme:
      'Đây là bài học cần học, không phải điềm xấu. Số 16 gợi xu hướng từng đặt cái tôi và ham muốn lên trên tình yêu chân thật. Vì thế đời sống có thể trải qua những "sụp đổ" của cái tôi — biến cố lay chuyển những gì ta tưởng là chắc chắn.',
    growth:
      'Mỗi lần cái tôi cũ đổ xuống là một lần được mời gọi dựng lại trên nền KHIÊM NHƯỜNG và chiều sâu tâm linh. Buông bớt kiêu hãnh, sống chân thành và kết nối thật với người khác. Khi đặt tình yêu và sự tỉnh thức lên trước cái tôi, số 16 mở ra sự tái sinh nội tâm bền vững.',
  },
  19: {
    number: 19,
    title: 'Nợ nghiệp 19 — Bài học về Tự lực không vị kỷ',
    theme:
      'Đây là bài học cần học, không phải điềm xấu. Số 19 gợi xu hướng từng lạm dụng quyền lực hoặc sự độc lập — áp đặt, chỉ lo cho mình, hoặc ngược lại quá phụ thuộc người khác. Bài học xoay quanh thế cân bằng giữa "đứng một mình" và "biết nhờ cậy".',
    growth:
      'Trưởng thành bằng cách học TỰ LỰC mà KHÔNG vị kỷ: dám đứng vững một mình, chịu trách nhiệm cho lựa chọn của mình, nhưng vẫn rộng mở để giúp người và để người giúp lại. Dùng năng lực và sức ảnh hưởng để phụng sự thay vì thống trị — đó là lúc số 19 trở thành sức mạnh dẫn dắt.',
  },
};

/**
 * 9 Bài Học Nghiệp (Karmic Lessons) — chữ số 1-9 THIẾU trong tên.
 * Theo Decoz/Jordan: chữ số vắng mặt chỉ ra phẩm chất bạn chưa quen vận dụng,
 * cần ý thức rèn luyện ở kiếp này. Đây là cơ hội phát triển, không phải khiếm
 * khuyết cố định.
 */
export const KARMIC_LESSONS: Record<number, KarmicLessonMeaning> = {
  1: {
    number: 1,
    lesson:
      'Học cách tự khẳng định và độc lập. Bạn có thể ngại đưa ra quyết định, dễ dựa dẫm hoặc thiếu tự tin dẫn dắt chính mình.',
    how: 'Tập chủ động: tự mình quyết định những việc nhỏ rồi lớn dần, nói lên ý kiến riêng, dám khởi xướng. Tin rằng bạn có quyền và đủ sức đứng đầu cuộc đời mình.',
  },
  2: {
    number: 2,
    lesson:
      'Học cách hợp tác, kiên nhẫn và tế nhị. Bạn có thể thiếu nhạy cảm với người khác, nóng vội hoặc khó nhường nhịn trong quan hệ.',
    how: 'Tập lắng nghe và đặt mình vào vị trí người khác, làm việc nhóm, chấp nhận đi chậm để cùng nhau. Chú ý đến cảm xúc và sự cân bằng trong các mối quan hệ.',
  },
  3: {
    number: 3,
    lesson:
      'Học cách biểu đạt và tự tin sáng tạo. Bạn có thể khó nói ra cảm xúc, ngại thể hiện bản thân hoặc tự phê bình quá mức về khả năng sáng tạo.',
    how: 'Tập diễn đạt qua lời nói, viết lách, nghệ thuật hay bất cứ hình thức nào hợp với bạn. Cho phép mình vui sống, lạc quan và chia sẻ niềm vui với người khác.',
  },
  4: {
    number: 4,
    lesson:
      'Học cách kỷ luật, trật tự và bền bỉ. Bạn có thể thấy khó duy trì nề nếp, dễ bỏ dở hoặc né tránh việc đòi hỏi tính tổ chức.',
    how: 'Tập lập kế hoạch, làm việc đều đặn từng bước và hoàn thành tới cùng. Xây thói quen và nền móng vững chắc; sự kiên trì hằng ngày sẽ thành sức mạnh.',
  },
  5: {
    number: 5,
    lesson:
      'Học cách thích nghi, đón nhận thay đổi và sống tự do có trách nhiệm. Bạn có thể ngại đổi thay, bám vào vùng an toàn hoặc ngược lại sợ cam kết.',
    how: 'Tập đón nhận cái mới, linh hoạt trước biến động và dám trải nghiệm. Đồng thời giữ tự do trong khuôn khổ trách nhiệm, không buông thả hay trốn tránh.',
  },
  6: {
    number: 6,
    lesson:
      'Học cách nhận trách nhiệm, chăm sóc và cam kết. Bạn có thể ngại ràng buộc với gia đình, người thân hoặc khó gánh vác bổn phận lâu dài.',
    how: 'Tập có mặt và đáng tin cậy với những người thuộc về mình. Đón nhận vai trò chăm lo, giữ cam kết và xây dựng tổ ấm, cộng đồng bằng tình yêu thương.',
  },
  7: {
    number: 7,
    lesson:
      'Học cách đi vào chiều sâu, tin tưởng và nuôi dưỡng nội tâm. Bạn có thể sống quá bề mặt, hoài nghi hoặc ngại khám phá thế giới bên trong.',
    how: 'Tập dành thời gian tĩnh lặng, suy ngẫm, học hỏi và tìm ý nghĩa sâu xa. Nuôi dưỡng niềm tin vào bản thân và cuộc sống thay vì chỉ dựa vào lý trí hoài nghi.',
  },
  8: {
    number: 8,
    lesson:
      'Học cách quản lý vật chất, quyền lực và sự tự tin về tài chính. Bạn có thể lúng túng với tiền bạc, ngại đảm nhận vị trí lãnh đạo hoặc xem nhẹ giá trị bản thân.',
    how: 'Tập quản lý nguồn lực một cách thực tế, đặt mục tiêu rõ ràng và nhận lấy quyền lãnh đạo khi cần. Tin rằng bạn xứng đáng với thành quả và biết dùng quyền lực một cách công bằng.',
  },
  9: {
    number: 9,
    lesson:
      'Học cách buông bỏ, từ bi và nhìn toàn cảnh. Bạn có thể bám chấp, hẹp hòi hoặc khó cảm thông với nỗi đau của người khác.',
    how: 'Tập cho đi mà không tính toán, tha thứ và mở lòng với mọi người. Nhìn vượt khỏi lợi ích cá nhân để thấy bức tranh lớn và phụng sự điều lớn hơn bản thân.',
  },
};
