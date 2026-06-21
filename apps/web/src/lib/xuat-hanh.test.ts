import { describe, it, expect } from 'vitest';
import { computeXuatHanh, HY_THAN, TAI_THAN } from './xuat-hanh';

const STEMS = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];

describe('xuat-hanh engine', () => {
  it('phủ đủ 10 thiên can ở cả hai bảng', () => {
    for (const s of STEMS) {
      expect(HY_THAN[s]).toBeTruthy();
      expect(TAI_THAN[s]).toBeTruthy();
    }
  });

  // Gold-standard: đối chiếu ngày đã CÔNG BỐ (cross-verified nhiều nguồn).
  // Đây là test then chốt: xác thực CHUỖI engine (ngày→can) + bảng-theo-can.
  it('17/02/2026 (mùng 1 Tết Bính Ngọ) = Nhâm Tuất → Hỷ Thần Chính Nam, Tài Thần Chính Tây', () => {
    const r = computeXuatHanh(17, 2, 2026);
    expect(r).not.toBeNull();
    expect(r!.dayCanChi.label).toBe('Nhâm Tuất');
    expect(r!.hyThan).toBe('Chính Nam');
    expect(r!.taiThan).toBe('Chính Tây');
  });

  it('29/01/2025 (mùng 1 Tết Ất Tỵ) = Mậu Tuất → Hỷ Thần Đông Nam, Tài Thần Chính Bắc', () => {
    const r = computeXuatHanh(29, 1, 2025);
    expect(r).not.toBeNull();
    expect(r!.dayCanChi.stem).toBe('Mậu');
    expect(r!.hyThan).toBe('Đông Nam');
    expect(r!.taiThan).toBe('Chính Bắc');
  });

  it('trả giờ hoàng đạo (toàn giờ tốt) + null khi ngày không hợp lệ', () => {
    const r = computeXuatHanh(6, 2, 2027); // mùng 1 Tết Đinh Mùi
    expect(r).not.toBeNull();
    expect(r!.goodHours.length).toBeGreaterThan(0);
    expect(r!.goodHours.every((h) => h.good)).toBe(true);
    expect(computeXuatHanh(32, 1, 2027)).toBeNull();
  });
});
