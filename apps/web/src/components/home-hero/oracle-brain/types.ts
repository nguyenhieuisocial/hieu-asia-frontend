import type { BanMenhData } from '@/lib/ban-menh-data';

export type Lens = {
  name: string;
  symbol: string;
  tagline: string;
  element: string;
  quality: string;
  rulingPlanet: string;
  strengths: string[];
  growthEdge: string | null;
  love: string;
  work: string;
  opposite: string;
};
export type Bazi = {
  dayCan: string;
  dayEl: string;
  dayYang: boolean;
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  monthTenGod: string;
  hourPillar: string | null;
  strongest: string | null;
  missing: string[];
  // FULL — chỉ mở khi nhập ĐỦ giờ sinh (4 trụ thật; không giờ = trụ giờ giả định
  // nên các tầng dưới đây sẽ sai → gate hasTime, trung thực):
  hourTenGod: string | null;
  elementCount: Record<string, number> | null;
  thanSat: { name: string; meaning: string }[];
  relations: { type: string; chi: string; detail: string }[];
  namNay: { label: string; tenGod: string } | null;
};
export type Reveal = {
  dong: BanMenhData;
  conVat: string;
  /** Tính cách tuổi (con giáp) — engine con-giap-data, cùng nguồn trang /con-giap. */
  cg: { tagline: string; strengths: string[]; growthEdge: string | null; love: string } | null;
  /** Hướng tốt + vật phẩm + 1 lời khuyên hành động theo hành bản mệnh (ngu-hanh-remedy). */
  huongTot: string[];
  vatPham: string[];
  loiKhuyen: string | null;
  tay: Lens | null;
  nearCusp: boolean;
  bazi: Bazi;
  /** true = sinh TRƯỚC Lập Xuân → đã quy về năm âm liền trước (chuẩn mệnh học). */
  lunarAdjusted: boolean;
};
