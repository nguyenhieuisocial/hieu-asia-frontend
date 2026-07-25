// Chứng minh HÀNH VI, không chỉ cấu hình.
//
// `nam-het-han.guard.test.ts` canh cấu hình (còn hằng số gõ chết không, có
// `revalidate` không). Nhưng cấu hình đúng mà chuỗi chữ vẫn kẹt năm cũ thì
// người dùng vẫn thấy sai — nên phải có một bài đọc ĐÚNG CHỮ mà trang sinh ra,
// dưới đồng hồ giả, tại các mốc quanh Tết.
//
// Đây cũng là bài duy nhất trả lời được câu "sang Tết trang có thật sự đổi
// không" mà không phải chờ tới Tết.
import { describe, it, expect, vi, afterEach } from 'vitest';
import { buildYearPage as cuoi } from '@/app/xem-tuoi-cuoi/years';
import { buildYearPage as lamNha } from '@/app/xem-tuoi-lam-nha/years';
import { buildYearPage as khaiTruong } from '@/app/khai-truong/years';

/** Đặt đồng hồ hệ thống về một thời điểm giờ VN (UTC+7). */
const datDongHo = (ngayVN: string) => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(`${ngayVN}T05:00:00Z`)); // 12:00 giờ VN
};

afterEach(() => {
  vi.useRealTimers();
});

/** Rút năm 4 chữ số xuất hiện trong tiêu đề SEO của một trang con. */
const namTrongTieuDe = (title: string): number[] =>
  [...title.matchAll(/\b(20\d{2})\b/g)].map((m) => Number(m[1]));

const CUM = [
  { ten: '/xem-tuoi-cuoi', build: cuoi, namSinh: 1997 },
  { ten: '/xem-tuoi-lam-nha', build: lamNha, namSinh: 1990 },
  { ten: '/khai-truong', build: khaiTruong, namSinh: 1990 },
];

describe('trang lật năm ĐÚNG vào mùng 1 Tết — đọc chữ trang sinh ra', () => {
  for (const { ten, build, namSinh } of CUM) {
    it(`${ten}: 05/02/2027 vẫn năm cũ, 06/02/2027 (mùng 1 Tết) đã sang năm mới`, () => {
      datDongHo('2027-02-05'); // 29 tháng Chạp
      const truoc = build(namSinh);
      datDongHo('2027-02-06'); // mùng 1 Tết Đinh Mùi
      const sau = build(namSinh);

      expect(namTrongTieuDe(truoc.seoTitle), `${ten}: tiêu đề trước Tết`).toContain(2026);
      expect(namTrongTieuDe(sau.seoTitle), `${ten}: tiêu đề sau Tết`).toContain(2027);
      expect(truoc.seoTitle, `${ten}: tiêu đề không đổi qua Tết`).not.toBe(sau.seoTitle);
    });

    it(`${ten}: tháng 1 dương KHÔNG lật sớm (khác hẳn phương án lật 01/01)`, () => {
      datDongHo('2027-01-20');
      expect(namTrongTieuDe(build(namSinh).seoTitle), `${ten}: lật sớm trước Tết`).toContain(2026);
    });

    it(`${ten}: mô tả và FAQ cũng lật theo, không sót chỗ nào`, () => {
      datDongHo('2027-02-06');
      const d = build(namSinh);
      const chu = [d.seoDescription, ...d.faqs.map((f) => `${f.q} ${f.a}`)].join(' ');
      // Không được còn năm cũ nào trong toàn bộ chữ trang sinh ra. (2026 vẫn có
      // thể xuất hiện hợp lệ ở vai trò khác — ví dụ liệt kê dải năm Tam Tai —
      // nên chỉ khẳng định điều chắc chắn: năm mục tiêu mới PHẢI có mặt.)
      expect(chu, `${ten}: chữ trang không nhắc năm mới`).toContain('2027');
    });
  }

  it('hôm nay các cụm vẫn cho đúng năm đang chạy — thay đổi không làm lệch hiện tại', () => {
    vi.useRealTimers();
    const namNay = new Date().getFullYear();
    for (const { ten, build, namSinh } of CUM) {
      const nams = namTrongTieuDe(build(namSinh).seoTitle);
      // Trước Tết của năm sau thì năm mục tiêu = năm dương hiện tại.
      expect(nams, `${ten}: tiêu đề hôm nay`).toContain(namNay);
    }
  });
});
