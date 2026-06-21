// hieu.asia — Lịch SỰ KIỆN THIÊN VĂN (nhật/nguyệt thực + phân/chí) 2026–2030.
//
// Mồi traffic theo mùa + tăng "độ tin thiên văn thật". TÍNH BẰNG thư viện
// mã-nguồn-mở astronomy-engine (MIT, cosinekitty) chạy 1 lần lúc dựng dữ liệu;
// nhúng KẾT QUẢ tĩnh (không thêm dependency runtime, không phình bundle).
// Nhật thực lọc theo NGƯỜI QUAN SÁT tại Hà Nội (21.03°N, 105.83°E) → chỉ liệt
// kê cái QUAN SÁT ĐƯỢC từ VN. Nguyệt thực = toàn cầu (xem được nếu Trăng trên
// đường chân trời). Giờ quy về GIỜ VN (UTC+7). Số liệu THẬT, đối chiếu được.
//
// ⚠️ CHỐNG BỊA: phần "chiêm nghiệm" chỉ là khung phản-tư điềm-tĩnh, KHÔNG phán
// điềm dữ — sự kiện thiên văn là hiện tượng tự nhiên, không định đoạt số phận.

export type SkyEventType = 'lunar' | 'solar' | 'season';

export interface SkyEvent {
  type: SkyEventType;
  /** total/partial/penumbral (thực) hoặc xuan_phan/ha_chi/thu_phan/dong_chi (mùa). */
  kind: string;
  dateUTC: string;
  /** "YYYY-MM-DD HH:mm" giờ VN (UTC+7). */
  dateVN: string;
  /** % che (nhật thực, theo người quan sát VN). */
  obscuration?: number;
  /** Độ cao Mặt Trời lúc đỉnh (nhật thực). */
  altitude?: number;
}

/** Sự kiện 2026–2030 — tính sẵn, sắp theo thời gian. */
export const SKY_EVENTS: SkyEvent[] = [
  { type: "lunar", kind: "total", dateUTC: "2026-03-03T11:33:40.289Z", dateVN: "2026-03-03 18:33" },
  { type: "season", kind: "xuan_phan", dateUTC: "2026-03-20T14:45:36.044Z", dateVN: "2026-03-20 21:45" },
  { type: "season", kind: "ha_chi", dateUTC: "2026-06-21T08:25:00.316Z", dateVN: "2026-06-21 15:25" },
  { type: "lunar", kind: "partial", dateUTC: "2026-08-28T04:12:49.076Z", dateVN: "2026-08-28 11:12" },
  { type: "season", kind: "thu_phan", dateUTC: "2026-09-23T00:05:38.617Z", dateVN: "2026-09-23 07:05" },
  { type: "season", kind: "dong_chi", dateUTC: "2026-12-21T20:50:22.187Z", dateVN: "2026-12-22 03:50" },
  { type: "lunar", kind: "penumbral", dateUTC: "2027-02-20T23:12:44.142Z", dateVN: "2027-02-21 06:12" },
  { type: "season", kind: "xuan_phan", dateUTC: "2027-03-20T20:24:43.453Z", dateVN: "2027-03-21 03:24" },
  { type: "season", kind: "ha_chi", dateUTC: "2027-06-21T14:10:33.792Z", dateVN: "2027-06-21 21:10" },
  { type: "lunar", kind: "penumbral", dateUTC: "2027-07-18T16:02:54.880Z", dateVN: "2027-07-18 23:02" },
  { type: "lunar", kind: "penumbral", dateUTC: "2027-08-17T07:13:44.931Z", dateVN: "2027-08-17 14:13" },
  { type: "season", kind: "thu_phan", dateUTC: "2027-09-23T06:01:18.345Z", dateVN: "2027-09-23 13:01" },
  { type: "season", kind: "dong_chi", dateUTC: "2027-12-22T02:42:18.622Z", dateVN: "2027-12-22 09:42" },
  { type: "lunar", kind: "partial", dateUTC: "2028-01-12T04:13:00.859Z", dateVN: "2028-01-12 11:13" },
  { type: "season", kind: "xuan_phan", dateUTC: "2028-03-20T02:17:01.018Z", dateVN: "2028-03-20 09:17" },
  { type: "season", kind: "ha_chi", dateUTC: "2028-06-20T20:01:42.742Z", dateVN: "2028-06-21 03:01" },
  { type: "lunar", kind: "partial", dateUTC: "2028-07-06T18:19:38.379Z", dateVN: "2028-07-07 01:19" },
  { type: "solar", kind: "partial", dateUTC: "2028-07-22T01:41:17.776Z", dateVN: "2028-07-22 08:41", obscuration: 1, altitude: 43 },
  { type: "season", kind: "thu_phan", dateUTC: "2028-09-22T11:45:24.683Z", dateVN: "2028-09-22 18:45" },
  { type: "season", kind: "dong_chi", dateUTC: "2028-12-21T08:20:05.734Z", dateVN: "2028-12-21 15:20" },
  { type: "lunar", kind: "total", dateUTC: "2028-12-31T16:51:54.549Z", dateVN: "2028-12-31 23:51" },
  { type: "lunar", kind: "total", dateUTC: "2029-06-26T03:22:06.538Z", dateVN: "2029-06-26 10:22" },
  { type: "lunar", kind: "total", dateUTC: "2029-12-20T22:41:54.610Z", dateVN: "2029-12-21 05:41" },
  { type: "solar", kind: "partial", dateUTC: "2030-06-01T07:58:38.029Z", dateVN: "2030-06-01 14:58", obscuration: 3, altitude: 47 },
  { type: "lunar", kind: "partial", dateUTC: "2030-06-15T18:33:14.732Z", dateVN: "2030-06-16 01:33" },
  { type: "lunar", kind: "penumbral", dateUTC: "2030-12-09T22:27:32.805Z", dateVN: "2030-12-10 05:27" },
];

export interface EventKindMeta {
  label: string;
  /** Mô tả hiện tượng (factual). */
  what: string;
  /** Khung chiêm nghiệm điềm-tĩnh (không phán điềm). */
  reflect: string;
}

export const LUNAR_META: Record<string, EventKindMeta> = {
  total: {
    label: 'Nguyệt thực toàn phần (“trăng máu”)',
    what: 'Mặt Trăng đi trọn vào vùng bóng tối của Trái Đất, ngả màu đỏ đồng — dân gian gọi là “trăng máu”. Xem được tại Việt Nam khi Trăng ở trên đường chân trời lúc xảy ra.',
    reflect: 'Theo lối chiêm nghiệm: một điểm “khép vòng” — hợp để nhìn lại điều đã qua, buông cái cần buông. Không phải điềm dữ; chỉ là nhịp tự nhiên để dừng và soi.',
  },
  partial: {
    label: 'Nguyệt thực một phần',
    what: 'Một phần Mặt Trăng đi vào bóng tối Trái Đất, khuyết đi một mảng rõ.',
    reflect: 'Một lát cắt nhỏ để tạm dừng, chú ý điều đang “khuyết” trong nhịp sống của mình.',
  },
  penumbral: {
    label: 'Nguyệt thực nửa tối',
    what: 'Mặt Trăng đi qua vùng nửa tối (penumbra) của Trái Đất — chỉ mờ đi nhẹ, khó thấy bằng mắt thường.',
    reflect: 'Thay đổi tinh tế, dễ bỏ qua — như những chuyển động ngầm cần lắng mới nhận ra.',
  },
};

export const SOLAR_META: EventKindMeta = {
  label: 'Nhật thực một phần',
  what: 'Mặt Trăng che một phần Mặt Trời, nhìn từ Việt Nam. ⚠️ KHÔNG nhìn trực tiếp — phải dùng kính lọc chuyên dụng.',
  reflect: 'Một khoảnh khắc “che — tỏ”: hợp để đặt lại câu hỏi điều gì đang bị che khuất trong lựa chọn của mình.',
};

export const SEASON_META: Record<string, EventKindMeta> = {
  xuan_phan: { label: 'Xuân phân', what: 'Ngày và đêm dài gần bằng nhau; Mặt Trời qua xích đạo lên bắc — khởi mùa xuân thiên văn.', reflect: 'Điểm cân bằng — hợp để gieo dự định mới.' },
  ha_chi: { label: 'Hạ chí', what: 'Ngày dài nhất năm ở bắc bán cầu; dương khí cực thịnh.', reflect: 'Đỉnh của sức bung — giữ nhịp bền thay vì đốt cạn.' },
  thu_phan: { label: 'Thu phân', what: 'Ngày–đêm cân bằng trở lại; khí chuyển sang thu.', reflect: 'Điểm thu hoạch và buông bớt — soát lại nửa năm.' },
  dong_chi: { label: 'Đông chí', what: 'Đêm dài nhất năm; âm khí cực thịnh, dương bắt đầu sinh.', reflect: 'Tĩnh sâu nhất — dưỡng sức, chuẩn bị cho vòng mới.' },
};

export function kindMeta(e: SkyEvent): EventKindMeta {
  if (e.type === 'lunar') return LUNAR_META[e.kind] ?? LUNAR_META.partial!;
  if (e.type === 'solar') return SOLAR_META;
  return SEASON_META[e.kind] ?? { label: e.kind, what: '', reflect: '' };
}
