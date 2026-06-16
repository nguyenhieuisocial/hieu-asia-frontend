import { describe, it, expect } from 'vitest';
import { dayCanChi, computeGioHoangDao, HOANG_DAO_STARS, HAC_DAO_STARS } from './gio-hoang-dao';

/**
 * Kiểm thử hồi quy — engine GIỜ HOÀNG ĐẠO (can-chi ngày + xếp 12 sao theo chi ngày).
 *
 * LÝ DO TỒN TẠI (quan trọng): offset can-chi ngày đúng là `stem=(jd+9)%10,
 * branch=(jd+1)%12`. Công thức này đã bị sửa NHẦM thành `+8/+4` tới HAI lần trên
 * các nhánh (`fix/gio-hoang-dao-canchi` ở frontend + `fix/day-canchi-offset` ở
 * backend), với "anchor" sai 01/01/2024 = Quý Mão. Sự thật: 01/01/2024 = Giáp Tý.
 * Test này CHẶN VĨNH VIỄN việc tái phạm — mọi thay đổi làm sai can-chi sẽ đỏ CI.
 *
 * Mốc chuẩn (đối chiếu lịch vạn niên VN / Hồ Ngọc Đức + backend lunar.ts):
 *   07/01/2000 = Giáp Tý (anchor kinh điển) · 01/01/2024 = Giáp Tý
 *   21/05/2026 = Ất Mùi · 16/06/2026 = Tân Dậu
 */
describe('gio-hoang-dao › can-chi ngày (chặn lỗi +8/+4 tái diễn)', () => {
  it('07/01/2000 = Giáp Tý (mốc chuẩn Hồ Ngọc Đức)', () => {
    const d = dayCanChi(7, 1, 2000);
    expect(d.label).toBe('Giáp Tý');
    expect(d.stemIndex).toBe(0);
    expect(d.branchIndex).toBe(0);
  });

  it('01/01/2024 = Giáp Tý — KHÔNG phải Quý Mão (công thức sai +8/+4)', () => {
    expect(dayCanChi(1, 1, 2024).label).toBe('Giáp Tý');
  });

  it('21/05/2026 = Ất Mùi', () => {
    expect(dayCanChi(21, 5, 2026).label).toBe('Ất Mùi');
  });

  it('16/06/2026 = Tân Dậu', () => {
    expect(dayCanChi(16, 6, 2026).label).toBe('Tân Dậu');
  });
});

describe('gio-hoang-dao › xếp 12 sao theo chi ngày', () => {
  it('đúng 6 sao hoàng đạo + 6 sao hắc đạo', () => {
    expect(HOANG_DAO_STARS).toHaveLength(6);
    expect(HAC_DAO_STARS).toHaveLength(6);
  });

  it('mỗi ngày = 12 canh giờ, đúng 6 tốt + 6 xấu', () => {
    const r = computeGioHoangDao(16, 6, 2026);
    expect(r).not.toBeNull();
    expect(r!.hours).toHaveLength(12);
    expect(r!.hours.filter((h) => h.good)).toHaveLength(6);
    expect(r!.hours.filter((h) => !h.good)).toHaveLength(6);
  });

  it('ngày Tân Dậu (16/06/2026): giờ Tý = Tư Mệnh (tốt), Ngọ = Kim Quỹ (tốt), Tuất = xấu', () => {
    const r = computeGioHoangDao(16, 6, 2026)!;
    expect(r.dayCanChi.label).toBe('Tân Dậu');
    expect(r.hours[0].branch).toBe('Tý');
    expect(r.hours[0].star).toBe('Tư Mệnh');
    expect(r.hours[0].good).toBe(true);
    expect(r.hours[6].branch).toBe('Ngọ');
    expect(r.hours[6].star).toBe('Kim Quỹ');
    expect(r.hours[6].good).toBe(true);
    expect(r.hours[10].branch).toBe('Tuất');
    expect(r.hours[10].good).toBe(false);
  });

  it('ngày không hợp lệ trả null', () => {
    expect(computeGioHoangDao(32, 1, 2026)).toBeNull();
  });
});
