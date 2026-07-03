/**
 * Bảo hiểm bao phủ: bản diễn giải đời thường PHẢI phủ 100% chuỗi engine sinh ra
 * (10 Thiên Can, 10 Thập Thần + 'Nhật Chủ', 5 hành) — lệch key là fail ngay.
 */
import { describe, it, expect } from 'vitest';
import { CAN, ELEMENTS, calculateBazi } from './bazi';
import { CAN_PLAIN, TEN_GOD_PLAIN, NGU_HANH_PLAIN } from './bat-tu-plain';

describe('bat-tu-plain — bao phủ 100% chuỗi engine', () => {
  it('đủ 10 Thiên Can, có hình + blurb', () => {
    for (const can of CAN) {
      expect(CAN_PLAIN[can], `thiếu CAN_PLAIN[${can}]`).toBeTruthy();
      expect(CAN_PLAIN[can]!.hinh.length).toBeGreaterThan(3);
      expect(CAN_PLAIN[can]!.blurb.length).toBeGreaterThan(20);
    }
  });

  it('đủ 10 Thập Thần chuẩn + Nhật Chủ', () => {
    const TEN_GODS = [
      'Tỷ Kiên', 'Kiếp Tài', 'Thực Thần', 'Thương Quan', 'Chính Tài',
      'Thiên Tài', 'Chính Quan', 'Thất Sát', 'Chính Ấn', 'Thiên Ấn', 'Nhật Chủ',
    ];
    for (const tg of TEN_GODS) {
      expect(TEN_GOD_PLAIN[tg], `thiếu TEN_GOD_PLAIN[${tg}]`).toBeTruthy();
    }
  });

  it('đủ 5 hành với nghĩa vượng + thiếu', () => {
    for (const el of ELEMENTS) {
      expect(NGU_HANH_PLAIN[el], `thiếu NGU_HANH_PLAIN[${el}]`).toBeTruthy();
      expect(NGU_HANH_PLAIN[el]!.vuong.length).toBeGreaterThan(5);
      expect(NGU_HANH_PLAIN[el]!.thieu.length).toBeGreaterThan(5);
    }
  });

  it('tenGod thật từ engine (quét 1970–2000, trụ năm/tháng) luôn có bản dịch', () => {
    for (let y = 1970; y <= 2000; y++) {
      const chart = calculateBazi({ birthSolarDate: `${y}-06-01`, birthHour: 12 });
      for (const p of [chart.year, chart.month, chart.day, chart.hour]) {
        expect(TEN_GOD_PLAIN[p.tenGod], `tenGod lạ: ${p.tenGod}`).toBeTruthy();
      }
    }
  });
});
