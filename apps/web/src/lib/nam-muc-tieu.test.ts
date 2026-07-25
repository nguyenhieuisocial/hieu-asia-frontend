import { describe, it, expect } from 'vitest';
import { namMucTieu } from './nam-muc-tieu';

// Giờ VN = UTC+7. Dùng mốc 12:00 VN (05:00Z) cho các ca thường, và mốc sát nửa
// đêm cho ca biên — chính chỗ dễ lệch một ngày nếu quy đổi múi giờ sai.
const vn = (s: string) => new Date(`${s}T05:00:00Z`);

describe('năm mục tiêu lật vào mùng 1 Tết', () => {
  it('trong năm thì bằng năm dương', () => {
    expect(namMucTieu(vn('2026-07-26'))).toBe(2026);
    expect(namMucTieu(vn('2026-12-31'))).toBe(2026);
  });

  it('tháng 1 dương KHÔNG lật — vẫn còn hơn một tháng nữa mới tới Tết', () => {
    // Đây là điểm khác biệt then chốt so với phương án lật vào 01/01.
    expect(namMucTieu(vn('2027-01-01'))).toBe(2026);
    expect(namMucTieu(vn('2027-01-31'))).toBe(2026);
  });

  it('lật đúng mùng 1 Tết Đinh Mùi, không sớm không muộn một ngày', () => {
    expect(namMucTieu(vn('2027-02-05'))).toBe(2026); // 29 tháng Chạp
    expect(namMucTieu(vn('2027-02-06'))).toBe(2027); // mùng 1 Tết
  });

  it('các năm sau vẫn lật đúng mùng 1 Tết (không phải bảng gõ tay nên không hết dữ liệu)', () => {
    expect(namMucTieu(vn('2028-01-25'))).toBe(2027);
    expect(namMucTieu(vn('2028-01-26'))).toBe(2028); // Tết 2028
    expect(namMucTieu(vn('2029-02-12'))).toBe(2028);
    expect(namMucTieu(vn('2029-02-13'))).toBe(2029); // Tết 2029
    expect(namMucTieu(vn('2035-02-07'))).toBe(2034);
    expect(namMucTieu(vn('2035-02-08'))).toBe(2035); // Tết 2035
  });

  it('mốc sát nửa đêm giờ VN không lệch ngày', () => {
    // 05/02/2027 23:59 giờ VN = 16:59Z cùng ngày → vẫn chưa Tết.
    expect(namMucTieu(new Date('2027-02-05T16:59:00Z'))).toBe(2026);
    // 06/02/2027 00:01 giờ VN = 17:01Z ngày 05/02 → ĐÃ là mùng 1 theo giờ VN.
    expect(namMucTieu(new Date('2027-02-05T17:01:00Z'))).toBe(2027);
  });

  it('luôn tiến, không bao giờ lùi — quét từng ngày suốt 12 năm', () => {
    // Chốt mạnh nhất ở đây: một hàm ngày-tháng sai kiểu tinh vi thường lộ ra
    // bằng cách nhảy lùi hoặc nhảy 2 bậc ở đâu đó giữa dải.
    let truoc = namMucTieu(vn('2026-01-01'));
    let soLanLat = 0;
    const ngay = new Date(Date.UTC(2026, 0, 1, 5, 0, 0));
    const het = Date.UTC(2038, 0, 1);
    while (ngay.getTime() < het) {
      const n = namMucTieu(new Date(ngay));
      expect(n, `lùi năm tại ${ngay.toISOString().slice(0, 10)}`).toBeGreaterThanOrEqual(truoc);
      expect(n - truoc, `nhảy hơn 1 năm tại ${ngay.toISOString().slice(0, 10)}`).toBeLessThanOrEqual(1);
      if (n > truoc) soLanLat++;
      truoc = n;
      ngay.setUTCDate(ngay.getUTCDate() + 1);
    }
    // 12 năm phải có đúng 12 lần lật (mỗi Tết một lần).
    expect(soLanLat, 'số lần lật không khớp số năm đã quét').toBe(12);
  });
});
