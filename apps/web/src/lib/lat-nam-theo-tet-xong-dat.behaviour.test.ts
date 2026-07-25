// Cụm /xong-dat lật năm theo Tết — nhưng LỆCH +1 so với ba cụm kia.
//
// VÌ SAO PHẢI CÓ BÀI RIÊNG
// `lat-nam-theo-tet.behaviour.test.ts` khoá hành vi của /xem-tuoi-cuoi,
// /xem-tuoi-lam-nha, /khai-truong: năm mục tiêu = năm âm ĐANG SỐNG. Xông đất
// thì khác — nó là tục MỞ một năm âm mới, nên trong suốt năm âm 2026 (Bính Ngọ)
// trang phải nói về Tết 2027 (Đinh Mùi), đúng bằng con số 2027 từng gõ cứng.
// Ai đọc lướt sẽ thấy cụm này "lệch một năm so với ba cụm kia" và sửa cho
// "thống nhất" — làm vậy là 31 trang lùi về năm vừa qua. Bài này khoá lại.
//
// Bài cũng đọc ĐÚNG CHỮ trang sinh ra: cấu hình đúng mà câu chữ vẫn kẹt can chi
// / ngày mùng 1 của mùa cũ thì người dùng vẫn thấy sai.
import { describe, it, expect, vi, afterEach } from 'vitest';
import { defaultTargetYear, targetYears, tetMoc, yearChiGroups } from '@/lib/xong-dat';
import { howToChoose } from '@/lib/tai-lieu/xong-dat-guide';
import { yearProfile } from '@/lib/sinh-con';
import { buildHostPage } from '@/app/xong-dat/years';

/** Đặt đồng hồ hệ thống về một thời điểm giờ VN (UTC+7). */
const datDongHo = (ngayVN: string) => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(`${ngayVN}T05:00:00Z`)); // 12:00 giờ VN
};

afterEach(() => {
  vi.useRealTimers();
});

const ten = (zs: { ten: string }[]) => zs.map((z) => z.ten).join(', ');

describe('năm Tết mục tiêu = kỳ Tết KẾ TIẾP, lật đúng mùng 1', () => {
  it('hôm nay (năm âm 2026) → 2027, đúng bằng hằng số cũ ⇒ đổi mã không đổi nội dung', () => {
    vi.useRealTimers();
    expect(defaultTargetYear()).toBe(2027);
    expect(targetYears()).toEqual([2027, 2028]);
  });

  it('20/01/2027 và 05/02/2027 (29 Chạp) vẫn 2027 — không lật sớm theo 01/01', () => {
    datDongHo('2027-01-20');
    expect(defaultTargetYear()).toBe(2027);
    datDongHo('2027-02-05');
    expect(defaultTargetYear()).toBe(2027);
  });

  it('BA NGÀY TẾT vẫn giữ năm đang mở — đây là ngày cao điểm của cả cụm', () => {
    // Bản đầu lật ngay lúc giao thừa: sáng mùng 1 Tết Đinh Mùi trang đã nói về
    // Tết 2028, trong khi người đang đọc chính là người đi xông đất cho 2027
    // sáng hôm đó. Sai đúng vào ngày đông người đọc nhất.
    datDongHo('2027-02-06'); // mùng 1
    expect(defaultTargetYear(), 'mùng 1 Tết phải vẫn là kỳ Tết đang diễn ra').toBe(2027);
    datDongHo('2027-02-07'); // mùng 2
    expect(defaultTargetYear()).toBe(2027);
    datDongHo('2027-02-08'); // mùng 3
    expect(defaultTargetYear()).toBe(2027);
  });

  it('hết ba ngày Tết mới chuyển sang kỳ sau, rồi giữ nguyên suốt năm', () => {
    datDongHo('2027-02-09'); // mùng 4
    expect(defaultTargetYear()).toBe(2028);
    datDongHo('2027-12-31');
    expect(defaultTargetYear()).toBe(2028);
    datDongHo('2028-01-26'); // mùng 1 Tết Mậu Thân — vẫn là kỳ đang diễn ra
    expect(defaultTargetYear()).toBe(2028);
    datDongHo('2028-01-29'); // mùng 4
    expect(defaultTargetYear()).toBe(2029);
  });
});

describe('mùng 1 Tết dò từ lịch âm trong repo, không gõ bảng ngày', () => {
  it('khớp ngày Tết thật của 2026–2029', () => {
    expect(tetMoc(2027)).toEqual({ ngay: '06/02/2027', thu: 'thứ Bảy', ngayTruoc: '05/02/2027' });
    expect(tetMoc(2026).ngay).toBe('17/02/2026');
    expect(tetMoc(2028).ngay).toBe('26/01/2028');
    expect(tetMoc(2029).ngay).toBe('13/02/2029');
  });
});

describe('nhóm chi của năm — thay cho các danh sách trước đây gõ tay', () => {
  it('2027 (Đinh Mùi) ra đúng từng nhóm như chữ cũ', () => {
    const g = yearChiGroups(2027)!;
    expect(g.target.canChi).toBe('Đinh Mùi');
    expect([ten(g.tamHop), ten(g.lucHop), ten(g.xung), ten(g.hai), ten(g.trung)]).toEqual([
      'Mão, Hợi',
      'Ngọ',
      'Sửu',
      'Tý',
      'Mùi',
    ]);
    expect(g.boTamHop.map((z) => z.ten).join(' – ')).toBe('Hợi – Mão – Mùi');
    expect(g.capLucHop.map((z) => z.ten).join(' – ')).toBe('Ngọ – Mùi');
  });

  it('bộ tam hợp đúng thứ tự quen gọi cho cả 4 bộ', () => {
    const bo = new Set<string>();
    for (let y = 2020; y < 2032; y++) {
      bo.add(yearChiGroups(y)!.boTamHop.map((z) => z.ten).join(' – '));
    }
    expect([...bo].sort()).toEqual(
      ['Dần – Ngọ – Tuất', 'Hợi – Mão – Mùi', 'Thân – Tý – Thìn', 'Tỵ – Dậu – Sửu'].sort(),
    );
  });
});

describe('câu chữ mùa 2027 không đổi một ký tự nào', () => {
  it('bước 2 của tài liệu tặng', () => {
    expect(howToChoose(yearProfile(2027)!)[1]!.body).toBe(
      'Tết 2027 là năm Đinh Mùi, chi năm là Mùi. Người có tuổi thuộc nhóm tam hợp hoặc lục hợp với chi Mùi được xem là thuận. Người có tuổi xung với chi năm, hoặc trùng đúng tuổi Mùi (dân gian gọi là phạm Thái Tuế), thì theo lệ thường để dành cho dịp khác.',
    );
  });

  it('/xong-dat/sinh-nam-1968: tiêu đề, mô tả, lưu ý và FAQ', () => {
    datDongHo('2026-07-26');
    const d = buildHostPage(1968);
    expect(d.seoTitle).toBe('Tuổi xông đất 2027 cho gia chủ sinh 1968');
    expect(d.seoDescription).toBe(
      'Gia chủ sinh 1968 (Mậu Thân, mệnh Thổ) đón Tết Đinh Mùi 2027: gợi ý tuổi xông đất theo tam hợp, lục hợp và ngũ hành tương sinh. Tham khảo, không phán định.',
    );
    expect(d.considerations[1]).toBe(
      'Tết Đinh Mùi 2027: mùng 1 rơi vào 06/02/2027. Tuổi tính theo năm ÂM lịch — người sinh tháng 1–2 dương (trước Tết) thuộc năm âm liền trước.',
    );
    expect(d.considerations[2]).toBe(
      'Riêng với chi năm Mùi: tuổi Mão, Hợi thuộc nhóm tam hợp; tuổi Ngọ là cặp lục hợp; tuổi Sửu xung, tuổi Tý hại, tuổi Mùi trùng chi năm (Thái Tuế).',
    );
    expect(d.faqs[0]!.q).toBe('Gia chủ sinh năm 1968 nên mời tuổi nào xông đất Tết 2027?');
    expect(d.faqs[3]!.q).toBe('Mùng 1 Tết Đinh Mùi 2027 là ngày nào dương lịch?');
    expect(d.faqs[3]!.a).toBe(
      'Mùng 1 Tết Đinh Mùi rơi vào thứ Bảy, ngày 06/02/2027 dương lịch. Lưu ý tuổi tính theo năm âm: người sinh tháng 1 hoặc đầu tháng 2 dương (trước mùng 1 Tết năm sinh của mình) thuộc năm âm liền trước — nên xác nhận lại can chi trước khi đối chiếu.',
    );
  });

  it('hết ba ngày Tết: trang nói mùa mới và KHÔNG sót mảnh nào của mùa cũ', () => {
    // Mốc là mùng 4 chứ không phải mùng 1: ba ngày Tết vẫn thuộc mùa đang diễn
    // ra (xem ghi chú `defaultTargetYear`). Bài này canh thứ đáng sợ hơn con số
    // năm — ngày mùng 1, can chi và nhóm chi có đi theo không, hay còn kẹt lại
    // mảnh của mùa cũ khiến trang tự mâu thuẫn.
    datDongHo('2027-02-09');
    const d = buildHostPage(1968);
    const chu = [
      d.seoTitle,
      d.seoDescription,
      ...d.considerations,
      ...d.faqs.map((f) => `${f.q} ${f.a}`),
    ].join(' ');
    expect(d.seoTitle).toBe('Tuổi xông đất 2028 cho gia chủ sinh 1968');
    expect(chu).toContain('Mậu Thân');
    expect(chu).toContain('26/01/2028');
    expect(chu).not.toContain('Đinh Mùi');
    expect(chu).not.toContain('06/02/2027');
  });
});
