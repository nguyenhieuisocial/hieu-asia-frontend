// Lưới an toàn cho `scripts/audit-guard.mjs` — cùng quy ước seo-guard/seo-live.
//
// Cổng này là bản TỔNG QUÁT của `lockfile-svgo.guard.test.ts`: mọi override bảo
// mật bị gỡ đều làm advisory tương ứng xuất hiện lại. Nên nếu CHÍNH NÓ hỏng thì
// hỏng kiểu tệ nhất — im lặng cho qua mọi lỗ hổng mới.
//
// Bài học xuyên suốt đợt 2026-07: chốt canh KHÔNG BAO GIỜ ĐỎ ĐƯỢC còn tệ hơn
// không có chốt. Test dưới đây khoá cả hai chiều.
import { describe, it, expect } from 'vitest';

import {
  DA_XET,
  HAN_XET_LAI_NGAY,
  bocAdvisory,
  kiemLyDo,
  quaHanXetLai,
  soSanh,
} from '../../../../scripts/audit-guard.mjs';

const adv = (ma: string, goi = 'x') => ({
  github_advisory_id: ma,
  module_name: goi,
  severity: 'high',
  vulnerable_versions: '<1',
  patched_versions: '>=1',
});

describe('bocAdvisory', () => {
  it('bóc đúng danh sách từ JSON của pnpm audit', () => {
    const r = bocAdvisory({ advisories: { a: adv('GHSA-1', 'lodash') } });
    expect(r).toEqual([
      { ma: 'GHSA-1', goi: 'lodash', mucDo: 'high', dai: '<1', banVa: '>=1' },
    ]);
  });

  it('GIỮ `patched_versions` — vứt đi thì mất luôn dữ liệu để biết đã vá được chưa', () => {
    expect(bocAdvisory({ advisories: { a: adv('GHSA-1') } })![0]!.banVa).toBe('>=1');
  });

  it('không có advisory nào ⇒ mảng RỖNG (khác hẳn "không đọc được")', () => {
    expect(bocAdvisory({ advisories: {} })).toEqual([]);
  });

  it('JSON đổi định dạng ⇒ null, để nơi gọi thoát mã 2 thay vì báo "sạch"', () => {
    // Nếu pnpm đổi khoá `advisories` mà hàm này trả [] thì mọi phép so bên dưới
    // thành vô nghĩa và cổng in "0 MỚI" — sạch giả trên một phép đo rỗng.
    expect(bocAdvisory({})).toBeNull();
    expect(bocAdvisory({ advisories: null })).toBeNull();
    expect(bocAdvisory(null)).toBeNull();
  });
});

describe('soSanh — báo CẢ HAI chiều', () => {
  const daXet = { 'GHSA-1': { goi: 'a', lyDo: 'x', xetNgay: '2026-07-29' } };

  it('advisory chưa xét ⇒ MỚI (đây là ca chính)', () => {
    const r = soSanh([adv('GHSA-1'), adv('GHSA-2')].map((a) => bocAdvisory({ advisories: { a } })![0]!), daXet);
    expect(r.moi.map((x: { ma: string }) => x.ma)).toEqual(['GHSA-2']);
    expect(r.thua).toEqual([]);
  });

  it('mục đã xét KHÔNG còn xuất hiện ⇒ THỪA, phải dọn', () => {
    // Lỗ hổng đã được vá ở đâu đó ⇒ mục đó nay là lời nói dối nằm lại trong
    // file. Đúng kiểu "mục miễn trừ thành chỗ giấu lỗi" mà seo-guard từng mắc.
    expect(soSanh([], daXet).thua).toEqual(['GHSA-1']);
  });

  it('khớp hoàn toàn ⇒ không MỚI, không THỪA', () => {
    const r = soSanh([{ ma: 'GHSA-1', goi: 'a', mucDo: 'high', dai: '<1' }], daXet);
    expect(r.moi).toEqual([]);
    expect(r.thua).toEqual([]);
  });
});

describe('quaHanXetLai — chiều thứ ba: lý do MỤC theo thời gian', () => {
  // Ca thật: cả 5 mục hiện tại đều có lý do dạng "thượng nguồn chưa với tới
  // được". Nếu mai zmp-ui nâng react-router thì advisory VẪN xuất hiện (ta vẫn
  // ở bản cũ), VẪN nằm trong danh sách ⇒ exit 0 mãi mãi, không ai biết đã nâng
  // được. Thứ thật sự mục là LÝ DO, và thứ đo được nó là THỜI GIAN.
  const xet = (ngay: string) => ({ A: { goi: 'a', lyDo: 'x', xetNgay: ngay } });

  it('mục xét lâu hơn hạn phải bị nêu tên', () => {
    expect(quaHanXetLai(xet('2026-01-01'), '2026-07-29')).toEqual(['A']);
  });

  it('mục mới xét thì không kêu', () => {
    expect(quaHanXetLai(xet('2026-07-29'), '2026-07-29')).toEqual([]);
    expect(quaHanXetLai(xet('2026-07-01'), '2026-07-29')).toEqual([]);
  });

  it('đúng ranh giới hạn', () => {
    const hom = '2026-07-29';
    const vua = new Date(new Date(hom).getTime() - (HAN_XET_LAI_NGAY - 1) * 86400000)
      .toISOString()
      .slice(0, 10);
    const qua = new Date(new Date(hom).getTime() - (HAN_XET_LAI_NGAY + 1) * 86400000)
      .toISOString()
      .slice(0, 10);
    expect(quaHanXetLai(xet(vua), hom)).toEqual([]);
    expect(quaHanXetLai(xet(qua), hom)).toEqual(['A']);
  });

  it('DANH SÁCH THẬT chưa mục tại thời điểm viết', () => {
    expect(quaHanXetLai(DA_XET, '2026-07-29')).toEqual([]);
  });
});

describe('kiemLyDo — không cho dán mã vào cho CI hết đỏ', () => {
  it('thiếu lý do, lý do quá ngắn, hoặc thiếu ngày xét đều bị nêu tên', () => {
    const xau = {
      A: { goi: 'a', lyDo: '', xetNgay: '2026-07-29' },
      B: { goi: 'b', lyDo: 'ngắn quá', xetNgay: '2026-07-29' },
      C: { goi: 'c', lyDo: 'lý do này dài hơn bốn mươi ký tự nên hợp lệ nhé bạn' },
    };
    expect(kiemLyDo(xau).sort()).toEqual(['A', 'B', 'C']);
  });

  it('DANH SÁCH THẬT phải sạch — mọi mục có lý do và ngày xét', () => {
    expect(kiemLyDo(DA_XET)).toEqual([]);
  });

  it('mọi mục thật phải ghi rõ gói và ngày xét dạng YYYY-MM-DD', () => {
    for (const [ma, v] of Object.entries(DA_XET)) {
      expect(ma, 'mã advisory phải dạng GHSA-').toMatch(/^GHSA-/);
      expect((v as { goi: string }).goi, ma).toBeTruthy();
      expect((v as { xetNgay: string }).xetNgay, ma).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
