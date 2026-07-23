/**
 * Danh mục tài liệu tặng miễn phí (lead magnet) — một nguồn sự thật cho hub
 * /tai-lieu, breadcrumb của từng trang con và sitemap.
 *
 * Mỗi tài liệu đều: đọc được trên web, có bản PDF tải về qua cổng email
 * (<DownloadToolPdfButton> → /email/subscribe), và nói rõ giới hạn.
 */

export interface TaiLieuEntry {
  slug: string;
  /** Nhãn ngắn cho thẻ trong hub. */
  title: string;
  /** Một câu mô tả nội dung. */
  blurb: string;
  /** Thứ người đọc nhận được, 2–4 gạch đầu dòng. */
  gets: string[];
  emoji: string;
  /** Nhãn thời điểm/nhịp, vd "Cập nhật mỗi tháng". */
  cadence: string;
}

export const TAI_LIEU: readonly TaiLieuEntry[] = [
  {
    slug: 'sach-hieu-la-so',
    title: 'Hiểu lá số của mình mà không mê tín',
    blurb:
      'Sách điện tử 9 chương, đọc khoảng 15–20 phút: cách đọc lá số một cách tỉnh táo, cách nhận ra lời nói chung chung, và cách đối chiếu với quá khứ của chính bạn.',
    gets: [
      'Phân biệt phần tính được và phần diễn giải',
      'Ba câu hỏi để kiểm tra mọi lời nhận xét',
      'Dấu hiệu nhận ra chỗ xem không đàng hoàng',
    ],
    emoji: '📖',
    cadence: 'Đọc 15–20 phút',
  },
  {
    slug: 'tuoi-xong-dat',
    title: 'Tuổi xông đất Tết Đinh Mùi 2027',
    blurb:
      'Cách chọn người xông đất cho đúng, danh sách tuổi hợp tính riêng theo tuổi gia chủ, và nhóm tuổi thường được kiêng — kèm lý do cụ thể của từng trường hợp.',
    gets: [
      'Danh sách tuổi hợp theo đúng tuổi gia chủ',
      'Nhóm tuổi nên cân nhắc, có nêu lý do',
      'Cách chấm công khai, không giấu quy tắc',
    ],
    emoji: '🧧',
    cadence: 'Cho Tết 06/02/2027',
  },
  {
    slug: 'lich-ngay-tot',
    title: 'Lịch ngày tốt tháng này',
    blurb:
      'Bảng ngày Hoàng đạo, Hắc đạo, can chi và trực ngày của cả tháng đang xem — lấy thẳng từ engine Lịch Vạn Niên, chọn tháng nào cũng được.',
    gets: [
      'Cả tháng trên một trang, dễ khoanh ngày',
      'Ngày Hoàng đạo và ngày nên thận trọng',
      'Can chi và trực của từng ngày',
    ],
    emoji: '📅',
    cadence: 'Xem lại mỗi đầu tháng',
  },
  {
    slug: 'ba-cau-hoi',
    title: 'Bộ 3 câu hỏi giúp bạn tự soi mình',
    blurb:
      'Khung tự soi 20 phút trước một quyết định lớn: cưới, sinh con, đổi việc, bán nhà. Không cần biết gì về tử vi, chỉ cần giấy bút.',
    gets: [
      'Ba câu hỏi kèm cách trả lời từng bước',
      'Ví dụ đã điền sẵn để bắt chước',
      'Cạm bẫy hay gặp ở mỗi câu',
    ],
    emoji: '🪞',
    cadence: 'Làm trong 20 phút',
  },
] as const;

export function taiLieuBySlug(slug: string): TaiLieuEntry | undefined {
  return TAI_LIEU.find((e) => e.slug === slug);
}
